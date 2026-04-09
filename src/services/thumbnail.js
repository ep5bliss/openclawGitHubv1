const OpenAI = require('openai');

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in .env');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Generate a thumbnail concept based on video analysis and guidelines
 */
async function generate(transcription, analysis, guidelines) {
  const openai = getClient();
  const guidelinesSection = guidelines
    ? `\nTHUMBNAIL GUIDELINES (from uploaded MD file):\n${guidelines}\n`
    : '\nNo custom thumbnail guidelines uploaded. Use general best practices.\n';

  const prompt = `You are an expert thumbnail designer for short-form video content. Create a detailed thumbnail concept for this video.

VIDEO CONTENT:
- Topic: ${analysis.mainTopic || 'N/A'}
- Hook: ${analysis.hook || 'N/A'}
- Target Audience: ${analysis.targetAudience || 'N/A'}
- Key Points: ${(analysis.keyPoints || []).join(', ')}
- Tone: ${analysis.toneAndStyle || 'N/A'}

TRANSCRIPTION SUMMARY:
${transcription.text.substring(0, 500)}
${guidelinesSection}

Create a detailed thumbnail concept in the following JSON format:
{
  "concept": "One-line description of the thumbnail concept",
  "layout": {
    "composition": "Rule of thirds / centered / split screen / etc",
    "primaryElement": "Main visual focus",
    "secondaryElements": ["Supporting visual elements"],
    "negativeSpace": "Where to leave breathing room"
  },
  "text": {
    "headline": "Main text on thumbnail (keep to 3-5 words max)",
    "subtext": "Optional secondary text",
    "font": "Font style recommendation",
    "fontSize": "Relative size (large/medium/small)",
    "color": "Text color",
    "outline": "Text outline/shadow details",
    "position": "Where to place text"
  },
  "visualElements": {
    "background": "Background description",
    "mainSubject": "Main person/object description and pose",
    "expression": "Facial expression if person is shown",
    "colors": {
      "primary": "Dominant color",
      "secondary": "Supporting color",
      "accent": "Pop color for contrast"
    },
    "overlays": ["Any graphic overlays, arrows, circles, emojis"]
  },
  "style": {
    "mood": "Overall mood/feeling",
    "brightness": "Bright / Dark / High contrast",
    "saturation": "Vibrant / Muted / Natural",
    "filter": "Any color filter/grade"
  },
  "imageGenerationPrompt": "A detailed DALL-E prompt to generate this thumbnail. Be very specific about composition, colors, text, and style. Format: 1280x720 YouTube thumbnail.",
  "alternativeVersions": [
    {
      "concept": "Brief alternate concept",
      "headline": "Alternate headline text"
    }
  ],
  "guidelinesCompliance": "How this concept follows the uploaded guidelines (if any)"
}

Return ONLY valid JSON.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generate };
