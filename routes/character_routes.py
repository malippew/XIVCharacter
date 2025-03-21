from flask import Blueprint
from controllers.character_controller import search_characters, get_character_details

character_bp: Blueprint = Blueprint("character_bp", __name__)

# Routes définies et reliées au controller
character_bp.route("/search", methods=["GET"])(search_characters)
character_bp.route("/<int:id>", methods=["GET"])(get_character_details)
