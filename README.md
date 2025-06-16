# Buscador Inteligente de Libros - Autocompletado y Priorización

Este proyecto implementa un sistema de autocompletado de títulos de libros para una biblioteca, comparando estructuras Trie, AVL/BST y HashMap, priorizando por frecuencia de búsqueda.

## ¿Cómo correr el proyecto?
- Descarga o clona este repositorio.
- Abre `index.html` en tu navegador favorito (no necesita servidor para probar).
- ¡Explora, prueba y revisa los tiempos y sugerencias de cada estructura!

## Estructuras implementadas
- Trie.js: Búsqueda por prefijo y ranking por popularidad.
- AVLTree.js: Árbol binario balanceado para orden alfabético y conteo.
- HashMap.js: Lookup rápido para consultas exactas.

## Créditos
- Daniel Loy y Daniel Gracia

# Guía Rápida: Implementación de Clases en JavaScript (ES6+)

## ¿Qué es una clase en JavaScript?

En JavaScript moderno (ES6+), puedes definir clases de forma similar a Python, Java o C++.  
Una **clase** es una plantilla para crear objetos con atributos (propiedades) y métodos (funciones asociadas).

---

## 1. Definición básica de clase

```js
class Libro {
  constructor(titulo, autor) {
    this.titulo = titulo;       // Atributo de instancia
    this.autor = autor;
    this.numBusquedas = 0;      // Inicialización de atributo
  }

  buscar() {
    this.numBusquedas += 1;     // Método de instancia
    return `${this.titulo} fue buscado ${this.numBusquedas} veces.`;
  }

  getInfo() {
    return `${this.titulo}, de ${this.autor}`;
  }
}

// Crear una instancia
let miLibro = new Libro("Cien años de soledad", "Gabriel García Márquez");
console.log(miLibro.getInfo());      // "Cien años de soledad, de Gabriel García Márquez"
console.log(miLibro.buscar());       // "Cien años de soledad fue buscado 1 veces."
```

## 2. Métodos y atributos estáticos

Los atributos y métodos estáticos pertenecen a la clase, no a la instancia.

```js
class Libro {
  static totalLibros = 0;           // Atributo de la clase

  constructor(titulo, autor) {
    this.titulo = titulo;
    this.autor = autor;
    Libro.totalLibros += 1;
  }

  static cuantosLibros() {
    return Libro.totalLibros;
  }
}

let l1 = new Libro("El Aleph", "Borges");
let l2 = new Libro("Rayuela", "Cortázar");
console.log(Libro.cuantosLibros());  // 2
```
## 3. Herencia

Puedes heredar de otra clase usando extends y llamar al constructor de la clase padre con super().

```js
class MaterialBiblioteca {
  constructor(id) {
    this.id = id;
  }
}

class Libro extends MaterialBiblioteca {
  constructor(id, titulo, autor) {
    super(id);                     // Llama al constructor de la clase padre
    this.titulo = titulo;
    this.autor = autor;
  }

  getInfo() {
    return `[${this.id}] ${this.titulo}, de ${this.autor}`;
  }
}

let libro = new Libro(1, "Ficciones", "Borges");
console.log(libro.getInfo()); // [1] Ficciones, de Borges
```


## 4. Métodos y atributos privados (opcional, ES2022+)

Desde versiones modernas puedes usar # para atributos y métodos privados.

```js
class Libro {
  #notasSecretas = "No compartir";   // Privado

  verNotas() {
    return this.#notasSecretas;
  }
}

let libro = new Libro();
console.log(libro.verNotas());    // "No compartir"
// console.log(libro.#notasSecretas); // Error: es privado
```

## 5. Ejemplo de clase para estructuras de datos

Por ejemplo, para un nodo de Trie:

```js
class TrieNode {
  constructor() {
    this.hijos = {};    // Diccionario: letra -> TrieNode
    this.esFin = false;
    this.contador = 0;  // Frecuencia de la palabra
  }
}

class Trie {
  constructor() {
    this.raiz = new TrieNode();
  }

  insertar(palabra) {
    let nodo = this.raiz;
    for (let letra of palabra) {
      if (!nodo.hijos[letra]) {
        nodo.hijos[letra] = new TrieNode();
      }
      nodo = nodo.hijos[letra];
    }
    nodo.esFin = true;
    nodo.contador += 1;
  }
}
```

## 6. Diferencias clave con otros lenguajes

- El constructor se llama siempre `constructor`.
- No se declaran tipos de variables (JavaScript es dinámico).
- Se usa `this.` para acceder a atributos y métodos.
- Los métodos se definen dentro del bloque de la clase, sin la palabra clave `function`.
- No existen "interfaces" o "clases abstractas" formales (puedes simularlas).
- Métodos/atributos privados usan `#` (requieren entornos modernos).


## 7. Exportar e importar clases entre archivos

Para organizar tu proyecto modularmente:

En el archivo de la clase (por ejemplo, Trie.js):

```js
export class Trie {
  // ... implementación ...
}
```

```js
import { Trie } from './structures/Trie.js';

const miTrie = new Trie();
```

## 8. Recursos útiles

- [MDN - Classes in JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes)
- [Tutorial básico de clases JS (en español)](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects#Definici%C3%B3n_de_clases)
