class MinHeap {

    // Implementacion de un MinHeap con un tamaño máximo k.
    // Permite mantener los elements con mayor cantidad de
    // hits en la parte superior, así se obtienen los
    // top-k elements con más hits.

  constructor(k) {
    this.k = k;
    this.elements = [];
  }


  size() { return this.elements.length; } // Devuelve el tamaño del heap

  // Insertar un elemento en el heap.
  // Si el heap supera el tamaño k, elimina el elemento más pequeño
  // y mantiene el heap con los k elements más grandes.

  push(item) {
    this.elements.push(item);
    this.siftUp(this.elements.length - 1);
    if (this.elements.length > this.k) this.pop();
  }

  // Eliminar el elemento más pequeño del heap.

  pop() {
    if (this.elements.length === 0) return undefined;
    const top = this.elements[0];
    const last = this.elements.pop();
    if (this.elements.length) {
      this.elements[0] = last;
      this.siftDown(0); // Reajusta el heap después de eliminar el elemento
    }
    return top;
  }

  // Retorna los elements más grandes del heap

  toSortedDesc() {
    const res = [];
    while (this.elements.length) res.push(this.pop());
    return res.reverse(); // invierte el orden del MinHeap
  }

  // Reajusta el heap hacia arriba desde el índice idx
  // para mantener la propiedad del MinHeap.

  siftUp(idx) {
    while (idx > 0) {
      const parent = (idx - 1) >> 1;

      // Si el elemento en idx es mayor o igual que su padre, no es necesario reajustar
      if (this.elements[idx][0] >= this.elements[parent][0]) break;

      // Intercambia el elemento en idx con su padre
      [this.elements[idx], this.elements[parent]] = [this.elements[parent], this.elements[idx]];
      idx = parent;
    }
  }

  // Reajusta el heap hacia abajo desde el índice idx
  // para mantener la propiedad del MinHeap.

  siftDown(idx) {
    const n = this.elements.length;
    while (true) {
      const l = idx*2 + 1, r = l+1; // hijos izquierdo y derecho
      let smallest = idx; // Inicializa el índice del más pequeño como el actual

      // Compara el elemento en idx con sus hijos
      if (l < n && this.elements[l][0] < this.elements[smallest][0]) smallest = l;
      if (r < n && this.elements[r][0] < this.elements[smallest][0]) smallest = r;
      if (smallest === idx) break;

      // Intercambia el elemento en idx con el más pequeño de sus hijos
      [this.elements[idx], this.elements[smallest]] = [this.elements[smallest], this.elements[idx]];
      idx = smallest;
    }
  }
}