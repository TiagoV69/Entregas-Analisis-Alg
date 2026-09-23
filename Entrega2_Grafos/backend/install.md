# Backend — Guía de instalación

Requisito: Python 3.10+ instalado y disponible como `python` en la terminal.

## 1. Clonar y ubicarse en la carpeta

```powershell
git clone <url-del-repo>
cd Entrega2_Grafos
```

## 2. Crear y activar el entorno virtual (en la raíz del proyecto)

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

El prompt debe mostrar `(venv)` al inicio. Si PowerShell bloquea el script con un error de
permisos, ejecuta una vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

y vuelve a intentar la activación.

## 3. Instalar dependencias

```powershell
cd backend
pip install -r requirements.txt
```

## 4. Levantar el servidor

```powershell
python app.py
```

Debe imprimir `Running on http://127.0.0.1:5000`. Déjalo corriendo en esa terminal.

## 5. Probar que funciona (en otra terminal, con el venv activado)

```powershell
curl.exe http://127.0.0.1:5000/usuarios
curl.exe "http://127.0.0.1:5000/bfs/distancia?origen=1&destino=12"
curl.exe "http://127.0.0.1:5000/bfs/sugerencias?usuario=1"
```

## 6. Correr los tests

```powershell
pytest -v
```

Deben pasar 10/10.

## Endpoints disponibles

| Método | Ruta                                      | Descripción                          |
|--------|-------------------------------------------|---------------------------------------|
| GET    | `/usuarios`                               | Lista usuarios y amistades            |
| POST   | `/usuarios`                               | Agrega un usuario                     |
| POST   | `/amistades`                              | Agrega una amistad                    |
| GET    | `/bfs/distancia?origen=X&destino=Y`       | Grado de separación entre X e Y       |
| GET    | `/bfs/sugerencias?usuario=X`              | Amigos sugeridos (nivel 2) para X     |

## Notas para el frontend

- CORS ya está habilitado (`flask-cors`), así que el frontend puede consumir la API desde otro puerto sin problema.
- `datos.json` es la fuente de datos; se lee y escribe en cada request (no hay base de datos).