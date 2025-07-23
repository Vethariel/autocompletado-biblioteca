/*
  indexer.js — Web Worker
  Construye un índice de autocompletado para el dataset de Goodreads
  Estructuras usadas:
    • Trie (árbol de prefijos) con posting‑lists por clusterId
    • Union–Find para agrupar ediciones (clusterId)
    • HashMap (Map JS) id → metadatos (solo en el worker)
    • Min‑Heap (top‑k) para ranking de resultados
    • Set (Set JS) para intersecciones de clusters
    • stack (Array JS) para DFS en Trie
*/

////////////////////////////////////////////////////////////////////////////////
// 0. Utilidades de normalización y CSV ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// RegEx pre‑compiladas
const RE_DIACRITICS = /[\u0300-\u036f]/g;      // marcas de acento
const RE_NON_ALNUM = /[^a-z0-9\s]/g;          // quitar puntuación
const RE_SPACES = /\s+/g;                  // colapsar espacios

/**
 * Convierte un string a clave de buscador: lower, sin tildes, sin signos.
 */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(RE_DIACRITICS, '')
    .replace(RE_NON_ALNUM, ' ')
    .replace(RE_SPACES, ' ')
    .trim();
}

/**
 * Parsing CSV muy simplificado: SOLO vale para lineas sin saltos dentro de comillas y con
 * título entre comillas dobles. Para producción usa PapaParse.
 * Columns esperadas: book_id,title,authors,...  (Kaggle Goodreads)
 */
function parseCSVLine(line) {
  const parts = [];
  let inQuotes = false, current = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {        // toggle quote mode (doble doble = escapado)
      if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

////////////////////////////////////////////////////////////////////////////////
// 1. Estructuras de datos //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

import { UnionFind, MinHeap, Trie } from './src/structures/index.js';


////////////////////////////////////////////////////////////////////////////////
// 2. Variables globales del trabajador ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const trie = new Trie();
const MAX_LINES = 1_500_000;             // to pre‑size UF (aprox Goodreads)
const uf = new UnionFind(MAX_LINES);
const id2meta = new Map();               // bookId -> {titleOriginal, authors}
const titleKey2id = new Map();           // clave duplicados -> bookId
let currentLineId = 0;                   // para unionfind cuando book_id no es consecutivo

////////////////////////////////////////////////////////////////////////////////
// 3. Inserción en Trie /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// 4. Índice de búsqueda ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function aggregatedHitsFor(clusterId) {
  // Simple: contamos hits del primer nodo donde aparezca (podría mejorarse)
  // Aquí guardamos un map auxiliar clusterId->hits acumulados
  return clusterHits.get(clusterId) || 0;
}

const clusterHits = new Map();           // cache hits acumulados

function incrementHits(clusterId, delta = 1) {
  clusterHits.set(clusterId, (clusterHits.get(clusterId) || 0) + delta);
}

////////////////////////////////////////////////////////////////////////////////
// 5. Procesamiento de consulta ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function handleQuery(q, k = 10) {
  const parts = normalize(q).split(' ');
  if (parts.length === 0) return [];
  const prefix = parts.pop();
  const sets = [];

  // tokens completos exactos
  for (const tok of parts) {
    if (!tok) continue;
    const node = trie.search(tok);
    if (!node) return [];
    sets.push(new Set(node.posting.keys()));
  }

  // prefijo
  if (prefix) sets.push(trie.autocomplete(prefix));
  if (sets.length === 0) return [];

  // intersección progresiva (empieza por set más pequeño)
  sets.sort((a, b) => a.size - b.size);
  let intersect = sets[0];
  for (let i = 1; i < sets.length && intersect.size; i++) {
    const next = new Set();
    for (const cid of intersect) if (sets[i].has(cid)) next.add(cid);
    intersect = next;
  }
  if (!intersect.size) return [];

  // ranking con heap (min‑heap guardando los top‑k mayores hits)
  const heap = new MinHeap(k);
  for (const cid of intersect) {
    const hits = clusterHits.get(cid) || 0;
    heap.push([-hits, cid]);   // negativo: heap min sobre hits inverso → top hits
  }
  const ranked = heap.toSortedDesc().map(([negHits, cid]) => ({ clusterId: cid, hits: -negHits }));

  ranked.reverse();


  // map to titles
  return ranked.map(obj => {
    const anyEdition = lookupAnyEdition(obj.clusterId);
    const meta = id2meta.get(anyEdition);

    return { title: meta?.titleOriginal || '(desconocido)', authors: meta?.authors, hits: obj.hits, clusterId: obj.clusterId };
  });
}

function lookupAnyEdition(clusterId) {
  // Recorrer posting de cualquier nodo para encontrar un bookId de este cluster
  // Ineficiente pero simple; optimiza guardando mapa clusterId -> repBookId
  if (clusterRep.has(clusterId)) return clusterRep.get(clusterId);
  // búsqueda lenta sólo la primera vez
  const stack = [trie.root];
  while (stack.length) {
    const n = stack.pop();
    if (n.endWord && n.posting.has(clusterId)) {
      const rec = n.posting.get(clusterId);
      const rep = rec.editions[0];
      clusterRep.set(clusterId, rep);
      return rep;
    }
    for (const child of n.children.values()) stack.push(child);
  }
  return null;
}
const clusterRep = new Map();

////////////////////////////////////////////////////////////////////////////////
// 6. Carga del CSV en chunks ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

self.onmessage = async (e) => {
  const { cmd } = e.data;
  if (cmd === 'index') {
    const file = e.data.file;   // File object transferido desde el main
    await indexFile(file);
  }
  else if (cmd === 'query') {
    const { q, k } = e.data;
    const res = handleQuery(q, k);
    self.postMessage({ cmd: 'results', results: res });
  }
  else if (cmd === 'clicked') {
    const { clusterId } = e.data;
    incrementHits(clusterId);
  }
};

async function indexFile(file) {

  const CHUNK_SIZE = 1 << 20; // 1 MiB
  const reader = file.stream().getReader();
  let utf8decoder = new TextDecoder();
  let leftover = '';
  let bytesRead = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    bytesRead += value.byteLength;
    let text = leftover + utf8decoder.decode(value, { stream: true });
    const lines = text.split(/\r?\n/);
    leftover = lines.pop();                      // posiblemente linea incompleta

    processLines(lines);

    const percent = Math.round((bytesRead / file.size) * 100);
    self.postMessage({ cmd: 'progress', percent });
  }

  if (leftover) processLines([leftover]);
  self.postMessage({ cmd: 'ready' });
}

function processLines(lines) {

  for (const line of lines) {
    if (!line) continue;

    const cols = parseCSVLine(line);
    const bookId = Number(cols[0]);
    const rawTitle = cols[1] || '';
    const authors = cols[2] || '';
    const ratingsCount = Number(cols[8] || 0);

    if (!bookId || !rawTitle) continue;

    const normTitle = normalize(rawTitle);
    const key = authors.toLowerCase() + '|' + normTitle;

    /* ------------ manejar duplicados ------------- */
    if (titleKey2id.has(key)) {
      const prevId = titleKey2id.get(key);      // edición previa
      const rootPrev = uf.find(prevId);
      const hitsPrev = clusterHits.get(rootPrev) || 0;

      uf.union(bookId, prevId);                    // puede cambiar la raíz
      const rootNow = uf.find(prevId);

      // Escoge el mayor entre: hits previos, ratingsCount nuevo, hits que ya tuviera la raíz
      const hitsNow = Math.max(hitsPrev, ratingsCount, clusterHits.get(rootNow) || 0);
      clusterHits.set(rootNow, hitsNow);

      if (rootNow !== rootPrev) clusterHits.delete(rootPrev); // limpia ID viejo
    } else {
      titleKey2id.set(key, bookId);
      const clusterId = uf.find(bookId);
      clusterHits.set(clusterId, ratingsCount);    // **inicializa** con ratings_count
    }

    const clusterId = uf.find(bookId);
    const tokens = Array.from(new Set(normTitle.split(' '))).filter(Boolean);
    for (const tok of tokens) trie.insert(tok, clusterId, bookId);

    id2meta.set(bookId, { titleOriginal: rawTitle, authors });
  }
}