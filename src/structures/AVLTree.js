class AVLNode {
    constructor(valor) {
        this.valor = valor;
        this.altura = 1;
        this.izquierda = null;
        this.derecha = null;
    }
}

class AVLTree {
    constructor() {
        this.raiz = null;
    }

    insertar(valor) {
        this.raiz = this.insertarRecursivo(this.raiz, valor);
    }

    insertarRecursivo(nodo, valor) {
        if (nodo === null) {
            return new AVLNode(valor);
        }

        if (valor < nodo.valor) {
            nodo.izquierda = this.insertarRecursivo(nodo.izquierda, valor);
        } else if (valor > nodo.valor) {
            nodo.derecha = this.insertarRecursivo(nodo.derecha, valor);
        } else {
            return nodo;
        }

        nodo.altura = 1 + Math.max(nodo.izquierda.altura, nodo.derecha.altura);

        // Balancear el árbol
        return this.balancear(nodo);
    }

    balancear(nodo) {
        const balance = this.obtenerBalance(nodo);

        // Rotación RR
        if (balance > 1 && this.obtenerBalance(nodo.izquierda) >= 0) {
            return this.rotacionDerecha(nodo);
        }

        // Rotación LL
        if (balance < -1 && this.obtenerBalance(nodo.derecha) <= 0) {
            return this.rotacionIzquierda(nodo);
        }

        // Rotación LR
        if (balance > 1 && this.obtenerBalance(nodo.izquierda) < 0) {
            nodo.izquierda = this.rotacionIzquierda(nodo.izquierda);
            return this.rotacionDerecha(nodo);
        }

        // Rotación RL
        if (balance < -1 && this.obtenerBalance(nodo.derecha) > 0) {
            nodo.derecha = this.rotacionDerecha(nodo.derecha);
            return this.rotacionIzquierda(nodo);
        }

        return nodo;
    }

    obtenerBalance(nodo) {
        if (nodo === null) {
            return 0;
        }
        return (nodo.izquierda ? nodo.izquierda.altura : 0) - (nodo.derecha ? nodo.derecha.altura : 0);
    }

    rotacionDerecha(nodo) {
        const nuevoRaiz = nodo.izquierda;
        nodo.izquierda = nuevoRaiz.derecha;
        nuevoRaiz.derecha = nodo;

        nodo.altura = 1 + Math.max(nodo.izquierda ? nodo.izquierda.altura : 0, nodo.derecha ? nodo.derecha.altura : 0);
        nuevoRaiz.altura = 1 + Math.max(nuevoRaiz.izquierda ? nuevoRaiz.izquierda.altura : 0, nodo.altura);

        return nuevoRaiz;
    }

    rotacionIzquierda(nodo) {
        const nuevoRaiz = nodo.derecha;
        nodo.derecha = nuevoRaiz.izquierda;
        nuevoRaiz.izquierda = nodo;

        nodo.altura = 1 + Math.max(nodo.izquierda ? nodo.izquierda.altura : 0, nodo.derecha ? nodo.derecha.altura : 0);
        nuevoRaiz.altura = 1 + Math.max(nuevoRaiz.derecha ? nuevoRaiz.derecha.altura : 0, nodo.altura);

        return nuevoRaiz;
    }
    // Métodos para eliminar y buscar
    
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

            // Nodo con un hijo o sin hijos
            if (nodo.izquierda === null || nodo.derecha === null) {
                return nodo.izquierda || nodo.derecha;
            }

            // Nodo con dos hijos, toca obtener el más pequeño del subárbol derecho
            const sucesor = this.obtenerMinimo(nodo.derecha);
            nodo.valor = sucesor.valor;
            nodo.derecha = this.eliminarRecursivo(nodo.derecha, sucesor.valor);
        }

        // Actualizar la altura del nodo actual
        nodo.altura = 1 + Math.max(nodo.izquierda ? nodo.izquierda.altura : 0, nodo.derecha ? nodo.derecha.altura : 0);

        // Balancear el árbol
        return this.balancear(nodo);
    }

    obtenerMinimo(nodo) {
        while (nodo.izquierda !== null) {
            nodo = nodo.izquierda;
        }
        return nodo;
    }

}
