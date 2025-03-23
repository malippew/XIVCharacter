from flask import Flask, jsonify, send_from_directory, request, g
from flask_cors import CORS
from routes.character_routes import character_bp
import os

app: Flask = Flask(__name__)
CORS(app)

# Character's blueprint
app.register_blueprint(character_bp, url_prefix="/api/characters")

# ignoring JSON keys default sorting
app.json.sort_keys = False  # type: ignore

# Allowed languages and default language
LANGS = {"fr", "eu", "na", "de", "jp"}
DEFAULT_LANG = "eu"


@app.before_request
def set_global_lang():
    lang = request.args.get("lang", DEFAULT_LANG)

    # default language is eu (english)
    if lang not in LANGS:
        lang = DEFAULT_LANG
    g.lang = lang
    g.base_url = f"https://{g.lang}.finalfantasyxiv.com"


# Handler 404
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"status": 404, "error": "Not found"})


# Favicon
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"), "favicon.ico")


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
