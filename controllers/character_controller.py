from http import HTTPStatus
from flask import Response, request, jsonify
from requests import HTTPError
from services.character_service import (
    search_characters_service,
    get_character_details_service,
)


def search_characters() -> tuple[Response, HTTPStatus]:
    """
    Search for characters based on name and optionally server
    """
    try:
        name = request.args.get("name")
        server = request.args.get("server", "").capitalize()

        if not name:
            return (
                jsonify({"success": False, "message": "Character's name is required"}),
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
                        else "No character found"
                    ),
                }
            ),
            HTTPStatus.OK,
        )

    # Serveur incorrect
    except ValueError as e:
        return jsonify({"success": False, "message": str(e)}), HTTPStatus.BAD_REQUEST

    except Exception as error:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Erreur while searching characters",
                    "error": str(error),
                }
            ),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )


def get_character_details(id) -> tuple[Response, HTTPStatus]:
    """
    Retrieves a character's details by ID.
    """
    try:
        character = get_character_details_service(id)

        return jsonify({"success": True, "character": character}), HTTPStatus.OK

    except HTTPError as e:
        return (
            jsonify({"success": False, "message": "Character not found"}),
            HTTPStatus.NOT_FOUND,
        )

    except Exception as error:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Erreur while getting character's data",
                    "error": str(error),
                }
            ),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )


def get_character_achievements(id):
    """
    Search character achievements by ID
    """
    return jsonify()
