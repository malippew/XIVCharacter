const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController.js');

// Route pour rechercher des personnages
router.get('/search', characterController.searchCharacters);

// Route pour obtenir les détails d'un personnage
router.get('/:id', characterController.getCharacterDetails);

module.exports = router;