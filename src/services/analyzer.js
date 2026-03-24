const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyze the video content based on transcription and metadata
 */
async function analyze(transcription, videoInfo, url) {
  const prompt = `You are an expert short-form video analyst. Analyze this TikTok/YouTube Short and provide a detailed breakdown.

VIDEO INFO:
- Title: ${videoInfo.title || 'N/A'}
- Creator: ${videoInfo.uploader || 'N/A'}
- Duration: ${videoInfo.duration || transcription.duration || 'N/A'} seconds
- Platform: ${videoInfo.platform || 'N/A'}
- Description: ${videoInfo.description || 'N/A'}
- Tags: ${(videoInfo.tags || []).join(', ') || 'N/A'}
- URL: ${url}

TRANSCRIPTION:
${transcription.text}

TIMESTAMPED SEGMENTS:
${transcription.segments.map(s => `[${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s] ${s.text}`).join('\n')}

Please provide a comprehensive analysis in the following JSON format:
{
  "hook": "The opening hook used in first 1-3 seconds",
  "mainTopic": "Core topic/message of the video",
  "contentStructure": "How the video is structured (e.g., problem-solution, listicle, story, tutorial)",
  "toneAndStyle": "The tone, energy level, and style of delivery",
  "targetAudience": "Who this video is made for",
  "keyPoints": ["List of main points or takeaways"],
  "callToAction": "Any CTA at the end",
  "estimatedScenes": [
    {
      "timeRange": "0-3s",
      "description": "What likely happens visually in this segment",
      "textOnScreen": "Any text overlays estimated",
      "narration": "What is said"
    }
  ],
  "editingStyle": {
    "pacing": "fast/medium/slow",
    "transitions": "cut/zoom/swipe/etc",
    "textOverlays": true,
    "musicStyle": "Type of background music likely used",
    "effects": "Any special effects noted"
  },
  "viralElements": ["What makes this engaging or shareable"],
  "hashtags": ["Suggested hashtags based on content"]
}

Return ONLY valid JSON.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { analyze };
