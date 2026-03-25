// State
let pollingIntervals = {};

// DOM elements
const urlForm = document.getElementById('url-form');
const videoUrlInput = document.getElementById('video-url');
const submitBtn = document.getElementById('submit-btn');
const projectsList = document.getElementById('projects-list');
const guidelinesFile = document.getElementById('guidelines-file');
const guidelinesStatus = document.getElementById('guidelines-status');
const guidelinesFilename = document.getElementById('guidelines-filename');
const guidelinesPreview = document.getElementById('guidelines-preview');
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadGuidelines();
  loadProjects();
});

// Guidelines upload
guidelinesFile.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('guidelines', file);

  try {
    const res = await fetch('/api/guidelines', { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      guidelinesStatus.textContent = 'Guidelines uploaded';
      guidelinesStatus.className = 'status-badge status-approved';
      guidelinesFilename.textContent = file.name;
      loadGuidelines();
    } else {
      alert('Upload failed: ' + data.error);
    }
  } catch (err) {
    alert('Upload error: ' + err.message);
  }
});

async function loadGuidelines() {
  try {
    const res = await fetch('/api/guidelines');
    const data = await res.json();
    if (data.exists) {
      guidelinesStatus.textContent = 'Guidelines uploaded';
      guidelinesStatus.className = 'status-badge status-approved';
      guidelinesPreview.textContent = data.content;
      guidelinesPreview.classList.remove('hidden');
    }
  } catch {}
}

// Submit video URL
urlForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = videoUrlInput.value.trim();
  if (!url) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      videoUrlInput.value = '';
      startPolling(data.projectId);
      loadProjects();
    }
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Process Video';
  }
});

// Polling for project updates
function startPolling(projectId) {
  if (pollingIntervals[projectId]) return;
  pollingIntervals[projectId] = setInterval(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const project = await res.json();
      loadProjects();
      if (['ready_for_review', 'approved', 'rejected', 'error'].includes(project.status)) {
        clearInterval(pollingIntervals[projectId]);
        delete pollingIntervals[projectId];
      }
    } catch {}
  }, 2000);
}

// Load and render all projects
async function loadProjects() {
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    renderProjects(projects);
  } catch {}
}

function renderProjects(projects) {
  if (projects.length === 0) {
    projectsList.innerHTML = '<p class="empty-state">No projects yet. Paste a video URL above to get started.</p>';
    return;
  }

  projectsList.innerHTML = projects.map(p => {
    const statusLabel = formatStatus(p.status);
    const isProcessing = !['ready_for_review', 'approved', 'rejected', 'error'].includes(p.status);

    // Start polling for in-progress projects
    if (isProcessing) startPolling(p.id);

    return `
      <div class="project-card" onclick="openProject('${p.id}')">
        <div class="project-info">
          <h3>${p.videoInfo?.title || p.url}</h3>
          <div class="meta">
            ${p.videoInfo?.uploader ? p.videoInfo.uploader + ' · ' : ''}
            ${p.videoInfo?.duration ? p.videoInfo.duration + 's · ' : ''}
            ${new Date(p.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div class="project-actions">
          <span class="status-badge status-${p.status}">${isProcessing ? '<span class="spinner"></span> ' : ''}${statusLabel}</span>
          <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteProject('${p.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function formatStatus(status) {
  const map = {
    downloading: 'Downloading',
    transcribing: 'Transcribing',
    analyzing: 'Analyzing',
    recreating: 'Creating Script',
    generating_thumbnail: 'Generating Thumbnail',
    ready_for_review: 'Ready for Review',
    approved: 'Approved',
    rejected: 'Rejected',
    error: 'Error'
  };
  return map[status] || status;
}

// Open project detail modal
async function openProject(id) {
  try {
    const res = await fetch(`/api/projects/${id}`);
    const project = await res.json();
    renderModal(project);
    modal.classList.add('visible');
  } catch (err) {
    alert('Error loading project: ' + err.message);
  }
}

function closeModal() {
  modal.classList.remove('visible');
}

// Close modal on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function renderModal(project) {
  const p = project;
  let html = `
    <h2 style="margin-bottom: 0.5rem">${p.videoInfo?.title || 'Processing...'}</h2>
    <p class="meta" style="margin-bottom: 1rem; color: var(--text-muted)">
      <a href="${p.url}" target="_blank" style="color: var(--primary)">${p.url}</a>
      <br>Status: <span class="status-badge status-${p.status}">${formatStatus(p.status)}</span>
    </p>
  `;

  if (p.error) {
    html += `<div class="detail-section"><h3>Error</h3><p style="color: var(--danger)">${p.error}</p></div>`;
  }

  // Video Info
  if (p.videoInfo) {
    html += `
      <div class="detail-section">
        <h3>Video Info</h3>
        <div class="detail-grid">
          <div class="detail-item"><label>Title</label><span>${p.videoInfo.title}</span></div>
          <div class="detail-item"><label>Creator</label><span>${p.videoInfo.uploader}</span></div>
          <div class="detail-item"><label>Duration</label><span>${p.videoInfo.duration}s</span></div>
          <div class="detail-item"><label>Platform</label><span>${p.videoInfo.platform}</span></div>
          <div class="detail-item"><label>Views</label><span>${(p.videoInfo.viewCount || 0).toLocaleString()}</span></div>
          <div class="detail-item"><label>Likes</label><span>${(p.videoInfo.likeCount || 0).toLocaleString()}</span></div>
        </div>
      </div>
    `;
  }

  // Transcription
  if (p.transcription) {
    html += `
      <div class="detail-section">
        <h3>Transcription</h3>
        <p style="background: var(--bg); padding: 1rem; border-radius: 8px; font-size: 0.9rem; white-space: pre-wrap">${p.transcription.text}</p>
        ${p.transcription.segments?.length ? `
          <details style="margin-top: 0.75rem">
            <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.85rem">Timestamped Segments</summary>
            <div style="margin-top: 0.5rem">
              ${p.transcription.segments.map(s =>
                `<div style="font-size: 0.8rem; padding: 0.25rem 0"><span style="color: var(--primary)">[${s.start.toFixed(1)}s]</span> ${s.text}</div>`
              ).join('')}
            </div>
          </details>
        ` : ''}
      </div>
    `;
  }

  // Analysis
  if (p.analysis) {
    const a = p.analysis;
    html += `
      <div class="detail-section">
        <h3>Analysis</h3>
        <div class="detail-grid">
          <div class="detail-item"><label>Hook</label><span>${a.hook || 'N/A'}</span></div>
          <div class="detail-item"><label>Topic</label><span>${a.mainTopic || 'N/A'}</span></div>
          <div class="detail-item"><label>Structure</label><span>${a.contentStructure || 'N/A'}</span></div>
          <div class="detail-item"><label>Tone</label><span>${a.toneAndStyle || 'N/A'}</span></div>
          <div class="detail-item"><label>Audience</label><span>${a.targetAudience || 'N/A'}</span></div>
          <div class="detail-item"><label>Pacing</label><span>${a.editingStyle?.pacing || 'N/A'}</span></div>
        </div>
        ${a.keyPoints?.length ? `
          <div style="margin-top: 0.75rem">
            <label style="font-size: 0.75rem; color: var(--text-muted)">Key Points</label>
            <ul style="margin-top: 0.25rem; padding-left: 1.5rem; font-size: 0.9rem">
              ${a.keyPoints.map(k => `<li>${k}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${a.viralElements?.length ? `
          <div style="margin-top: 0.75rem">
            <label style="font-size: 0.75rem; color: var(--text-muted)">Viral Elements</label>
            <div style="margin-top: 0.25rem">${a.viralElements.map(v => `<span class="tag">${v}</span>`).join(' ')}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Recreation Script
  if (p.recreation) {
    const r = p.recreation;
    html += `
      <div class="detail-section">
        <h3>Recreation Script</h3>
        <div class="detail-grid">
          <div class="detail-item"><label>Title</label><span>${r.title || 'N/A'}</span></div>
          <div class="detail-item"><label>Duration</label><span>${r.totalDuration || 'N/A'}s</span></div>
        </div>

        ${r.equipment ? `
          <div style="margin-top: 0.75rem">
            <label style="font-size: 0.75rem; color: var(--text-muted)">Equipment</label>
            <div class="detail-grid" style="margin-top: 0.25rem">
              <div class="detail-item"><label>Camera</label><span>${r.equipment.camera || 'N/A'}</span></div>
              <div class="detail-item"><label>Lighting</label><span>${r.equipment.lighting || 'N/A'}</span></div>
              <div class="detail-item"><label>Audio</label><span>${r.equipment.audio || 'N/A'}</span></div>
            </div>
          </div>
        ` : ''}

        ${r.script?.length ? `
          <div style="margin-top: 1rem">
            <label style="font-size: 0.75rem; color: var(--text-muted)">Shot-by-Shot Script</label>
            ${r.script.map(scene => `
              <div class="scene-card">
                <h4>Scene ${scene.scene} — ${scene.timeRange || ''} (${scene.duration || ''})</h4>
                <p><span class="label">Shot:</span> ${scene.shotType || 'N/A'} ${scene.cameraMovement ? '/ ' + scene.cameraMovement : ''}</p>
                <p><span class="label">Narration:</span> "${scene.narration || ''}"</p>
                <p><span class="label">Delivery:</span> ${scene.delivery || 'N/A'}</p>
                <p><span class="label">Visual:</span> ${scene.visualDescription || 'N/A'}</p>
                ${scene.textOverlay ? `<p><span class="label">Text Overlay:</span> "${scene.textOverlay}" (${scene.textPosition || ''})</p>` : ''}
                ${scene.transition ? `<p><span class="label">Transition:</span> ${scene.transition}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${r.postProduction ? `
          <details style="margin-top: 0.75rem">
            <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.85rem">Post-Production Notes</summary>
            <div style="margin-top: 0.5rem; font-size: 0.85rem">
              <p><strong>Editing:</strong> ${r.postProduction.editingNotes || 'N/A'}</p>
              <p><strong>Music:</strong> ${r.postProduction.musicRecommendation || 'N/A'}</p>
              <p><strong>Captions:</strong> ${r.postProduction.captionStyle || 'N/A'}</p>
              <p><strong>Color:</strong> ${r.postProduction.colorGrading || 'N/A'}</p>
            </div>
          </details>
        ` : ''}

        ${r.publishingNotes ? `
          <details style="margin-top: 0.75rem">
            <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.85rem">Publishing Notes</summary>
            <div style="margin-top: 0.5rem; font-size: 0.85rem">
              <p><strong>Caption:</strong> ${r.publishingNotes.suggestedCaption || 'N/A'}</p>
              <p><strong>Best Time:</strong> ${r.publishingNotes.bestTimeToPost || 'N/A'}</p>
              <p><strong>Tips:</strong> ${r.publishingNotes.platformTips || 'N/A'}</p>
              ${r.publishingNotes.hashtags?.length ?
                `<div>${r.publishingNotes.hashtags.map(h => `<span class="tag">${h}</span>`).join(' ')}</div>` : ''}
            </div>
          </details>
        ` : ''}
      </div>
    `;
  }

  // Thumbnail Concept
  if (p.thumbnailConcept) {
    const t = p.thumbnailConcept;
    html += `
      <div class="detail-section">
        <h3>Thumbnail Concept</h3>
        <p style="font-size: 0.95rem; margin-bottom: 0.75rem">${t.concept || 'N/A'}</p>

        <div class="detail-grid">
          <div class="detail-item"><label>Headline</label><span style="font-size: 1.1rem; font-weight: 700">${t.text?.headline || 'N/A'}</span></div>
          <div class="detail-item"><label>Subtext</label><span>${t.text?.subtext || 'N/A'}</span></div>
          <div class="detail-item"><label>Font</label><span>${t.text?.font || 'N/A'}</span></div>
          <div class="detail-item"><label>Composition</label><span>${t.layout?.composition || 'N/A'}</span></div>
        </div>

        ${t.visualElements ? `
          <div style="margin-top: 0.75rem">
            <label style="font-size: 0.75rem; color: var(--text-muted)">Visual Elements</label>
            <div class="detail-grid" style="margin-top: 0.25rem">
              <div class="detail-item"><label>Background</label><span>${t.visualElements.background || 'N/A'}</span></div>
              <div class="detail-item"><label>Main Subject</label><span>${t.visualElements.mainSubject || 'N/A'}</span></div>
              <div class="detail-item"><label>Expression</label><span>${t.visualElements.expression || 'N/A'}</span></div>
              <div class="detail-item"><label>Colors</label><span>${t.visualElements.colors?.primary || ''} / ${t.visualElements.colors?.secondary || ''} / ${t.visualElements.colors?.accent || ''}</span></div>
            </div>
          </div>
        ` : ''}

        ${t.imageGenerationPrompt ? `
          <details style="margin-top: 0.75rem">
            <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.85rem">DALL-E Generation Prompt</summary>
            <p style="margin-top: 0.5rem; background: var(--bg); padding: 1rem; border-radius: 8px; font-size: 0.85rem; white-space: pre-wrap">${t.imageGenerationPrompt}</p>
          </details>
        ` : ''}

        ${t.alternativeVersions?.length ? `
          <div style="margin-top: 0.75rem">
            <label style="font-size: 0.75rem; color: var(--text-muted)">Alternative Concepts</label>
            ${t.alternativeVersions.map((v, i) => `
              <div style="background: var(--bg); padding: 0.5rem; border-radius: 6px; margin-top: 0.25rem; font-size: 0.85rem">
                <strong>${i + 1}.</strong> ${v.concept} — <em>"${v.headline}"</em>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${t.guidelinesCompliance ? `
          <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted)"><strong>Guidelines Compliance:</strong> ${t.guidelinesCompliance}</p>
        ` : ''}
      </div>
    `;
  }

  // Approval bar
  if (p.status === 'ready_for_review') {
    html += `
      <div class="approval-bar">
        <button class="btn btn-success" onclick="approveProject('${p.id}')">Approve</button>
        <button class="btn btn-danger" onclick="rejectProject('${p.id}')">Reject / Request Revision</button>
      </div>
    `;
  } else if (p.status === 'approved') {
    html += `<div class="approval-bar"><span class="status-badge status-approved">Approved on ${new Date(p.approvedAt).toLocaleString()}</span></div>`;
  } else if (p.status === 'rejected') {
    html += `<div class="approval-bar"><span class="status-badge status-rejected">Rejected${p.rejectionNote ? ': ' + p.rejectionNote : ''}</span></div>`;
  }

  modalBody.innerHTML = html;
}

async function approveProject(id) {
  try {
    await fetch(`/api/projects/${id}/approve`, { method: 'POST' });
    openProject(id);
    loadProjects();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function rejectProject(id) {
  const note = prompt('Rejection note (optional):');
  if (note === null) return; // cancelled
  try {
    await fetch(`/api/projects/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    openProject(id);
    loadProjects();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    loadProjects();
    closeModal();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}
