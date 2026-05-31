/* ── Blueprint for Creators — SPA ── */

const API = '/api/ideas';

// ── State ──
let state = {
  view: 'dashboard',
  ideas: [],
  stats: { total: 0, to_create: 0, created: 0, skipped: 0, categories: [] },
  filter: 'all',
  search: '',
  calWeekOffset: 0,
  selectedScript: null,
  tpRunning: false,
  tpSpeed: 2,
  tpPos: 0,
  tpTimer: null,
};

// ── API helpers ──
async function fetchIdeas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}${qs ? '?' + qs : ''}`);
  return res.json();
}
async function fetchStats() {
  const res = await fetch(`${API}/stats/summary`);
  return res.json();
}
async function createIdea(data) {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
async function updateIdea(id, data) {
  const res = await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return res.json();
}
async function deleteIdea(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
}

// ── Router ──
function navigate(view) {
  state.view = view;
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
  closeSidebar();
  render();
}

// ── Render dispatcher ──
async function render() {
  const main = document.getElementById('mainContent');
  switch (state.view) {
    case 'dashboard':   await renderDashboard(main); break;
    case 'vault':       await renderVault(main); break;
    case 'calendar':    await renderCalendar(main); break;
    case 'scripts':     await renderScripts(main); break;
    case 'teleprompter': await renderTeleprompter(main); break;
  }
}

// ── Dashboard ──
async function renderDashboard(el) {
  const [ideas, stats] = await Promise.all([fetchIdeas(), fetchStats()]);
  state.ideas = ideas;
  state.stats = stats;

  const recent = ideas.slice(0, 5);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back. Here's your content overview.</p>
      </div>
      <button class="btn-primary" onclick="openNewIdeaModal()">+ New Idea</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Ideas</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">To Create</div>
        <div class="stat-value">${stats.to_create}</div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">Created</div>
        <div class="stat-value">${stats.created}</div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">Skipped</div>
        <div class="stat-value">${stats.skipped}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex-wrap:wrap;">
      <div class="card" style="min-width:0">
        <div class="card-header">
          <h2>Recent Ideas</h2>
          <a href="#" onclick="navigate('vault');return false;" style="font-size:13px;color:var(--blue);text-decoration:none;font-weight:600">View all</a>
        </div>
        <div class="card-body">
          ${recent.length === 0 ? `<div class="empty-state"><div class="empty-icon">💡</div><p>No ideas yet. Add your first!</p></div>` :
            `<div class="recent-list">${recent.map(renderRecentItem).join('')}</div>`}
        </div>
      </div>

      <div class="card" style="min-width:0">
        <div class="card-header"><h2>Quick Actions</h2></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="openNewIdeaModal()">
            💡 Capture a new idea
          </button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('calendar')">
            📅 Plan your content calendar
          </button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('scripts')">
            📝 Write a script
          </button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('teleprompter')">
            🎬 Start the teleprompter
          </button>
          ${stats.categories.length > 0 ? `
            <div style="margin-top:8px">
              <div style="font-size:12px;font-weight:600;color:var(--gray-500);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Categories</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${stats.categories.map(c => `<span class="badge badge-category">${c}</span>`).join('')}
              </div>
            </div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderRecentItem(idea) {
  return `
    <div class="recent-item" onclick="openIdeaDetail('${idea.id}')">
      <div class="recent-item-icon">${sourceIcon(idea.source)}</div>
      <div>
        <div class="recent-item-title">${esc(idea.title)}</div>
        <div class="recent-item-meta">${statusLabel(idea.status)} · ${fmtDate(idea.createdAt)}</div>
      </div>
    </div>`;
}

// ── Vault ──
async function renderVault(el) {
  state.ideas = await fetchIdeas();

  const filtered = applyFilter(state.ideas);
  const counts = {
    all: state.ideas.length,
    to_create: state.ideas.filter(i => i.status === 'to_create').length,
    created: state.ideas.filter(i => i.status === 'created').length,
    skipped: state.ideas.filter(i => i.status === 'skipped').length,
  };

  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Idea Vault</h1>
        <p>All your captured video ideas in one place.</p>
      </div>
      <button class="btn-primary" onclick="openNewIdeaModal()">+ New Idea</button>
    </div>

    <div class="search-bar">
      <input type="text" placeholder="Search ideas…" id="vaultSearch" value="${esc(state.search)}" oninput="handleSearch(this.value)" />
    </div>

    <div class="filters">
      <button class="filter-tab ${state.filter === 'all' ? 'active' : ''}" onclick="setFilter('all')">All (${counts.all})</button>
      <button class="filter-tab ${state.filter === 'to_create' ? 'active' : ''}" onclick="setFilter('to_create')">To Create (${counts.to_create})</button>
      <button class="filter-tab ${state.filter === 'created' ? 'active' : ''}" onclick="setFilter('created')">Created (${counts.created})</button>
      <button class="filter-tab ${state.filter === 'skipped' ? 'active' : ''}" onclick="setFilter('skipped')">Skipped (${counts.skipped})</button>
    </div>

    ${filtered.length === 0
      ? `<div class="empty-state"><div class="empty-icon">🗃️</div><h3>No ideas found</h3><p>Try adjusting your filter or search, or add a new idea.</p><button class="btn-primary" onclick="openNewIdeaModal()">+ Add Idea</button></div>`
      : `<div class="ideas-grid">${filtered.map(renderIdeaCard).join('')}</div>`}
  `;
}

function renderIdeaCard(idea) {
  return `
    <div class="idea-card ${idea.script ? 'has-script' : ''}" onclick="openIdeaDetail('${idea.id}')">
      <div class="idea-card-top">
        <div class="idea-title">${esc(idea.title)}</div>
        <div class="idea-actions" onclick="event.stopPropagation()">
          <button class="idea-action-btn" title="Edit" onclick="openEditModal('${idea.id}')">✏️</button>
          <button class="idea-action-btn" title="Delete" onclick="confirmDelete('${idea.id}')">🗑️</button>
        </div>
      </div>
      <div class="idea-meta">
        <span class="badge badge-${idea.source}">${sourceLabel(idea.source)}</span>
        <span class="badge badge-${idea.status}">${statusLabel(idea.status)}</span>
        ${idea.category ? `<span class="badge badge-category">${esc(idea.category)}</span>` : ''}
      </div>
      ${idea.notes ? `<div class="idea-notes">${esc(idea.notes)}</div>` : ''}
      <div class="idea-date">${fmtDate(idea.createdAt)}</div>
      ${idea.script ? `<div style="margin-top:8px;font-size:11px;font-weight:600;color:var(--blue)">📝 Script written</div>` : ''}
    </div>`;
}

function applyFilter(ideas) {
  let list = ideas;
  if (state.filter !== 'all') list = list.filter(i => i.status === state.filter);
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(i => i.title.toLowerCase().includes(q) || i.notes.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }
  return list;
}

function setFilter(f) { state.filter = f; render(); }
function handleSearch(v) { state.search = v; render(); }

// ── Calendar ──
async function renderCalendar(el) {
  state.ideas = await fetchIdeas();

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + state.calWeekOffset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const monthLabel = days[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Content Calendar</h1>
        <p>Plan and track what you're creating.</p>
      </div>
      <button class="btn-primary" onclick="openNewIdeaModal()">+ New Idea</button>
    </div>

    <div class="calendar-nav">
      <button class="cal-btn" onclick="shiftWeek(-1)">&#8592;</button>
      <h2>${monthLabel}</h2>
      <button class="cal-btn" onclick="shiftWeek(1)">&#8594;</button>
    </div>

    <div class="card">
      <div class="card-body" style="overflow-x:auto">
        <div class="week-grid">
          ${days.map(d => renderDayCol(d, today)).join('')}
        </div>
      </div>
    </div>

    <hr class="divider">
    <div class="card">
      <div class="card-header"><h2>Unscheduled Ideas</h2></div>
      <div class="card-body">
        ${renderUnscheduled()}
      </div>
    </div>
  `;
}

function renderDayCol(date, today) {
  const iso = date.toISOString().split('T')[0];
  const isToday = iso === today.toISOString().split('T')[0];
  const dayIdeas = state.ideas.filter(i => i.scheduledDate === iso);
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return `
    <div class="day-col">
      <div class="day-header">
        <div class="day-name">${DAYS[date.getDay()]}</div>
        <div class="day-num ${isToday ? 'today' : ''}">${date.getDate()}</div>
      </div>
      ${dayIdeas.map(i => `
        <div class="cal-idea ${i.status}" onclick="openIdeaDetail('${i.id}')" title="${esc(i.title)}">
          ${esc(i.title)}
        </div>`).join('')}
      <button class="cal-add" onclick="openNewIdeaModal('${iso}')">+</button>
    </div>`;
}

function renderUnscheduled() {
  const unscheduled = state.ideas.filter(i => !i.scheduledDate && i.status === 'to_create');
  if (!unscheduled.length) return `<p class="text-muted">No unscheduled ideas.</p>`;
  return `<div class="ideas-grid">${unscheduled.map(renderIdeaCard).join('')}</div>`;
}

function shiftWeek(delta) { state.calWeekOffset += delta; render(); }

// ── Scripts ──
async function renderScripts(el) {
  state.ideas = await fetchIdeas();
  const withScript = state.ideas.filter(i => i.script);
  const all = state.ideas;

  if (!state.selectedScript && withScript.length > 0) state.selectedScript = withScript[0].id;

  const active = all.find(i => i.id === state.selectedScript);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Scripts</h1>
        <p>Write and manage scripts for your ideas.</p>
      </div>
    </div>

    <div class="script-layout">
      <div>
        <div style="margin-bottom:12px">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gray-500);margin-bottom:8px">With Script (${withScript.length})</div>
          <div class="script-list">
            ${withScript.map(i => `
              <div class="script-item ${i.id === state.selectedScript ? 'active' : ''}" onclick="selectScript('${i.id}')">
                <h4>${esc(i.title)}</h4>
                <p>${esc(i.script.substring(0, 60))}…</p>
              </div>`).join('') || `<p class="text-muted" style="padding:8px">No scripts yet.</p>`}
          </div>
        </div>
        <hr class="divider">
        <div>
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gray-500);margin-bottom:8px">Need Script (${all.filter(i=>!i.script).length})</div>
          <div class="script-list">
            ${all.filter(i=>!i.script).slice(0,6).map(i => `
              <div class="script-item ${i.id === state.selectedScript ? 'active' : ''}" onclick="selectScript('${i.id}')">
                <h4>${esc(i.title)}</h4>
                <p class="text-muted">No script yet — click to write</p>
              </div>`).join('') || `<p class="text-muted" style="padding:8px">All ideas have scripts!</p>`}
          </div>
        </div>
      </div>

      <div>
        ${active ? renderEditorPanel(active) : `
          <div class="editor-panel card">
            <div class="empty-state"><div class="empty-icon">📝</div><h3>No idea selected</h3><p>Pick an idea from the list to write its script.</p></div>
          </div>`}
      </div>
    </div>
  `;
}

function renderEditorPanel(idea) {
  return `
    <div class="editor-panel">
      <div class="editor-toolbar">
        <input class="title-input" value="${esc(idea.title)}" id="scriptTitleInput" placeholder="Idea title…" />
        <span class="badge badge-${idea.source}">${sourceLabel(idea.source)}</span>
        <button class="btn-primary sm" onclick="saveScript()">Save</button>
        <button class="btn-ghost sm" onclick="navigate('teleprompter')">▶ Teleprompter</button>
      </div>
      <textarea class="script-textarea" id="scriptTextarea" placeholder="Write your script here… Start with a hook, build to the main point, and end with a clear CTA.">${esc(idea.script || '')}</textarea>
    </div>`;
}

async function saveScript() {
  const id = state.selectedScript;
  const script = document.getElementById('scriptTextarea').value;
  const title = document.getElementById('scriptTitleInput').value;
  await updateIdea(id, { script, title });
  await render();
}

function selectScript(id) { state.selectedScript = id; render(); }

// ── Teleprompter ──
async function renderTeleprompter(el) {
  state.ideas = await fetchIdeas();
  const withScript = state.ideas.filter(i => i.script);

  if (!state.selectedScript && withScript.length > 0) state.selectedScript = withScript[0].id;
  const active = state.ideas.find(i => i.id === state.selectedScript);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Teleprompter</h1>
        <p>Stay on script and sound natural on camera.</p>
      </div>
    </div>

    <div class="teleprompter-view">
      <div class="teleprompter-select">
        <select onchange="selectTpScript(this.value)">
          <option value="">— Select a script —</option>
          ${withScript.map(i => `<option value="${i.id}" ${i.id === state.selectedScript ? 'selected' : ''}>${esc(i.title)}</option>`).join('')}
        </select>
      </div>

      <div class="teleprompter-screen" id="tpScreen">
        <div class="tp-progress"><div class="tp-progress-bar" id="tpBar" style="height:0%"></div></div>
        <div class="teleprompter-text" id="tpText">
          ${active?.script ? esc(active.script) : 'Select a script above to begin.'}
        </div>
      </div>

      <div class="teleprompter-controls">
        <button class="btn-ghost" onclick="tpReset()">↺ Reset</button>
        <button class="btn-primary" id="tpPlayBtn" onclick="tpToggle()">▶ Start</button>
        <button class="btn-ghost" onclick="tpFullscreen()">⛶ Fullscreen</button>
      </div>

      <div class="speed-slider">
        <label>Speed: <span id="tpSpeedLabel">${state.tpSpeed}x</span></label>
        <input type="range" min="0.5" max="5" step="0.5" value="${state.tpSpeed}" oninput="setTpSpeed(this.value)" style="width:150px"/>
      </div>
    </div>
  `;
}

function selectTpScript(id) { state.selectedScript = id || null; stopTp(); render(); }

let tpScrollInterval = null;
function tpToggle() {
  state.tpRunning = !state.tpRunning;
  document.getElementById('tpPlayBtn').textContent = state.tpRunning ? '⏸ Pause' : '▶ Start';
  if (state.tpRunning) {
    const screen = document.getElementById('tpScreen');
    tpScrollInterval = setInterval(() => {
      screen.scrollTop += state.tpSpeed * 0.8;
      const bar = document.getElementById('tpBar');
      if (bar && screen.scrollHeight > screen.clientHeight) {
        const pct = (screen.scrollTop / (screen.scrollHeight - screen.clientHeight)) * 100;
        bar.style.height = pct + '%';
      }
      if (screen.scrollTop + screen.clientHeight >= screen.scrollHeight) stopTp();
    }, 100);
  } else {
    stopTp(false);
  }
}

function stopTp(reset = false) {
  state.tpRunning = false;
  clearInterval(tpScrollInterval);
  const btn = document.getElementById('tpPlayBtn');
  if (btn) btn.textContent = '▶ Start';
  if (reset) {
    const screen = document.getElementById('tpScreen');
    if (screen) { screen.scrollTop = 0; }
    const bar = document.getElementById('tpBar');
    if (bar) bar.style.height = '0%';
  }
}

function tpReset() { stopTp(true); }

function setTpSpeed(v) {
  state.tpSpeed = parseFloat(v);
  const lbl = document.getElementById('tpSpeedLabel');
  if (lbl) lbl.textContent = v + 'x';
}

function tpFullscreen() {
  const screen = document.getElementById('tpScreen');
  if (screen.requestFullscreen) screen.requestFullscreen();
  else if (screen.webkitRequestFullscreen) screen.webkitRequestFullscreen();
}

// ── Modals ──
function openNewIdeaModal(scheduledDate = '') {
  openModal('New Idea', `
    <form onsubmit="submitNewIdea(event)">
      <div class="form-group">
        <label>Idea Title *</label>
        <input name="title" placeholder="What's the video about?" required autofocus />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Source</label>
          <select name="source">
            <option value="manual">Manual / Original</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        <div class="form-group">
          <label>Category / Niche</label>
          <input name="category" placeholder="e.g. Finance, Fitness…" />
        </div>
      </div>
      <div class="form-group">
        <label>Source URL</label>
        <input name="sourceUrl" type="url" placeholder="https://…" />
      </div>
      <div class="form-group">
        <label>Notes / Hook</label>
        <textarea name="notes" placeholder="What makes this idea work? Key points, hook idea…"></textarea>
      </div>
      <div class="form-group">
        <label>Schedule Date</label>
        <input name="scheduledDate" type="date" value="${scheduledDate}" />
      </div>
      <div class="form-actions">
        <button type="button" class="btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn-primary">Save Idea</button>
      </div>
    </form>
  `);
}

async function submitNewIdea(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  await createIdea(data);
  closeModal();
  await render();
}

async function openEditModal(id) {
  const idea = state.ideas.find(i => i.id === id);
  if (!idea) return;
  openModal('Edit Idea', `
    <form onsubmit="submitEditIdea(event,'${id}')">
      <div class="form-group">
        <label>Idea Title *</label>
        <input name="title" value="${esc(idea.title)}" required autofocus />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Source</label>
          <select name="source">
            ${['manual','tiktok','instagram','youtube'].map(s => `<option value="${s}" ${idea.source===s?'selected':''}>${sourceLabel(s)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            <option value="to_create" ${idea.status==='to_create'?'selected':''}>To Create</option>
            <option value="created" ${idea.status==='created'?'selected':''}>Created</option>
            <option value="skipped" ${idea.status==='skipped'?'selected':''}>Skipped</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category</label>
          <input name="category" value="${esc(idea.category)}" placeholder="e.g. Finance, Fitness…" />
        </div>
        <div class="form-group">
          <label>Schedule Date</label>
          <input name="scheduledDate" type="date" value="${idea.scheduledDate}" />
        </div>
      </div>
      <div class="form-group">
        <label>Source URL</label>
        <input name="sourceUrl" type="url" value="${esc(idea.sourceUrl)}" placeholder="https://…" />
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea name="notes">${esc(idea.notes)}</textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-danger" onclick="confirmDelete('${id}')">Delete</button>
        <button type="button" class="btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn-primary">Save Changes</button>
      </div>
    </form>
  `);
}

async function submitEditIdea(e, id) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  await updateIdea(id, data);
  closeModal();
  await render();
}

async function openIdeaDetail(id) {
  const idea = state.ideas.find(i => i.id === id) || await (async () => { const r = await fetch(`${API}/${id}`); return r.json(); })();

  openModal(idea.title, `
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px">
      <span class="badge badge-${idea.source}">${sourceLabel(idea.source)}</span>
      <span class="badge badge-${idea.status}">${statusLabel(idea.status)}</span>
      ${idea.category ? `<span class="badge badge-category">${esc(idea.category)}</span>` : ''}
    </div>
    ${idea.sourceUrl ? `<p style="font-size:13px;margin-bottom:12px"><a href="${esc(idea.sourceUrl)}" target="_blank" style="color:var(--blue)">${esc(idea.sourceUrl)}</a></p>` : ''}
    ${idea.notes ? `<div style="background:var(--gray-50);border-radius:8px;padding:14px;margin-bottom:16px;font-size:14px;line-height:1.6">${esc(idea.notes)}</div>` : ''}
    ${idea.scheduledDate ? `<p style="font-size:13px;color:var(--gray-500);margin-bottom:16px">📅 Scheduled: ${idea.scheduledDate}</p>` : ''}

    <hr class="divider">
    <div style="font-size:13px;font-weight:700;margin-bottom:8px">Script</div>
    ${idea.script
      ? `<div style="background:var(--gray-50);border-radius:8px;padding:14px;font-size:14px;line-height:1.7;white-space:pre-wrap;max-height:200px;overflow-y:auto">${esc(idea.script)}</div>`
      : `<p class="text-muted">No script written yet.</p>`}

    <div class="form-actions" style="margin-top:20px">
      <button class="btn-ghost" onclick="cycleStatus('${idea.id}','${idea.status}')">
        ${idea.status === 'to_create' ? '✅ Mark Created' : idea.status === 'created' ? '⏭ Mark Skipped' : '↩ Reset to To Create'}
      </button>
      <button class="btn-ghost" onclick="closeModal();state.selectedScript='${idea.id}';navigate('scripts')">✏️ Edit Script</button>
      <button class="btn-primary" onclick="closeModal();openEditModal('${idea.id}')">Edit</button>
    </div>
  `);
}

async function cycleStatus(id, current) {
  const next = current === 'to_create' ? 'created' : current === 'created' ? 'skipped' : 'to_create';
  await updateIdea(id, { status: next });
  closeModal();
  await render();
}

function confirmDelete(id) {
  if (!confirm('Delete this idea? This cannot be undone.')) return;
  deleteIdea(id).then(() => { closeModal(); render(); });
}

function openModal(title, bodyHtml) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalBackdrop').style.display = 'flex';
}
function closeModal() { document.getElementById('modalBackdrop').style.display = 'none'; }

// ── Sidebar mobile ──
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('visible');
}

// ── Helpers ──
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function sourceLabel(s) {
  return { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', manual: 'Original' }[s] || s;
}
function sourceIcon(s) {
  return { tiktok: '🎵', instagram: '📸', youtube: '▶️', manual: '💡' }[s] || '💡';
}
function statusLabel(s) {
  return { to_create: 'To Create', created: 'Created', skipped: 'Skipped' }[s] || s;
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate(link.dataset.view); });
  });

  // Add idea buttons
  document.getElementById('globalAddBtn').addEventListener('click', openNewIdeaModal);
  document.getElementById('mobileAddBtn').addEventListener('click', openNewIdeaModal);

  // Modal close
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modalBackdrop')) closeModal();
  });

  // Hamburger
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'sidebarOverlay';
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);

  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  render();
});
