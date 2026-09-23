"""
app.py
API Flask para la Red Social Simplificada (Entrega2_Grafos).

Endpoints:
  GET  /usuarios                          -> lista usuarios y amistades
  POST /usuarios                          -> agrega un usuario
  POST /amistades                         -> agrega una amistad
  GET  /bfs/distancia?origen=1&destino=3  -> grado de separación
  GET  /bfs/sugerencias?usuario=1         -> amigos sugeridos
"""

import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from grafo import construir_grafo, bfs_distancia, sugerir_amigos

app = Flask(__name__)
CORS(app)  # permite que el frontend (otro puerto/origen) consuma la API

DATA_PATH = os.path.join(os.path.dirname(__file__), "datos.json")


def cargar_datos():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def guardar_datos(datos):
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)


@app.route("/usuarios", methods=["GET"])
def obtener_usuarios():
    datos = cargar_datos()
    return jsonify(datos)


@app.route("/usuarios", methods=["POST"])
def agregar_usuario():
    body = request.get_json()
    nombre = body.get("nombre")
    avatar = body.get("avatar", "🙂")

    if not nombre:
        return jsonify({"error": "El campo 'nombre' es obligatorio"}), 400

    datos = cargar_datos()
    nuevo_id = max([u["id"] for u in datos["usuarios"]], default=0) + 1
    nuevo_usuario = {"id": nuevo_id, "nombre": nombre, "avatar": avatar}

    datos["usuarios"].append(nuevo_usuario)
    guardar_datos(datos)

    return jsonify(nuevo_usuario), 201


@app.route("/amistades", methods=["POST"])
def agregar_amistad():
    body = request.get_json()
    origen = body.get("origen")
    destino = body.get("destino")

    if origen is None or destino is None:
        return jsonify({"error": "Se requieren 'origen' y 'destino'"}), 400

    datos = cargar_datos()
    ids_validos = {u["id"] for u in datos["usuarios"]}

    if origen not in ids_validos or destino not in ids_validos:
        return jsonify({"error": "origen o destino no existen"}), 404

    datos["amistades"].append({"origen": origen, "destino": destino})
    guardar_datos(datos)

    return jsonify({"origen": origen, "destino": destino}), 201


@app.route("/bfs/distancia", methods=["GET"])
def obtener_distancia():
    origen = request.args.get("origen", type=int)
    destino = request.args.get("destino", type=int)

    if origen is None or destino is None:
        return jsonify({"error": "Se requieren los parámetros 'origen' y 'destino'"}), 400

    datos = cargar_datos()
    grafo = construir_grafo(datos["usuarios"], datos["amistades"])
    resultado = bfs_distancia(grafo, origen, destino)

    return jsonify(resultado)


@app.route("/bfs/sugerencias", methods=["GET"])
def obtener_sugerencias():
    usuario = request.args.get("usuario", type=int)

    if usuario is None:
        return jsonify({"error": "Se requiere el parámetro 'usuario'"}), 400

    datos = cargar_datos()
    grafo = construir_grafo(datos["usuarios"], datos["amistades"])
    sugerencias = sugerir_amigos(grafo, usuario)

    return jsonify(sugerencias)


if __name__ == "__main__":
    app.run(debug=True, port=5000)