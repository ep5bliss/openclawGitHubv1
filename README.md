# AI Phone Receptionist

An AI receptionist for your phone line — powered by **Vapi** (voice infrastructure) and **OpenAI GPT-4o** (the brain). It answers calls, screens out spam, captures leads, and books appointments.

## Why Vapi instead of Twilio

Vapi is purpose-built for AI voice agents. It handles speech recognition, text-to-speech, and conversation management out of the box. No more carrier blocks, no complex TwiML, and native OpenAI integration — you just write the business logic.

## What it does

| Caller type | Result |
|-------------|--------|
| Genuine prospect / client | AI chats, captures name + need + contact info → saved to `data/leads.json` |
| Appointment seeker | AI collects details → creates a Google Calendar event |
| Spam / solicitor | AI politely ends the call immediately |
| Wrong number / irrelevant | AI ends the call |

## How it works

```
Your phone number (via Vapi)
        │
        ▼
  Vapi platform  ──►  OpenAI GPT-4o (conversation + decisions)
        │                    │ calls tools
        │          ┌─────────┴──────────────┐
        │          │                        │
        ▼          ▼                        ▼
  Your server  Google Calendar       data/leads.json
  (tool calls)  (book event)     data/appointments.json
```

---

## Setup

### 1. Prerequisites

- Node.js 18+
- [Vapi account](https://vapi.ai) (free trial available)
- [OpenAI API key](https://platform.openai.com/api-keys)
- A publicly accessible server (Railway, Render, Fly.io, or ngrok for local testing)

### 2. Install

```bash
git clone <this-repo>
cd ai-receptionist
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:
- `BUSINESS_NAME`, `BUSINESS_TYPE`, `BUSINESS_HOURS`, `OWNER_NAME`, `RECEPTIONIST_NAME`
- `SERVER_URL` — your public server URL (e.g. `https://abc123.ngrok.io`)
- `VAPI_API_KEY` — from [dashboard.vapi.ai/keys](https://dashboard.vapi.ai/keys)

### 4. Add your OpenAI key to Vapi

Vapi calls OpenAI directly using your key, so you enter it in Vapi's dashboard (not `.env`):

1. Log in to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Go to **Provider Keys** → **OpenAI**
3. Paste your OpenAI API key and save

### 5. Start the server

```bash
npm start        # or: npm run dev  (auto-reload)
```

For local testing, expose with ngrok:

```bash
ngrok http 3000
# copy the https URL → set as SERVER_URL in .env
```

### 6. Create the AI assistant

```bash
npm run setup
```

This calls the Vapi API to create an assistant configured with your business details, system prompt, GPT-4o, and tool definitions. It prints an **Assistant ID** — copy it into your `.env`:

```
VAPI_ASSISTANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Re-run `npm run setup` anytime you change the system prompt or business details.

### 7. Get a phone number & link the assistant

**Option A — New Vapi number (easiest):**
1. [dashboard.vapi.ai/phone-numbers](https://dashboard.vapi.ai/phone-numbers) → **Create phone number**
2. Under **Assistant**, select the assistant you just created
3. Done — call that number to test

**Option B — Forward your existing number:**
On your phone, set up conditional call forwarding (when busy / no answer) to your Vapi number:
- iPhone: `*61*<vapi-number>#` (no answer) and `*67*<vapi-number>#` (busy)
- Android: Settings → Phone → Call forwarding
- Carrier: call your carrier to set up forwarding

The AI answers when you don't pick up. Calls you do answer go through normally.

---

## Optional: Google Calendar

Without this, appointments are saved to `data/appointments.json` only. The AI still confirms the booking to the caller.

**Setup:**
1. [console.cloud.google.com](https://console.cloud.google.com) → create project → enable **Google Calendar API**
2. **IAM & Admin → Service Accounts** → create one → download the JSON key
3. Save the key as `google-service-account.json` in the project root
4. In Google Calendar → **Settings → Share with specific people** → add the service account email with **"Make changes to events"** permission
5. Copy the **Calendar ID** from Calendar Settings → Integrate calendar
6. In `.env`: set `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` and `GOOGLE_CALENDAR_ID`

---

## File structure

```
├── server.js                    ← Express entry point
├── src/
│   ├── handlers/
│   │   └── vapi.js              ← Vapi webhook (tool-calls, call events)
│   ├── services/
│   │   ├── calendar.js          ← Google Calendar booking
│   │   └── leads.js             ← Save leads + appointments to JSON
│   ├── setup/
│   │   └── assistant.js         ← One-time script to create/update Vapi assistant
│   └── prompts/
│       └── system.js            ← AI receptionist personality + rules
├── data/
│   ├── leads.json               ← Captured leads (auto-created)
│   └── appointments.json        ← Booked appointments (auto-created)
└── .env.example
```

## Customising the AI

Edit `src/prompts/system.js` to change:
- Spam detection rules (add industry-specific signals)
- Lead qualification questions
- Tone and style (more formal, more casual, etc.)
- Appointment flow (ask for specific info)

Then re-run `npm run setup` to push the updated prompt to Vapi.

## Viewing leads and appointments

```bash
cat data/leads.json
cat data/appointments.json
```

## Deploying to production

The app runs fine on any Node.js host:

- **Railway**: connect repo → set env vars → deploy (auto-detects `npm start`)
- **Render**: same, set start command to `npm start`
- **Fly.io**: `fly launch` then `fly secrets set KEY=value`

For production persistence, swap `src/services/leads.js` to write to a database (Postgres, Airtable) or CRM (HubSpot API, Salesforce, etc.).

## Environment variables reference

| Variable | Required | Description |
|----------|----------|-------------|
| `BUSINESS_NAME` | Yes | Your business name |
| `BUSINESS_TYPE` | Yes | What your business does |
| `BUSINESS_HOURS` | Yes | Spoken to callers |
| `OWNER_NAME` | Yes | Used in "I'll have X call you back" |
| `RECEPTIONIST_NAME` | Yes | The AI's name |
| `SERVER_URL` | Yes | Your public server URL (no trailing slash) |
| `PORT` | No | HTTP port (default `3000`) |
| `VAPI_API_KEY` | Yes | From dashboard.vapi.ai/keys |
| `VAPI_ASSISTANT_ID` | After setup | Set by `npm run setup` |
| `OPENAI_MODEL` | No | Model (default `gpt-4o`) |
| `OPENAI_VOICE` | No | TTS voice (default `nova`) |
| `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` | No | Path to Google service account JSON |
| `GOOGLE_CALENDAR_ID` | No | Google Calendar ID |
| `APPOINTMENT_DURATION_MINUTES` | No | Slot length (default `30`) |
