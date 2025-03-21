from flask import Flask
from flask_cors import CORS
from routes.character_routes import character_bp
from flask import render_template

# Initialisation de l'application Flask
app: Flask = Flask(__name__)
CORS(app)

# Enregistrement du blueprint pour les personnages
app.register_blueprint(character_bp, url_prefix="/api/characters")


# Gérer l'erreur 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
