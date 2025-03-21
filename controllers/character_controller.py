from flask import Response, request, jsonify
from requests import HTTPError
from services.character_service import (
    search_characters_service,
    get_character_details_service,
)


def search_characters() -> tuple[Response, int]:
    try:
        name = request.args.get("name")
        server = request.args.get("server", "").capitalize()

        if not name:
            return (
                jsonify(
                    {"success": False, "message": "Le nom du personnage est requis"}
                ),
                400,
            )

        characters = search_characters_service(name, server)

        return (
            jsonify(
                {
                    "success": True,
                    "numberOfCharacters": len(characters),
                    "characters": (
                        sorted(characters, key=lambda char: char["name"])
                        if len(characters) > 0
                        else "Aucun personnage trouvé"
                    ),
                }
            ),
            200,
        )

    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), 400

    except Exception as error:
        print("Erreur lors de la recherche des personnages:", error)
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Erreur lors de la recherche des personnages",
                    "error": str(error),
                }
            ),
            500,
        )


def get_character_details(id) -> tuple[Response, int]:
    try:
        if not id:
            return (
                jsonify({"success": False, "message": "L'ID du personnage est requis"}),
                400,
            )

        character = get_character_details_service(id)

        return jsonify({"success": True, "character": character}), 200

    except HTTPError as e:
        return jsonify({"success": False, "message": "Ce personnage n'existe pas"}), 400

    except Exception as error:
        print("Erreur lors de la récupération des détails du personnage:", error)
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Erreur lors de la récupération des détails du personnage",
                    "error": str(error),
                }
            ),
            500,
        )
