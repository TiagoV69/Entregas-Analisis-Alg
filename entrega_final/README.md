# Taller final — Análisis de algoritmos

Repositorio del grupo con los ocho ejercicios Medium de LeetCode. Cada ejercicio tiene su carpeta con el código, y las capturas de **Accepted** están en `evidencias/`.

## Autoría

| Integrante              | Ejercicios  |
| ----------------------- | ----------- |
| Santiago Varela Jimenez | 743, 1584   |
| Brayan                  | _pendiente_ |
| Enrique                 | _pendiente_ |

## 1. 215. Kth Largest Element in an Array

Pendiente

## 2. 179. Largest Number

Pendiente

## 3. 743. Network Delay Time

Enlace: https://leetcode.com/problems/network-delay-time/  
Lenguaje: Java  
Código: [`network-delay-time/Solution.java`](network-delay-time/Solution.java)  
Familia: grafos (Dijkstra)

**Idea:** la red es un grafo dirigido donde cada arco tiene un tiempo. Como los tiempos no son todos iguales, un BFS no sirve (no es lo mismo un arco de 1 que uno de 100). Se usa Dijkstra desde el nodo `k`: una cola de prioridad que siempre saca el nodo al que se llega en menos tiempo acumulado, y desde ahí se actualizan sus vecinos si se encuentra un camino más corto. Cuando la cola se vacía, la señal ya llegó a todos los nodos alcanzables; la respuesta es el tiempo del más lejano, o `-1` si algún nodo nunca recibió la señal.

**Complejidad:** con `n` nodos y `m = times.length` arcos, el tiempo es **O((n + m) log n)** y el espacio es **O(n + m)** (lista de adyacencia, arreglo de distancias y cola).

![Accepted — Network Delay Time](evidencias/network-delay-time-accepted.png)

## 4. 1584. Min Cost to Connect All Points

Enlace: https://leetcode.com/problems/min-cost-to-connect-all-points/  
Lenguaje: Java  
Código: [`min-cost-to-connect-all-points/Solution.java`](min-cost-to-connect-all-points/Solution.java)  
Familia: grafos (árbol de recubrimiento mínimo)

**Idea:** los puntos son vértices de un grafo completo y el peso de cada arista es la distancia de Manhattan entre sus extremos. No hay un origen: se busca conectar a todos gastando lo menos posible, o sea, un árbol de recubrimiento mínimo. Se resuelve con Prim: se empieza en un punto, y en cada vuelta se agrega al grupo el punto desconectado que sale más barato de unir; después se revisa si ese punto nuevo abarata la conexión de los demás. Se usa Prim con arreglo (sin cola) porque el grafo es completo y así queda más simple.

**Complejidad:** con `n = points.length`, el tiempo es **O(n²)** (n vueltas, y en cada una se recorre el arreglo dos veces) y el espacio es **O(n)** (arreglos `costo` y `conectado`).

![Accepted — Min Cost to Connect All Points](evidencias/min-cost-to-connect-all-points-accepted.png)

## 5. 72. Edit Distance

Pendiente

## 6. 300. Longest Increasing Subsequence

Pendiente

## 7. 134. Gas Station

Pendiente

## 8. 79. Word Search

Pendiente
