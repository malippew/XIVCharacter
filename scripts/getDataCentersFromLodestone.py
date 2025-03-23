from bs4 import BeautifulSoup
from requests import get
import json
import sys


def getDataCentersFromLodestone() -> None:
    """
    Find the list of all regions with their respective data centers and associated servers
    """
    try:
        # Building URL
        search_url = f"{WORLDSTATUS_URL}"

        response = get(search_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        regionalDataCenters: dict = {}

        # Getting regions
        for entry in soup.select(".world__tab li"):
            region_id = entry.get("data-region")
            region_elem = entry.select_one("span")
            region = region_elem.get_text(strip=True) if region_elem else ""

            regionalDataCenters[region] = {}

            # Getting data centers
            for dc_entry in soup.select("ul.world-dcgroup > li"):
                parent_container = (
                    dc_entry.parent.parent.parent
                    if dc_entry.parent
                    and dc_entry.parent.parent
                    and dc_entry.parent.parent.parent
                    else None
                )
                dataCenter_id = (
                    parent_container.get("data-region") if parent_container else None
                )

                if dataCenter_id == region_id:
                    dataCenter_elem = dc_entry.select_one("h2")
                    dataCenter = (
                        dataCenter_elem.get_text(strip=True) if dataCenter_elem else ""
                    )
                    regionalDataCenters[region][dataCenter] = []

                    # Getting servers
                    dc_servers = dc_entry.select(".world-list__world_name")
                    for server_entry in dc_servers:
                        server_elem = server_entry.select_one("p")
                        server = server_elem.get_text(strip=True) if server_elem else ""
                        regionalDataCenters[region][dataCenter].append(server)

        with open("config/data_centers.json", "w", encoding="utf-8") as file:
            json.dump(regionalDataCenters, file, ensure_ascii=False, indent=4)

    except Exception as e:
        print("Erreur lors du scraping des datacenters:", e)
        raise Exception(f"Échec du scraping: {str(e)}")


if __name__ == "__main__":
    langs = ["fr", "eu", "na", "de", "jp"]

    # Default language, english
    if len(sys.argv) == 1:
        lang = "eu"
    elif sys.argv[1] not in langs or len(sys.argv) != 2:
        print("Usage: python scripts/getDataCentersFromLodestone.py <lang>")
        print("Lang accepted: fr, eu, na, de, jp")
        exit(-1)
    else:
        lang = sys.argv[1]

    BASE_URL = f"https://{lang}.finalfantasyxiv.com"
    WORLDSTATUS_URL = f"{BASE_URL}/lodestone/worldstatus"

    getDataCentersFromLodestone()
