import pytest
from grafo import construir_grafo, bfs_distancia, sugerir_amigos


@pytest.fixture
def grafo_ejemplo():
    usuarios = [{"id": i} for i in range(1, 6)]
    amistades = [
        {"origen": 1, "destino": 2},
        {"origen": 2, "destino": 3},
        {"origen": 3, "destino": 4},
        # 5 queda aislado (sin amistades)
    ]
    return construir_grafo(usuarios, amistades)


def test_construir_grafo_nodo_aislado(grafo_ejemplo):
    assert grafo_ejemplo[5] == set()


def test_construir_grafo_no_dirigido(grafo_ejemplo):
    assert 2 in grafo_ejemplo[1]
    assert 1 in grafo_ejemplo[2]  # arista debe existir en ambos sentidos


def test_bfs_distancia_camino_directo(grafo_ejemplo):
    r = bfs_distancia(grafo_ejemplo, 1, 2)
    assert r["distancia"] == 1
    assert r["camino"] == [1, 2]


def test_bfs_distancia_camino_largo(grafo_ejemplo):
    r = bfs_distancia(grafo_ejemplo, 1, 4)
    assert r["distancia"] == 3
    assert r["camino"] == [1, 2, 3, 4]


def test_bfs_distancia_mismo_nodo(grafo_ejemplo):
    r = bfs_distancia(grafo_ejemplo, 1, 1)
    assert r["distancia"] == 0
    assert r["camino"] == [1]


def test_bfs_distancia_sin_conexion(grafo_ejemplo):
    r = bfs_distancia(grafo_ejemplo, 1, 5)
    assert r["distancia"] == -1
    assert r["camino"] == []


def test_bfs_distancia_usuario_inexistente(grafo_ejemplo):
    r = bfs_distancia(grafo_ejemplo, 1, 999)
    assert r["distancia"] == -1
    assert r["camino"] == []


def test_sugerir_amigos_normal(grafo_ejemplo):
    r = sugerir_amigos(grafo_ejemplo, 1)
    assert r["directos"] == [2]
    assert r["sugeridos"] == [3]  # amigo de amigo, no amigo directo


def test_sugerir_amigos_usuario_aislado(grafo_ejemplo):
    r = sugerir_amigos(grafo_ejemplo, 5)
    assert r["directos"] == []
    assert r["sugeridos"] == []


def test_sugerir_amigos_usuario_inexistente(grafo_ejemplo):
    r = sugerir_amigos(grafo_ejemplo, 999)
    assert r["directos"] == []
    assert r["sugeridos"] == []