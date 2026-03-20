/**
 * Vapi webhook handler.
 *
 * Vapi sends all call events to POST /vapi/webhook.
 * We handle two key event types:
 *   - tool-calls  → run the function the AI requested (save lead, book appt, flag spam)
 *   - end-of-call-report → log the call summary
 *
 * All other events are acknowledged with 200.
 */

const express = require('express');
const { saveLead, saveAppointment } = require('../services/leads');
const { bookAppointment, isCalendarEnabled } = require('../services/calendar');

const router = express.Router();

// ─── Webhook ──────────────────────────────────────────────────────────────────

router.post('/webhook', async (req, res) => {
  // Vapi wraps events in a `message` envelope
  const message = req.body?.message || req.body;
  const type = message?.type;

  if (!type) {
    return res.sendStatus(400);
  }

  // ── Tool calls ─────────────────────────────────────────────────────────────
  if (type === 'tool-calls') {
    // Vapi uses `toolCallList` in the message envelope
    const toolCallList = message.toolCallList || message.toolCalls || [];
    const callerNumber = message.call?.customer?.number || 'unknown';
    const callId = message.call?.id || 'unknown';

    const results = [];

    for (const toolCall of toolCallList) {
      const toolCallId = toolCall.id;
      const fnName = toolCall.function?.name;
      let args = {};

      try {
        args = JSON.parse(toolCall.function?.arguments || '{}');
      } catch {
        args = toolCall.function?.arguments || {};
      }

      console.log(`[tool] ${fnName} called for ${callerNumber}:`, args);

      let result = 'Done.';

      try {
        if (fnName === 'capture_lead') {
          saveLead(args, callerNumber, callId);
          result = 'Lead saved. The team will be in touch soon.';

        } else if (fnName === 'book_appointment') {
          let calendarResult = null;

          if (isCalendarEnabled()) {
            try {
              calendarResult = await bookAppointment(args);
              console.log(`[calendar] event created: ${calendarResult.htmlLink}`);
            } catch (err) {
              console.error('[calendar] booking failed:', err.message);
              // Non-fatal — appointment still saved locally
            }
          } else {
            console.log('[calendar] not configured — saving locally only');
          }

          saveAppointment(args, callerNumber, callId, calendarResult?.eventId);

          result = calendarResult
            ? `Appointment confirmed for ${args.preferred_datetime}. A calendar invite has been sent.`
            : `Appointment noted for ${args.preferred_datetime}. The team will send a confirmation shortly.`;

        } else if (fnName === 'flag_spam') {
          const reason = args.reason || 'unknown';
          console.log(`[spam] flagged (${callId}): ${reason}`);
          result = 'Call flagged as spam.';

        } else {
          console.warn(`[tool] unknown function: ${fnName}`);
          result = 'Action completed.';
        }

      } catch (err) {
        console.error(`[tool] ${fnName} error:`, err.message);
        // Still return a result — Vapi requires 200 with results array
        result = 'There was an issue completing that action, but the call can continue.';
      }

      results.push({ toolCallId, result });
    }

    // Vapi requires HTTP 200 with this exact shape
    return res.status(200).json({ results });
  }

  // ── End-of-call report ─────────────────────────────────────────────────────
  if (type === 'end-of-call-report') {
    const callId = message.call?.id;
    const summary = message.summary || message.call?.analysis?.summary || '(no summary)';
    const durationSeconds = message.call?.endedAt
      ? Math.round(
          (new Date(message.call.endedAt) - new Date(message.call.startedAt)) / 1000
        )
      : null;

    console.log(`[call] ended: ${callId}${durationSeconds ? ` (${durationSeconds}s)` : ''}`);
    console.log(`[call] summary: ${summary}`);
    return res.sendStatus(200);
  }

  // ── Status updates and other events ───────────────────────────────────────
  if (type === 'status-update') {
    const status = message.status;
    const callId = message.call?.id;
    console.log(`[call] status: ${callId} → ${status}`);
    return res.sendStatus(200);
  }

  // Acknowledge all other event types
  res.sendStatus(200);
});

module.exports = router;
