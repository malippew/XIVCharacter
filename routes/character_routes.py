from flask import Blueprint
from controllers.character_controller import search_characters, get_character_details, get_character_achievements

character_bp: Blueprint = Blueprint("character_bp", __name__)

### Routes ###

# Recherche des personnages en fonction du nom et optionnellement du serveur
character_bp.route("/search", methods=["GET"])(search_characters) 

# Récupère les détails d'un personnage par son ID.
character_bp.route("/<int:id>", methods=["GET"])(get_character_details)

# Recherche des hauts faits du personnage par son ID
character_bp.route("/<int:id>/achievement", methods=["GET"])(get_character_achievements)