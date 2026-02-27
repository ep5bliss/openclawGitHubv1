/**
 * Twilio webhook handlers.
 *
 * Routes:
 *   POST /call/incoming  — a new call arrives; greet and start listening
 *   POST /call/gather    — caller spoke; process with AI and respond
 *   POST /call/status    — call ended; clean up session
 */

const express = require('express');
const twilio = require('twilio');
const { createSession, getSession, addMessage, deleteSession } = require('../services/sessions');
const { processConversation } = require('../services/ai');
const { bookAppointment, isCalendarEnabled } = require('../services/calendar');
const { saveLead, saveAppointment } = require('../services/leads');

const router = express.Router();

// ─── TwiML helpers ────────────────────────────────────────────────────────────

const VOICE = process.env.TWILIO_VOICE || 'Polly.Joanna'; // AWS Polly voice via Twilio
const SPEECH_TIMEOUT = parseInt(process.env.SPEECH_TIMEOUT_SECONDS || '3', 10);

/**
 * Build a TwiML response that speaks to the caller and gathers their reply.
 */
function gatherResponse(sayText, callSid) {
  const twiml = new twilio.twiml.VoiceResponse();

  const gather = twiml.gather({
    input: 'speech',
    action: `/call/gather?callSid=${encodeURIComponent(callSid)}`,
    method: 'POST',
    speechTimeout: SPEECH_TIMEOUT,
    speechModel: 'phone_call',
    enhanced: true,
    language: 'en-US',
  });

  gather.say({ voice: VOICE }, sayText);

  // If gather times out without speech, re-prompt once
  twiml.redirect({ method: 'POST' }, `/call/reprompt?callSid=${encodeURIComponent(callSid)}`);

  return twiml.toString();
}

/**
 * Build a TwiML response that speaks and hangs up.
 */
function hangupResponse(sayText) {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say({ voice: VOICE }, sayText);
  twiml.hangup();
  return twiml.toString();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /call/incoming
 * Twilio calls this webhook when a new call arrives.
 */
router.post('/incoming', async (req, res) => {
  const callSid = req.body.CallSid;
  const callerNumber = req.body.From || 'unknown';
  const businessName = process.env.BUSINESS_NAME || 'us';
  const receptionistName = process.env.RECEPTIONIST_NAME || 'Alex';

  console.log(`[call] incoming from ${callerNumber} (${callSid})`);

  const session = createSession(callSid, callerNumber);

  const greeting = `Hello, thank you for calling ${businessName}. My name is ${receptionistName}. How can I help you today?`;

  // Seed the history so the AI knows what was already said
  addMessage(callSid, 'assistant', greeting);

  res.type('text/xml').send(gatherResponse(greeting, callSid));
});

/**
 * POST /call/gather
 * Twilio sends transcribed speech here after the caller speaks.
 */
router.post('/gather', async (req, res) => {
  const callSid = req.query.callSid || req.body.CallSid;
  const speechResult = req.body.SpeechResult || '';
  const confidence = parseFloat(req.body.Confidence || '0');

  console.log(`[call] speech from ${callSid}: "${speechResult}" (confidence: ${confidence.toFixed(2)})`);

  const session = getSession(callSid);
  if (!session) {
    // Session expired — end gracefully
    res.type('text/xml').send(hangupResponse("I'm sorry, something went wrong. Please call back. Goodbye."));
    return;
  }

  // Low confidence or empty — ask to repeat
  if (!speechResult || confidence < 0.3) {
    res.type('text/xml').send(
      gatherResponse("I'm sorry, I didn't catch that. Could you please say that again?", callSid)
    );
    return;
  }

  // Add caller's message to history
  addMessage(callSid, 'user', speechResult);

  let aiResponse;
  try {
    aiResponse = await processConversation(session.history);
  } catch (err) {
    console.error('[ai] error:', err.message);
    res.type('text/xml').send(
      gatherResponse("I'm sorry, I'm having a little trouble right now. Could you please hold on and try again?", callSid)
    );
    return;
  }

  const { say, action, data } = aiResponse;

  // Add AI's response to history
  addMessage(callSid, 'assistant', say);

  console.log(`[call] AI action: ${action} | say: "${say}"`);

  // ── Act on the AI's decision ──────────────────────────────────────────────

  if (action === 'flag_spam') {
    const reason = data.reason || 'solicitor/spam';
    console.log(`[spam] flagged (${callSid}): ${reason}`);
    deleteSession(callSid);
    res.type('text/xml').send(hangupResponse(say));
    return;
  }

  if (action === 'end_call') {
    deleteSession(callSid);
    res.type('text/xml').send(hangupResponse(say));
    return;
  }

  if (action === 'capture_lead') {
    saveLead(data, session.callerNumber, callSid);
    deleteSession(callSid);
    res.type('text/xml').send(hangupResponse(say));
    return;
  }

  if (action === 'book_appointment') {
    let calendarResult = null;

    if (isCalendarEnabled()) {
      try {
        calendarResult = await bookAppointment(data);
        console.log(`[calendar] event created: ${calendarResult.htmlLink}`);
      } catch (err) {
        console.error('[calendar] booking failed:', err.message);
        // Non-fatal — still save the appointment locally
      }
    } else {
      console.log('[calendar] Google Calendar not configured — saving locally only');
    }

    saveAppointment(data, session.callerNumber, callSid, calendarResult?.eventId);

    const confirmSay = calendarResult
      ? say
      : `${say} I've noted your appointment and the team will confirm it shortly.`;

    deleteSession(callSid);
    res.type('text/xml').send(hangupResponse(confirmSay));
    return;
  }

  // Default: continue the conversation
  res.type('text/xml').send(gatherResponse(say, callSid));
});

/**
 * POST /call/reprompt
 * Called when <Gather> times out with no speech — give the caller one more chance.
 */
router.post('/reprompt', async (req, res) => {
  const callSid = req.query.callSid || req.body.CallSid;
  const session = getSession(callSid);

  if (!session) {
    res.type('text/xml').send(hangupResponse('Goodbye.'));
    return;
  }

  // Check how many reprompts we've done
  session.repromptCount = (session.repromptCount || 0) + 1;

  if (session.repromptCount >= 2) {
    deleteSession(callSid);
    res.type('text/xml').send(
      hangupResponse("It seems like you may have stepped away. Feel free to call back anytime. Goodbye!")
    );
    return;
  }

  res.type('text/xml').send(
    gatherResponse("I'm still here — go ahead and speak whenever you're ready.", callSid)
  );
});

/**
 * POST /call/status
 * Twilio calls this when a call ends (configured in the Twilio console as
 * "Status Callback URL"). Used to clean up dangling sessions.
 */
router.post('/status', (req, res) => {
  const callSid = req.body.CallSid;
  const status = req.body.CallStatus;
  console.log(`[call] status update: ${callSid} → ${status}`);
  deleteSession(callSid);
  res.sendStatus(204);
});

module.exports = router;
