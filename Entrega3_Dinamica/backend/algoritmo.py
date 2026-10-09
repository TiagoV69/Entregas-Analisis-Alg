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


    normalized_items = []
    for index, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"El proyecto {index} no tiene un formato válido.")
        name = item.get("name")
        weight = item.get("weight")
        value = item.get("value")
        if not isinstance(name, str) or not name.strip():
            raise ValueError(f"El proyecto {index} debe tener un nombre.")
        if isinstance(weight, bool) or not isinstance(weight, int) or weight <= 0:
            raise ValueError(f"El peso del proyecto {index} debe ser un entero positivo.")
        if isinstance(value, bool) or not isinstance(value, int) or value < 0:
            raise ValueError(f"El beneficio del proyecto {index} debe ser un entero no negativo.")
        normalized_items.append(
            {"id": index, "name": name.strip(), "weight": weight, "value": value}
        )