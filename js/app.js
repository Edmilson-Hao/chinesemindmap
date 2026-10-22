/* ============================================================
   SinoGraph Pro — App Logic (Vanilla ES6+)
   ============================================================ */

// ---------- DEFAULT DATABASE ----------
const DEFAULT_DATABASE = {
  chunks: [
    { id: 'CHUNK_POWERLIFTING', name: '力量举 - Powerlifting', color: '#f59e0b' },
    { id: 'CHUNK_FITNESS', name: '日常健身与生活 - Rotina & Treino', color: '#0ea5e9' },
    { id: 'CHUNK_COMPETITION', name: '竞赛与目标 - Competição & Metas', color: '#8b5cf6' }
  ],
  nodes: [
    // CHUNK 1: POWERLIFTING
    { id: 'liliangju', hanzi: '力量举', pinyin: 'lì liàng jǔ', translation: 'Powerlifting / Levantamento de Força', chunkId: 'CHUNK_POWERLIFTING', parent: null, isRoot: true, notes: 'Modalidade de força composta por três levantamentos principais.' },
    { id: 'yundong', hanzi: '运动', pinyin: 'yùn dòng', translation: 'Esporte / Exercício', chunkId: 'CHUNK_POWERLIFTING', parent: 'liliangju', isRoot: false, notes: 'Termo central e chave de conexão entre esportes e rotina.' },
    { id: 'dongzuo', hanzi: '动作', pinyin: 'dòng zuò', translation: 'Movimento / Exercício Técnico', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Padrão ou execução técnica de um movimento.' },
    { id: 'sandadongzuo', hanzi: '三大动作', pinyin: 'sān dà dòng zuò', translation: 'Os 3 Movimentos Principais', chunkId: 'CHUNK_POWERLIFTING', parent: 'dongzuo', isRoot: false, notes: 'Agachamento, Supino e Levantamento Terra.' },
    { id: 'shendun', hanzi: '深蹲', pinyin: 'shēn dūn', translation: 'Agachamento (Squat)', chunkId: 'CHUNK_POWERLIFTING', parent: 'sandadongzuo', isRoot: false, notes: 'Flexão profunda de joelhos e quadril.' },
    { id: 'wotui', hanzi: '卧推', pinyin: 'wò tuī', translation: 'Supino (Bench Press)', chunkId: 'CHUNK_POWERLIFTING', parent: 'sandadongzuo', isRoot: false, notes: 'Empurrar a barra deitado no banco.' },
    { id: 'yingla', hanzi: '硬拉', pinyin: 'yìng lā', translation: 'Levantamento Terra (Deadlift)', chunkId: 'CHUNK_POWERLIFTING', parent: 'sandadongzuo', isRoot: false, notes: 'Tirar o peso do solo até a extensão do quadril.' },
    { id: 'shiju', hanzi: '试举', pinyin: 'shì jǔ', translation: 'Tentativa de Levantamento', chunkId: 'CHUNK_POWERLIFTING', parent: 'dongzuo', isRoot: false, notes: 'Cada tentativa oficial no tablado.' },
    { id: 'jianshenfang', hanzi: '健身房', pinyin: 'jiàn shēn fáng', translation: 'Academia / Centro de Treino', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Espaço físico para o treino.' },
    { id: 'gangling', hanzi: '杠铃', pinyin: 'gàng líng', translation: 'Barra Olímpica', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Barra de treino com pesos nas extremidades.' },
    { id: 'ganglingpian', hanzi: '杠铃片', pinyin: 'gàng líng piàn', translation: 'Anilha / Prato de Peso', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Discos colocados na barra.' },
    { id: 'yaling', hanzi: '哑铃', pinyin: 'yǎ líng', translation: 'Halter (Dumbbell)', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Equipamento para treino unilateral.' },
    { id: 'jinbiaosai', hanzi: '锦标赛', pinyin: 'jǐn biāo sài', translation: 'Campeonato / Torneio', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Competição oficial de alto nível.' },
    { id: 'lian', hanzi: '练', pinyin: 'liàn', translation: 'Treinar / Exercitar', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Verbo para ação do treino.' },
    { id: 'yundongyuan', hanzi: '运动员', pinyin: 'yùn dòng yuán', translation: 'Atleta / Competidor', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Pessoa que pratica esportes em alto nível.' },
    { id: 'jinxing', hanzi: '进行', pinyin: 'jìn xíng', translation: 'Realizar / Em andamento', chunkId: 'CHUNK_POWERLIFTING', parent: 'yundong', isRoot: false, notes: 'Conduzir ou executar uma ação formal.' },

    // CHUNK 2: FITNESS / ROUTINE (cross: 运动, 练, 健身房)
    { id: 'yundong_fit', hanzi: '运动', pinyin: 'yùn dòng', translation: 'Exercício Físico / Atividade', chunkId: 'CHUNK_FITNESS', parent: null, isRoot: true, notes: 'Termo reutilizado que liga o esporte com a rotina diária.' },
    { id: 'xiuxi', hanzi: '休息', pinyin: 'xiū xi', translation: 'Descanso / Recuperação', chunkId: 'CHUNK_FITNESS', parent: 'yundong_fit', isRoot: false, notes: 'Essencial para a hipertrofia e regeneração muscular.' },
    { id: 'jirou', hanzi: '肌肉', pinyin: 'jī ròu', translation: 'Músculo / Massa Magra', chunkId: 'CHUNK_FITNESS', parent: 'yundong_fit', isRoot: false, notes: 'Tecido muscular fortalecido nos treinos.' },
    { id: 'danbaizhi', hanzi: '蛋白质', pinyin: 'dàn bái zhì', translation: 'Proteína (Nutrição)', chunkId: 'CHUNK_FITNESS', parent: 'yundong_fit', isRoot: false, notes: 'Nutriente fundamental para construção muscular.' },
    { id: 'jianchi', hanzi: '坚持', pinyin: 'jiān chí', translation: 'Persistir / Manter a Frequência', chunkId: 'CHUNK_FITNESS', parent: 'yundong_fit', isRoot: false, notes: 'Consistência no treino e na dieta.' },
    { id: 'lian_fit', hanzi: '练', pinyin: 'liàn', translation: 'Treinar / Malhar', chunkId: 'CHUNK_FITNESS', parent: 'yundong_fit', isRoot: false, notes: 'Verbo comum na rotina diária de academia.' },
    { id: 'jianshenfang_fit', hanzi: '健身房', pinyin: 'jiàn shēn fáng', translation: 'Academia', chunkId: 'CHUNK_FITNESS', parent: 'yundong_fit', isRoot: false, notes: 'Espaço de treino diário.' },

    // CHUNK 3: COMPETITION (cross: 锦标赛, 运动员, 试举)
    { id: 'mubiao', hanzi: '目标', pinyin: 'mù biāo', translation: 'Meta / Objetivo', chunkId: 'CHUNK_COMPETITION', parent: null, isRoot: true, notes: 'Foco principal da preparação.' },
    { id: 'jihua', hanzi: '计划', pinyin: 'jì huà', translation: 'Plano de Treino / Cronograma', chunkId: 'CHUNK_COMPETITION', parent: 'mubiao', isRoot: false, notes: 'Estruturação das cargas e semanas.' },
    { id: 'chenggong', hanzi: '成功', pinyin: 'chéng gōng', translation: 'Sucesso / Obter Êxito', chunkId: 'CHUNK_COMPETITION', parent: 'mubiao', isRoot: false, notes: 'Validação da tentativa no campeonato.' },
    { id: 'jinbiaosai_comp', hanzi: '锦标赛', pinyin: 'jǐn biāo sài', translation: 'Campeonato Oficial', chunkId: 'CHUNK_COMPETITION', parent: 'mubiao', isRoot: false, notes: 'Evento de competição.' },
    { id: 'yundongyuan_comp', hanzi: '运动员', pinyin: 'yùn dòng yuán', translation: 'Atleta de Elite', chunkId: 'CHUNK_COMPETITION', parent: 'mubiao', isRoot: false, notes: 'Participante da competição.' },
    { id: 'shiju_comp', hanzi: '试举', pinyin: 'shì jǔ', translation: 'Pedida / Tentativa', chunkId: 'CHUNK_COMPETITION', parent: 'chenggong', isRoot: false, notes: 'Tentativa bem-sucedida.' }
  ],
  sentences: {
    liliangju: [
      { hanzi: '力量举比赛非常刺激。', pinyin: 'Lìliàngjǔ bǐsài fēicháng cìjī.', trans: 'A competição de powerlifting é muito empolgante.', grammar: '力量举 + 比赛' },
      { hanzi: '他是一名专业的力量举运动员。', pinyin: 'Tā shì yī míng zhuānyè de lìliàngjǔ yùndòngyuán.', trans: 'Ele é um atleta profissional de powerlifting.', grammar: '力量举 como adjetivo.' }
    ],
    shendun: [
      { hanzi: '今天我们要练深蹲。', pinyin: 'Jīntiān wǒmen yào liàn shēn dūn.', trans: 'Hoje nós vamos treinar agachamento.', grammar: '练 + 深蹲' },
      { hanzi: '他的深蹲动作非常标准。', pinyin: 'Tā de shēndūn dòngzuò fēicháng biāozhǔn.', trans: 'A execução do agachamento dele é extremamente correta.', grammar: '深蹲 + 动作' }
    ],
    yundong: [
      { hanzi: '坚持运动对健康很重要。', pinyin: 'Jiānchí yùndòng duì jiànkāng hěn zhòngyào.', trans: 'Persistir nos exercícios é muito importante para a saúde.', grammar: '坚持 + 运动' },
      { hanzi: '力量举是一项有挑战性的运动。', pinyin: 'Lìliàngjǔ shì yī xiàng yǒu tiǎozhànxìng de yùndòng.', trans: 'O powerlifting é um esporte desafiador.', grammar: '运动 como substantivo.' }
    ],
    jianchi: [
      { hanzi: '在健身房训练需要坚持。', pinyin: 'Zài jiànshēnfáng xùnliàn xūyào jiānchí.', trans: 'Treinar na academia exige persistência.', grammar: 'Ancorado em 健身房.' }
    ]
  }
};

// ---------- STATE ----------
let db = null;
let selectedChunkId = 'GLOBAL';
let selectedNodeId = null;
let activeTab = 'graph';
let hidePinyin = false;
let hideTrans = true; // translation only when open (as requested)

// D3
let svg, gContainer, simulation, zoomHandler;
let nodesData = [], linksData = [];
let graphInitialized = false;

// ---------- STORAGE ----------
function loadDB() {
  try {
    const raw = localStorage.getItem('sinograph_db_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.chunks && parsed.nodes) return parsed;
    }
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATABASE));
}

function saveDB() {
  localStorage.setItem('sinograph_db_v2', JSON.stringify(db));
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

// ---------- SWEETALERT HELPERS ----------
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

// ---------- CROSS-CHUNK HELPERS ----------
function getCrossChunkHanziSet() {
  const count = {};
  db.nodes.forEach(n => {
    count[n.hanzi] = (count[n.hanzi] || 0) + 1;
  });
  const set = new Set();
  Object.keys(count).forEach(h => { if (count[h] > 1) set.add(h); });
  return set;
}

// ---------- GRAPH DATA PREP ----------
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
      color: isCross ? '#22c55e' : (n.isRoot ? chunk.color : chunk.color),
      radius: n.isRoot ? 28 : (isCross ? 22 : 18)
    };
    nodeMap[n.id] = obj;
    return obj;
  });

  linksData = [];
  // Parent-child links
  filteredNodes.forEach(n => {
    if (n.parent && nodeMap[n.parent]) {
      linksData.push({ source: n.parent, target: n.id, type: 'parent' });
    }
  });

  // Cross-chunk links (only in GLOBAL view)
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

// ---------- D3 INIT & RENDER ----------
function initGraph() {
  const container = document.getElementById('graphContainer');
  if (!container) return;

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 400;

  d3.select('#d3GraphSvg').selectAll('*').remove();

  svg = d3.select('#d3GraphSvg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', '100%')
    .attr('height', '100%');

  gContainer = svg.append('g');

  zoomHandler = d3.zoom()
    .scaleExtent([0.15, 4])
    .on('zoom', (event) => {
      gContainer.attr('transform', event.transform);
    });

  svg.call(zoomHandler);

  simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(d => d.type === 'cross-chunk' ? 130 : 75))
    .force('charge', d3.forceManyBody().strength(-320))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => d.radius + 18));

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
    .attr('stroke-width', d => d.isRoot ? 3.5 : (d.isCross ? 2.5 : 2))
    .attr('class', d => `node-circle${d.isCross ? ' is-cross' : ''}`)
    .attr('id', d => `circle-${d.id}`);

  node.append('text')
    .attr('class', 'node-label-hanzi')
    .attr('text-anchor', 'middle')
    .attr('dy', d => hidePinyin ? '0.35em' : '-0.15em')
    .attr('font-size', d => d.radius > 24 ? '14px' : '12px')
    .text(d => d.hanzi);

  node.append('text')
    .attr('class', 'node-label-pinyin')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.15em')
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
  svg.transition().duration(280).call(zoomHandler.scaleBy, factor);
}

function resetGraphZoom() {
  if (!svg || !zoomHandler) return;
  svg.transition().duration(450).call(zoomHandler.transform, d3.zoomIdentity);
}

// ---------- SELECT NODE / SIDEBAR ----------
function selectNode(id) {
  selectedNodeId = id;
  const node = db.nodes.find(n => n.id === id);
  if (!node) return;
  highlightSelectedNodeInGraph(id);
  renderSidebarDetails(node);
}

function highlightSelectedNodeInGraph(id) {
  d3.selectAll('.node-circle')
    .attr('stroke-width', d => d.isRoot ? 3.5 : (d.isCross ? 2.5 : 2))
    .attr('stroke', d => d.color);

  d3.selectAll('.link-line').classed('highlighted', false);

  d3.select(`#circle-${id}`)
    .attr('stroke', '#f59e0b')
    .attr('stroke-width', 5);

  d3.selectAll('.link-line')
    .filter(d => (d.source.id || d.source) === id || (d.target.id || d.target) === id)
    .classed('highlighted', true);
}

function renderSidebarDetails(node) {
  const sidebarBody = document.getElementById('sidebarBody');
  const sidebarChunkTag = document.getElementById('sidebarChunkTag');
  const chunkObj = db.chunks.find(c => c.id === node.chunkId) || { name: 'Geral', color: '#f59e0b' };

  sidebarChunkTag.textContent = chunkObj.name;
  sidebarChunkTag.style.borderColor = chunkObj.color;
  sidebarChunkTag.style.color = chunkObj.color;

  const crossMatches = db.nodes.filter(n => n.hanzi === node.hanzi && n.id !== node.id);
  const sentences = db.sentences[node.id] || [
    {
      hanzi: `在训练中，${node.hanzi}非常重要。`,
      pinyin: `Zài xùnliàn zhōng, ${node.pinyin} fēicháng zhòngyào.`,
      trans: `No treino, "${node.translation.split('/')[0].trim()}" é muito importante.`,
      grammar: 'Frase de contexto gerada automaticamente.'
    }
  ];

  const otherNodesOpts = db.nodes
    .filter(n => n.id !== node.id)
    .map(n => `<option value="${n.id}">${n.hanzi} (${n.translation.split('/')[0].trim()})</option>`)
    .join('');

  sidebarBody.innerHTML = `
    <div class="word-card">
      <button class="btn-speak" onclick="speakChinese('${node.hanzi}')" title="Ouvir">🔊</button>
      <div class="word-hanzi">${node.hanzi}</div>
      <div class="word-pinyin ${hidePinyin ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${node.pinyin}</div>
      <div class="word-trans ${hideTrans ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${node.translation}</div>
    </div>

    ${crossMatches.length > 0 ? `
      <div class="cross-box">
        <div class="title">🔗 Conexão Inter-Chunk</div>
        <p class="text-xs text-muted" style="margin-bottom:8px">Este ideograma também aparece em:</p>
        <div class="flex gap-1" style="flex-wrap:wrap">
          ${crossMatches.map(m => {
            const tc = db.chunks.find(c => c.id === m.chunkId);
            return `<button class="chip" style="border-color:${tc ? tc.color : '#22c55e'};color:${tc ? tc.color : '#22c55e'}" onclick="jumpToCrossNode('${m.id}')">${tc ? tc.name.split(' - ')[0] : 'Outro'}</button>`;
          }).join('')}
        </div>
      </div>
    ` : ''}

    <div>
      <div class="card-title">Notas & Nuances</div>
      <div class="note note-accent">${node.notes || 'Sem notas específicas.'}</div>
    </div>

    <div>
      <div class="card-title">Frases de Exemplo (${sentences.length})</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${sentences.map(s => `
          <div class="sentence-item">
            <button class="btn-speak" style="top:8px;right:8px;width:30px;height:30px;font-size:0.85rem" onclick="speakChinese('${s.hanzi}')">🔊</button>
            <div class="sentence-hanzi">${highlightKeyword(s.hanzi, node.hanzi)}</div>
            <div class="sentence-pinyin ${hidePinyin ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${s.pinyin}</div>
            <div class="sentence-trans ${hideTrans ? 'blur-recall' : ''}" onclick="this.classList.remove('blur-recall')">${s.trans}</div>
            ${s.grammar ? `<div class="text-xs text-muted" style="margin-top:6px;font-style:italic">${s.grammar}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <div>
      <div class="card-title">Gerar Frase Combinada</div>
      <p class="text-xs text-muted" style="margin-bottom:8px">Combine <strong style="color:var(--text)">${node.hanzi}</strong> com outra palavra:</p>
      <div class="flex gap-2">
        <select id="secondWordSelect" class="select" style="flex:1;min-height:40px;padding:8px">${otherNodesOpts}</select>
        <button class="btn btn-primary btn-sm" onclick="generateCombinedSentence('${node.id}')">Gerar</button>
      </div>
      <div id="combinedSentenceOutput" class="combined-out hidden"></div>
    </div>
  `;
}

function highlightKeyword(sentence, keyword) {
  if (!keyword) return sentence;
  return sentence.replace(new RegExp(keyword, 'g'), `<span class="kw-highlight">${keyword}</span>`);
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
  const secondId = document.getElementById('secondWordSelect').value;
  const w1 = db.nodes.find(n => n.id === firstNodeId);
  const w2 = db.nodes.find(n => n.id === secondId);
  const output = document.getElementById('combinedSentenceOutput');
  if (!w1 || !w2) return;

  const combinedHanzi = `在${w1.hanzi}过程中，合理使用${w2.hanzi}非常关键。`;
  const combinedPinyin = `Zài ${w1.pinyin} guòchéng zhōng, hélǐ shǐyòng ${w2.pinyin} fēicháng guānjiàn.`;
  const combinedTrans = `No processo de ${w1.translation.split('/')[0].trim()}, usar corretamente ${w2.translation.split('/')[0].trim()} é fundamental.`;

  output.classList.remove('hidden');
  output.innerHTML = `
    <div class="flex items-center" style="justify-content:space-between;margin-bottom:6px">
      <span class="font-bold" style="color:var(--accent);font-size:0.8rem">Frase Combinada</span>
      <button class="btn-speak" style="position:static;width:28px;height:28px" onclick="speakChinese('${combinedHanzi}')">🔊</button>
    </div>
    <div class="sentence-hanzi">${combinedHanzi}</div>
    <div class="sentence-pinyin ${hidePinyin ? 'blur-recall' : ''}">${combinedPinyin}</div>
    <div class="sentence-trans ${hideTrans ? 'blur-recall' : ''}">${combinedTrans}</div>
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
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--muted)">Nenhum vocábulo encontrado.</td></tr>`;
    return;
  }

  filtered.forEach(node => {
    const chunkObj = db.chunks.find(c => c.id === node.chunkId) || { name: 'Geral', color: '#f59e0b' };
    const isCross = crossSet.has(node.hanzi);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="hanzi-cell">${node.hanzi}</td>
      <td class="${hidePinyin ? 'blur-recall' : ''}" style="color:var(--accent)">${node.pinyin}</td>
      <td class="${hideTrans ? 'blur-recall' : ''}">${node.translation}</td>
      <td><span class="badge-muted badge" style="color:${chunkObj.color};background:var(--bg);border:1px solid var(--border)">${chunkObj.name.split(' - ')[0]}</span></td>
      <td>
        ${isCross ? '<span class="badge" style="background:rgba(34,197,94,0.2);color:#22c55e">Inter</span>' : '<span class="text-muted text-xs">—</span>'}
      </td>
      <td style="text-align:right;white-space:nowrap">
        <button class="btn-icon btn-sm" style="width:34px;height:34px" onclick="speakChinese('${node.hanzi}')" title="Ouvir">🔊</button>
        <button class="btn-icon btn-sm" style="width:34px;height:34px" onclick="goToNodeInGraph('${node.id}')" title="Ver no grafo">◎</button>
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

  const opts = db.chunks.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (chunkSelect) {
    chunkSelect.innerHTML = `<option value="GLOBAL">🌐 Todos os Chunks</option>${opts}`;
    chunkSelect.value = selectedChunkId;
  }
  if (tableFilter) {
    tableFilter.innerHTML = `<option value="ALL">Todos os Chunks</option>${opts}`;
  }
  if (newNodeChunk) {
    newNodeChunk.innerHTML = opts;
  }
}

function updateDataViews() {
  if (activeTab === 'graph') renderD3Graph();
  renderTable();
  if (selectedNodeId) {
    const stillExists = db.nodes.find(n => n.id === selectedNodeId);
    if (stillExists) selectNode(selectedNodeId);
    else {
      selectedNodeId = null;
      document.getElementById('sidebarBody').innerHTML = `
        <div class="empty-state">
          <div class="icon">👆</div>
          <p>Clique em qualquer palavra no mapa para explorar.</p>
        </div>`;
    }
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
  if (tab === 'graph' && !graphInitialized) {
    setTimeout(initGraph, 50);
  } else if (tab === 'graph') {
    // force resize
    setTimeout(() => {
      const container = document.getElementById('graphContainer');
      if (container && svg) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        svg.attr('viewBox', [0, 0, w, h]);
        simulation.force('center', d3.forceCenter(w / 2, h / 2));
        simulation.alpha(0.3).restart();
      }
    }, 50);
  }
}

// ---------- RECALL TOGGLES ----------
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
  selectedNodeId = null;
  document.getElementById('sidebarBody').innerHTML = `
    <div class="empty-state">
      <div class="icon">👆</div>
      <p>Clique em qualquer palavra no mapa para explorar.</p>
    </div>`;
  document.getElementById('sidebarChunkTag').textContent = 'Nenhum nó';
  renderD3Graph();
}

// ---------- MODALS (NEW CHUNK / NODE) ----------
function openNewChunkModal() {
  document.getElementById('newChunkName').value = '';
  document.getElementById('newChunkColor').value = '#f59e0b';
  document.getElementById('newChunkModal').classList.remove('hidden');
}

function openNewNodeModal() {
  const parentSelect = document.getElementById('newNodeParentSelect');
  parentSelect.innerHTML = '<option value="">Sem pai (raiz)</option>';
  db.nodes.forEach(n => {
    parentSelect.innerHTML += `<option value="${n.id}">${n.hanzi} — ${n.translation.split('/')[0].trim()}</option>`;
  });
  document.getElementById('newNodeChunkSelect').value =
    selectedChunkId === 'GLOBAL' ? db.chunks[0].id : selectedChunkId;
  document.getElementById('newNodeHanzi').value = '';
  document.getElementById('newNodePinyin').value = '';
  document.getElementById('newNodeTranslation').value = '';
  document.getElementById('newNodeNotes').value = '';
  document.getElementById('newNodeModal').classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

async function submitNewChunk() {
  const name = document.getElementById('newChunkName').value.trim();
  const color = document.getElementById('newChunkColor').value;
  if (!name) {
    await swalError('Nome obrigatório', 'Digite o título do tema/chunk.');
    return;
  }
  const id = 'CHUNK_' + Date.now();
  db.chunks.push({ id, name, color });
  saveDB();
  populateChunkSelectors();
  closeModal('newChunkModal');
  showToast('Novo tema criado');
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

  const id = 'node_' + Date.now();
  db.nodes.push({
    id, hanzi, pinyin, translation, chunkId, parent,
    isRoot: !parent,
    notes
  });
  saveDB();
  closeModal('newNodeModal');
  updateDataViews();
  selectNode(id);
  showToast('Vocábulo adicionado');
}

// ---------- DATA MENU ----------
function toggleDataMenu() {
  document.getElementById('dataMenu').classList.toggle('hidden');
}

function exportDataJSON() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `sinograph_backup_${new Date().toISOString().slice(0, 10)}.json`;
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
      const ok = await swalConfirm('Importar dados?', 'Isso substituirá os dados atuais.', 'Importar');
      if (!ok) return;
      db = imported;
      saveDB();
      populateChunkSelectors();
      selectedNodeId = null;
      updateDataViews();
      await swalSuccess('Dados importados!');
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
    'Resetar para o padrão?',
    'Todos os chunks e vocábulos personalizados serão apagados.',
    'Resetar',
    true
  );
  if (!ok) return;
  db = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
  saveDB();
  selectedChunkId = 'GLOBAL';
  selectedNodeId = null;
  populateChunkSelectors();
  updateDataViews();
  await swalSuccess('Dados restaurados');
}

// ---------- SPEECH ----------
function speakChinese(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Síntese de voz não suportada', 'error');
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
      simulation.alpha(0.4).restart();
    }
  }, 150);
}

// ---------- INIT ----------
function init() {
  db = loadDB();
  populateChunkSelectors();

  // Default: hide translation (user request: translation only when open)
  document.getElementById('toggleTransBtn').classList.add('active');

  switchMainTab('graph');
  setTimeout(() => {
    initGraph();
    // Select root of first chunk by default
    const root = db.nodes.find(n => n.isRoot && n.chunkId === 'CHUNK_POWERLIFTING');
    if (root) selectNode(root.id);
  }, 80);

  window.addEventListener('resize', onResize);

  // Close data menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('dataMenu');
    const btn = document.getElementById('dataMenuBtn');
    if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.add('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
