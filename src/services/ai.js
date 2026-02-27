/**
 * Claude AI service.
 * Takes a conversation history and returns a structured action + response.
 */

const Anthropic = require('@anthropic-ai/sdk');
const { buildSystemPrompt } = require('../prompts/system');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-sonnet-4-6';

/**
 * Process one turn of the conversation.
 *
 * @param {Array<{role: string, content: string}>} history - Full conversation history
 * @returns {Promise<{say: string, action: string, data: object}>}
 */
async function processConversation(history) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: buildSystemPrompt(),
    messages: history,
  });

  const raw = response.content[0]?.text?.trim() || '';

  // Strip markdown code fences if Claude wrapped the JSON
  const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    // Fallback: treat the entire response as something to say and continue
    console.warn('[ai] failed to parse JSON response, using fallback:', raw);
    parsed = {
      say: "I'm sorry, I didn't quite catch that. Could you please repeat what you said?",
      action: 'continue',
      data: {},
    };
  }

  // Normalise — ensure required fields
  return {
    say: parsed.say || "I'm sorry, could you repeat that?",
    action: parsed.action || 'continue',
    data: parsed.data || {},
  };
}

module.exports = { processConversation };
