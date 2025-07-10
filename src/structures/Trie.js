class TrieNode {
  constructor() {
    this.children = new Map(); // Usamos un Map para almacenar los hijos
    this.posting = new Map(); // Usamos un Map para almacenar la info del  clusterId -> {hits:int, editions:int[]}
    this.endWord = false; // importante para saber si un prefijo s una palabra completa
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  // Toca poner como minimo las funciones de insertar, buscar y eliminar
  //tambien hay que implementar una que retorne y modifique la frecuencia de una palabra
    
    insertar(palabra) {
        if (this.buscar(palabra)) {
            this.root.children[palabra].contador++; // Si la palabra ya existe, incrementa su frecuencia
            return; // No es necesario insertar de nuevo
        }
        let nodoActual = this.root;
        for (const caracter of palabra) { //iterar la palabra
        if (!nodoActual.children[caracter]) { 
            nodoActual.children[caracter] = new TrieNode(); //si no existe la letra en los children, se crea
        }
        nodoActual = nodoActual.children[caracter]; // se mueve al nodo hijo correspondiente
        }
        nodoActual.endWord = true; // marca el final de la palabra para que se encuentre en caso de existir una palabra compuesta
    }

    buscar(palabra) {
        let nodoActual = this.root;
        for (const caracter of palabra) {
            if (!nodoActual.children[caracter]) {
                return false; // Si no existe el caracter, la palabra no está
            }
            nodoActual = nodoActual.children[caracter]; // se mueve al nodo hijo correspondiente
        }
        return nodoActual.endWord; // Retorna true si es una palabra completa
    }

    comienzaCon(prefijo) {
        let nodoActual = this.root;
        for (const caracter of prefijo) {
            if (!nodoActual.children[caracter]) {
                return []; // Si no existe el prefijo, retorna un array vacío
            }
            nodoActual = nodoActual.children[caracter]; // se mueve al nodo hijo correspondiente
        }
        return this.buscarPalabrasDesde(nodoActual, prefijo); // Busca todas las palabras que comienzan con el prefijo
    }

    buscarPalabrasDesde(nodo, prefijo) {
        const palabras = [];
        if (nodo.endWord) {
            palabras.push(prefijo); // Si es una palabra completa, la agrega
        }
        for (const caracter in nodo.children) {
            palabras.push(...this.buscarPalabrasDesde(nodo.children[caracter], prefijo + caracter)); // Busca recursivamente en los children
            //NOTA: el operador ... (spread) se usa para concatenar los arrays de palabras, en vez de agregar valores individuales
        }
        return palabras; 
    }

    borrar(palabra) {
        if (!this.buscar(palabra)) {
            return false; // Si la palabra no existe, no se puede eliminar
        }
        this.borrarDesde(this.root, palabra, 0);
    }

    borrarDesde(nodo, palabra, indice) {
        if (indice === palabra.length) {
            nodo.endWord = false; // Marca el final de la palabra como falso
            return Object.keys(nodo.children).length === 0; // Retorna true si no hay children
        }
        const caracter = palabra[indice];
        const hijo = nodo.children[caracter];
        if (!hijo) {
            return false; // La palabra no existe
        }
        const debeBorrarHijo = this.borrarDesde(hijo, palabra, indice + 1); //Lamada recursiva para borrar el hijo
        if (debeBorrarHijo) {
            delete nodo.children[caracter]; // Elimina el hijo
            return Object.keys(nodo.children).length === 0; // Retorna true si no hay children
        }
        return false;
    }

}