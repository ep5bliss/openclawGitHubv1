/**
 * In-memory call session store.
 * Each session holds the conversation history for one active phone call.
 * Sessions are cleaned up when the call ends.
 */

const sessions = new Map();

function createSession(callSid, callerNumber) {
  const session = {
    callSid,
    callerNumber,
    history: [],       // { role: 'user'|'assistant', content: string }[]
    leadData: {},
    startedAt: new Date().toISOString(),
  };
  sessions.set(callSid, session);
  console.log(`[session] created for ${callerNumber} (${callSid})`);
  return session;
}

function getSession(callSid) {
  return sessions.get(callSid) || null;
}

function addMessage(callSid, role, content) {
  const session = sessions.get(callSid);
  if (session) {
    session.history.push({ role, content });
  }
}

function deleteSession(callSid) {
  sessions.delete(callSid);
  console.log(`[session] deleted (${callSid})`);
}

function getAll() {
  return Array.from(sessions.values());
}

module.exports = { createSession, getSession, addMessage, deleteSession, getAll };
