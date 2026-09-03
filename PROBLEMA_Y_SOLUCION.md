# Problema y solucion

## Problema

Una sala de coworking recibe solicitudes de reuniones. Cada reunion tiene un nombre, una hora de inicio y una hora de fin. Como la sala solo puede atender una reunion a la vez, se necesita escoger la mayor cantidad posible de reuniones sin que se superpongan.

Una reunion puede comenzar exactamente cuando termina la anterior. Por ejemplo, una reunion de 9 a 11 es compatible con otra de 11 a 12.


## Solucion greedy

Se utiliza el algoritmo greedy de seleccion de actividades:

1. Validar que cada reunion tenga nombre y un horario valido entre 0 y 24.
2. Ordenar las reuniones por su hora de finalizacion, de menor a mayor.
3. Recorrerlas en ese orden.
4. Seleccionar una reunion si su inicio es mayor o igual a la hora de fin de la ultima reunion seleccionada.
5. Actualizar la hora de fin disponible y continuar.

La decision local es escoger primero la reunion que termina mas temprano. Esto deja la mayor cantidad de tiempo disponible para las siguientes reuniones y produce una solucion optima para maximizar la cantidad de actividades.

## Backend

El servicio `ReunionService` contiene la logica del algoritmo. El controlador `ReunionController` expone:

```text
POST http://localhost:9001/api/reuniones/optimizar
Content-Type: application/json
```

Ejemplo de entrada:

```json
[
  {"nombre": "Marketing", "inicio": 9, "fin": 11},
  {"nombre": "Ventas", "inicio": 10, "fin": 12},
  {"nombre": "Desarrollo", "inicio": 11, "fin": 13},
  {"nombre": "Soporte", "inicio": 13, "fin": 14}
]
```

Respuesta:

```json
[
  {"nombre": "Marketing", "inicio": 9, "fin": 11},
  {"nombre": "Desarrollo", "inicio": 11, "fin": 13},
  {"nombre": "Soporte", "inicio": 13, "fin": 14}
]
```

Los datos invalidos producen una respuesta HTTP `400` con un mensaje descriptivo.

## Complejidad

Ordenar las $n$ reuniones cuesta $O(n log n)$ y recorrerlas cuesta $O(n)$. Por tanto, la complejidad total es $O(n log n)$ y el espacio adicional usado para la copia ordenada es $O(n)$.
