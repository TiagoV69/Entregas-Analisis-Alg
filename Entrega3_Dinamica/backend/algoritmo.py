"""Validación y algoritmo de programación dinámica para la mochila"""

MAX_CAPACITY = 2000
MAX_ITEMS = 30


def optimize_budget(capacity, items):
    """Resuelve la mochila 0/1 y devuelve el óptimo y la tabla de programación dinámica."""
    if isinstance(capacity, bool) or not isinstance(capacity, int):
        raise ValueError("La capacidad debe ser un número entero.")
    if not 0 <= capacity <= MAX_CAPACITY:
        raise ValueError(f"La capacidad debe estar entre 0 y {MAX_CAPACITY}.")
    if not isinstance(items, list):
        raise ValueError("La lista de proyectos no tiene un formato válido.")
    if len(items) > MAX_ITEMS:
        raise ValueError(f"Se permiten como máximo {MAX_ITEMS} proyectos.")
