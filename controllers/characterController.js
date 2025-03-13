const characterService = require('../services/characterService.js');

exports.searchCharacters = async (req, res) => {
  try {
    const { name, server, dataCenter } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du personnage est requis'
      });
    }

    const capitalizeFirstLetter = (str) => 
      str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
    
    const characters = await characterService.searchCharacters(name, capitalizeFirstLetter(server), capitalizeFirstLetter(dataCenter));
    
    res.status(200).json({
      success: true,
      numberOfCharacters: characters.length,
      characters: characters.sort((a, b) => a.name.localeCompare(b.name)) // tri des personnages par nom alphabétique
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des personnages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des personnages',
      error: error.message
    });
  }
};

exports.getCharacterDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'L\'ID du personnage est requis'
      });
    }
    
    const character = await characterService.getCharacterDetails(id);
    
    res.status(200).json({
      success: true,
      character: character
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du personnage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du personnage',
      error: error.message
    });
  }
};