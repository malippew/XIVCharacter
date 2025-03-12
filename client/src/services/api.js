// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configuration de base pour axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Recherche des personnages par nom et serveur optionnel
 */
export const searchCharacters = async (name, server = '') => {
  try {
    const params = { name };
    
    if (server) {
      params.server = server;
    }
    
    const response = await api.get('/characters/search', { params });
    
    if (response.data.success) {
      return response.data.characters;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la recherche');
    }
  } catch (error) {
    console.error('Erreur API searchCharacters:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'un personnage par son ID
 */
export const getCharacterDetails = async (id) => {
  try {
    const response = await api.get(`/characters/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erreur lors de la récupération des détails');
    }
  } catch (error) {
    console.error('Erreur API getCharacterDetails:', error);
    throw error;
  }
};

export default api;