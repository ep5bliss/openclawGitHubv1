const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, '../../data/products.json');

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function save(products) {
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
}

// Score = (commission% * conversion * rpm) / (competition * refundRisk)
// competition and refundRisk are 1-10 (10 = worst)
// Higher score = better product to promote
function computeScore({ commissionPct, rpm, conversion, competition, refundRisk }) {
  if (!competition || !refundRisk) return 0;
  return parseFloat(
    ((commissionPct * conversion * rpm) / (competition * refundRisk)).toFixed(4)
  );
}

function grade(score) {
  if (score >= 10) return 'A';
  if (score >= 5) return 'B';
  if (score >= 2) return 'C';
  if (score >= 1) return 'D';
  return 'F';
}

function enrich(product) {
  const score = computeScore(product);
  return { ...product, score, grade: grade(score) };
}

function list() {
  return load().map(enrich).sort((a, b) => b.score - a.score);
}

function create({ name, commissionPct, rpm, conversion, competition, refundRisk }) {
  if (!name) throw new Error('product name is required');
  const products = load();
  const record = {
    id: crypto.randomUUID(),
    name,
    commissionPct: commissionPct || 0,
    rpm: rpm || 0,
    conversion: conversion || 0,
    competition: competition || 5,
    refundRisk: refundRisk || 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(record);
  save(products);
  return enrich(record);
}

function update(id, fields) {
  const products = load();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('product not found');
  products[idx] = { ...products[idx], ...fields, id, updatedAt: new Date().toISOString() };
  save(products);
  return enrich(products[idx]);
}

function remove(id) {
  const products = load();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('product not found');
  products.splice(idx, 1);
  save(products);
}

function leaderboard() {
  const products = load().map(enrich).sort((a, b) => b.score - a.score);
  return {
    ranked: products,
    best: products[0] || null,
    avoid: products.filter(p => p.grade === 'F'),
  };
}

module.exports = { list, create, update, remove, leaderboard };
