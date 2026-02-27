/**
 * Google Calendar integration.
 *
 * Uses a service account so there's no OAuth dance — just share your calendar
 * with the service account email and it can create events automatically.
 *
 * Setup steps are in README.md.
 */

const { google } = require('googleapis');
const path = require('path');

function getCalendarClient() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  if (!keyPath) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_PATH is not set in .env');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(keyPath),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

/**
 * Parse a natural-language datetime string into a JS Date.
 * Claude already extracts "next Tuesday at 2pm" etc.; here we do a best-effort
 * parse. For production use, swap in a proper NLP date library like chrono-node.
 *
 * @param {string} datetimeStr
 * @returns {Date}
 */
function parseDateTime(datetimeStr) {
  // Try direct Date parse first (handles ISO strings and many natural formats)
  const direct = new Date(datetimeStr);
  if (!isNaN(direct.getTime())) return direct;

  // Fall back to "next available slot" — tomorrow at 10 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  console.warn(`[calendar] could not parse datetime "${datetimeStr}", defaulting to tomorrow 10 AM`);
  return tomorrow;
}

/**
 * Book an appointment on Google Calendar.
 *
 * @param {object} params
 * @param {string} params.name        - Caller's name
 * @param {string} params.phone       - Caller's phone number
 * @param {string} params.purpose     - Reason for the appointment
 * @param {string} params.preferred_datetime - Natural language or ISO datetime string
 * @param {string} [params.notes]     - Any extra notes
 * @returns {Promise<{eventId: string, htmlLink: string, start: string, end: string}>}
 */
async function bookAppointment({ name, phone, purpose, preferred_datetime, notes }) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID is not set in .env');
  }

  const calendar = getCalendarClient();
  const durationMinutes = parseInt(process.env.APPOINTMENT_DURATION_MINUTES || '30', 10);

  const start = parseDateTime(preferred_datetime);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const event = {
    summary: `Call with ${name}`,
    description: [
      `Purpose: ${purpose}`,
      `Phone: ${phone}`,
      notes ? `Notes: ${notes}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 15 },
        { method: 'email', minutes: 60 },
      ],
    },
  };

  const response = await calendar.events.insert({ calendarId, resource: event });

  return {
    eventId: response.data.id,
    htmlLink: response.data.htmlLink,
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Returns true if Google Calendar is configured (keys are set).
 */
function isCalendarEnabled() {
  return !!(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH && process.env.GOOGLE_CALENDAR_ID);
}

module.exports = { bookAppointment, isCalendarEnabled };
