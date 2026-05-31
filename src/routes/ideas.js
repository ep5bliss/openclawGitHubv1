const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { load, save } = require('../storage');

const router = express.Router();

router.get('/', (req, res) => {
  const { status, category, source } = req.query;
  let { ideas } = load();
  if (status) ideas = ideas.filter(i => i.status === status);
  if (category) ideas = ideas.filter(i => i.category === category);
  if (source) ideas = ideas.filter(i => i.source === source);
  ideas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(ideas);
});

router.get('/:id', (req, res) => {
  const { ideas } = load();
  const idea = ideas.find(i => i.id === req.params.id);
  if (!idea) return res.status(404).json({ error: 'Not found' });
  res.json(idea);
});

router.post('/', (req, res) => {
  const { title, source, sourceUrl, category, niche, notes, scheduledDate } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const db = load();
  const idea = {
    id: uuidv4(),
    title,
    source: source || 'manual',
    sourceUrl: sourceUrl || '',
    category: category || '',
    niche: niche || '',
    status: 'to_create',
    notes: notes || '',
    script: '',
    scheduledDate: scheduledDate || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.ideas.push(idea);
  save(db);
  res.status(201).json(idea);
});

router.put('/:id', (req, res) => {
  const db = load();
  const idx = db.ideas.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const allowed = ['title', 'source', 'sourceUrl', 'category', 'niche', 'status', 'notes', 'script', 'scheduledDate'];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) db.ideas[idx][k] = req.body[k];
  });
  db.ideas[idx].updatedAt = new Date().toISOString();
  save(db);
  res.json(db.ideas[idx]);
});

router.delete('/:id', (req, res) => {
  const db = load();
  const idx = db.ideas.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.ideas.splice(idx, 1);
  save(db);
  res.json({ ok: true });
});

router.get('/stats/summary', (req, res) => {
  const { ideas } = load();
  const categories = [...new Set(ideas.map(i => i.category).filter(Boolean))];
  res.json({
    total: ideas.length,
    to_create: ideas.filter(i => i.status === 'to_create').length,
    created: ideas.filter(i => i.status === 'created').length,
    skipped: ideas.filter(i => i.status === 'skipped').length,
    categories,
  });
});

module.exports = router;
