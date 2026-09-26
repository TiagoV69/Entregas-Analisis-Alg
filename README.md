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

