const characterService = require('../services/characterService.js');

exports.searchCharacters = async (req, res) => {
  try {
    const { name, server } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du personnage est requis'
      });
    }
    
    const characters = await characterService.searchCharacters(name, server);
    
    res.status(200).json({
      success: true,
      numberOfCharacters: characters.length,
      characters: characters
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