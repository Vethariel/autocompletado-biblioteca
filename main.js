/*
  main.js — hilo principal
  Mínima interfaz para probar indexer.js en el navegador sin frameworks.
  ▸ Pongamos en index.html:
      <input id="file"   type="file" accept=".csv,.json">
      <progress id="bar" value="0" max="100"></progress>
      <span id="status"></span>
      <input id="search" placeholder="Busca un título…" disabled>
      <ul id="suggestions"></ul>

  ▸ Luego incluye:
      <script type="module" src="main.js"></script>
*/

////////////////////////////////////////////////////////////////////////////////
// 0. Referencias DOM ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const $file        = document.getElementById('file');
const $progressBar = document.getElementById('bar');
const $status      = document.getElementById('status');
const $search      = document.getElementById('search');
const $results     = document.getElementById('suggestions');

////////////////////////////////////////////////////////////////////////////////
// 1. Worker & canal de mensajes ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const worker = new Worker('indexer.js');

$file.addEventListener('change', () => {
  const file = $file.files[0];
  if (!file) return;
  $status.textContent = `Indexando «${file.name}»…`;
  $progressBar.value = 0;
  worker.postMessage({ cmd: 'index', file });
});

worker.onmessage = (e) => {
  const { cmd } = e.data;
  if (cmd === 'progress') {
    $progressBar.value = e.data.percent;
    $status.textContent = `Indexando… ${e.data.percent}%`;
  }
  else if (cmd === 'ready') {
    $status.textContent = 'Índice listo ✅';
    $search.disabled = false;
    $search.focus();
  }
  else if (cmd === 'results') {
    renderResults(e.data.results);
  }
};

////////////////////////////////////////////////////////////////////////////////
// 2. Búsqueda en vivo (debounce 150 ms) ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let debounceTimer;
$search.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const q = $search.value.trim();
    if (!q) {
      $results.innerHTML = '';
      return;
    }
    worker.postMessage({ cmd: 'query', q, k: 10 });
  }, 150);
});

////////////////////////////////////////////////////////////////////////////////
// 3. Renderizado de resultados ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function renderResults(arr) {
  $results.innerHTML = '';
  for (const { title, authors, hits, clusterId } of arr) {
    const li = document.createElement('li');
    li.textContent = `${title} — ${authors ?? 'Autor desconocido'}  (${hits} búsq.)`;
    li.dataset.cid = clusterId;
    $results.appendChild(li);
  }
}

////////////////////////////////////////////////////////////////////////////////
// 4. Manejo de clic en sugerencia (↑ popularidad) //////////////////////////////
////////////////////////////////////////////////////////////////////////////////

$results.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const cid = Number(li.dataset.cid);
  if (cid) {
    worker.postMessage({ cmd: 'clicked', clusterId: cid });
    // feedback inmediato en UI
    li.style.fontWeight = 'bold';
  }
});
