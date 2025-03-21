from http import HTTPStatus
from flask import Response, request, jsonify
from requests import HTTPError
from services.character_service import (
    search_characters_service,
    get_character_details_service,
)


def search_characters() -> tuple[Response, HTTPStatus]:
    """
    Recherche des personnages en fonction du nom et optionnellement du serveur
    """
    try:
        name = request.args.get("name")
        server = request.args.get("server", "").capitalize()

        if not name:
            return (
                jsonify(
                    {"success": False, "message": "Le nom du personnage est requis"}
                ),
                HTTPStatus.BAD_REQUEST,
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
            HTTPStatus.OK,
        )

    # Serveur incorrect
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), HTTPStatus.BAD_REQUEST

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
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )


def get_character_details(id) -> tuple[Response, HTTPStatus]:
    """
    Récupère les détails d'un personnage par son ID.
    """
    try:
        character = get_character_details_service(id)

        return jsonify({"success": True, "character": character}), HTTPStatus.OK

    except HTTPError as e:
        return jsonify({"success": False, "message": "Ce personnage n'existe pas"}), HTTPStatus.BAD_REQUEST

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
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )


def get_character_achievements(id):
    """
    Recherche des hauts faits du personnage par son ID
    """
    return jsonify()