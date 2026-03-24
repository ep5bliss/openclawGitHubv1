const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '../../projects');

// Ensure projects directory exists
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

function getPath(id) {
  return path.join(PROJECTS_DIR, `${id}.json`);
}

function save(project) {
  fs.writeFileSync(getPath(project.id), JSON.stringify(project, null, 2));
}

function get(id) {
  const filePath = getPath(id);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getAll() {
  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
  return files
    .map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf-8'));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function remove(id) {
  const filePath = getPath(id);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  // Also clean up downloads
  const downloadDir = path.join(__dirname, '../../downloads', id);
  if (fs.existsSync(downloadDir)) {
    fs.rmSync(downloadDir, { recursive: true, force: true });
  }
  return true;
}

module.exports = { save, get, getAll, remove };
