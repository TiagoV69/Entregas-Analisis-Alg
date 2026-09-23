"""
grafo.py
Lógica de grafo no dirigido y algoritmo BFS para:
1. Calcular el grado de separación (camino más corto) entre dos usuarios.
2. Sugerir amigos (usuarios a distancia 2: "amigos de amigos").

Se mantiene independiente de Flask para poder probarlo con unit tests
sin necesidad de levantar un servidor.
"""

from collections import defaultdict, deque


def construir_grafo(usuarios, amistades):
    """
    Construye una lista de adyacencia a partir de usuarios y amistades.

    grafo[id_usuario] = set con los ids de sus amigos directos.
    """
    grafo = defaultdict(set)

    # Aseguramos que todo usuario exista como nodo, aunque no tenga amigos
    for u in usuarios:
        grafo[u["id"]]  # defaultdict crea el set vacío al acceder

    for a in amistades:
        origen, destino = a["origen"], a["destino"]
        grafo[origen].add(destino)
        grafo[destino].add(origen)  # no dirigido

    return grafo


def bfs_distancia(grafo, origen, destino):
    """
    Calcula la distancia mínima (grado de separación) entre dos usuarios
    y reconstruye el camino recorrido.

    Retorna un dict:
        {
          "distancia": int,   # -1 si no están conectados
          "camino": [ids...], # lista de ids en orden origen -> destino
          "pasos": [...]      # orden en que BFS visitó los nodos (para animar)
        }
    """
    if origen not in grafo or destino not in grafo:
        return {"distancia": -1, "camino": [], "pasos": []}

    visitados = {origen: 0}
    padres = {origen: None}
    cola = deque([origen])
    orden_visita = []  # útil para que el frontend anime la expansión

    while cola:
        actual = cola.popleft()
        orden_visita.append(actual)

        if actual == destino:
            camino = []
            nodo = destino
            while nodo is not None:
                camino.append(nodo)
                nodo = padres[nodo]
            camino.reverse()
            return {
                "distancia": visitados[destino],
                "camino": camino,
                "pasos": orden_visita,
            }

        for vecino in sorted(grafo[actual]):
            if vecino not in visitados:
                visitados[vecino] = visitados[actual] + 1
                padres[vecino] = actual
                cola.append(vecino)

    # Si el bucle termina sin encontrar destino, no están conectados
    return {"distancia": -1, "camino": [], "pasos": orden_visita}


def sugerir_amigos(grafo, usuario_id):
    """
    Sugiere amigos usando BFS por niveles explícitos:
      - Nivel 1: amigos directos (no se sugieren, ya son amigos)
      - Nivel 2: amigos de amigos que NO son amigos directos (se sugieren)

    Retorna:
        {
          "directos": [ids...],
          "sugeridos": [ids...]
        }
    """
    if usuario_id not in grafo:
        return {"directos": [], "sugeridos": []}

    nivel1 = grafo[usuario_id]  # amigos directos
    nivel2 = set()

    for amigo in nivel1:
        for amigo_de_amigo in grafo[amigo]:
            if amigo_de_amigo != usuario_id and amigo_de_amigo not in nivel1:
                nivel2.add(amigo_de_amigo)

    return {
        "directos": sorted(nivel1),
        "sugeridos": sorted(nivel2),
    }