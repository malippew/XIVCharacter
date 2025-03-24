import asyncio
from aiohttp import ClientResponseError
from flask import Response, request, jsonify
from http import HTTPStatus
from requests import HTTPError
from services.character_service import (
    search_characters_service,
    get_character_details_service,
    get_character_achievements_service,
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
    except ValueError as error:
        return (
            jsonify({"success": False, "message": str(error)}),
            HTTPStatus.BAD_REQUEST,
        )

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


def get_character_details(id: int) -> tuple[Response, HTTPStatus]:
    """
    Retrieves a character's details by ID.
    """
    try:
        character = get_character_details_service(id)

        return jsonify({"success": True, "character": character}), HTTPStatus.OK

    except HTTPError as error:
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


def get_character_achievements(id: int) -> tuple[Response, HTTPStatus]:
    """
    Search character achievements by ID
    """
    try:
        achievements = asyncio.run(get_character_achievements_service(id))

        return (
            jsonify(
                {"success": True, "character_id": id, "achievements": achievements}
            ),
            HTTPStatus.OK,
        )

    except ClientResponseError as error:
        if error.status == HTTPStatus.FORBIDDEN:
            message = "This character has their achievements private"
            status = HTTPStatus.FORBIDDEN
        else:
            message = "Character not found"
            status = HTTPStatus.NOT_FOUND

        return jsonify({"success": False, "message": message}), status

    except Exception as error:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Erreur while getting character's achivements",
                    "error": str(error),
                }
            ),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )
