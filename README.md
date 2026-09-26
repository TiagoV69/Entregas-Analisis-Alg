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


## Complejidad

### Complejidad Temporal

#### `bfs_distancia(grafo, origen, destino)`
- **Peor caso**: O(V + E)
  - Cada vértice se visita una vez: O(V)
  - Cada arista se examina hasta dos veces (una por cada extremo): O(E)
- **Mejor caso**: O(1) si origen == destino

#### `sugerir_amigos(grafo, usuario_id)`
- **Peor caso**: O(V + E)
  - Itera sobre los vecinos del usuario: O(grado(usuario))
  - Para cada vecino, itera sobre sus vecinos: O(∑ grado(vecino))
  - En el peor caso (grafo denso), esto puede ser O(V²), pero en grafos dispersos (como redes sociales reales) es O(V)

### Complejidad Espacial

- **Grafo (lista de adyacencia)**: O(V + E)
- **Auxiliares de BFS**:
  - `visitados`: O(V)
  - `padres`: O(V)
  - `cola`: O(V) en el peor caso
  - `orden_visita`: O(V)
- **Total**: O(V + E)

##  Arquitectura del Proyecto

```
Entrega2_Grafos/
│
├── backend/
│   ├── app.py              # API Flask con endpoints REST
│   ├── grafo.py            # Lógica de grafo y algoritmos BFS
│   ├── datos.json          # Base de datos (usuarios y amistades)
│   ├── requirements.txt    # Dependencias de Python
│   ├── pytest.ini          # Configuración de tests
│   └── tests/
│       └── test_grafo.py   # Tests unitarios de los algoritmos
│
├── frontend/
│   ├── index.html          # Interfaz de usuario
│   ├── app.js              # Lógica del frontend y llamadas a la API
│   └── styles.css          # Estilos visuales
│
└── venv/                   # Entorno virtual de Python
```

### Flujo de Datos

```
┌──────────────┐         HTTP GET/POST         ┌──────────────┐
│   Frontend   │  ────────────────────────────> │  Flask API   │
│ (index.html, │                                 │   (app.py)   │
│    app.js)   │  <────────────────────────────  │              │
└──────────────┘         JSON Response          └──────┬───────┘
                                                        │
                                                        │ usa
                                                        ▼
                                                ┌──────────────┐
                                                │   grafo.py   │
                                                │ (BFS logic)  │
                                                └──────┬───────┘
                                                        │
                                                        │ lee/escribe
                                                        ▼
                                                ┌──────────────┐
                                                │ datos.json   │
                                                │ (usuarios +  │
                                                │  amistades)  │
                                                └──────────────┘
```

## Tabla de Endpoints

| Método | Ruta | Parámetros | Respuesta Esperada | Descripción |
|--------|------|------------|-------------------|-------------|
| **GET** | `/usuarios` | Ninguno | `{"usuarios": [...], "amistades": [...]}` | Retorna todos los usuarios y amistades del sistema |
| **POST** | `/usuarios` | Body: `{"nombre": "string", "avatar": "emoji"}` | `{"id": number, "nombre": "string", "avatar": "emoji"}` | Crea un nuevo usuario |
| **POST** | `/amistades` | Body: `{"origen": number, "destino": number}` | `{"origen": number, "destino": number}` | Crea una nueva amistad |
| **GET** | `/bfs/distancia` | Query: `?origen=X&destino=Y` | `{"distancia": number, "camino": [ids], "pasos": [ids]}` | Calcula el grado de separación entre dos usuarios |
| **GET** | `/bfs/sugerencias` | Query: `?usuario=X` | `{"directos": [ids], "sugeridos": [ids]}` | Sugiere amigos de amigos para un usuario |

### Ejemplos de Respuestas

#### GET `/bfs/distancia?origen=1&destino=12`
```json
{
  "distancia": 5,
  "camino": [1, 2, 3, 7, 8, 9, 12],
  "pasos": [1, 2, 4, 3, 5, 7, 6, 8, 10, 9, 11, 12]
}
```

#### GET `/bfs/sugerencias?usuario=1`
```json
{
  "directos": [2, 4],
  "sugeridos": [3, 5]
}
```

## Instrucciones de Instalación

### Requisitos Previos

- **Python 3.10+** instalado
- **Git** (para clonar el repositorio)
- Navegador web moderno (Chrome, Firefox, Edge)

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Entrega2_Grafos
```

### Paso 2: Crear y Activar el Entorno Virtual

**En Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Si PowerShell bloquea la ejecución del script, ejecuta una vez:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**En Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

El prompt debe mostrar `(venv)` al inicio.

### Paso 3: Instalar Dependencias

```bash
cd backend
pip install -r requirements.txt
```

### Paso 4: Levantar el Backend

```bash
python app.py
```

**Salida esperada:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

Deja esta terminal abierta con el servidor corriendo.

### Paso 5: Abrir el Frontend

1. Abre otra terminal
2. Navega a la carpeta `frontend/`
3. Abre `index.html` directamente en tu navegador:

**Opción 1 (desde terminal):**
```bash
# Windows
start frontend/index.html

# macOS
open frontend/index.html

# Linux
xdg-open frontend/index.html
```

**Opción 2:**
Haz doble clic en el archivo `frontend/index.html` desde el explorador de archivos.

### Paso 6: Verificar la Conexión

En el navegador deberías ver:
- Estado de la API: **"API conectada"** (punto verde)
- Red visualizada con 12 usuarios
- Formularios de consulta habilitados

## Ejecutar las Pruebas

Con el entorno virtual activado y dentro de la carpeta `backend/`:

```bash
pytest -v
```

**Salida esperada:**
```
tests/test_grafo.py::test_construir_grafo_nodo_aislado PASSED
tests/test_grafo.py::test_construir_grafo_no_dirigido PASSED
tests/test_grafo.py::test_bfs_distancia_camino_directo PASSED
tests/test_grafo.py::test_bfs_distancia_camino_largo PASSED
tests/test_grafo.py::test_bfs_distancia_mismo_nodo PASSED
tests/test_grafo.py::test_bfs_distancia_sin_conexion PASSED
tests/test_grafo.py::test_bfs_distancia_usuario_inexistente PASSED
tests/test_grafo.py::test_sugerir_amigos_normal PASSED
tests/test_grafo.py::test_sugerir_amigos_usuario_aislado PASSED
tests/test_grafo.py::test_sugerir_amigos_usuario_inexistente PASSED

========== 10 passed in 0.XX s ==========
```

## Ejemplos de Consultas

### Ejemplo 1: Calcular Distancia entre Ana (1) y Julián (12)

**Request:**
```bash
curl "http://127.0.0.1:5000/bfs/distancia?origen=1&destino=12"
```

**Response:**
```json
{
  "distancia": 5,
  "camino": [1, 2, 3, 7, 8, 9, 12],
  "pasos": [1, 2, 4, 3, 5, 7, 6, 8, 10, 9, 11, 12]
}
```

**Interpretación:**
- **Distancia**: 5 grados de separación
- **Camino**: Ana → Luis → Pedro → Valentina → Diego → Camila → Julián
- **Pasos**: Orden en que BFS visitó los nodos


### Ejemplo 2: Sugerencias de Amistad para Ana (1)

**Request:**
```bash
curl "http://127.0.0.1:5000/bfs/sugerencias?usuario=1"
```

**Response:**
```json
{
  "directos": [2, 4],
  "sugeridos": [3, 5]
}
```

**Interpretación:**
- **Amigos directos**: Luis (2) y Marta (4)
- **Sugeridos**: Pedro (3) y Sofía (5)
  - Pedro es amigo de Luis (amigo de Ana)
  - Sofía es amiga de Marta (amiga de Ana)

### Ejemplo 3: Usuario Sin Conexiones

**Request:**
```bash
curl "http://127.0.0.1:5000/bfs/distancia?origen=1&destino=999"
```

**Response:**
```json
{
  "distancia": -1,
  "camino": [],
  "pasos": [1, 2, 4, 3, 5, 7, 6, 8, 10, 9, 11, 12]
}
```

**Interpretación:**
- **Distancia -1**: No hay camino entre los usuarios
- BFS exploró toda la red conectada desde el origen

---

## Referencias

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- Sedgewick, R., & Wayne, K. (2011). *Algorithms* (4th ed.). Addison-Wesley.
- Documentación oficial de Flask: https://flask.palletsprojects.com/
- Breadth-First Search - Wikipedia: https://en.wikipedia.org/wiki/Breadth-first_search

---

**Entrega 2 · Análisis de Algoritmos**  
*Red Conecta - Explorador de Grafos con BFS*