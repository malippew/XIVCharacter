import asyncio
import re
from aiohttp import ClientSession, ClientResponseError
from bs4 import BeautifulSoup, Tag
from config.data_centers import DataCenters
from flask import g
from http import HTTPStatus
from requests import get, HTTPError
from urllib.parse import quote


def search_characters_service(name: str, server: str = "") -> list[dict]:
    """
    Search for characters based on name and optionally server

    :param name: character's name
    :param server: server (optional)
    :return: Found characters
    """
    try:
        # Loading datacenters
        DataCenters.load_data()

        # Check if server is valid
        if server and server not in DataCenters.get_all_servers():
            raise ValueError(f"Server '{server}' doesn't exist. Check the name")

        # Building URL
        search_url = f"{g.base_url}/lodestone/character/?q={quote(name)}&worldname={quote(server)}"

        response = get(search_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        characters = []
        # Getting characters entries
        for entry in soup.select(".entry__link"):
            name_elem = entry.select_one(".entry__name")
            server_elem = entry.select_one(".entry__world")
            image_elem = entry.select_one(".entry__chara__face img")
            lang_elem = entry.select_one(".entry__chara__lang")

            character_url = str(entry.get("href"))
            # Extracting ID from URL
            parts = [part for part in character_url.split("/") if part]
            character_id = parts[-1] if parts else None

            # Extracting information from the server and data center
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
                    "profileUrl": f"{g.base_url}{character_url}",
                    "dataCenter": data_center_value,
                }
            )
        return characters

    except ValueError as error:
        raise error

    except Exception as error:
        print("Error while scraping characters: ", error)
        raise Exception(f"Scraping failed: {str(error)}")


def get_character_details_service(character_id: int) -> dict:
    """
    Retrieves a character's details by ID.

    :param character_id: character's ID
    :return: Dictionary containing character details
    """
    try:
        # Building URL
        character_url = f"{g.base_url}/lodestone/character/{character_id}/"
        response = get(character_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Extracting basic information
        name_elem = soup.select_one(".frame__chara__name")
        avatar_elem = soup.select_one(".frame__chara__face img")
        title_elem = soup.select_one(".frame__chara__title")
        portrait_elem = soup.select_one(".character__detail__image img")

        # Extraction of the server and the data center
        server_info_elem = soup.select_one(".frame__chara__world")
        server_info = server_info_elem.get_text(strip=True) if server_info_elem else ""
        server_parts = server_info.split(" [")
        server = server_parts[0].strip() if len(server_parts) > 0 else ""
        data_center_value = (
            server_parts[1].replace("]", "").strip() if len(server_parts) > 1 else ""
        )

        # Extracting class and level information
        jobs = []
        for li in soup.select(".character__level__list li"):
            img_elem = li.find("img")

            if isinstance(img_elem, Tag):
                job_name = img_elem.get("data-tooltip", "") if img_elem else ""
                job_img = img_elem.get("src") if img_elem else ""

            # Clean up the class name
            if isinstance(job_name, str) and re.search(r"[\/()]", job_name):
                job_name = re.split(r"[\/()]", job_name)[0].strip()

            job_level_text = li.get_text(strip=True)

            try:
                job_level = int(job_level_text)
            except ValueError:
                job_level = 0
            if job_name and job_level_text:
                jobs.append({"name": job_name, "level": job_level, "image": job_img})

        # Extracting free company information (FC)
        free_company = None
        fc_elem = soup.select_one(".character__freecompany__name a")
        if fc_elem:
            fc_name = fc_elem.get_text(strip=True)
            fc_url = str(fc_elem.get("href"))
            fc_parts = [part for part in fc_url.split("/") if part]
            fc_id = fc_parts[-1] if fc_parts else None
            free_company = {
                "id": fc_id,
                "name": fc_name,
                "url": f"{g.base_url}{fc_url}",
            }

        # Gather all the information
        character = {
            "id": character_id,
            "name": name_elem.get_text(strip=True) if name_elem else "",
            "title": title_elem.get_text(strip=True) if title_elem else "",
            "server": server,
            "dataCenter": data_center_value,
            "avatar": avatar_elem.get("src") if avatar_elem else "",
            "portrait": portrait_elem.get("src") if portrait_elem else "",
            "profileUrl": character_url,
            "freeCompany": free_company,
            "jobs": jobs,
        }

        return character

    except HTTPError as error:
        raise error

    except Exception as error:
        print("Error while scraping characters: ", error)
        raise Exception(f"Scraping failed: {str(error)}")


async def get_character_achievements_service(character_id: int) -> dict:
    """
    Search character achievements by ID

    :param character_id: character's ID
    :return: Dictionary containing character details
    """
    try:
        # Building URL
        character_achievements_url = (
            f"{g.base_url}/lodestone/character/{character_id}/achievement"
        )

        async with ClientSession() as session:
            response = await fetch(session, character_achievements_url)

            if response:
                soup = BeautifulSoup(response, "html.parser")

            achievements = {}

            # Récupération des catégories principales
            category_elements = soup.select("nav.achievement__category dt")[1:]

            # Lancement de toutes les requêtes pour récupérer les sous-catégories en parallèle
            tasks = []
            for entry_category_achievement in category_elements:
                category_elem = entry_category_achievement.select_one("a")
                if category_elem:
                    category_name = category_elem.get_text(strip=True)
                    category_urlArray = str(category_elem["href"]).split("/")
                    category_url = "/" + "/".join(category_urlArray[-3:])
                    category_fullUrl = f"{character_achievements_url}{category_url}"

                    # Ajout des tâches pour récupérer les sous-catégories
                    tasks.append(
                        get_character_achievements_subcategories(
                            session, category_fullUrl, category_name
                        )
                    )

            results = await asyncio.gather(*tasks)

            # Fusion des résultats
            for category_name, subcategories in results:
                achievements[category_name] = subcategories

            return achievements

    except ClientResponseError as error:
        raise error

    except Exception as error:
        print(error.__class__)
        print("Error while scraping character's achievements: ", error)
        raise Exception(f"Scraping failed: {str(error)}")


async def get_character_achievements_subcategories(
    session, subCategory_url: str, category_name: str
):
    """
    Fetch subcategories asynchronously
    """
    response = await fetch(session, subCategory_url)
    if response:
        soup = BeautifulSoup(response, "html.parser")

    subCategories = {}

    for entry_category_achievement in soup.select(
        "nav.achievement__category .btn__category__list li"
    ):
        subcategory_elem = entry_category_achievement.select_one("a")
        if subcategory_elem:
            subcategory_name = subcategory_elem.get_text(strip=True)
            subCategories[subcategory_name] = []

    return category_name, subCategories


async def fetch(session, url):
    async with session.get(url) as response:
        if response.status == HTTPStatus.OK:
            return await response.text()
        else:
            response.raise_for_status()
