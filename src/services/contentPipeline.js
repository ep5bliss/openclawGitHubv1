const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, '../../data/pipeline.json');

const STAGES = ['idea', 'hook', 'film', 'edit', 'post', 'analyze', 'repeat'];

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function save(items) {
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2));
}

function nextStage(current) {
  const idx = STAGES.indexOf(current);
  if (idx === -1 || idx === STAGES.length - 1) return null;
  return STAGES[idx + 1];
}

function list(filters = {}) {
  let items = load();
  if (filters.stage) items = items.filter(i => i.stage === filters.stage);
  if (filters.product) items = items.filter(i => i.product === filters.product);
  return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function create({ title, topic, product, hookId, notes }) {
  if (!title) throw new Error('title is required');
  const items = load();
  const record = {
    id: crypto.randomUUID(),
    title,
    topic: topic || '',
    product: product || '',
    hookId: hookId || null,
    notes: notes || '',
    stage: 'idea',
    stageHistory: [{ stage: 'idea', enteredAt: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(record);
  save(items);
  return record;
}

function advance(id, { notes } = {}) {
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('content not found');

  const item = items[idx];
  const next = nextStage(item.stage);
  if (!next) throw new Error(`already at final stage: ${item.stage}`);

  item.stage = next;
  item.stageHistory.push({ stage: next, enteredAt: new Date().toISOString() });
  if (notes) item.notes = notes;
  item.updatedAt = new Date().toISOString();

  save(items);
  return item;
}

function update(id, fields) {
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('content not found');
  const protected_ = ['id', 'stage', 'stageHistory', 'createdAt'];
  protected_.forEach(k => delete fields[k]);
  items[idx] = { ...items[idx], ...fields, updatedAt: new Date().toISOString() };
  save(items);
  return items[idx];
}

function remove(id) {
  const items = load();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('content not found');
  items.splice(idx, 1);
  save(items);
}

function stats() {
  const items = load();
  const byStage = {};
  STAGES.forEach(s => { byStage[s] = 0; });
  items.forEach(i => { byStage[i.stage] = (byStage[i.stage] || 0) + 1; });

  // Average time per stage across all items that passed through it
  const stageTimes = {};
  items.forEach(item => {
    const hist = item.stageHistory;
    for (let i = 0; i < hist.length - 1; i++) {
      const s = hist[i].stage;
      const ms = new Date(hist[i + 1].enteredAt) - new Date(hist[i].enteredAt);
      if (!stageTimes[s]) stageTimes[s] = [];
      stageTimes[s].push(ms);
    }
  });

  const avgDaysPerStage = {};
  Object.entries(stageTimes).forEach(([stage, times]) => {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    avgDaysPerStage[stage] = parseFloat((avg / 86_400_000).toFixed(1));
  });

  return {
    total: items.length,
    byStage,
    avgDaysPerStage,
    stages: STAGES,
  };
}

module.exports = { STAGES, list, create, advance, update, remove, stats };
