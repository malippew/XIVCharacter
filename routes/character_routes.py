from flask import Blueprint
from controllers.character_controller import (
    search_characters,
    get_character_details,
    get_character_achievements,
)

character_bp: Blueprint = Blueprint("character_bp", __name__)

### Routes ###

# Search for characters based on name and optionally server
character_bp.route("/search", methods=["GET"])(search_characters)

# Retrieves a character's details by ID.
character_bp.route("/<int:id>", methods=["GET"])(get_character_details)

# Search character achievements by ID
character_bp.route("/<int:id>/achievement", methods=["GET"])(get_character_achievements)
