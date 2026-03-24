const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const downloader = require('../services/downloader');
const transcriber = require('../services/transcriber');
const analyzer = require('../services/analyzer');
const recreator = require('../services/recreator');
const thumbnail = require('../services/thumbnail');
const projects = require('../services/projects');

const router = express.Router();

// Multer config for MD file uploads
const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.md') || file.mimetype === 'text/markdown' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .md files are accepted'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Upload thumbnail guidelines MD file
router.post('/guidelines', upload.single('guidelines'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fs = require('fs');
    const content = fs.readFileSync(req.file.path, 'utf-8');
    const guidelinesPath = path.join(__dirname, '../../uploads', 'thumbnail-guidelines.md');
    fs.writeFileSync(guidelinesPath, content);
    // Clean up temp file
    fs.unlinkSync(req.file.path);
    res.json({ success: true, message: 'Thumbnail guidelines uploaded successfully' });
  } catch (error) {
    console.error('Guidelines upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current guidelines
router.get('/guidelines', (req, res) => {
  const fs = require('fs');
  const guidelinesPath = path.join(__dirname, '../../uploads', 'thumbnail-guidelines.md');
  if (fs.existsSync(guidelinesPath)) {
    const content = fs.readFileSync(guidelinesPath, 'utf-8');
    res.json({ exists: true, content });
  } else {
    res.json({ exists: false, content: null });
  }
});

// Start a new project from a video URL
router.post('/projects', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Video URL is required' });
  }

  // Validate URL
  if (!downloader.isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid TikTok or YouTube Shorts URL' });
  }

  const projectId = uuidv4();
  const project = {
    id: projectId,
    url,
    status: 'downloading',
    createdAt: new Date().toISOString(),
    transcription: null,
    analysis: null,
    recreation: null,
    thumbnailConcept: null,
    approved: false
  };

  projects.save(project);
  res.json({ projectId, status: 'downloading' });

  // Process asynchronously
  processVideo(projectId, url).catch(err => {
    console.error(`Project ${projectId} failed:`, err);
    const proj = projects.get(projectId);
    if (proj) {
      proj.status = 'error';
      proj.error = err.message;
      projects.save(proj);
    }
  });
});

// Get project status
router.get('/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// List all projects
router.get('/projects', (req, res) => {
  const all = projects.getAll();
  res.json(all);
});

// Approve a project
router.post('/projects/:id/approve', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.approved = true;
  project.approvedAt = new Date().toISOString();
  projects.save(project);
  res.json({ success: true, project });
});

// Reject / request revision
router.post('/projects/:id/reject', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  project.approved = false;
  project.status = 'rejected';
  project.rejectionNote = req.body.note || '';
  projects.save(project);
  res.json({ success: true, project });
});

// Delete a project
router.delete('/projects/:id', (req, res) => {
  const deleted = projects.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ success: true });
});

// Async video processing pipeline
async function processVideo(projectId, url) {
  const project = projects.get(projectId);

  // Step 1: Download video
  project.status = 'downloading';
  projects.save(project);
  const { audioPath, videoInfo } = await downloader.download(url, projectId);
  project.videoInfo = videoInfo;

  // Step 2: Transcribe
  project.status = 'transcribing';
  projects.save(project);
  const transcription = await transcriber.transcribe(audioPath);
  project.transcription = transcription;

  // Step 3: Analyze
  project.status = 'analyzing';
  projects.save(project);
  const analysis = await analyzer.analyze(transcription, videoInfo, url);
  project.analysis = analysis;

  // Step 4: Generate recreation script
  project.status = 'recreating';
  projects.save(project);
  const recreation = await recreator.recreate(transcription, analysis, videoInfo);
  project.recreation = recreation;

  // Step 5: Generate thumbnail concept
  project.status = 'generating_thumbnail';
  projects.save(project);
  const fs = require('fs');
  const guidelinesPath = path.join(__dirname, '../../uploads', 'thumbnail-guidelines.md');
  let guidelines = '';
  if (fs.existsSync(guidelinesPath)) {
    guidelines = fs.readFileSync(guidelinesPath, 'utf-8');
  }
  const thumbnailConcept = await thumbnail.generate(transcription, analysis, guidelines);
  project.thumbnailConcept = thumbnailConcept;

  // Done - awaiting approval
  project.status = 'ready_for_review';
  projects.save(project);

  console.log(`Project ${projectId} ready for review`);
}

module.exports = router;
