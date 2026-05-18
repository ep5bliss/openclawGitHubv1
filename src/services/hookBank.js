const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, '../../data/hooks.json');

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function save(hooks) {
  fs.writeFileSync(FILE, JSON.stringify(hooks, null, 2));
}

// A hook with views but zero sales is entertainment, not business
function classify(hook) {
  const isEntertainment = hook.views >= 1_000_000 && hook.sales === 0;
  return { ...hook, classification: isEntertainment ? 'entertainment' : 'business' };
}

function list(filters = {}) {
  let hooks = load().map(classify);
  if (filters.topic) hooks = hooks.filter(h => h.topic === filters.topic);
  if (filters.product) hooks = hooks.filter(h => h.product === filters.product);
  if (filters.classification) hooks = hooks.filter(h => h.classification === filters.classification);
  return hooks.sort((a, b) => (b.views || 0) - (a.views || 0));
}

function create({ hook, topic, product, views = 0, retention = 0, sales = 0 }) {
  if (!hook) throw new Error('hook text is required');
  const hooks = load();
  const record = {
    id: crypto.randomUUID(),
    hook,
    topic: topic || '',
    product: product || '',
    views,
    retention,
    sales,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  hooks.push(record);
  save(hooks);
  return classify(record);
}

function update(id, fields) {
  const hooks = load();
  const idx = hooks.findIndex(h => h.id === id);
  if (idx === -1) throw new Error('hook not found');
  hooks[idx] = { ...hooks[idx], ...fields, id, updatedAt: new Date().toISOString() };
  save(hooks);
  return classify(hooks[idx]);
}

function remove(id) {
  const hooks = load();
  const idx = hooks.findIndex(h => h.id === id);
  if (idx === -1) throw new Error('hook not found');
  hooks.splice(idx, 1);
  save(hooks);
}

function stats() {
  const hooks = load().map(classify);
  return {
    total: hooks.length,
    business: hooks.filter(h => h.classification === 'business').length,
    entertainment: hooks.filter(h => h.classification === 'entertainment').length,
    topByViews: hooks.slice(0, 5),
    topBySales: [...hooks].sort((a, b) => b.sales - a.sales).slice(0, 5),
  };
}

module.exports = { list, create, update, remove, stats };
