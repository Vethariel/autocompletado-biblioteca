# Librarian 🕮

**Buscador Inteligente de Libros**\
Autocompletado y priorización por popularidad sobre un dataset de Goodreads.

---

## 🔍 Descripción

Librarian es una pequeña aplicación web que permite:

- **Indexar** los títulos de libros de un `.csv` (o `.json`) con estructuras de datos especializadas.
- **Autocompletar** mientras escribes, devolviendo sugerencias en milisegundos.
- **Priorizar** los resultados según la frecuencia de búsqueda (popularidad).

Ideal para bibliotecas digitales, catálogos en línea o cualquier proyecto que requiera un buscador rápido y eficiente.

---

## 🚀 Características principales

- **Carga incremental** de archivos grandes en chunks (Web Workers).
- **Estructuras de datos** implementadas desde cero:
  - **Trie**: búsqueda por prefijo + posting‑lists.
  - **Union–Find**: agrupa ediciones bajo un mismo clusterId.
  - **Min-Heap**: ranking top-k de clusters más buscados.
- **Interfaz minimalista** sin frameworks pesados, sólo HTML/CSS/JS nativo.
- **UX fluida**: barra de progreso, debounce de entrada (150 ms) y feedback visual.

---

## 📦 Instalación y puesta en marcha

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Vethariel/autocompletado-biblioteca.git
   cd autocompletado-biblioteca
   ```
2. **Levanta un servidor local** (para evitar restricciones de CORS en archivos locales):
   ```bash
   # Con Python 3
   python -m http.server 8000
   ```
3. Abre tu navegador en
   ```
   http://localhost:8000/
   ```
4. Haz clic en **CARGAR CSV**, selecciona tu fichero y ¡empieza a buscar!

---

## 🗂 Estructura del proyecto

```text
/
├─ index.html           # UI principal
├─ main.js              # Lógica de la interfaz y conexión con el Worker
├─ indexer.js           # Web Worker: parseo, indexación y búsqueda
├─ src/
│  └─ structures/
│     ├─ UnionFind.js   # Clase Union–Find
│     ├─ Trie.js        # Trie con métodos insert, search y autocomplete
│     ├─ MinHeap.js     # Min-Heap para ranking top-k
│     └─ index.js       # Barrel que reexporta las estructuras
└─ README.md            # (este archivo)
```

---

## 🧱 Detalle de las estructuras

| Clase         | Función                                                                |
| ------------- | ---------------------------------------------------------------------- |
| **Trie**      | Inserta tokens, busca palabras completas y autocompleta prefijos.      |
| **UnionFind** | Agrupa ediciones bajo un mismo `clusterId` para normalizar duplicados. |
| **MinHeap**   | Mantiene los `k` clusters con más “hits” para ranking eficiente.       |

---

## ⚙️ Configuración y parámetros

- **Debounce**: 150 ms (ajustable en `main.js`).
- **Tamaño de Union-Find**: por defecto `MAX_LINES = 1_500_000`, adapta según tu dataset.
- **Top-k resultados**: parámetro `k` en la función `handleQuery(q, k=10)`.

---

## 👥 Contribuciones

1. Haz un *fork* de este repositorio.
2. Crea una rama:
   ```bash
   git checkout -b feature/mi-mejora
   ```
3. Realiza tus cambios y haz *commit*:
   ```bash
   git commit -m "feat: descripción de mi mejora"
   ```
4. Empuja a tu *fork* y abre un *Pull Request*.

---

## Video demostrativo
[![Demo del proyecto](https://img.youtube.com/vi/ABC123XYZ/0.jpg)]([https://www.youtube.com/watch?v=ABC123XYZ](https://youtu.be/h3pUvQ3FZ-0))



## 🤝 Créditos

- **Daniel Loy**
- **Julián Benítez**
- **Daniel Gracia**

---

## 📜 Licencia

[MIT](LICENSE) © 2025 Librarian Contributors

---

¡Gracias por usar Librarian! Si te gusta el proyecto, dale ⭐ en GitHub y comparte tus sugerencias.

