class DataCenters:
    """Liste des Data Centers et leurs serveurs dans Final Fantasy XIV, classés par région."""

    REGIONAL_DATA_CENTERS = {
        "North America": {
            "Aether": [
                "Adamantoise",
                "Cactuar",
                "Faerie",
                "Gilgamesh",
                "Jenova",
                "Midgardsormr",
                "Sargatanas",
                "Siren",
            ],
            "Primal": [
                "Behemoth",
                "Excalibur",
                "Exodus",
                "Famfrit",
                "Hyperion",
                "Lamia",
                "Leviathan",
                "Ultros",
            ],
            "Crystal": [
                "Balmung",
                "Brynhildr",
                "Coeurl",
                "Diabolos",
                "Goblin",
                "Malboro",
                "Mateus",
                "Zalera",
            ],
            "Dynamis": ["Halicarnassus", "Maduin", "Marilith", "Seraph"],
        },
        "Europe": {
            "Chaos": [
                "Cerberus",
                "Louisoix",
                "Moogle",
                "Omega",
                "Phantom",
                "Ragnarok",
                "Sagittarius",
                "Spriggan",
            ],
            "Light": [
                "Alpha",
                "Lich",
                "Odin",
                "Phoenix",
                "Raiden",
                "Shiva",
                "Twintania",
                "Zodiark",
            ],
        },
        "Japan": {
            "Elemental": [
                "Aegis",
                "Atomos",
                "Carbuncle",
                "Garuda",
                "Gungnir",
                "Kujata",
                "Ramuh",
                "Tonberry",
                "Typhon",
                "Unicorn",
            ],
            "Gaia": [
                "Alexander",
                "Bahamut",
                "Durandal",
                "Fenrir",
                "Ifrit",
                "Ridill",
                "Tiamat",
                "Ultima",
                "Valefor",
                "Yojimbo",
                "Zeromus",
            ],
            "Mana": [
                "Anima",
                "Asura",
                "Belias",
                "Chocobo",
                "Hades",
                "Ixion",
                "Mandragora",
                "Masamune",
                "Pandaemonium",
                "Shinryu",
                "Titan",
            ],
            "Meteor": ["Bismarck", "Ravana", "Sephirot", "Sophia", "Zurvan"],
        },
        "Oceania": {"Materia": ["Bismarck", "Ravana", "Sephirot", "Sophia", "Zurvan"]},
    }

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
