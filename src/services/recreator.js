const OpenAI = require('openai');

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in .env');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Generate a detailed recreation script based on analysis
 */
async function recreate(transcription, analysis, videoInfo) {
  const openai = getClient();
  const prompt = `You are an expert short-form video producer. Based on the following analysis of an original video, create a COMPLETE recreation script that someone could follow to recreate this video.

ORIGINAL VIDEO INFO:
- Title: ${videoInfo.title || 'N/A'}
- Duration: ${videoInfo.duration || transcription.duration || 'N/A'} seconds
- Platform: ${videoInfo.platform || 'N/A'}

TRANSCRIPTION:
${transcription.text}

ANALYSIS:
${JSON.stringify(analysis, null, 2)}

Create a detailed recreation plan in the following JSON format:
{
  "title": "Suggested title for the recreated video",
  "totalDuration": "Target duration in seconds",
  "equipment": {
    "camera": "Camera setup recommendation",
    "lighting": "Lighting setup",
    "audio": "Microphone/audio setup",
    "props": ["Any props needed"]
  },
  "preProduction": {
    "location": "Where to film",
    "wardrobe": "What to wear",
    "preparation": ["Steps to prepare before filming"]
  },
  "script": [
    {
      "scene": 1,
      "timeRange": "0-3s",
      "duration": "3s",
      "shotType": "Close-up / Wide / Medium",
      "cameraMovement": "Static / Pan / Zoom in",
      "narration": "Exact words to say",
      "delivery": "How to deliver (tone, pace, energy)",
      "visualDescription": "What should be on screen",
      "textOverlay": "Text to add in editing",
      "textPosition": "Where to place text",
      "transition": "How to transition to next scene"
    }
  ],
  "postProduction": {
    "editingNotes": "Overall editing guidance",
    "musicRecommendation": "Type of music / specific suggestions",
    "soundEffects": ["Any sound effects to add"],
    "colorGrading": "Color/filter suggestions",
    "captionStyle": "How to style captions/subtitles",
    "exportSettings": {
      "resolution": "1080x1920",
      "fps": "30",
      "format": "MP4"
    }
  },
  "publishingNotes": {
    "suggestedCaption": "Caption for posting",
    "hashtags": ["Relevant hashtags"],
    "bestTimeToPost": "Suggested posting time",
    "platformTips": "Platform-specific optimization tips"
  }
}

Return ONLY valid JSON. Be extremely detailed and specific so someone could follow this script step-by-step.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { recreate };
