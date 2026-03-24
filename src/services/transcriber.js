const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe audio using OpenAI Whisper API
 */
async function transcribe(audioPath) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in .env');
  }

  const audioFile = fs.createReadStream(audioPath);

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: audioFile,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment']
  });

  return {
    text: response.text,
    language: response.language,
    duration: response.duration,
    segments: (response.segments || []).map(s => ({
      start: s.start,
      end: s.end,
      text: s.text.trim()
    }))
  };
}

module.exports = { transcribe };
