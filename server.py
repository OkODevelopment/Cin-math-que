from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Activer CORS pour toutes les routes

MOVIES_FILE = "movies.json"  # Chemin vers le fichier JSON

# Endpoint pour récupérer les films
@app.route("/movies", methods=["GET"])
def get_movies():
    if os.path.exists(MOVIES_FILE):
        with open(MOVIES_FILE, "r") as file:
            movies = json.load(file)
        return jsonify(movies), 200
    return jsonify([]), 200

@app.route("/movies", methods=["POST"])
def add_movie():
    new_movie = request.json

    # Ajoutez un ID unique si absent
    if not new_movie.get("id"):
        new_movie["id"] = hex(int.from_bytes(os.urandom(4), "big"))

    # Charger les films existants
    movies = []
    if os.path.exists(MOVIES_FILE):
        with open(MOVIES_FILE, "r") as file:
            movies = json.load(file)

    # Ajouter le nouveau film
    movies.append(new_movie)

    # Écrire dans le fichier JSON
    with open(MOVIES_FILE, "w") as file:
        json.dump(movies, file, indent=2)

    return jsonify(new_movie), 201

@app.route("/movies/<id>", methods=["PUT"])
def update_movie(id):
    updated_movie = request.json
    if not updated_movie.get("title") or not isinstance(updated_movie.get("rating"), int):
        return jsonify({"error": "Invalid data"}), 400

    if os.path.exists(MOVIES_FILE):
        with open(MOVIES_FILE, "r") as file:
            movies = json.load(file)

        # Trouver le film correspondant à l'ID
        for movie in movies:
            if movie["id"] == id:
                movie.update(updated_movie)  # Mise à jour des champs
                with open(MOVIES_FILE, "w") as file:
                    json.dump(movies, file, indent=2)
                return jsonify(movie), 200

    return jsonify({"error": "Movie not found"}), 404


@app.route("/movies/<id>", methods=["DELETE"])
def delete_movie(id):
    if os.path.exists(MOVIES_FILE):
        with open(MOVIES_FILE, "r") as file:
            movies = json.load(file)

        # Rechercher le film par ID
        updated_movies = [movie for movie in movies if movie["id"] != id]

        # Si le nombre de films reste le même, cela signifie que le film n'existe pas
        if len(updated_movies) == len(movies):
            return jsonify({"error": "Film non trouvé"}), 404

        # Écrire les films restants dans le fichier
        with open(MOVIES_FILE, "w") as file:
            json.dump(updated_movies, file, indent=2)
        return jsonify({"message": "Film supprimé avec succès"}), 200

    return jsonify({"error": "Fichier des films non trouvé"}), 404


@app.route("/wishlist", methods=["POST"])
def add_to_wishlist():
    new_movie = request.json
    if not new_movie.get("id") or not new_movie.get("title") or not isinstance(new_movie.get("rating"), int):
        return jsonify({"error": "Invalid data"}), 400

    # Chemin du fichier wishlist.json
    WISHLIST_FILE = "wishlist.json"

    # Charger la wishlist existante
    wishlist = []
    if os.path.exists(WISHLIST_FILE):
        with open(WISHLIST_FILE, "r") as file:
            wishlist = json.load(file)

    # Vérifier si le film existe déjà dans la wishlist
    existing_movie = next((movie for movie in wishlist if movie["id"] == new_movie["id"]), None)

    if existing_movie:
        # Vérifiez les différences entre les deux films
        if existing_movie == new_movie:
            return jsonify({"message": "Le film existe déjà dans la wishlist sans modification."}), 200
        else:
            # Mettre à jour les informations existantes
            for key in new_movie:
                existing_movie[key] = new_movie[key]
            with open(WISHLIST_FILE, "w") as file:
                json.dump(wishlist, file, indent=2)
            return jsonify({"message": "Le film a été mis à jour dans la wishlist.", "movie": new_movie}), 200

    # Ajouter le nouveau film à la wishlist
    wishlist.append(new_movie)
    with open(WISHLIST_FILE, "w") as file:
        json.dump(wishlist, file, indent=2)

    return jsonify({"message": "Le film a été ajouté à la wishlist.", "movie": new_movie}), 201


@app.route("/wishlist", methods=["GET"])
def get_wishlist():
    # Chemin du fichier wishlist.json
    WISHLIST_FILE = "wishlist.json"

    # Vérifiez si le fichier existe et chargez son contenu
    if os.path.exists(WISHLIST_FILE):
        with open(WISHLIST_FILE, "r") as file:
            wishlist = json.load(file)
        return jsonify(wishlist), 200

    # Si le fichier n'existe pas, retournez une liste vide
    return jsonify([]), 200

@app.route("/wishlist/<id>", methods=["DELETE"])
def delete_from_wishlist(id):
    WISHLIST_FILE = "wishlist.json"

    if os.path.exists(WISHLIST_FILE):
        with open(WISHLIST_FILE, "r") as file:
            wishlist = json.load(file)

        updated_wishlist = [movie for movie in wishlist if movie["id"] != id]

        # Si aucun changement, cela signifie que le film n'existe pas
        if len(updated_wishlist) == len(wishlist):
            return jsonify({"error": "Film non trouvé dans la wishlist"}), 404

        # Écrire la nouvelle wishlist
        with open(WISHLIST_FILE, "w") as file:
            json.dump(updated_wishlist, file, indent=2)
        return jsonify({"message": "Film supprimé de la wishlist"}), 200

    return jsonify({"error": "Fichier wishlist.json non trouvé"}), 404



if __name__ == "__main__":
    app.run(debug=True)
