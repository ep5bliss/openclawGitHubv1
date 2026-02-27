# AI Phone Receptionist

An AI-powered receptionist that answers your phone calls, screens out spam, captures leads, and books appointments — all without you picking up.

## What it does

| Caller type | What happens |
|-------------|-------------|
| **Real prospect / client** | AI chats, captures name + purpose + contact info, saves the lead |
| **Appointment seeker** | AI collects details, books a slot on your Google Calendar |
| **Spammer / solicitor** | AI politely ends the call immediately |
| **Wrong number / irrelevant** | AI ends the call |

## How it works

```
Incoming call
     │
     ▼
  Twilio (phone number)
     │  webhook POST
     ▼
  This server  ──────►  Claude AI (decides what to say + do)
     │                        │
     │           ┌────────────┴────────────┐
     │           │                         │
     ▼           ▼                         ▼
  TwiML      Google Calendar          data/leads.json
  (speech)   (book event)          data/appointments.json
```

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Twilio account](https://www.twilio.com) with a phone number
- An [Anthropic API key](https://console.anthropic.com)
- A publicly accessible server (Railway, Render, Fly.io, or ngrok for local testing)

### 2. Install

```bash
git clone <this-repo>
cd ai-receptionist
npm install
```

### 3. Configure

```bash
cp .env.example .env
```

Edit `.env` and fill in:

- `BUSINESS_NAME` — your business name
- `BUSINESS_TYPE` — e.g. "real estate agency", "law firm", "dental practice"
- `BUSINESS_HOURS` — spoken to callers when relevant
- `OWNER_NAME` — whose name the AI mentions ("I'll have Sarah call you back")
- `RECEPTIONIST_NAME` — the AI's name ("Hi, I'm Alex")
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — from Twilio Console
- `TWILIO_PHONE_NUMBER` — your Twilio number in E.164 format (+15550001234)
- `ANTHROPIC_API_KEY` — from console.anthropic.com

### 4. (Optional) Google Calendar

Skip this if you just want leads saved to a JSON file.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Enable APIs** → enable **Google Calendar API**
3. **IAM & Admin** → **Service Accounts** → **Create service account** → download the JSON key
4. Save the JSON key as `google-service-account.json` in the project root
5. In **Google Calendar** → open your calendar's **Settings** → **Share with specific people**
   - Add the service account email (looks like `name@project.iam.gserviceaccount.com`)
   - Permission: **Make changes to events**
6. Copy your **Calendar ID** from Settings → **Integrate calendar**
7. In `.env`: set `GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json` and `GOOGLE_CALENDAR_ID=your-calendar-id`

### 5. Run

```bash
npm start          # production
npm run dev        # development with auto-reload (requires nodemon)
```

### 6. Connect Twilio

Your server needs a public URL. For local testing use [ngrok](https://ngrok.com):

```bash
ngrok http 3000
# copy the https URL, e.g. https://abc123.ngrok.io
```

In the [Twilio Console](https://console.twilio.com):

1. Go to **Phone Numbers** → your number → **Configure**
2. Under **Voice & Fax** → **A call comes in**:
   - Set to **Webhook**
   - URL: `https://your-domain.com/call/incoming`
   - Method: `HTTP POST`
3. Under **Call Status Changes** → Status callback URL:
   - URL: `https://your-domain.com/call/status`
   - Method: `HTTP POST`
4. Save

Your AI receptionist is now live. Call your Twilio number to test it.

---

## File structure

```
├── server.js                  # Express app entry point
├── src/
│   ├── handlers/
│   │   └── call.js            # Twilio webhook routes + TwiML generation
│   ├── services/
│   │   ├── ai.js              # Claude API integration
│   │   ├── calendar.js        # Google Calendar booking
│   │   ├── leads.js           # Save leads + appointments to JSON
│   │   └── sessions.js        # In-memory call session store
│   └── prompts/
│       └── system.js          # AI system prompt (receptionist behaviour)
├── data/
│   ├── leads.json             # Captured leads (auto-created)
│   └── appointments.json      # Booked appointments (auto-created)
├── .env.example               # Environment variable template
└── package.json
```

## Customising the AI's behaviour

Edit `src/prompts/system.js` to change:

- **Spam detection rules** — add industry-specific spam signals
- **Lead qualification questions** — tailor to your business
- **Tone and style** — make it more formal, casual, etc.
- **Appointment flow** — ask for specific info relevant to your service

## Deploying to production

The app is stateless (sessions are in-memory, data in flat files) and runs fine on any Node host:

- **Railway**: connect repo → set env vars → deploy
- **Render**: same — set `npm start` as start command
- **Fly.io**: `fly launch` → set secrets with `fly secrets set KEY=value`

For persistence in production, swap `src/services/leads.js` to write to a database (Postgres, MongoDB, Airtable, etc.) or a CRM API (HubSpot, Salesforce).

## Viewing captured leads and appointments

```bash
cat data/leads.json
cat data/appointments.json
```

## Environment variables reference

| Variable | Required | Description |
|----------|----------|-------------|
| `BUSINESS_NAME` | Yes | Your business name |
| `BUSINESS_TYPE` | Yes | What your business does |
| `BUSINESS_HOURS` | Yes | Spoken to callers |
| `OWNER_NAME` | Yes | Name used in "I'll have X call you" |
| `RECEPTIONIST_NAME` | Yes | AI's name |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Yes | Your Twilio phone number |
| `TWILIO_VOICE` | No | TTS voice (default: `Polly.Joanna`) |
| `SPEECH_TIMEOUT_SECONDS` | No | Silence timeout (default: `3`) |
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` | No | Path to Google service account JSON |
| `GOOGLE_CALENDAR_ID` | No | Google Calendar ID |
| `APPOINTMENT_DURATION_MINUTES` | No | Slot length (default: `30`) |
| `PORT` | No | HTTP port (default: `3000`) |
