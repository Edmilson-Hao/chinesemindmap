/* ============================================================
   SinoGraph Pro — Mobile-First | Empty start (user creates all)
   ============================================================ */

const DEFAULT_DATABASE = {
  chunks: [],
  nodes: [],
  sentences: {}
};

// ---------- STATE ----------
let db = null;
let selectedChunkId = 'GLOBAL';
let selectedNodeId = null;
let activeTab = 'graph';
let hidePinyin = false;
let hideTrans = true; // translation only when revealed

// D3
let svg, gContainer, simulation, zoomHandler;
let nodesData = [], linksData = [];
let graphInitialized = false;

// ---------- STORAGE ----------
function loadDB() {
  try {
    const raw = localStorage.getItem('sinograph_db_v3');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.chunks) && Array.isArray(parsed.nodes)) {
        if (!parsed.sentences) parsed.sentences = {};
        return parsed;
      }
    }
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
}

function saveDB() {
  localStorage.setItem('sinograph_db_v3', JSON.stringify(db));
}

// ---------- TOAST ----------
function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 2200);
}

// ---------- SWEETALERT ----------
const swalBase = {
  background: '#1e293b',
  color: '#f1f5f9',
  confirmButtonColor: '#f59e0b',
  cancelButtonColor: '#475569'
};

async function swalConfirm(title, text, confirmText = 'Confirmar', danger = false) {
  const result = await Swal.fire({
    ...swalBase,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: danger ? '#ef4444' : '#f59e0b'
  });
  return result.isConfirmed;
}

async function swalSuccess(title) {
  await Swal.fire({
    ...swalBase,
    title,
    icon: 'success',
    timer: 1400,
    showConfirmButton: false
  });
}

async function swalError(title, text = '') {
  await Swal.fire({
    ...swalBase,
    title,
    text,
    icon: 'error'
  });
}

// ---------- CROSS-CHUNK ----------
function getCrossChunkHanziSet() {
  const count = {};
  db.nodes.forEach(n => {
    count[n.hanzi] = (count[n.hanzi] || 0) + 1;
  });
  const set = new Set();
  Object.keys(count).forEach(h => { if (count[h] > 1) set.add(h); });
  return set;
}

// ---------- GRAPH DATA ----------
function prepareGraphData() {
  const crossSet = getCrossChunkHanziSet();
  let filteredNodes;

  if (selectedChunkId === 'GLOBAL') {
    filteredNodes = db.nodes.slice();
  } else {
    filteredNodes = db.nodes.filter(n => n.chunkId === selectedChunkId);
  }

  const nodeMap = {};
  nodesData = filteredNodes.map(n => {
    const chunk = db.chunks.find(c => c.id === n.chunkId) || { color: '#f59e0b' };
    const isCross = crossSet.has(n.hanzi);
    const obj = {
      id: n.id,
      hanzi: n.hanzi,
      pinyin: n.pinyin,
      translation: n.translation,
      chunkId: n.chunkId,
      parent: n.parent,
      isRoot: n.isRoot,
      isCross,
      color: isCross ? '#22c55e' : chunk.color,
      radius: n.isRoot ? 26 : (isCross ? 20 : 16)
    };
    nodeMap[n.id] = obj;
    return obj;
  });

  linksData = [];
  filteredNodes.forEach(n => {
    if (n.parent && nodeMap[n.parent]) {
      linksData.push({ source: n.parent, target: n.id, type: 'parent' });
    }
  });

  if (selectedChunkId === 'GLOBAL') {
    const byHanzi = {};
    filteredNodes.forEach(n => {
      if (!byHanzi[n.hanzi]) byHanzi[n.hanzi] = [];
      byHanzi[n.hanzi].push(n.id);
    });
    Object.values(byHanzi).forEach(ids => {
      if (ids.length > 1) {
        for (let i = 0; i < ids.length; i++) {
          for (let j = i + 1; j < ids.length; j++) {
            linksData.push({ source: ids[i], target: ids[j], type: 'cross-chunk' });
          }
        }
      }
    });
  }
}

// ---------- D3 ----------
function initGraph() {
  const container = document.getElementById('graphContainer');
  if (!container) return;

  const width = container.clientWidth || 360;
  const height = container.clientHeight || 280;

  d3.select('#d3GraphSvg').selectAll('*').remove();

  svg = d3.select('#d3GraphSvg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', '100%')
    .attr('height', '100%');

  gContainer = svg.append('g');

  zoomHandler = d3.zoom()
    .scaleExtent([0.2, 4])
    .on('zoom', (event) => {
      gContainer.attr('transform', event.transform);
    });

  svg.call(zoomHandler);

  simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(d => d.type === 'cross-chunk' ? 110 : 65))
    .force('charge', d3.forceManyBody().strength(-280))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => d.radius + 14));

  graphInitialized = true;
  renderD3Graph();
}

function renderD3Graph() {
  if (!graphInitialized) {
    initGraph();
    return;
  }

  prepareGraphData();
  gContainer.selectAll('*').remove();

  const emptyEl = document.getElementById('graphEmpty');
  if (nodesData.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (simulation) simulation.stop();
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  const linkGroup = gContainer.append('g').attr('class', 'links');
  const link = linkGroup.selectAll('line')
    .data(linksData)
    .enter().append('line')
    .attr('class', d => `link-line ${d.type}`)
    .attr('stroke', d => d.type === 'cross-chunk' ? '#22c55e' : '#475569')
    .attr('stroke-width', d => d.type === 'cross-chunk' ? 2 : 1.5);

  const nodeGroup = gContainer.append('g').attr('class', 'nodes');
  const node = nodeGroup.selectAll('g')
    .data(nodesData)
    .enter().append('g')
    .attr('class', 'node-group')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('click', (event, d) => {
      event.stopPropagation();
      selectNode(d.id);
    });

  node.append('circle')
    .attr('r', d => d.radius)
    .attr('fill', '#0f172a')
    .attr('stroke', d => d.color)
    .attr('stroke-width', d => d.isRoot ? 3 : (d.isCross ? 2.5 : 2))
    .attr('class', d => `node-circle${d.isCross ? ' is-cross' : ''}`)
    .attr('id', d => `circle-${d.id}`);

  node.append('text')
    .attr('class', 'node-label-hanzi')
    .attr('text-anchor', 'middle')
    .attr('dy', d => hidePinyin ? '0.35em' : '-0.15em')
    .attr('font-size', d => d.radius > 22 ? '13px' : '11px')
    .text(d => d.hanzi);

  node.append('text')
    .attr('class', 'node-label-pinyin')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.1em')
    .style('display', hidePinyin ? 'none' : 'block')
    .text(d => d.pinyin);

  simulation.nodes(nodesData).on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  simulation.force('link').links(linksData);
  simulation.alpha(1).restart();

  if (selectedNodeId) highlightSelectedNodeInGraph(selectedNodeId);
}

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}
function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  if (!event.sourceEvent.shiftKey) {
    d.fx = null;
    d.fy = null;
  }
}

function zoomGraph(factor) {
  if (!svg || !zoomHandler) return;
  svg.transition().duration(250).call(zoomHandler.scaleBy, factor);
}

function resetGraphZoom() {
  if (!svg || !zoomHandler) return;
  svg.transition().duration(400).call(zoomHandler.transform, d3.zoomIdentity);
}

// ---------- SELECT / SIDEBAR ----------
function selectNode(id) {
  selectedNodeId = id;
  const node = db.nodes.find(n => n.id === id);
  if (!node) return;
  highlightSelectedNodeInGraph(id);
  renderSidebarDetails(node);
}

function highlightSelectedNodeInGraph(id) {
  d3.selectAll('.node-circle')
    .attr('stroke-width', d => d.isRoot ? 3 : (d.isCross ? 2.5 : 2))
    .attr('stroke', d => d.color);

  d3.selectAll('.link-line').classed('highlighted', false);

  d3.select(`#circle-${id}`)
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 4.5);

  d3.selectAll('.link-line')
    .filter(d => (d.source.id || d.source) === id || (d.target.id || d.target) === id)
    .classed('highlighted', true);
}

function clearSidebar() {
  selectedNodeId = null;
  const tag = document.getElementById('sidebarChunkTag');
  if (tag) {
    tag.textContent = 'Nenhum nó';
    tag.style.borderColor = '';
    tag.style.color = '';
  }
  const body = document.getElementById('sidebarBody');
  if (!body) return;

  if (db.chunks.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <div class="icon">🗺️</div>
        <p>Nenhum mapa mental ainda.<br>Crie um tema para começar.</p>
        <button class="btn btn-primary btn-sm" onclick="openNewChunkModal()">+ Criar tema</button>
      </div>`;
  } else if (db.nodes.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <div class="icon">字</div>
        <p>Tema criado, mas sem palavras.<br>Adicione o primeiro vocábulo.</p>
        <button class="btn btn-primary btn-sm" onclick="openNewNodeModal()">+ Adicionar palavra</button>
      </div>`;
  } else {
    body.innerHTML = `
      <div class="empty-state">
        <div class="icon">👆</div>
        <p>Toque em uma palavra no mapa para estudar.</p>
      </div>`;
  }
}

function renderSidebarDetails(node) {
  const sidebarBody = document.getElementById('sidebarBody');
  const sidebarChunkTag = document.getElementById('sidebarChunkTag');
  const chunkObj = db.chunks.find(c => c.id === node.chunkId) || { name: 'Geral', color: '#f59e0b' };

  sidebarChunkTag.textContent = chunkObj.name.length > 18
    ? chunkObj.name.slice(0, 16) + '…'
    : chunkObj.name;
  sidebarChunkTag.style.borderColor = chunkObj.color;
  sidebarChunkTag.style.color = chunkObj.color;

  const crossMatches = db.nodes.filter(n => n.hanzi === node.hanzi && n.id !== node.id);
  const sentences = (db.sentences && db.sentences[node.id]) || [];

  const otherNodesOpts = db.nodes
    .filter(n => n.id !== node.id)
    .map(n => `<option value="${n.id}">${n.hanzi} (${n.translation.split('/')[0].trim()})</option>`)
    .join('');

  sidebarBody.innerHTML = `
    <div class="word-card">
      <button class="btn-speak" onclick="speakChinese('${escapeAttr(node.hanzi)}')" title="Ouvir">🔊</button>
      <div class="word-hanzi">${escapeHtml(node.hanzi)}</div>
      <div class="word-pinyin ${hidePinyin ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${escapeHtml(node.pinyin)}</div>
      <div class="word-trans ${hideTrans ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${escapeHtml(node.translation)}</div>
    </div>

    ${crossMatches.length > 0 ? `
      <div class="cross-box">
        <div class="title">🔗 Inter-Chunk</div>
        <p class="text-xs text-muted" style="margin-bottom:6px">Mesmo ideograma em:</p>
        <div class="flex gap-1" style="flex-wrap:wrap">
          ${crossMatches.map(m => {
            const tc = db.chunks.find(c => c.id === m.chunkId);
            const label = tc ? tc.name.split(' - ')[0] : 'Outro';
            return `<button class="chip" style="border-color:${tc ? tc.color : '#22c55e'};color:${tc ? tc.color : '#22c55e'}" onclick="jumpToCrossNode('${m.id}')">${escapeHtml(label)}</button>`;
          }).join('')}
        </div>
      </div>
    ` : ''}

    ${node.notes ? `
      <div>
        <div class="card-title">Notas</div>
        <div class="note note-accent">${escapeHtml(node.notes)}</div>
      </div>
    ` : ''}

    ${sentences.length > 0 ? `
      <div>
        <div class="card-title">Frases (${sentences.length})</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${sentences.map(s => `
            <div class="sentence-item">
              <button class="btn-speak" style="top:6px;right:6px;width:28px;height:28px;font-size:0.8rem" onclick="speakChinese('${escapeAttr(s.hanzi)}')">🔊</button>
              <div class="sentence-hanzi">${highlightKeyword(s.hanzi, node.hanzi)}</div>
              <div class="sentence-pinyin ${hidePinyin ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${escapeHtml(s.pinyin)}</div>
              <div class="sentence-trans ${hideTrans ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${escapeHtml(s.trans)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${db.nodes.length > 1 ? `
      <div>
        <div class="card-title">Combinar palavras</div>
        <div class="flex gap-2">
          <select id="secondWordSelect" class="select" style="flex:1;min-height:40px;padding:8px">${otherNodesOpts}</select>
          <button class="btn btn-primary btn-sm" onclick="generateCombinedSentence('${node.id}')">Gerar</button>
        </div>
        <div id="combinedSentenceOutput" class="combined-out hidden"></div>
      </div>
    ` : ''}
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function highlightKeyword(sentence, keyword) {
  if (!keyword) return escapeHtml(sentence);
  const parts = String(sentence).split(keyword);
  return parts.map(escapeHtml).join(`<span class="kw-highlight">${escapeHtml(keyword)}</span>`);
}

function jumpToCrossNode(nodeId) {
  const node = db.nodes.find(n => n.id === nodeId);
  if (!node) return;
  if (selectedChunkId !== 'GLOBAL' && selectedChunkId !== node.chunkId) {
    selectedChunkId = 'GLOBAL';
    document.getElementById('chunkSelect').value = 'GLOBAL';
    renderD3Graph();
  }
  selectNode(nodeId);
}

function generateCombinedSentence(firstNodeId) {
  const sel = document.getElementById('secondWordSelect');
  if (!sel) return;
  const secondId = sel.value;
  const w1 = db.nodes.find(n => n.id === firstNodeId);
  const w2 = db.nodes.find(n => n.id === secondId);
  const output = document.getElementById('combinedSentenceOutput');
  if (!w1 || !w2 || !output) return;

  const t1 = w1.translation.split('/')[0].trim();
  const t2 = w2.translation.split('/')[0].trim();
  const combinedHanzi = `在${w1.hanzi}过程中，合理使用${w2.hanzi}非常关键。`;
  const combinedPinyin = `Zài ${w1.pinyin} guòchéng zhōng, hélǐ shǐyòng ${w2.pinyin} fēicháng guānjiàn.`;
  const combinedTrans = `No processo de ${t1}, usar corretamente ${t2} é fundamental.`;

  output.classList.remove('hidden');
  output.innerHTML = `
    <div class="flex items-center" style="justify-content:space-between;margin-bottom:4px">
      <span class="font-bold" style="color:var(--accent);font-size:0.75rem">Frase combinada</span>
      <button class="btn-speak" style="position:static;width:28px;height:28px" onclick="speakChinese('${escapeAttr(combinedHanzi)}')">🔊</button>
    </div>
    <div class="sentence-hanzi">${escapeHtml(combinedHanzi)}</div>
    <div class="sentence-pinyin ${hidePinyin ? 'blur-recall' : ''}">${escapeHtml(combinedPinyin)}</div>
    <div class="sentence-trans ${hideTrans ? 'blur-recall' : ''}">${escapeHtml(combinedTrans)}</div>
  `;
}

// ---------- TABLE ----------
function renderTable() {
  const tbody = document.getElementById('vocabTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const searchVal = (document.getElementById('tableSearchInput')?.value || '').toLowerCase();
  const filterChunk = document.getElementById('tableChunkFilter')?.value || 'ALL';
  const crossSet = getCrossChunkHanziSet();

  if (db.nodes.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="5" style="text-align:center;padding:28px">
        <div class="empty-state" style="padding:8px">
          <div class="icon">字</div>
          <p>${db.chunks.length === 0
            ? 'Crie um tema e adicione palavras.'
            : 'Nenhuma palavra ainda. Adicione o primeiro vocábulo.'}</p>
          <button class="btn btn-primary btn-sm" onclick="${db.chunks.length === 0 ? 'openNewChunkModal()' : 'openNewNodeModal()'}">
            ${db.chunks.length === 0 ? '+ Criar tema' : '+ Adicionar palavra'}
          </button>
        </div>
      </td></tr>`;
    return;
  }

  const filtered = db.nodes.filter(n => {
    const matchChunk = filterChunk === 'ALL' || n.chunkId === filterChunk;
    const matchSearch = !searchVal ||
      n.hanzi.toLowerCase().includes(searchVal) ||
      n.pinyin.toLowerCase().includes(searchVal) ||
      n.translation.toLowerCase().includes(searchVal) ||
      (n.notes && n.notes.toLowerCase().includes(searchVal));
    return matchChunk && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--muted)">Nenhum resultado.</td></tr>`;
    return;
  }

  filtered.forEach(node => {
    const chunkObj = db.chunks.find(c => c.id === node.chunkId) || { name: '—', color: '#f59e0b' };
    const isCross = crossSet.has(node.hanzi);
    const shortChunk = chunkObj.name.split(' - ')[0];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="hanzi-cell">${escapeHtml(node.hanzi)}</td>
      <td class="${hidePinyin ? 'blur-recall' : ''}" style="color:var(--accent)">${escapeHtml(node.pinyin)}</td>
      <td class="${hideTrans ? 'blur-recall' : ''}">${escapeHtml(node.translation)}</td>
      <td><span class="badge-muted badge" style="color:${chunkObj.color};background:var(--bg);border:1px solid var(--border)">${escapeHtml(shortChunk)}</span></td>
      <td style="text-align:right;white-space:nowrap">
        ${isCross ? '<span class="badge" style="background:rgba(34,197,94,0.2);color:#22c55e;margin-right:4px">↔</span>' : ''}
        <button class="btn-icon btn-sm" style="width:32px;height:32px" onclick="speakChinese('${escapeAttr(node.hanzi)}')" title="Ouvir">🔊</button>
        <button class="btn-icon btn-sm" style="width:32px;height:32px" onclick="goToNodeInGraph('${node.id}')" title="No mapa">◎</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function goToNodeInGraph(id) {
  switchMainTab('graph');
  selectNode(id);
}

// ---------- UI UPDATES ----------
function populateChunkSelectors() {
  const chunkSelect = document.getElementById('chunkSelect');
  const tableFilter = document.getElementById('tableChunkFilter');
  const newNodeChunk = document.getElementById('newNodeChunkSelect');

  const opts = db.chunks.map(c =>
    `<option value="${c.id}">${escapeHtml(c.name)}</option>`
  ).join('');

  if (chunkSelect) {
    chunkSelect.innerHTML = `<option value="GLOBAL">🌐 Todos</option>${opts}`;
    if (![...chunkSelect.options].some(o => o.value === selectedChunkId)) {
      selectedChunkId = 'GLOBAL';
    }
    chunkSelect.value = selectedChunkId;
  }
  if (tableFilter) {
    tableFilter.innerHTML = `<option value="ALL">Todos</option>${opts}`;
  }
  if (newNodeChunk) {
    newNodeChunk.innerHTML = opts || '<option value="">Crie um tema primeiro</option>';
  }
}

function updateDataViews() {
  if (activeTab === 'graph') renderD3Graph();
  renderTable();
  if (selectedNodeId) {
    const still = db.nodes.find(n => n.id === selectedNodeId);
    if (still) selectNode(selectedNodeId);
    else clearSidebar();
  } else {
    clearSidebar();
  }
}

// ---------- TABS ----------
function switchMainTab(tab) {
  activeTab = tab;
  document.getElementById('graphView').classList.toggle('active', tab === 'graph');
  document.getElementById('tableView').classList.toggle('active', tab === 'table');
  document.getElementById('tabGraphBtn').classList.toggle('active', tab === 'graph');
  document.getElementById('tabTableBtn').classList.toggle('active', tab === 'table');
  if (tab === 'table') renderTable();
  if (tab === 'graph') {
    if (!graphInitialized) {
      setTimeout(initGraph, 40);
    } else {
      setTimeout(() => {
        const container = document.getElementById('graphContainer');
        if (container && svg) {
          const w = container.clientWidth;
          const h = container.clientHeight;
          svg.attr('viewBox', [0, 0, w, h]);
          simulation.force('center', d3.forceCenter(w / 2, h / 2));
          simulation.alpha(0.3).restart();
        }
      }, 40);
    }
  }
}

// ---------- RECALL ----------
function toggleRecall(type) {
  if (type === 'pinyin') {
    hidePinyin = !hidePinyin;
    document.getElementById('togglePinyinBtn').classList.toggle('active', hidePinyin);
  } else {
    hideTrans = !hideTrans;
    document.getElementById('toggleTransBtn').classList.toggle('active', hideTrans);
  }
  if (activeTab === 'graph') renderD3Graph();
  renderTable();
  if (selectedNodeId) selectNode(selectedNodeId);
}

// ---------- CHUNK SELECT ----------
function onChunkSelectChange(val) {
  selectedChunkId = val;
  clearSidebar();
  renderD3Graph();
}

// ---------- MODALS ----------
function openNewChunkModal() {
  document.getElementById('newChunkName').value = '';
  document.getElementById('newChunkColor').value = '#f59e0b';
  document.getElementById('newChunkModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('newChunkName').focus(), 100);
}

function openNewNodeModal() {
  if (db.chunks.length === 0) {
    swalError('Crie um tema primeiro', 'Antes de adicionar palavras, crie um mapa mental (tema).');
    openNewChunkModal();
    return;
  }

  const parentSelect = document.getElementById('newNodeParentSelect');
  parentSelect.innerHTML = '<option value="">Sem pai (raiz do mapa)</option>';
  const relevant = selectedChunkId === 'GLOBAL'
    ? db.nodes
    : db.nodes.filter(n => n.chunkId === selectedChunkId);
  relevant.forEach(n => {
    parentSelect.innerHTML += `<option value="${n.id}">${escapeHtml(n.hanzi)} — ${escapeHtml(n.translation.split('/')[0].trim())}</option>`;
  });

  populateChunkSelectors();
  const chunkSel = document.getElementById('newNodeChunkSelect');
  if (selectedChunkId !== 'GLOBAL') {
    chunkSel.value = selectedChunkId;
  } else if (db.chunks[0]) {
    chunkSel.value = db.chunks[0].id;
  }

  document.getElementById('newNodeHanzi').value = '';
  document.getElementById('newNodePinyin').value = '';
  document.getElementById('newNodeTranslation').value = '';
  document.getElementById('newNodeNotes').value = '';
  document.getElementById('newNodeModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('newNodeHanzi').focus(), 100);
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

async function submitNewChunk() {
  const name = document.getElementById('newChunkName').value.trim();
  const color = document.getElementById('newChunkColor').value;
  if (!name) {
    await swalError('Nome obrigatório', 'Digite o título do mapa / tema.');
    return;
  }
  const id = 'CHUNK_' + Date.now();
  db.chunks.push({ id, name, color });
  saveDB();
  selectedChunkId = id;
  populateChunkSelectors();
  closeModal('newChunkModal');
  updateDataViews();
  showToast('Mapa criado');
  // Offer to add first word
  setTimeout(() => openNewNodeModal(), 400);
}

async function submitNewNode() {
  const hanzi = document.getElementById('newNodeHanzi').value.trim();
  const pinyin = document.getElementById('newNodePinyin').value.trim();
  const translation = document.getElementById('newNodeTranslation').value.trim();
  const chunkId = document.getElementById('newNodeChunkSelect').value;
  const parent = document.getElementById('newNodeParentSelect').value || null;
  const notes = document.getElementById('newNodeNotes').value.trim();

  if (!hanzi || !pinyin || !translation) {
    await swalError('Campos obrigatórios', 'Preencha Hanzi, Pinyin e Tradução.');
    return;
  }
  if (!chunkId) {
    await swalError('Sem tema', 'Selecione ou crie um tema.');
    return;
  }

  const id = 'node_' + Date.now();
  db.nodes.push({
    id, hanzi, pinyin, translation, chunkId, parent,
    isRoot: !parent,
    notes
  });
  saveDB();
  closeModal('newNodeModal');
  if (selectedChunkId !== 'GLOBAL' && selectedChunkId !== chunkId) {
    selectedChunkId = chunkId;
    populateChunkSelectors();
  }
  updateDataViews();
  selectNode(id);
  showToast('Palavra adicionada');
}

// ---------- DATA MENU ----------
function toggleDataMenu() {
  document.getElementById('dataMenu').classList.toggle('hidden');
}

function exportDataJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `sinograph_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  toggleDataMenu();
  showToast('Backup exportado');
}

function importDataJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported.chunks || !imported.nodes) {
        await swalError('Arquivo inválido', 'O JSON precisa ter chunks e nodes.');
        return;
      }
      const ok = await swalConfirm('Importar dados?', 'Isso substitui os mapas atuais.', 'Importar');
      if (!ok) return;
      if (!imported.sentences) imported.sentences = {};
      db = imported;
      saveDB();
      selectedChunkId = 'GLOBAL';
      selectedNodeId = null;
      populateChunkSelectors();
      updateDataViews();
      await swalSuccess('Importado!');
    } catch (err) {
      await swalError('Erro ao ler JSON', err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
  toggleDataMenu();
}

async function resetToDefaultData() {
  const ok = await swalConfirm(
    'Apagar tudo?',
    'Todos os mapas e palavras serão removidos. Esta ação não pode ser desfeita.',
    'Apagar tudo',
    true
  );
  if (!ok) return;
  db = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  saveDB();
  selectedChunkId = 'GLOBAL';
  selectedNodeId = null;
  populateChunkSelectors();
  updateDataViews();
  await swalSuccess('Dados limpos');
}

// ---------- SPEECH ----------
function speakChinese(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Voz não suportada', 'error');
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ---------- RESIZE ----------
let resizeTimer;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (activeTab === 'graph' && graphInitialized) {
      const container = document.getElementById('graphContainer');
      if (!container || !svg) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      svg.attr('viewBox', [0, 0, w, h]);
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.35).restart();
    }
  }, 120);
}

// ---------- INIT ----------
function init() {
  db = loadDB();
  populateChunkSelectors();

  document.getElementById('toggleTransBtn').classList.add('active');

  switchMainTab('graph');
  setTimeout(() => {
    initGraph();
    clearSidebar();
  }, 60);

  window.addEventListener('resize', onResize);

  document.addEventListener('click', (e) => {
    const menu = document.getElementById('dataMenu');
    const btn = document.getElementById('dataMenuBtn');
    if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
