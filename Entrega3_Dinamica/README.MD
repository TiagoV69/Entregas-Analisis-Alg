
## Autores

- Brayan Alexis Correa Torres
- Enrique Betancur Pineda
- Santiago Varela Jimenez

## Link de grabación

- https://correoitmedu-my.sharepoint.com/:v:/g/personal/santiagovarela314184_correo_itm_edu_co/IQC0qPBSuFQWRKRwsPgLxpkWAV345KD4g1bAZuCxBbfkO0k

# Decide mejor — Programación dinámica

Aplicación web para resolver el problema de la mochila 0/1 aplicado a la selección de proyectos comunitarios: dado un presupuesto limitado, elegir el conjunto de proyectos con el mayor beneficio total sin excederlo.

## Tecnologías

- **Python 3.9 o superior**, con biblioteca estándar (`http.server`, `json` y `pathlib`). No se requieren frameworks ni paquetes externos.
- HTML, CSS y JavaScript nativos para el frontend.
git log --oneline -4
git push origin main
## Organización del backend

El backend separa responsabilidades en tres archivos:

- `backend/algoritmo.py`: validación de entradas, tabla dinámica, solución óptima y reconstrucción de proyectos.
- `backend/servidor.py`: servidor HTTP, archivos de la interfaz y endpoint JSON.
- `backend/app.py`: punto de entrada que inicia el servidor, conservando un comando de ejecución sencillo.

## Iniciar la aplicación

Desde una terminal, sitúate en `Entrega3_Dinamica` y ejecuta:

```bash
python backend/app.py
```

Si en Windows el comando `python` no está disponible, puedes usar `py backend/app.py`. Luego abre **http://127.0.0.1:8000** en el navegador. Para detener el servidor, presiona `Ctrl+C` en la terminal.

El servidor sirve tanto la aplicación como su API; no es necesario iniciar un frontend aparte ni configurar CORS.

## Cómo usarla

1. Indica el presupuesto disponible.
2. Para cada proyecto, escribe su nombre, la inversión (peso) y el beneficio.
3. Usa **Agregar proyecto** para incluir más alternativas, o **Cargar ejemplo** para recuperar los datos de demostración.
4. Presiona **Encontrar la mejor combinación**. La aplicación muestra el beneficio máximo, el presupuesto usado, los proyectos elegidos y la tabla de subproblemas.

Se aceptan presupuestos enteros entre 0 y 2.000, y hasta 30 proyectos. Las inversiones deben ser enteros positivos y los beneficios, enteros no negativos.

## Problema

Una organización tiene un presupuesto fijo y una lista de proyectos posibles. Cada proyecto requiere cierta inversión y genera cierto beneficio. Como un proyecto no se puede ejecutar parcialmente, solo existen dos opciones por proyecto: seleccionarlo completo o no seleccionarlo. Se busca maximizar la suma de beneficios sin superar el presupuesto.

## Algoritmo de programación dinámica

Se utiliza el problema de la **mochila 0/1**. No se prueban explícitamente las `2ⁿ` combinaciones: se guardan soluciones óptimas de subproblemas y se reutilizan al resolver los siguientes.

### Estado

`dp[i][c]` representa el beneficio máximo alcanzable al considerar los primeros `i` proyectos y disponer de un presupuesto de `c` unidades.

### Relación de recurrencia

Sea `pesoᵢ` la inversión del proyecto `i` y `beneficioᵢ` su beneficio:

```text
si pesoᵢ > c:
    dp[i][c] = dp[i - 1][c]
si pesoᵢ <= c:
    dp[i][c] = max(
        dp[i - 1][c],
        beneficioᵢ + dp[i - 1][c - pesoᵢ]
    )
```

La primera alternativa descarta el proyecto; la segunda lo selecciona. Siempre se conserva la alternativa con mayor beneficio.

### Casos base

```text
dp[0][c] = 0  para todo presupuesto c
dp[i][0] = 0  para todo número de proyectos i
```

Sin proyectos o sin presupuesto, el beneficio máximo es cero.

### Implementación y reconstrucción

El backend recorre la tabla desde cero hasta completar los proyectos y presupuestos. Después la recorre hacia atrás desde `dp[n][C]`: si el valor de una celda difiere del valor de la fila anterior para la misma capacidad, ese proyecto forma parte de la solución y se descuenta su inversión restante. En caso de empate se conserva la solución anterior; esto produce una selección óptima válida y no altera el beneficio máximo.

El endpoint `POST /api/optimizar` recibe un objeto JSON con `capacity` y `items`, donde cada proyecto tiene `name`, `weight` y `value`. Devuelve la selección óptima, el presupuesto utilizado, el beneficio máximo y la tabla completa. Los datos se envían y calculan en memoria, sin guardar información personal ni escribir archivos.

### Resultados, ejemplo y complejidad

El botón **Cargar ejemplo** propone un presupuesto de 10 y cuatro proyectos:

| Proyecto | Inversión | Beneficio |
|---|---:|---:|
| Huerta comunitaria | 4 | 7 |
| Biblioteca móvil | 3 | 5 |
| Taller de tecnología | 5 | 9 |
| Jornada deportiva | 2 | 4 |

Para estos datos el beneficio máximo es **18**, eligiendo Biblioteca móvil, Taller de tecnología y Jornada deportiva. La inversión total es 10, por lo que se utiliza todo el presupuesto. La última celda de la tabla generada refleja ese máximo.

- **Tiempo:** `O(n × C)`, donde `n` es el número de proyectos y `C` el presupuesto.
- **Espacio:** `O(n × C)`, porque se conserva la tabla para mostrar sus subproblemas y reconstruir la selección.

Los límites de entrada (30 proyectos y presupuesto máximo de 2.000) mantienen la tabla acotada y permiten visualizarla en la aplicación.

## Estructura de la carpeta

```text
Entrega3_Dinamica/
├── README.md
├── PRESENTACION.md
├── backend/
│   ├── algoritmo.py
│   ├── app.py
│   └── servidor.py
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
```
