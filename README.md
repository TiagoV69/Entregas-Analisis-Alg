"Parcial#2 Entregas Analisis de Algoritmos" 

VER CARPETA ENTREGA2_GRAFOS

Participantes: 
SANTIAGO VARELA JIMÉNEZ
BRAYAN ALEXIS CORREA TORRES
ENRIQUE BETANCUR PINEDA

# Red Conecta - Explorador de Grafos con BFS

## Descripción del Problema

En una red social, los usuarios están conectados entre sí mediante relaciones de amistad. Dos problemas fundamentales surgen en este contexto:

1. **Grado de separación**: ¿Cuál es la distancia mínima (número de conexiones) entre dos usuarios cualesquiera?
2. **Sugerencias de amistad**: ¿Qué usuarios podrían ser amigos potenciales basándose en amigos en común?

Estos problemas son equivalentes a encontrar el camino más corto en un grafo no dirigido y explorar nodos a exactamente 2 saltos de distancia.

##  Objetivo

Implementar un sistema que modele la red social como un **grafo no dirigido** y utilice el algoritmo **BFS (Breadth-First Search)** para:

- Calcular el camino más corto entre dos usuarios (grado de separación).
- Sugerir amigos basándose en conexiones de segundo nivel (amigos de amigos).


## Justificación: ¿Por qué Grafos y BFS?

### ¿Por qué un Grafo No Dirigido?

En una red social, las amistades son **bidireccionales**: si A es amigo de B, entonces B es amigo de A. Este comportamiento se modela perfectamente con un grafo no dirigido, donde cada arista representa una relación simétrica.

### ¿Por qué BFS?

BFS (Breadth-First Search) es el algoritmo ideal para:

1. **Encontrar el camino más corto** en grafos no ponderados.
2. **Explorar por niveles**: BFS visita primero todos los nodos a distancia 1, luego todos los nodos a distancia 2, y así sucesivamente.
3. **Garantía de optimalidad**: Cuando BFS encuentra el destino, el camino construido es necesariamente el más corto posible.

## Conceptos Fundamentales

### Grafo No Dirigido

Un grafo **G = (V, E)** donde:
- **V**: Conjunto de vértices (usuarios).
- **E**: Conjunto de aristas (amistades), sin dirección.
- Si existe la arista (u, v), también existe (v, u).

### Lista de Adyacencia

Estructura de datos para representar el grafo:

```
grafo = {
  1: {2, 4},        // Usuario 1 es amigo de 2 y 4
  2: {1, 3},        // Usuario 2 es amigo de 1 y 3
  3: {2, 7},
  4: {1, 5},
  ...
}
```

**Ventajas**:
- Espacio: O(V + E)
- Recorrer vecinos de un nodo: O(grado del nodo)

### BFS (Breadth-First Search)

Algoritmo de recorrido por niveles que utiliza una **cola FIFO** (First In, First Out) para garantizar que los nodos se visiten en orden de distancia creciente desde el origen.

## Pseudocódigo

### 1. Algoritmo `bfs_distancia`

Calcula la distancia mínima y reconstruye el camino entre dos usuarios.

```
función bfs_distancia(grafo, origen, destino):
    si origen no está en grafo O destino no está en grafo:
        retornar {distancia: -1, camino: [], pasos: []}
    
    visitados = {origen: 0}           // Mapea nodo -> distancia desde origen
    padres = {origen: null}           // Mapea nodo -> nodo anterior en el camino
    cola = Cola([origen])
    orden_visita = []
    
    mientras cola no esté vacía:
        actual = cola.desencolar()
        orden_visita.agregar(actual)
        
        si actual == destino:
            // Reconstruir camino desde destino hasta origen
            camino = []
            nodo = destino
            mientras nodo no sea null:
                camino.agregar_al_inicio(nodo)
                nodo = padres[nodo]
            
            retornar {
                distancia: visitados[destino],
                camino: camino,
                pasos: orden_visita
            }
        
        para cada vecino en grafo[actual]:
            si vecino no está en visitados:
                visitados[vecino] = visitados[actual] + 1
                padres[vecino] = actual
                cola.encolar(vecino)
    
    // No se encontró conexión
    retornar {distancia: -1, camino: [], pasos: orden_visita}
```

### 2. Algoritmo `sugerir_amigos`

Encuentra usuarios a exactamente 2 saltos de distancia (amigos de amigos).

```
función sugerir_amigos(grafo, usuario_id):
    si usuario_id no está en grafo:
        retornar {directos: [], sugeridos: []}
    
    nivel1 = grafo[usuario_id]        // Amigos directos
    nivel2 = Conjunto()
    
    para cada amigo en nivel1:
        para cada amigo_de_amigo en grafo[amigo]:
            si amigo_de_amigo != usuario_id Y amigo_de_amigo no está en nivel1:
                nivel2.agregar(amigo_de_amigo)
    
    retornar {
        directos: ordenar(nivel1),
        sugeridos: ordenar(nivel2)
    }
```
