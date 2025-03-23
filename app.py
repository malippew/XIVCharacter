from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.character_routes import character_bp
from flask import render_template
import os

# Initialisation de l'application Flask
app: Flask = Flask(__name__)
CORS(app)

# Enregistrement du blueprint pour les personnages
app.register_blueprint(character_bp, url_prefix="/api/characters")

# Clé des réponses JSON non triées
app.json.sort_keys = False # type: ignore

# Gérer l'erreur 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
