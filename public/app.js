/* ── Blueprint for Creators — SPA ── */

const API = '/api/ideas';

// ── State ──
let state = {
  view: 'dashboard',
  ideas: [],
  stats: { total: 0, to_create: 0, created: 0, skipped: 0, categories: [], formats: {} },
  filter: 'all',
  search: '',
  calWeekOffset: 0,
  calTab: 'to_create',
  calSelectedDay: null,
  selectedScript: null,
  tpSpeed: 2,
  tpRunning: false,
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
async function deleteIdea(id) { await fetch(`${API}/${id}`, { method: 'DELETE' }); }

// ── Router ──
function navigate(view) {
  state.view = view;
  document.querySelectorAll('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  closeSidebar();
  render();
}

// ── Render ──
async function render() {
  stopTp(false);
  const main = document.getElementById('mainContent');
  switch (state.view) {
    case 'dashboard':    await renderDashboard(main); break;
    case 'vault':        await renderVault(main); break;
    case 'categories':   await renderCategories(main); break;
    case 'calendar':     await renderCalendar(main); break;
    case 'scripts':      await renderScripts(main); break;
    case 'teleprompter': await renderTeleprompter(main); break;
  }
}

// ════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════
async function renderDashboard(el) {
  const [ideas, stats] = await Promise.all([fetchIdeas(), fetchStats()]);
  state.ideas = ideas;
  state.stats = stats;
  const recent = ideas.slice(0, 5);

  el.innerHTML = `
    <div class="page-header">
      <div><h1>Dashboard</h1><p>Welcome back. Here's your content overview.</p></div>
      <button class="btn-primary" onclick="openNewIdeaModal()">+ New Idea</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Total Ideas</div><div class="stat-value">${stats.total}</div></div>
      <div class="stat-card blue"><div class="stat-label">To Create</div><div class="stat-value">${stats.to_create}</div></div>
      <div class="stat-card green"><div class="stat-label">Created</div><div class="stat-value">${stats.created}</div></div>
      <div class="stat-card red"><div class="stat-label">Skipped</div><div class="stat-value">${stats.skipped}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card" style="min-width:0">
        <div class="card-header">
          <h2>Recent Ideas</h2>
          <a href="#" onclick="navigate('vault');return false" style="font-size:13px;color:var(--blue);font-weight:600;text-decoration:none">View all</a>
        </div>
        <div class="card-body">
          ${recent.length === 0
            ? `<div class="empty-state"><div class="empty-icon">💡</div><p>No ideas yet. Add your first!</p></div>`
            : `<div class="recent-list">${recent.map(renderRecentItem).join('')}</div>`}
        </div>
      </div>

      <div class="card" style="min-width:0">
        <div class="card-header"><h2>Quick Actions</h2></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="openNewIdeaModal()">💡 Capture a new idea</button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('categories')">📂 Browse by category</button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('calendar')">📅 Plan your calendar</button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('scripts')">📝 Write a script</button>
          <button class="btn-ghost" style="width:100%;text-align:left;padding:14px" onclick="navigate('teleprompter')">🎬 Start teleprompter</button>
          ${stats.categories.length > 0 ? `
            <div style="margin-top:4px">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gray-500);margin-bottom:6px">Categories</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px">
                ${stats.categories.map(c => `<span class="badge badge-category">${esc(c)}</span>`).join('')}
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

// ════════════════════════════════════════════
// VAULT — list view with templates + hashtags
// ════════════════════════════════════════════
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
      <div><h1>Idea Vault</h1><p>Every idea in one place — captured, templated, tagged.</p></div>
      <button class="btn-primary" onclick="openNewIdeaModal()">+ New Idea</button>
    </div>

    <div class="search-bar">
      <input type="text" placeholder="Search ideas…" value="${esc(state.search)}" oninput="handleSearch(this.value)" />
    </div>

    <div class="filters">
      <button class="filter-tab ${state.filter === 'all' ? 'active' : ''}" onclick="setFilter('all')">All (${counts.all})</button>
      <button class="filter-tab ${state.filter === 'to_create' ? 'active' : ''}" onclick="setFilter('to_create')">To Create (${counts.to_create})</button>
      <button class="filter-tab ${state.filter === 'created' ? 'active' : ''}" onclick="setFilter('created')">Created (${counts.created})</button>
      <button class="filter-tab ${state.filter === 'skipped' ? 'active' : ''}" onclick="setFilter('skipped')">Skipped (${counts.skipped})</button>
    </div>

    ${filtered.length === 0
      ? `<div class="empty-state"><div class="empty-icon">🗃️</div><h3>No ideas found</h3><p>Try a different filter, or add a new idea.</p><button class="btn-primary" onclick="openNewIdeaModal()">+ Add Idea</button></div>`
      : `<div class="vault-list">${filtered.map(renderVaultItem).join('')}</div>`}
  `;
}

function renderVaultItem(idea) {
  const isDone = idea.status === 'created';
  const tags = parseTags(idea.tags);
  const displayTitle = idea.template ? highlightTemplate(idea.template) : `<span>${esc(idea.title)}</span>`;
  const hasTemplate = !!idea.template;

  return `
    <div class="vault-item" onclick="openIdeaDetail('${idea.id}')">
      <div class="vault-item-check ${isDone ? 'checked' : ''}" onclick="event.stopPropagation();quickToggleDone('${idea.id}','${idea.status}')">
        ${isDone ? '✓' : ''}
      </div>
      <div class="vault-item-body">
        ${hasTemplate ? `<div class="vault-template-badge"><span>✦</span> Template</div>` : ''}
        <div class="vault-item-title">${displayTitle}</div>
        ${hasTemplate ? `
          <div class="vault-original">
            <span class="vault-original-icon">❝</span>
            <span class="vault-original-text">${esc(idea.title)}</span>
          </div>` : idea.hook ? `
          <div class="vault-original">
            <span class="vault-original-icon">❝</span>
            <span class="vault-original-text">${esc(idea.hook)}</span>
          </div>` : ''}
        <div class="vault-item-meta">
          <span class="vault-item-meta-src">${sourceIcon(idea.source)} ${sourceLabel(idea.source)}</span>
          ${idea.scheduledDate ? `<span class="vault-item-date">📅 ${idea.scheduledDate}</span>` : `<span class="vault-item-date">${fmtDate(idea.createdAt)}</span>`}
          <span class="badge badge-${idea.status}" style="font-size:10px;padding:2px 7px">${statusLabel(idea.status)}</span>
        </div>
        ${tags.length ? `<div class="vault-item-tags">${tags.map(t => `<span class="tag-chip">${esc(t)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="vault-item-actions" onclick="event.stopPropagation()">
        <button class="icon-btn" title="Edit" onclick="openEditModal('${idea.id}')">✏️</button>
        <button class="icon-btn" title="Script" onclick="state.selectedScript='${idea.id}';navigate('scripts')">🎬</button>
        <button class="icon-btn" title="Delete" onclick="confirmDelete('${idea.id}')">🗑️</button>
      </div>
    </div>`;
}

function highlightTemplate(tmpl) {
  return esc(tmpl).replace(/\{([^}]+)\}/g, '<span class="tmpl-var">{$1}</span>');
}

function parseTags(tags) {
  if (!tags) return [];
  return tags.split(/[\s,]+/).filter(t => t.trim());
}

async function quickToggleDone(id, currentStatus) {
  const next = currentStatus === 'created' ? 'to_create' : 'created';
  await updateIdea(id, { status: next });
  render();
}

function applyFilter(ideas) {
  let list = ideas;
  if (state.filter !== 'all') list = list.filter(i => i.status === state.filter);
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      (i.notes || '').toLowerCase().includes(q) ||
      (i.hook || '').toLowerCase().includes(q) ||
      (i.category || '').toLowerCase().includes(q) ||
      (i.tags || '').toLowerCase().includes(q)
    );
  }
  return list;
}

function setFilter(f) { state.filter = f; render(); }
function handleSearch(v) { state.search = v; render(); }

// ════════════════════════════════════════════
// CATEGORIES — visual format mosaic grid
// ════════════════════════════════════════════
const FORMAT_META = {
  talking_head:   { label: 'Talking Head',   tiles: ['#93C5FD','#3B82F6','#60A5FA','#1D4ED8'] },
  green_screen:   { label: 'Green Screen',   tiles: ['#86EFAC','#22C55E','#4ADE80','#15803D'] },
  tutorial:       { label: 'Tutorial',       tiles: ['#FCA5A5','#F97316','#FB923C','#C2410C'] },
  comparison:     { label: 'Comparison',     tiles: ['#C4B5FD','#8B5CF6','#A78BFA','#6D28D9'] },
  transformation: { label: 'Transformation', tiles: ['#F9A8D4','#EC4899','#F472B6','#9D174D'] },
  voiceover:      { label: 'Voiceover',      tiles: ['#FDE68A','#F59E0B','#FCD34D','#B45309'] },
  other:          { label: 'Other',          tiles: ['#D1D5DB','#9CA3AF','#6B7280','#374151'] },
};

async function renderCategories(el) {
  state.ideas = await fetchIdeas();

  // Group by format
  const groups = {};
  state.ideas.forEach(idea => {
    const key = idea.format || 'other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(idea);
  });

  const cards = Object.entries(groups).map(([fmt, ideas]) => renderCategoryCard(fmt, ideas)).join('');

  el.innerHTML = `
    <div class="page-header">
      <div><h1>Categories</h1><p>Organize ideas by video format.</p></div>
    </div>

    ${Object.keys(groups).length === 0
      ? `<div class="empty-state"><div class="empty-icon">📂</div><h3>No categories yet</h3><p>Add ideas with a video format to see them grouped here.</p><button class="btn-primary" onclick="openNewIdeaModal()">+ Add Idea</button></div>`
      : `<div class="categories-grid">
          ${cards}
          <div class="category-add-card" onclick="openNewIdeaModal()">
            <span style="font-size:28px">+</span>
            <span>Add Idea</span>
          </div>
        </div>`}
  `;
}

function renderCategoryCard(fmt, ideas) {
  const meta = FORMAT_META[fmt] || FORMAT_META.other;
  const tiles = meta.tiles;
  return `
    <div class="category-card" onclick="filterByFormat('${fmt}')">
      <div class="category-mosaic">
        ${tiles.map(c => `<div class="mosaic-tile" style="background:${c}"></div>`).join('')}
      </div>
      <div class="category-info">
        <div class="category-name">${meta.label}</div>
        <div class="category-count">${ideas.length} idea${ideas.length !== 1 ? 's' : ''}</div>
      </div>
    </div>`;
}

function filterByFormat(fmt) {
  state.filter = 'all';
  state.search = '';
  state.view = 'vault';
  document.querySelectorAll('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.view === 'vault'));
  fetchIdeas().then(ideas => {
    state.ideas = ideas.filter(i => (i.format || 'other') === fmt);
    const meta = FORMAT_META[fmt] || FORMAT_META.other;
    const main = document.getElementById('mainContent');
    const filtered = state.ideas;
    main.innerHTML = `
      <div class="page-header">
        <div>
          <h1>${meta.label}</h1>
          <p>${filtered.length} idea${filtered.length !== 1 ? 's' : ''} in this format</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn-ghost" onclick="navigate('categories')">← Categories</button>
          <button class="btn-primary" onclick="openNewIdeaModal()">+ New Idea</button>
        </div>
      </div>
      ${filtered.length === 0
        ? `<div class="empty-state"><div class="empty-icon">📂</div><h3>No ideas in ${meta.label}</h3><button class="btn-primary" onclick="openNewIdeaModal()">+ Add Idea</button></div>`
        : `<div class="vault-list">${filtered.map(renderVaultItem).join('')}</div>`}
    `;
  });
}

// ════════════════════════════════════════════
// CALENDAR — week strip + status tabs + list
// ════════════════════════════════════════════
async function renderCalendar(el) {
  state.ideas = await fetchIdeas();

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + state.calWeekOffset * 7); // Mon start

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  if (!state.calSelectedDay) state.calSelectedDay = today.toISOString().split('T')[0];

  const selDate = new Date(state.calSelectedDay + 'T12:00:00');
  const selLabel = selDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  const tabIdeas = state.ideas.filter(i => i.status === state.calTab);

  el.innerHTML = `
    <div class="page-header">
      <div><h1>Content Calendar</h1><p>Plan and track what you're creating.</p></div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-body" style="padding:16px 20px">
        <div class="cal-header">
          <button class="cal-nav-btn" onclick="shiftWeek(-1)">&#8592;</button>
          <span class="cal-title">${selLabel}</span>
          <button class="cal-nav-btn" onclick="shiftWeek(1)">&#8594;</button>
        </div>

        <div class="week-strip">
          ${days.map(d => renderWeekDay(d, today)).join('')}
        </div>

        <div class="status-tabs">
          <button class="status-tab ${state.calTab === 'to_create' ? 'active' : ''}" onclick="setCalTab('to_create')">To Create</button>
          <button class="status-tab ${state.calTab === 'created' ? 'active' : ''}" onclick="setCalTab('created')">Created</button>
          <button class="status-tab ${state.calTab === 'skipped' ? 'active' : ''}" onclick="setCalTab('skipped')">Skipped</button>
        </div>

        ${tabIdeas.length === 0
          ? `<div style="text-align:center;padding:40px 20px;color:var(--gray-400);font-size:14px">No ${statusLabel(state.calTab)} ideas yet.</div>`
          : `<div class="cal-idea-list">${tabIdeas.map(renderCalRow).join('')}</div>`}
      </div>
    </div>

    <button class="fab" onclick="openNewIdeaModal(state.calSelectedDay)">+</button>
  `;
}

function renderWeekDay(date, today) {
  const iso = date.toISOString().split('T')[0];
  const isToday = iso === today.toISOString().split('T')[0];
  const isSelected = iso === state.calSelectedDay;
  const hasIdeas = state.ideas.some(i => i.scheduledDate === iso);
  const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  return `
    <button class="week-day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" onclick="selectDay('${iso}')">
      <span class="week-day-name">${DAYS[date.getDay()]}</span>
      <span class="week-day-num">${date.getDate()}</span>
      ${hasIdeas ? `<span class="week-dot"></span>` : '<span style="width:4px;height:4px"></span>'}
    </button>`;
}

function renderCalRow(idea) {
  const isDone = idea.status === 'created';
  const isAudio = ['tiktok','instagram','manual'].includes(idea.source);
  return `
    <div class="cal-idea-row" onclick="openIdeaDetail('${idea.id}')">
      <div class="cal-idea-icon ${isAudio ? 'audio' : 'video'}">${isAudio ? '♪' : '📷'}</div>
      <div class="cal-idea-text">
        <div class="cal-idea-title">${esc(idea.title)}</div>
        ${idea.scheduledDate ? `<div class="cal-idea-date">📅 ${idea.scheduledDate}</div>` : ''}
      </div>
      <div class="cal-idea-check ${isDone ? 'done' : ''}" onclick="event.stopPropagation();quickToggleDone('${idea.id}','${idea.status}')">
        ${isDone ? '✓' : ''}
      </div>
    </div>`;
}

function selectDay(iso) { state.calSelectedDay = iso; render(); }
function setCalTab(tab) { state.calTab = tab; render(); }
function shiftWeek(delta) {
  state.calWeekOffset += delta;
  const base = new Date(state.calSelectedDay + 'T12:00:00');
  base.setDate(base.getDate() + delta * 7);
  state.calSelectedDay = base.toISOString().split('T')[0];
  render();
}

// ════════════════════════════════════════════
// SCRIPTS
// ════════════════════════════════════════════
async function renderScripts(el) {
  state.ideas = await fetchIdeas();
  const withScript = state.ideas.filter(i => i.script);
  const noScript = state.ideas.filter(i => !i.script);

  if (!state.selectedScript) state.selectedScript = withScript[0]?.id || noScript[0]?.id || null;
  const active = state.ideas.find(i => i.id === state.selectedScript);

  el.innerHTML = `
    <div class="page-header">
      <div><h1>Scripts</h1><p>Write scripts that match your voice using proven structures.</p></div>
    </div>

    <div class="script-layout">
      <div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gray-500);margin-bottom:8px">With Script (${withScript.length})</div>
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
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--gray-500);margin-bottom:8px">Need Script (${noScript.length})</div>
          <div class="script-list">
            ${noScript.slice(0, 8).map(i => `
              <div class="script-item ${i.id === state.selectedScript ? 'active' : ''}" onclick="selectScript('${i.id}')">
                <h4>${esc(i.title)}</h4>
                <p class="text-muted">${i.hook ? esc(i.hook.substring(0,50)) + '…' : 'No script yet — click to write'}</p>
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
      ${idea.hook ? `<div style="padding:12px 20px;background:var(--yellow-light);border-bottom:1px solid #FDE68A;font-size:13px;color:var(--gray-700)"><strong style="color:var(--yellow)">Hook:</strong> <em>${esc(idea.hook)}</em></div>` : ''}
      <textarea class="script-textarea" id="scriptTextarea" placeholder="Write your script here…\n\nStart with the hook, build to the main point, end with a clear CTA.">${esc(idea.script || '')}</textarea>
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

// ════════════════════════════════════════════
// TELEPROMPTER
// ════════════════════════════════════════════
async function renderTeleprompter(el) {
  state.ideas = await fetchIdeas();
  const withScript = state.ideas.filter(i => i.script);
  if (!state.selectedScript && withScript.length > 0) state.selectedScript = withScript[0].id;
  const active = state.ideas.find(i => i.id === state.selectedScript);

  el.innerHTML = `
    <div class="page-header">
      <div><h1>Teleprompter</h1><p>Stay on script and sound natural on camera.</p></div>
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
        <input type="range" min="0.5" max="5" step="0.5" value="${state.tpSpeed}" oninput="setTpSpeed(this.value)" style="width:150px" />
      </div>
    </div>
  `;
}

function selectTpScript(id) { state.selectedScript = id || null; stopTp(true); render(); }

let tpScrollInterval = null;

function tpToggle() {
  state.tpRunning = !state.tpRunning;
  const btn = document.getElementById('tpPlayBtn');
  if (btn) btn.textContent = state.tpRunning ? '⏸ Pause' : '▶ Start';
  if (state.tpRunning) {
    const screen = document.getElementById('tpScreen');
    tpScrollInterval = setInterval(() => {
      screen.scrollTop += state.tpSpeed * 0.8;
      const bar = document.getElementById('tpBar');
      if (bar && screen.scrollHeight > screen.clientHeight) {
        bar.style.height = (screen.scrollTop / (screen.scrollHeight - screen.clientHeight) * 100) + '%';
      }
      if (screen.scrollTop + screen.clientHeight >= screen.scrollHeight) stopTp(false);
    }, 100);
  } else {
    stopTp(false);
  }
}

function stopTp(resetScroll = false) {
  state.tpRunning = false;
  clearInterval(tpScrollInterval);
  const btn = document.getElementById('tpPlayBtn');
  if (btn) btn.textContent = '▶ Start';
  if (resetScroll) {
    const s = document.getElementById('tpScreen');
    if (s) s.scrollTop = 0;
    const b = document.getElementById('tpBar');
    if (b) b.style.height = '0%';
  }
}

function tpReset() { stopTp(true); }
function setTpSpeed(v) { state.tpSpeed = parseFloat(v); const l = document.getElementById('tpSpeedLabel'); if (l) l.textContent = v + 'x'; }
function tpFullscreen() { const s = document.getElementById('tpScreen'); (s.requestFullscreen || s.webkitRequestFullscreen).call(s); }

// ════════════════════════════════════════════
// IDEA DETAIL MODAL — Why This Works + Hook
// ════════════════════════════════════════════
async function openIdeaDetail(id) {
  let idea = state.ideas.find(i => i.id === id);
  if (!idea) { const r = await fetch(`${API}/${id}`); idea = await r.json(); }

  const tags = parseTags(idea.tags);

  openModal(idea.title, `
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;align-items:center">
      <span class="badge badge-${idea.status}">● ${statusLabel(idea.status)}</span>
      <span class="badge badge-${idea.source}">${sourceLabel(idea.source)}</span>
    </div>

    ${idea.format ? `
      <div class="detail-row" style="margin-bottom:14px">
        <span style="font-size:15px">📂</span>
        <div style="flex:1">
          <div class="detail-row-label">Category</div>
          <div class="detail-row-value">${esc(formatLabel(idea.format))}</div>
        </div>
        <span style="color:var(--gray-300)">›</span>
      </div>` : ''}

    ${idea.whyItWorks ? `
      <div class="detail-why">
        <div class="detail-why-header">✦ Why This Works</div>
        <div class="detail-why-text">${esc(idea.whyItWorks)}</div>
      </div>` : ''}

    ${idea.hook ? `
      <div class="detail-hook">
        <div class="detail-hook-header">❝ Hook</div>
        <div class="detail-hook-text">${esc(idea.hook)}</div>
      </div>` : ''}

    ${idea.notes ? `
      <div class="detail-section">
        <div class="detail-section-label">Notes</div>
        <div style="background:var(--gray-50);border-radius:8px;padding:12px;font-size:14px;line-height:1.6;color:var(--gray-700)">${esc(idea.notes)}</div>
      </div>` : ''}

    ${idea.scheduledDate ? `<p style="font-size:13px;color:var(--gray-500);margin-bottom:14px">📅 Scheduled: ${idea.scheduledDate}</p>` : ''}

    ${tags.length ? `<div class="vault-item-tags" style="margin-bottom:16px">${tags.map(t => `<span class="tag-chip">${esc(t)}</span>`).join('')}</div>` : ''}

    <hr class="divider">
    <div class="detail-section-label">Transcript / Script</div>
    ${idea.script
      ? `<div class="detail-script-box">${esc(idea.script)}</div>`
      : `<p class="text-muted" style="font-size:13px">No script written yet.</p>`}

    <div class="form-actions-spread" style="margin-top:20px">
      <button class="btn-ghost" onclick="cycleStatus('${idea.id}','${idea.status}')">
        ${idea.status === 'to_create' ? '✅ Mark Created' : idea.status === 'created' ? '⏭ Mark Skipped' : '↩ Reset'}
      </button>
      <div style="display:flex;gap:8px">
        <button class="btn-ghost" onclick="closeModal();state.selectedScript='${idea.id}';navigate('scripts')">📝 Create Script</button>
        <button class="btn-primary" onclick="closeModal();openEditModal('${idea.id}')">Edit</button>
      </div>
    </div>
  `);
}

async function cycleStatus(id, current) {
  const next = current === 'to_create' ? 'created' : current === 'created' ? 'skipped' : 'to_create';
  await updateIdea(id, { status: next });
  closeModal();
  render();
}

// ════════════════════════════════════════════
// FORMS — New / Edit Idea
// ════════════════════════════════════════════
function openNewIdeaModal(scheduledDate = '') {
  openModal('New Idea', `
    <form onsubmit="submitNewIdea(event)">
      <div class="form-group">
        <label>Idea Title *</label>
        <input name="title" placeholder="What's the video about?" required autofocus />
      </div>
      <div class="form-group">
        <label>Hook</label>
        <input name="hook" placeholder="The opening line that stops the scroll…" />
        <div class="hint">The first sentence viewers will hear</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Video Format</label>
          <select name="format">
            <option value="">— Select —</option>
            ${Object.entries(FORMAT_META).map(([k,v]) => `<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Source</label>
          <select name="source">
            <option value="manual">Original</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category / Niche</label>
          <input name="category" placeholder="e.g. Finance, Fitness…" />
        </div>
        <div class="form-group">
          <label>Schedule Date</label>
          <input name="scheduledDate" type="date" value="${scheduledDate}" />
        </div>
      </div>
      <div class="form-group">
        <label>Template</label>
        <input name="template" placeholder="e.g. I went from {start} to {end} in {time}" />
        <div class="hint">Use {variables} for reusable placeholders</div>
      </div>
      <div class="form-group">
        <label>Why This Works</label>
        <textarea name="whyItWorks" style="min-height:70px" placeholder="What makes this format effective? Hook type, structure, why it converts…"></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Source URL</label>
          <input name="sourceUrl" type="url" placeholder="https://…" />
        </div>
        <div class="form-group">
          <label>Tags</label>
          <input name="tags" placeholder="#wisdom #tutorial" />
        </div>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea name="notes" placeholder="Key points, structure, research notes…"></textarea>
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
  const data = Object.fromEntries(new FormData(e.target).entries());
  await createIdea(data);
  closeModal();
  render();
}

async function openEditModal(id) {
  let idea = state.ideas.find(i => i.id === id);
  if (!idea) { const r = await fetch(`${API}/${id}`); idea = await r.json(); }

  openModal('Edit Idea', `
    <form onsubmit="submitEditIdea(event,'${id}')">
      <div class="form-group">
        <label>Idea Title *</label>
        <input name="title" value="${esc(idea.title)}" required autofocus />
      </div>
      <div class="form-group">
        <label>Hook</label>
        <input name="hook" value="${esc(idea.hook || '')}" placeholder="Opening line…" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Video Format</label>
          <select name="format">
            <option value="">— Select —</option>
            ${Object.entries(FORMAT_META).map(([k,v]) => `<option value="${k}" ${idea.format===k?'selected':''}>${v.label}</option>`).join('')}
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
          <input name="category" value="${esc(idea.category || '')}" placeholder="e.g. Finance…" />
        </div>
        <div class="form-group">
          <label>Schedule Date</label>
          <input name="scheduledDate" type="date" value="${idea.scheduledDate || ''}" />
        </div>
      </div>
      <div class="form-group">
        <label>Template</label>
        <input name="template" value="${esc(idea.template || '')}" placeholder="e.g. I went from {start} to {end} in {time}" />
      </div>
      <div class="form-group">
        <label>Why This Works</label>
        <textarea name="whyItWorks" style="min-height:70px">${esc(idea.whyItWorks || '')}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Source</label>
          <select name="source">
            ${['manual','tiktok','instagram','youtube'].map(s => `<option value="${s}" ${idea.source===s?'selected':''}>${sourceLabel(s)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Tags</label>
          <input name="tags" value="${esc(idea.tags || '')}" placeholder="#wisdom #tutorial" />
        </div>
      </div>
      <div class="form-group">
        <label>Source URL</label>
        <input name="sourceUrl" type="url" value="${esc(idea.sourceUrl || '')}" />
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea name="notes">${esc(idea.notes || '')}</textarea>
      </div>
      <div class="form-actions-spread">
        <button type="button" class="btn-danger" onclick="confirmDelete('${id}')">Delete</button>
        <div style="display:flex;gap:8px">
          <button type="button" class="btn-ghost" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Changes</button>
        </div>
      </div>
    </form>
  `);
}

async function submitEditIdea(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  await updateIdea(id, data);
  closeModal();
  render();
}

function confirmDelete(id) {
  if (!confirm('Delete this idea? This cannot be undone.')) return;
  deleteIdea(id).then(() => { closeModal(); render(); });
}

// ════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════
function openModal(title, bodyHtml) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalBackdrop').style.display = 'flex';
}
function closeModal() { document.getElementById('modalBackdrop').style.display = 'none'; }

// ════════════════════════════════════════════
// SIDEBAR / MOBILE
// ════════════════════════════════════════════
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('visible');
}

// ════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function sourceLabel(s) { return { tiktok:'TikTok', instagram:'Instagram', youtube:'YouTube', manual:'Original' }[s] || s; }
function sourceIcon(s)  { return { tiktok:'🎵', instagram:'📸', youtube:'▶️', manual:'💡' }[s] || '💡'; }
function statusLabel(s) { return { to_create:'To Create', created:'Created', skipped:'Skipped' }[s] || s; }
function formatLabel(f) { return FORMAT_META[f]?.label || f; }

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  state.calSelectedDay = new Date().toISOString().split('T')[0];

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate(link.dataset.view); });
  });

  document.getElementById('globalAddBtn').addEventListener('click', openNewIdeaModal);
  document.getElementById('mobileAddBtn').addEventListener('click', openNewIdeaModal);

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modalBackdrop')) closeModal();
  });

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
