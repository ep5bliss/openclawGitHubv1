const express = require('express');
const hookBank = require('../services/hookBank');
const productScorecard = require('../services/productScorecard');
const contentPipeline = require('../services/contentPipeline');

const router = express.Router();

// ── Hook Bank ────────────────────────────────────────────────────────────────

router.get('/hooks', (req, res) => {
  try {
    res.json(hookBank.list(req.query));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/hooks/stats', (req, res) => {
  try {
    res.json(hookBank.stats());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/hooks', (req, res) => {
  try {
    res.status(201).json(hookBank.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/hooks/:id', (req, res) => {
  try {
    res.json(hookBank.update(req.params.id, req.body));
  } catch (e) {
    res.status(e.message === 'hook not found' ? 404 : 400).json({ error: e.message });
  }
});

router.delete('/hooks/:id', (req, res) => {
  try {
    hookBank.remove(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// ── Product Scorecard ────────────────────────────────────────────────────────

router.get('/products', (req, res) => {
  try {
    res.json(productScorecard.list());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/products/leaderboard', (req, res) => {
  try {
    res.json(productScorecard.leaderboard());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/products', (req, res) => {
  try {
    res.status(201).json(productScorecard.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/products/:id', (req, res) => {
  try {
    res.json(productScorecard.update(req.params.id, req.body));
  } catch (e) {
    res.status(e.message === 'product not found' ? 404 : 400).json({ error: e.message });
  }
});

router.delete('/products/:id', (req, res) => {
  try {
    productScorecard.remove(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// ── Content Assembly Line ────────────────────────────────────────────────────

router.get('/pipeline', (req, res) => {
  try {
    res.json(contentPipeline.list(req.query));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/pipeline/stats', (req, res) => {
  try {
    res.json(contentPipeline.stats());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/pipeline', (req, res) => {
  try {
    res.status(201).json(contentPipeline.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Advance a piece to its next stage
router.post('/pipeline/:id/advance', (req, res) => {
  try {
    res.json(contentPipeline.advance(req.params.id, req.body));
  } catch (e) {
    const status = e.message === 'content not found' ? 404 : 400;
    res.status(status).json({ error: e.message });
  }
});

router.put('/pipeline/:id', (req, res) => {
  try {
    res.json(contentPipeline.update(req.params.id, req.body));
  } catch (e) {
    res.status(e.message === 'content not found' ? 404 : 400).json({ error: e.message });
  }
});

router.delete('/pipeline/:id', (req, res) => {
  try {
    contentPipeline.remove(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = router;
