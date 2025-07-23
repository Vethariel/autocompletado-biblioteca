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

const $file = document.getElementById('file');
const $progressBar = document.getElementById('bar');
const $search = document.getElementById('search');
const $results = document.getElementById('suggestions');

////////////////////////////////////////////////////////////////////////////////
// 1. Worker & canal de mensajes ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const worker = new Worker('indexer.js', { type: 'module' });

// Al seleccionar archivo, envía al worker
$file.addEventListener('change', () => {
  const file = $file.files[0];
  if (!file) return;
  // notifica a la interfaz (botón → barra progreso)
  window.postMessage({ type: 'progress', percent: 0 }, '*');
  worker.postMessage({ cmd: 'index', file });
});

// Mensajes que regresan del worker
worker.onmessage = (e) => {
  const { cmd } = e.data;
  if (cmd === 'progress') {
    const percent = e.data.percent;
    $progressBar.value = percent;
    window.postMessage({ type: 'progress', percent }, '*');
  }
  else if (cmd === 'ready') {
    // habilita buscador
    document.body.classList.add('ready');          // activa animaciones
    $search.disabled = false;
    $search.focus();
    loadBtnTop.textContent = 'REESTABLECER';
    loadBtnTop.style.display = 'block';
    loadBtnTop.classList.add('enabled');
    window.postMessage({ type: 'ready' }, '*');
  }
  else if (cmd === 'results') {
    renderResults(e.data.results);
    window.postMessage({ type: 'results', list: e.data.results }, '*');
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
      $results.style.display = 'none';
      $results.innerHTML = '';
      window.postMessage({ type: 'results', list: [] }, '*');
      return;
    }
    worker.postMessage({ cmd: 'query', q, k: 50 });
  }, 150);
});

////////////////////////////////////////////////////////////////////////////////
// 3. Renderizado de resultados ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function renderResults(arr) {
  const wrap = document.getElementById('suggestions');
  if (!arr.length) { wrap.classList.remove('show'); return; }
  wrap.innerHTML = arr.slice(0,10).map(({title,authors,hits,clusterId}) =>
    `<li data-cid="${clusterId}">${title} (${hits}) — ${authors ?? 'Autor desconocido'}</li>`
  ).join('');
  wrap.classList.add('show');
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
  // ocultar dropdown tras selección (opcional UX)
  $results.style.display = 'none';
});


// --------- hide dropdown cuando vacío / clic fuera ----------
$search.addEventListener('blur', () => {
  setTimeout(()=> document.getElementById('suggestions').classList.remove('show'), 150);
});

// --------- botón superior = restablecer ----------
loadBtnTop.addEventListener('click', () => {
  if (!document.body.classList.contains('ready')) { fileInput.click(); return; }
  document.body.classList.remove('ready');
  loadBtnTop.style.display = 'none';
  $search.value = '';
  document.getElementById('suggestions').innerHTML = '';
  document.getElementById('suggestions').classList.remove('show');
  location.reload();                              // refresco rápido con parpadeo
});