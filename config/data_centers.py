import json


class DataCenters:
    """
    List of Data Centers and their servers in Final Fantasy XIV, listed by region.
    """

    REGIONAL_DATA_CENTERS: dict[str, dict[str, list]] = {}

    @classmethod
    def load_data(cls) -> None:
        """Loads data from JSON file for REGIONAL_DATA_CENTERS."""
        if not cls.REGIONAL_DATA_CENTERS:
            with open("config/data_centers.json", "r", encoding="utf-8") as file:
                cls.REGIONAL_DATA_CENTERS = json.load(file)

    @classmethod
    def get_servers(cls, data_center):
        """
        Returns the list of servers in a given Data Center.
        """
        for region, centers in cls.REGIONAL_DATA_CENTERS.items():
            if data_center in centers:
                return centers[data_center]
        return []

    @classmethod
    def belongs_to_data_center(cls, server_name, data_center):
        """
        Checks if a server belongs to a given Data Center.
        """
        return server_name in cls.get_servers(data_center)

    @classmethod
    def get_all_data_centers(cls):
        """
        Returns the list of names of all Data Centers.
        """
        return [
            dc for region in cls.REGIONAL_DATA_CENTERS.values() for dc in region.keys()
        ]

    @classmethod
    def get_all_servers(cls):
        """
        Returns a unique list of all existing servers.
        """
        return [
            server
            for region in cls.REGIONAL_DATA_CENTERS.values()
            for servers in region.values()
            for server in servers
        ]

    @classmethod
    def get_regions(cls):
        """
        Returns the list of regions.
        """
        return list(cls.REGIONAL_DATA_CENTERS.keys())

    @classmethod
    def get_data_centers_by_region(cls, region):
        """
        Returns the Data Centers of a specific region.
        """
        return cls.REGIONAL_DATA_CENTERS.get(region, {})
