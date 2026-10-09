"""Servidor HTTP para la interfaz web y la API del planificador."""

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from algoritmo import optimize_budget


HOST = "127.0.0.1"
PORT = 8000
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"


class RequestHandler(BaseHTTPRequestHandler):
    """Sirve los archivos del frontend y expone el endpoint de optimización."""

    def do_GET(self):
        path = urlparse(self.path).path
        files = {
            "/": ("index.html", "text/html; charset=utf-8"),
            "/index.html": ("index.html", "text/html; charset=utf-8"),
            "/styles.css": ("styles.css", "text/css; charset=utf-8"),
            "/app.js": ("app.js", "text/javascript; charset=utf-8"),
        }
        if path not in files:
            self.send_error(404, "Recurso no encontrado")
            return
        filename, content_type = files[path]
        file_path = FRONTEND_DIR / filename
        try:
            content = file_path.read_bytes()
        except OSError:
            self.send_error(500, "No se pudo leer un archivo del frontend")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_POST(self):
        if urlparse(self.path).path != "/api/optimizar":
            self.send_error(404, "Endpoint no encontrado")
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length <= 0 or content_length > 100_000:
                self._send_json(
                    {"error": "El cuerpo de la solicitud está vacío o es demasiado grande."},
                    400,
                )
                return
            payload = json.loads(self.rfile.read(content_length))
            if not isinstance(payload, dict):
                raise ValueError("La solicitud debe ser un objeto JSON.")
            result = optimize_budget(payload.get("capacity"), payload.get("items"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self._send_json({"error": "El cuerpo debe contener JSON válido."}, 400)
            return
        except ValueError as error:
            self._send_json({"error": str(error)}, 400)
            return
        except (TypeError, OverflowError):
            self._send_json({"error": "La solicitud contiene datos no válidos."}, 400)
            return
        self._send_json(result)

    def _send_json(self, payload, status=200):
        content = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, format_string, *args):
        print(f"{self.address_string()} - {format_string % args}")


def main():
    """Inicia el servidor web local."""
    server = ThreadingHTTPServer((HOST, PORT), RequestHandler)
    print(f"Servidor listo en http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()
