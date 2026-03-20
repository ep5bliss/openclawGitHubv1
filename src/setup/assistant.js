/**
 * One-time setup script: creates or updates your Vapi assistant.
 *
 * Run once after configuring .env:
 *   npm run setup
 *
 * The script prints the assistant ID — add it to .env as VAPI_ASSISTANT_ID.
 * Re-run anytime to push prompt/config changes to Vapi.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { buildSystemPrompt } = require('../prompts/system');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const SERVER_URL = process.env.SERVER_URL;

if (!VAPI_API_KEY) {
  console.error('ERROR: VAPI_API_KEY is not set in .env');
  process.exit(1);
}
if (!SERVER_URL) {
  console.error('ERROR: SERVER_URL is not set in .env (e.g. https://your-domain.com)');
  process.exit(1);
}

// ─── Tool definitions ─────────────────────────────────────────────────────────
// These are the functions the AI can call during a conversation.

const functions = [
  {
    name: 'capture_lead',
    description: "Save a qualified caller's contact info and needs so the team can follow up.",
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Caller's full name" },
        phone: { type: 'string', description: 'Best callback number' },
        company: { type: 'string', description: 'Company or organisation (if relevant)' },
        purpose: { type: 'string', description: 'What they need help with' },
        urgency: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'How urgently they need help',
        },
        notes: { type: 'string', description: 'Any other relevant details' },
      },
      required: ['name', 'phone', 'purpose'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book a calendar appointment for the caller.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Caller's full name" },
        phone: { type: 'string', description: 'Best callback number' },
        purpose: { type: 'string', description: 'Purpose of the appointment' },
        preferred_datetime: {
          type: 'string',
          description:
            'Preferred date and time as stated by the caller, e.g. "next Tuesday at 2pm" or an ISO 8601 string',
        },
        notes: { type: 'string', description: 'Any other notes for the appointment' },
      },
      required: ['name', 'phone', 'purpose', 'preferred_datetime'],
    },
  },
  {
    name: 'flag_spam',
    description: 'Flag and end a spam or solicitor call.',
    parameters: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Why this call is spam or irrelevant' },
      },
      required: ['reason'],
    },
  },
];

// ─── Assistant configuration ──────────────────────────────────────────────────

function buildAssistantConfig() {
  const businessName = process.env.BUSINESS_NAME || 'our company';
  const receptionistName = process.env.RECEPTIONIST_NAME || 'Alex';
  const voice = process.env.OPENAI_VOICE || 'nova';
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  return {
    name: `${businessName} — AI Receptionist`,

    // OpenAI model with our system prompt and function definitions
    model: {
      provider: 'openai',
      model,
      messages: [{ role: 'system', content: buildSystemPrompt() }],
      functions,
      temperature: 0.4,
    },

    // OpenAI TTS voice
    // Options: alloy, echo, fable, onyx, nova, shimmer, ash, coral, sage
    voice: {
      provider: 'openai',
      voiceId: voice,
    },

    // What the AI says when it picks up
    firstMessage: `Hello, thank you for calling ${businessName}. My name is ${receptionistName}. How can I help you today?`,
    firstMessageMode: 'assistant-speaks-first',

    // Where Vapi sends tool-call and status events
    serverUrl: `${SERVER_URL}/vapi/webhook`,
    serverMessages: ['tool-calls', 'end-of-call-report', 'status-update'],

    // End the call automatically after tool actions that wrap up the call
    endCallFunctionEnabled: true,

    // How long to wait (seconds) for the caller to speak before prompting again
    silenceTimeoutSeconds: 10,

    // Max call length to prevent runaway calls
    maxDurationSeconds: 600, // 10 minutes
  };
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function vapiRequest(method, path, body) {
  const response = await fetch(`https://api.vapi.ai${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Vapi API ${response.status}: ${text}`);
  }

  return response.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const existingId = process.env.VAPI_ASSISTANT_ID;
  const config = buildAssistantConfig();

  let assistant;

  if (existingId) {
    console.log(`Updating existing assistant ${existingId}...`);
    assistant = await vapiRequest('PATCH', `/assistant/${existingId}`, config);
    console.log('Assistant updated successfully.\n');
  } else {
    console.log('Creating new assistant...');
    assistant = await vapiRequest('POST', '/assistant', config);
    console.log('Assistant created successfully.\n');
  }

  console.log(`Assistant ID : ${assistant.id}`);
  console.log(`Assistant name: ${assistant.name}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Add this line to your .env file:');
  console.log(`VAPI_ASSISTANT_ID=${assistant.id}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Next: assign this assistant to a phone number in the Vapi dashboard.');
  console.log('https://dashboard.vapi.ai/phone-numbers');

  return assistant;
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
