require('dotenv').config();

const express = require('express');
const path = require('path');
const ideasRouter = require('./src/routes/ideas');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/ideas', ideasRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'blueprint-for-creators' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Blueprint for Creators running on http://localhost:${PORT}`);
});
