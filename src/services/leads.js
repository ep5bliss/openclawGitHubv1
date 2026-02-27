/**
 * Persists captured leads and booked appointments to JSON files in ./data/.
 * In production you'd swap this for a database, CRM API, or email notification.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function saveLead(leadData, callerNumber, callSid) {
  const leads = readJSON(LEADS_FILE);
  const entry = {
    id: `lead_${Date.now()}`,
    capturedAt: new Date().toISOString(),
    callerNumber,
    callSid,
    ...leadData,
  };
  leads.push(entry);
  writeJSON(LEADS_FILE, leads);
  console.log(`[leads] saved lead from ${callerNumber}:`, entry);
  return entry;
}

function saveAppointment(appointmentData, callerNumber, callSid, calendarEventId) {
  const appointments = readJSON(APPOINTMENTS_FILE);
  const entry = {
    id: `appt_${Date.now()}`,
    bookedAt: new Date().toISOString(),
    callerNumber,
    callSid,
    calendarEventId: calendarEventId || null,
    ...appointmentData,
  };
  appointments.push(entry);
  writeJSON(APPOINTMENTS_FILE, appointments);
  console.log(`[appointments] booked for ${callerNumber}:`, entry);
  return entry;
}

function getLeads() {
  return readJSON(LEADS_FILE);
}

function getAppointments() {
  return readJSON(APPOINTMENTS_FILE);
}

module.exports = { saveLead, saveAppointment, getLeads, getAppointments };
