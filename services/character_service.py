from requests import get, HTTPError
from bs4 import BeautifulSoup, Tag
from urllib.parse import quote
import re
from config.data_centers import DataCenters

BASE_URL = "https://fr.finalfantasyxiv.com"
LODESTONE_URL = f"{BASE_URL}/lodestone/character"


def search_characters_service(name: str, server: str = "") -> list[dict]:
    """
    Recherche des personnages en fonction du nom et optionnellement du serveur

    :param name: Nom du personnage
    :param server: Serveur spécifique (optionnel)
    :return: Liste des personnages trouvés
    """
    try:
        # Vérifier que le serveur est valide s'il est fourni
        if server and server not in DataCenters.get_all_servers():
            raise ValueError(f"Le serveur '{server}' n'existe pas. Vérifiez le nom.")

        # Construire l'URL de recherche
        search_url = f"{LODESTONE_URL}/?q={quote(name)}&worldname={quote(server)}"

        print(search_url)

        response = get(search_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        characters = []
        # Parcourir les entrées de personnages
        for entry in soup.select(".entry__link"):
            name_elem = entry.select_one(".entry__name")
            server_elem = entry.select_one(".entry__world")
            image_elem = entry.select_one(".entry__chara__face img")
            lang_elem = entry.select_one(".entry__chara__lang")

            character_url = str(entry.get("href"))
            # Extraction de l'ID à partir de l'URL
            parts = [part for part in character_url.split("/") if part]
            character_id = parts[-1] if parts else None

            # Extraction des informations du serveur et du Data Center
            character_server_text = (
                server_elem.get_text(strip=True) if server_elem else ""
            )
            server_data = character_server_text.split(" [")
            server_name = server_data[0].strip() if len(server_data) > 0 else ""
            data_center_value = (
                server_data[1].replace("]", "").strip() if len(server_data) > 1 else ""
            )

            characters.append(
                {
                    "id": character_id,
                    "name": name_elem.get_text(strip=True) if name_elem else "",
                    "server": server_name,
                    "lang": lang_elem.get_text(strip=True) if lang_elem else "",
                    "avatar": image_elem.get("src") if image_elem else "",
                    "profileUrl": f"{BASE_URL}{character_url}",
                    "dataCenter": data_center_value,
                }
            )
        return characters

    except ValueError as e:
        raise e

    except Exception as e:
        print("Erreur lors du scraping des personnages:", e)
        raise Exception(f"Échec du scraping: {str(e)}")


def get_character_details_service(character_id: int) -> dict:
    """
    Récupère les détails d'un personnage par son ID.

    :param character_id: L'ID du personnage
    :return: Dictionnaire contenant les détails du personnage
    """
    try:
        # Construire l'URL du personnage
        character_url = f"{LODESTONE_URL}/{character_id}/"
        response = get(character_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Extraction des informations de base
        name_elem = soup.select_one(".frame__chara__name")
        avatar_elem = soup.select_one(".frame__chara__face img")
        title_elem = soup.select_one(".frame__chara__title")
        portrait_elem = soup.select_one(".character__detail__image img")

        # Extraction du serveur et du Data Center
        server_info_elem = soup.select_one(".frame__chara__world")
        server_info = server_info_elem.get_text(strip=True) if server_info_elem else ""
        server_parts = server_info.split(" [")
        server = server_parts[0].strip() if len(server_parts) > 0 else ""
        data_center_value = (
            server_parts[1].replace("]", "").strip() if len(server_parts) > 1 else ""
        )

        # Extraction des informations de classes et niveaux
        jobs = []
        for li in soup.select(".character__level__list li"):
            img_elem = li.find("img")

            if isinstance(img_elem, Tag):
                job_name = img_elem.get("data-tooltip", "") if img_elem else ""
                job_img = img_elem.get("src") if img_elem else ""

            # Nettoyer le nom de la classe
            if isinstance(job_name, str) and re.search(r"[\/()]", job_name):
                job_name = re.split(r"[\/()]", job_name)[0].strip()

            job_level_text = li.get_text(strip=True)

            try:
                job_level = int(job_level_text)
            except ValueError:
                job_level = 0
            if job_name and job_level_text:
                jobs.append({"name": job_name, "level": job_level, "image": job_img})

        # Extraction des informations d'entreprise (FC)
        free_company = None
        fc_elem = soup.select_one(".character__freecompany__name a")
        if fc_elem:
            fc_name = fc_elem.get_text(strip=True)
            fc_url = str(fc_elem.get("href"))
            fc_parts = [part for part in fc_url.split("/") if part]
            fc_id = fc_parts[-1] if fc_parts else None
            free_company = {"id": fc_id, "name": fc_name, "url": f"{BASE_URL}{fc_url}"}

        # Rassembler toutes les informations
        character = {
            "id": character_id,
            "name": name_elem.get_text(strip=True) if name_elem else "",
            "title": title_elem.get_text(strip=True) if title_elem else "",
            "server": server,
            "dataCenter": data_center_value,
            "avatar": avatar_elem.get("src") if avatar_elem else "",
            "portrait": portrait_elem.get("src") if portrait_elem else "",
            "profileUrl": character_url,
            "jobs": jobs,
            "freeCompany": free_company,
        }

        return character

    except HTTPError as e:
        raise e

    except Exception as e:
        print("Erreur lors du scraping des détails du personnage:", e)
        raise Exception(f"Échec du scraping: {str(e)}")
