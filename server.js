require('dotenv').config();

const express = require('express');
const vapiRouter = require('./src/handlers/vapi');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Vapi webhook routes
app.use('/vapi', vapiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-receptionist' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const name = process.env.BUSINESS_NAME || 'Your Business';
  console.log(`AI Receptionist for "${name}" running on port ${PORT}`);
  console.log(`Vapi webhook URL: ${process.env.SERVER_URL || 'https://<your-domain>'}/vapi/webhook`);
});
