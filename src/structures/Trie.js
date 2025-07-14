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
    //Insertar un token en el trie
    // y asociarlo a un clusterId y bookId
    insert(token, clusterId, bookId) {
        let node = this.root;
        for (const ch of token) {
            if (!node.children.has(ch)) {
                node.children.set(ch, new TrieNode());
            }
            node = node.children.get(ch);
        }
        node.endWord = true; // Marca el final de la palabra
        
        // Actualiza el posting para el clusterId
        let rec = node.posting.get(clusterId);
        if (!rec) {
          rec = { hits: 0, editions: [] };
          node.posting.set(clusterId, rec);
        }
        rec.editions.push(bookId);
    }

    // Buscar un token en el trie
    search(token) {
      let node= this.root;
      for (const ch of token) {
          if (!node.children.has(ch)) {
              return null; // No se encontró el token
          }
          node = node.children.get(ch);
      }
      return node.endWord ? node : null; // Retorna el nodo si es una palabra completa
    }

    searchPrefix(prefix){

      //Encuentra el nodo que representa el prefijo
      let node= this.root;
      for (const ch of prefix){
        if (!node.children.has(ch)) return new Set(); // Si no existe el prefijo, retorna un Set vacío

      // recorrer todos los nodos hijos del nodo que representa el prefijo
        let result = new Set();
        let stack = [node.children.get(ch)];

        while (stack.length > 0) {
            let current = stack.pop();
            if (current.endWord) {

              //agrega los clusterIds del nodo actual al resultado
              for (const cid of current.posting.keys()) result.add(cid);
            }
            // Añadimos todos los hijos a la pila
            for (const child of current.children.values()) stack.push(child);
        }
        return result; // Retorna un Set con todos los clusterIds encontrados
      }
    }
}