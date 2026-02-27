require('dotenv').config();

const express = require('express');
const callRouter = require('./src/handlers/call');

const app = express();

// Twilio sends form-encoded POST bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Call handling routes
app.use('/call', callRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-receptionist' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const name = process.env.BUSINESS_NAME || 'Your Business';
  console.log(`AI Receptionist for "${name}" running on port ${PORT}`);
  console.log(`Webhook URL: https://<your-domain>/call/incoming`);
});
