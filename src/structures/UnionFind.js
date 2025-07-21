export default class UnionFind {
  constructor(size) {
    this.parent = new Int32Array(size);
    this.rank   = new Int8Array(size);
    for (let i = 0; i < size; i++) this.parent[i] = i;
  }

  //metodo de busqueda de un elemento
  //retorna el padre del elemento x, y aplica compresion de caminos
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];  // compresion 
      x = this.parent[x];
    }
    return x;
  }

    // metodo de union de dos elementos
    // une los conjuntos de a y b, aplicando union por rango
  union(a, b) {
    let x = this.find(a);
    let y = this.find(b);
    if (x === y) return;
    if (this.rank[x] < this.rank[y]) [x, y] = [y, x];
    this.parent[y] = x;
    if (this.rank[x] === this.rank[y]) this.rank[x]++;
  }
}
