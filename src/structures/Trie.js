class TrieNode {
  constructor() {
    this.hijos = {}; 
    this.esFinPalabra = false; // importante para saber si un prefijo s una palabra completa
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
        nodoActual.esFinPalabra = true; // marca el final de la palabra para que se encuentre en caso de existir una palabra compuesta
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

    comienzaCon(prefijo) {
        let nodoActual = this.raiz;
        for (const caracter of prefijo) {
            if (!nodoActual.hijos[caracter]) {
                return []; // Si no existe el prefijo, retorna un array vacío
            }
            nodoActual = nodoActual.hijos[caracter]; // se mueve al nodo hijo correspondiente
        }
        return this.buscarPalabrasDesde(nodoActual, prefijo); // Busca todas las palabras que comienzan con el prefijo
    }

    buscarPalabrasDesde(nodo, prefijo) {
        const palabras = [];
        if (nodo.esFinPalabra) {
            palabras.push(prefijo); // Si es una palabra completa, la agrega
        }
        for (const caracter in nodo.hijos) {
            palabras.push(...this.buscarPalabrasDesde(nodo.hijos[caracter], prefijo + caracter)); // Busca recursivamente en los hijos
            //NOTA: el operador ... (spread) se usa para concatenar los arrays de palabras, en vez de agregar valores individuales
        }
        return palabras; 
    }

    borrar(palabra) {
        if (!this.buscar(palabra)) {
            return false; // Si la palabra no existe, no se puede eliminar
        }
        this.borrarDesde(this.raiz, palabra, 0);
    }

    borrarDesde(nodo, palabra, indice) {
        if (indice === palabra.length) {
            nodo.esFinPalabra = false; // Marca el final de la palabra como falso
            return Object.keys(nodo.hijos).length === 0; // Retorna true si no hay hijos
        }
        const caracter = palabra[indice];
        const hijo = nodo.hijos[caracter];
        if (!hijo) {
            return false; // La palabra no existe
        }
        const debeBorrarHijo = this.borrarDesde(hijo, palabra, indice + 1); //Lamada recursiva para borrar el hijo
        if (debeBorrarHijo) {
            delete nodo.hijos[caracter]; // Elimina el hijo
            return Object.keys(nodo.hijos).length === 0; // Retorna true si no hay hijos
        }
        return false;
    }

}