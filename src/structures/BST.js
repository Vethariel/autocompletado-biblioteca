class BSTNodo {
    constructor(value) {
        this.valor = valor;
        this.izquierda = null;
        this.derecha = null;
    }
}

class BST {
    constructor() {
        this.raiz = null;
    }

    insertar(valor) {
        this.raiz = this.insertarRecursivo(this.raiz, valor);
    }

    insertarRecursivo(nodo, valor) {
        if (nodo === null) {
            return new BSTNodo(valor);
        }

        if (valor < nodo.valor) {
            nodo.izquierda = this.insertarRecursivo(nodo.izquierda, valor);
        } else if (valor > nodo.valor) {
            nodo.derecha = this.insertarRecursivo(nodo.derecha, valor);
        }
        // Si el valor ya existe, no se hace nada

        return nodo;
    }

    // implementar eliminar y buscar

    buscar(valor) {
        return this.buscarRecursivo(this.raiz, valor);
    }

    buscarRecursivo(nodo, valor) {
        if (nodo === null || nodo.valor === valor) {
            return nodo;
        }

        if (valor < nodo.valor) {
            return this.buscarRecursivo(nodo.izquierda, valor);
        } else {
            return this.buscarRecursivo(nodo.derecha, valor);
        }
    }

    eliminar(valor) {
        this.raiz = this.eliminarRecursivo(this.raiz, valor);
    }

    eliminarRecursivo(nodo, valor) {
        if (nodo === null) {
            return nodo;
        }

        if (valor < nodo.valor) {
            nodo.izquierda = this.eliminarRecursivo(nodo.izquierda, valor);
        } else if (valor > nodo.valor) {
            nodo.derecha = this.eliminarRecursivo(nodo.derecha, valor);
        } else {

            if (nodo.izquierda === null) {
                return nodo.derecha; 
            } else if (nodo.derecha === null) {
                return nodo.izquierda; 
            }

            // Nodo con dos hijos, encuentra el más pequeño en el subárbol derecho
            const sucesor = this.encontrarMinimo(nodo.derecha);
            nodo.valor = sucesor.valor; 
            nodo.derecha = this.eliminarRecursivo(nodo.derecha, sucesor.valor); // Elimina el sucesor
        }
        return nodo;
    }

    encontrarMinimo(nodo) {
        while (nodo.izquierda !== null) {
            nodo = nodo.izquierda; // Recorre hacia la izquierda hasta encontrar el mínimo
        }
        return nodo;
    }

    enRango(prefijo){
        const resultado = [];
        this.enRangoRecursivo(this.raiz, prefijo, resultado);
        return resultado;
    }
}