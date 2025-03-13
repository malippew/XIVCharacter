const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://fr.finalfantasyxiv.com';
const LODESTONE_URL = `${BASE_URL}/lodestone/character`;

// Structure des Data Centers et leurs serveurs
const dataCenters = {
  'Chaos': [
    'Cerberus', 'Louisoix', 'Moogle', 'Omega', 
    'Phantom', 'Ragnarok', 'Sagittarius', 'Spriggan'
  ],
  'Light': [
    'Alpha', 'Lich', 'Odin', 'Phoenix', 
    'Raiden', 'Shiva', 'Twintania', 'Zodiark'
  ]
};

/**
 * Recherche des personnages en fonction du nom et, optionnellement, du serveur ou du Data Center
 * @param {string} name - Nom du personnage
 * @param {string} server - Serveur spécifique (optionnel)
 * @param {string} dataCenter - Data Center (optionnel)
 * @returns {Promise<Array>} - Liste des personnages trouvés
 */
exports.searchCharacters = async (name, server = '', dataCenter = '') => {

  try {
    // Construire l'URL de recherche
    let searchUrl = `${LODESTONE_URL}/?q=${encodeURIComponent(name)}`;
    
    // Si un serveur spécifique est fourni, l'ajouter à l'URL de recherche
    if (server) {
      searchUrl += `&worldname=${encodeURIComponent(server)}`;
    }
    
    // Si un Data Center spécifique est fourni, l'ajouter à l'URL de recherche
    if (dataCenter) {
      searchUrl += `&dataCenter=${encodeURIComponent(dataCenter)}`;
    }
    // Effectuer la requête
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);

    // Récupérer la liste des personnages
    let characters = [];
    
    $('.entry__link').each((i, element) => {
      const $element = $(element);
      const $characterName = $element.find('.entry__name');
      const $characterServer = $element.find('.entry__world');
      const $characterImage = $element.find('.entry__chara__face img');
      
      // Extraire l'ID depuis l'URL
      const characterUrl = $element.attr('href');
      const characterId = characterUrl.split('/').filter(Boolean).pop();
      const characterServerName = $characterServer.text().trim();

      const [server, dataCenter] = characterServerName.split(" [").map(part => part.replace("]", "").trim());
      
      characters.push({
        id: characterId,
        name: $characterName.text().trim(),
        server: server,
        avatar: $characterImage.attr('src'),
        profileUrl: `${BASE_URL}${characterUrl}`,
        dataCenter: dataCenter
      });
    });
    
    // Si un Data Center est fourni, filtrer les résultats par Data Center
    if (dataCenter && !server) {
      characters = characters.filter(character => 
        character.dataCenter === dataCenter || 
        serverBelongsToDataCenter(character.server, dataCenter)
      );
    }
    
    return characters;
  } catch (error) {
    console.error('Erreur lors du scraping des personnages:', error);
    throw new Error(`Échec du scraping: ${error.message}`);
  }
};

/**
 * Détermine à quel Data Center appartient un serveur
 * @param {string} serverName - Nom du serveur
 * @returns {string} - Nom du Data Center, ou chaîne vide si non trouvé
 */
function getDataCenterByServer(serverName) {
  for (const [dataCenter, servers] of Object.entries(dataCenters)) {
    if (servers.includes(serverName)) {
      return dataCenter;
    }
  }
  return '';
}

/**
 * Vérifie si un serveur appartient à un Data Center
 * @param {string} serverName - Nom du serveur
 * @param {string} dataCenterName - Nom du Data Center
 * @returns {boolean} - true si le serveur appartient au Data Center
 */
function serverBelongsToDataCenter(serverName, dataCenterName) {
  return dataCenters[dataCenterName] && dataCenters[dataCenterName].includes(serverName);
}

exports.getCharacterDetails = async (id) => {
  try {
    // Construire l'URL du personnage
    const characterUrl = `${LODESTONE_URL}/${id}/`;
    
    // Effectuer la requête
    const response = await axios.get(characterUrl);
    const $ = cheerio.load(response.data);
    
    // Extraire les informations de base
    const name = $('.frame__chara__name').text().trim();
    const avatar = $('.frame__chara__face img').attr('src');
    const title = $('.frame__chara__title').text().trim();
    const portrait = $('.character__detail__image img').attr('src');
    
    // Extraire le serveur et le data center
    const serverInfo = $('.frame__chara__world').text().trim();
    const [server, dataCenter] = serverInfo.split(' [');
    
    // Extraire les informations de classe et niveau
    const jobs = [];
    
    $('.character__level__list li').each((i, element) => {
      const $element = $(element);
      const jobName = $element.find('img').attr('data-tooltip');
      const jobLevel = $element.text().trim()
      
      if (jobName && jobLevel) {
        jobs.push({
          name: jobName,
          level: parseInt(jobLevel, 10) || 0
        });
      }


    });
    
    // Extraire les informations d'entreprise (FC)
    let freeCompany = null;
    const fcElement = $('.character__freecompany__name a');
    
    if (fcElement.length > 0) {
      const fcName = fcElement.text().trim();
      const fcUrl = fcElement.attr('href');
      const fcId = fcUrl.split('/').filter(Boolean).pop();
      
      freeCompany = {
        id: fcId,
        name: fcName,
        url: `${BASE_URL}${fcUrl}`
      };
    }
    
    // Rassembler toutes les informations
    const character = {
      id,
      name,
      title,
      server: server,
      dataCenter: dataCenter ? dataCenter.replace(']', '') : '',
      avatar,
      portrait,
      profileUrl: characterUrl,
      jobs,
      freeCompany
    };
    
    return character;
  } catch (error) {
    console.error('Erreur lors du scraping des détails du personnage:', error);
    throw new Error(`Échec du scraping: ${error.message}`);
  }
};