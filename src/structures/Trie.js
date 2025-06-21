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
  //tambien hay que implementar una que retorne y modifique la frecuencia de una palabra
    
    insertar(palabra) {
        if (this.buscar(palabra)) {
            this.raiz.hijos[palabra].contador++; // Si la palabra ya existe, incrementa su frecuencia
            return; // No es necesario insertar de nuevo
        }
        let nodoActual = this.raiz;
        for (const caracter of palabra) { //iterar la palabra
        if (!nodoActual.hijos[caracter]) { 
            nodoActual.hijos[caracter] = new TrieNode(); //si no existe la letra en los hijos, se crea
        }
        nodoActual = nodoActual.hijos[caracter]; // se mueve al nodo hijo correspondiente
        }
        nodoActual.esFinPalabra = true; // marca el final de la palabra para que se enceuntre en caso de existir una palabra compuesta
    }

    buscar(palabra) {
        let nodoActual = this.raiz;
        for (const caracter of palabra) {
            if (!nodoActual.hijos[caracter]) {
                return false; // Si no existe el caracter, la palabra no está
            }
            nodoActual = nodoActual.hijos[caracter]; // se mueve al nodo hijo correspondiente
        }
        return nodoActual.esFinPalabra; // Retorna true si es una palabra completa
    }
}