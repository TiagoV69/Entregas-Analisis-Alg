const API_URL = 'http://127.0.0.1:5000';
const state = { users: [], friendships: [], positions: new Map(), path: [], visited: [], suggestions: [] };
const canvas = document.querySelector('#graph-canvas');
const context = canvas.getContext('2d');

const byId = (id) => document.getElementById(id);
const userById = (id) => state.users.find((user) => user.id === Number(id));

function setStatus(kind, text) {
  const status = document.querySelector('.api-status');
  status.className = `api-status ${kind}`;
  byId('status-text').textContent = text;
}

function fillSelect(selectId) {
  const select = byId(selectId);
  select.innerHTML = state.users.map((user) => `<option value="${user.id}">${user.avatar}  ${user.nombre}</option>`).join('');
}

function renderPeople() {
  byId('people-list').innerHTML = state.users.map((user) => `<div class="person"><span class="avatar">${user.avatar}</span><div><strong>${user.nombre}</strong><small>ID ${user.id}</small></div></div>`).join('');
  byId('people-count').textContent = `${state.users.length} perfiles`;
  byId('users-count').textContent = state.users.length;
  byId('edges-count').textContent = state.friendships.length;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  canvas.width = bounds.width * ratio;
  canvas.height = bounds.height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawGraph();
}

function calculatePositions() {
  const bounds = canvas.getBoundingClientRect();
  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;
  const radius = Math.min(bounds.width, bounds.height) * .37;
  state.positions = new Map(state.users.map((user, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / state.users.length;
    return [user.id, { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius }];
  }));
}

function drawGraph() {
  if (!state.users.length) return;
  calculatePositions();
  const bounds = canvas.getBoundingClientRect();
  context.clearRect(0, 0, bounds.width, bounds.height);
  const pathEdges = new Set(state.path.slice(1).map((id, index) => [state.path[index], id].sort((first, second) => first - second).join('-')));
  state.friendships.forEach((friendship) => {
    const start = state.positions.get(friendship.origen);
    const end = state.positions.get(friendship.destino);
    const key = [friendship.origen, friendship.destino].sort((first, second) => first - second).join('-');
    context.beginPath(); context.moveTo(start.x, start.y); context.lineTo(end.x, end.y);
    context.strokeStyle = pathEdges.has(key) ? '#e46e50' : '#bcc8c4'; context.lineWidth = pathEdges.has(key) ? 3 : 1.2; context.stroke();
  });
  state.users.forEach((user) => {
    const point = state.positions.get(user.id); const isPath = state.path.includes(user.id); const isVisited = state.visited.includes(user.id); const isSuggestion = state.suggestions.includes(user.id);
    context.beginPath(); context.arc(point.x, point.y, isPath || isSuggestion ? 20 : 16, 0, Math.PI * 2);
    let nodeColor = '#fffefa';
    if (isVisited) nodeColor = '#9bcfc6';
    if (isSuggestion) nodeColor = '#f0bf45';
    if (isPath) nodeColor = '#e46e50';
    context.fillStyle = nodeColor; context.fill(); context.strokeStyle = isPath ? '#e46e50' : '#157b72'; context.lineWidth = 2; context.stroke();
    context.fillStyle = isPath ? '#fffefa' : '#182229'; context.font = '700 10px Manrope'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(user.id, point.x, point.y);
    context.font = '500 10px Manrope'; context.fillStyle = '#526169'; context.fillText(user.nombre, point.x, point.y + 30);
  });
}

function showResult(title, detail, type = 'success') {
  const panel = byId('result'); panel.style.borderLeftColor = type === 'error' ? 'var(--coral)' : 'var(--yellow)';
  panel.querySelector('.result-mark').textContent = type === 'error' ? '!' : '>'; panel.querySelector('strong').textContent = title; panel.querySelector('p').textContent = detail;
}

async function loadNetwork() {
  try {
    const response = await fetch(`${API_URL}/usuarios`); if (!response.ok) throw new Error('API unavailable');
    const data = await response.json(); state.users = data.usuarios; state.friendships = data.amistades;
    ['origin-select', 'destination-select', 'suggestion-select'].forEach(fillSelect); renderPeople(); byId('graph-empty').style.display = 'none'; setStatus('online', 'API conectada'); resizeCanvas();
  } catch (error) { console.error(error); setStatus('error', 'API no disponible'); showResult('No se pudo cargar la red', 'Levanta el backend con python app.py y recarga esta pagina.', 'error'); }
}

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active')); tab.classList.add('active');
  byId('distance-form').classList.toggle('hidden', tab.dataset.tab !== 'distance'); byId('suggestions-form').classList.toggle('hidden', tab.dataset.tab !== 'suggestions');
}));

byId('distance-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const origin = Number(byId('origin-select').value); const destination = Number(byId('destination-select').value);
  try { const response = await fetch(`${API_URL}/bfs/distancia?origen=${origin}&destino=${destination}`); const data = await response.json(); state.path = data.camino; state.visited = data.pasos; state.suggestions = []; drawGraph(); const names = data.camino.map((id) => userById(id)?.nombre).join(' -> '); const degreeSuffix = data.distancia === 1 ? '' : 's'; const distanceTitle = data.distancia < 0 ? 'No hay conexion' : `${data.distancia} grado${degreeSuffix} de separacion`; const distanceDetail = data.distancia < 0 ? 'BFS recorrio la red, pero no encontro un camino entre estos usuarios.' : `Camino minimo: ${names}. Se visitaron ${data.pasos.length} nodos.`; showResult(distanceTitle, distanceDetail); } catch (error) { console.error(error); showResult('Error de consulta', 'Verifica que el backend este ejecutandose.', 'error'); }
});

byId('suggestions-form').addEventListener('submit', async (event) => {
  event.preventDefault(); const selected = Number(byId('suggestion-select').value);
  try { const response = await fetch(`${API_URL}/bfs/sugerencias?usuario=${selected}`); const data = await response.json(); state.path = []; state.visited = data.directos; state.suggestions = data.sugeridos; drawGraph(); const names = data.sugeridos.map((id) => userById(id)?.nombre).join(', '); const suggestionSuffix = data.sugeridos.length === 1 ? '' : 's'; const suggestionTitle = `${data.sugeridos.length} sugerencia${suggestionSuffix}`; showResult(suggestionTitle, names || 'No hay amigos de amigos disponibles para este usuario.'); } catch (error) { console.error(error); showResult('Error de consulta', 'Verifica que el backend este ejecutandose.', 'error'); }
});

byId('reset-graph').addEventListener('click', () => { state.path = []; state.visited = []; state.suggestions = []; drawGraph(); showResult('Listo para explorar', 'Elige una consulta para ver como BFS recorre la red.'); });
window.addEventListener('resize', resizeCanvas);
await loadNetwork();