class TrieNode {
  constructor() {
    this.hijos = {}; 
    this.esFinPalabra = false; 
    this.contador = 0;  // Frecuencia de la palabra
  }
}
class Trie {
  constructor() {
    this.raiz = new TrieNode();
  }
  // Toca poner como minimo las funciones de insertar, buscar y eliminar
  //tambien hay que implementar una que retorne la frecuencia de una palabra
  
}