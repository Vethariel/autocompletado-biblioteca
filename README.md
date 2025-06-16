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
