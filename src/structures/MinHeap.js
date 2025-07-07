class MinHeap {

    // Implementacion de un MinHeap con un tamaño máximo k.
    // Permite mantener los elementos con mayor cantidad de
    // hits en la parte superior, así se obtienen los
    // top-k elementos con más hits.

  constructor(k) {
    this.k = k;
    this.arr = [];
  }


  size() { return this.arr.length; } // Devuelve el tamaño del heap

  // Insertar un elemento en el heap.
  // Si el heap supera el tamaño k, elimina el elemento más pequeño
  // y mantiene el heap con los k elementos más grandes.

  push(item) {
    this.arr.push(item);
    this.siftUp(this.arr.length - 1);
    if (this.arr.length > this.k) this.pop();
  }

  // Eliminar el elemento más pequeño del heap.

  pop() {
    if (this.arr.length === 0) return undefined;
    const top = this.arr[0];
    const last = this.arr.pop();
    if (this.arr.length) {
      this.arr[0] = last;
      this.siftDown(0); // Reajusta el heap después de eliminar el elemento
    }
    return top;
  }

  // Retorna los elementos más grandes del heap

  toSortedDesc() {
    const res = [];
    while (this.arr.length) res.push(this.pop());
    return res.reverse(); // invierte el orden del MinHeap
  }

  // Reajusta el heap hacia arriba desde el índice idx
  // para mantener la propiedad del MinHeap.

  siftUp(idx) {
    while (idx > 0) {
      const parent = (idx - 1) >> 1;

      // Si el elemento en idx es mayor o igual que su padre, no es necesario reajustar
      if (this.arr[idx][0] >= this.arr[parent][0]) break;

      // Intercambia el elemento en idx con su padre
      [this.arr[idx], this.arr[parent]] = [this.arr[parent], this.arr[idx]];
      idx = parent;
    }
  }

  // Reajusta el heap hacia abajo desde el índice idx
  // para mantener la propiedad del MinHeap.

  siftDown(idx) {
    const n = this.arr.length;
    while (true) {
      const l = idx*2 + 1, r = l+1; // hijos izquierdo y derecho
      let smallest = idx; // Inicializa el índice del más pequeño como el actual

      // Compara el elemento en idx con sus hijos
      if (l < n && this.arr[l][0] < this.arr[smallest][0]) smallest = l;
      if (r < n && this.arr[r][0] < this.arr[smallest][0]) smallest = r;
      if (smallest === idx) break;

      // Intercambia el elemento en idx con el más pequeño de sus hijos
      [this.arr[idx], this.arr[smallest]] = [this.arr[smallest], this.arr[idx]];
      idx = smallest;
    }
  }
}