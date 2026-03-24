# Video Transcription & Recreation App

Paste a TikTok or YouTube Short link and this app will:

1. **Download** the video and extract audio
2. **Transcribe** the audio using OpenAI Whisper
3. **Analyze** the content — hook, structure, tone, editing style, viral elements
4. **Generate a recreation script** — shot-by-shot breakdown with equipment, narration, camera movements, and post-production notes
5. **Create a thumbnail concept** — based on your uploaded guidelines (MD file), with DALL-E prompt included
6. **Queue for your approval** — review everything before finalizing

## Setup

### Prerequisites

- Node.js 18+
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed (`pip install yt-dlp` or `brew install yt-dlp`)
- [OpenAI API key](https://platform.openai.com/api-keys)

### Install

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
```

### Run

```bash
npm start        # or: npm run dev (auto-reload)
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Upload thumbnail guidelines** (optional) — Click "Upload .md Guidelines" and select your markdown file with thumbnail rules
2. **Paste a video URL** — TikTok or YouTube Short link
3. **Wait for processing** — The app downloads, transcribes, analyzes, and generates a recreation script
4. **Review** — Click a project to see full details: transcription, analysis, shot-by-shot script, and thumbnail concept
5. **Approve or reject** — Use the approval buttons at the bottom of each project

## File Structure

```
├── server.js                    Express entry point
├── public/
│   ├── index.html               Web UI
│   ├── style.css                Styles
│   └── app.js                   Frontend logic
├── src/
│   ├── routes/
│   │   └── api.js               API endpoints
│   └── services/
│       ├── downloader.js        Video download (yt-dlp)
│       ├── transcriber.js       Audio transcription (Whisper)
│       ├── analyzer.js          Content analysis (GPT-4o)
│       ├── recreator.js         Recreation script generation
│       ├── thumbnail.js         Thumbnail concept generation
│       └── projects.js          Project storage
├── downloads/                   Downloaded video/audio (gitignored)
├── projects/                    Project JSON files (gitignored)
├── uploads/                     Uploaded guidelines (gitignored)
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Start new project `{ url }` |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects/:id/approve` | Approve a project |
| POST | `/api/projects/:id/reject` | Reject with optional note |
| DELETE | `/api/projects/:id` | Delete a project |
| POST | `/api/guidelines` | Upload thumbnail guidelines (.md) |
| GET | `/api/guidelines` | Get current guidelines |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for Whisper + GPT-4o |
| `PORT` | No | HTTP port (default `3000`) |
