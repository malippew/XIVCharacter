import json


class DataCenters:
    """Liste des Data Centers et leurs serveurs dans Final Fantasy XIV, classés par région."""

    REGIONAL_DATA_CENTERS: dict[str, dict[str, list]] = {}

    @classmethod
    def load_data(cls) -> None:
        """Charge les données du fichier JSON pour REGIONAL_DATA_CENTERS."""
        if not cls.REGIONAL_DATA_CENTERS:
            with open("config/data_centers.json", "r", encoding="utf-8") as file:
                cls.REGIONAL_DATA_CENTERS = json.load(file)

    @classmethod
    def get_servers(cls, data_center):
        """Retourne la liste des serveurs d'un Data Center donné."""
        for region, centers in cls.REGIONAL_DATA_CENTERS.items():
            if data_center in centers:
                return centers[data_center]
        return []

    @classmethod
    def belongs_to_data_center(cls, server_name, data_center):
        """Vérifie si un serveur appartient à un Data Center donné."""
        return server_name in cls.get_servers(data_center)

    @classmethod
    def get_all_data_centers(cls):
        """Retourne la liste des noms de tous les Data Centers."""
        return [
            dc for region in cls.REGIONAL_DATA_CENTERS.values() for dc in region.keys()
        ]

    @classmethod
    def get_all_servers(cls):
        """Retourne une liste unique de tous les serveurs existants."""
        return [
            server
            for region in cls.REGIONAL_DATA_CENTERS.values()
            for servers in region.values()
            for server in servers
        ]

    @classmethod
    def get_regions(cls):
        """Retourne la liste des régions."""
        return list(cls.REGIONAL_DATA_CENTERS.keys())

    @classmethod
    def get_data_centers_by_region(cls, region):
        """Retourne les Data Centers d'une région spécifique."""
        return cls.REGIONAL_DATA_CENTERS.get(region, {})
