import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';

import { FormControl, FormLabel } from '@chakra-ui/form-control';

import CharacterCard from '../components/CharacterCard.js';
import { searchCharacters } from '../services/api.js';

// Liste des serveurs FFXIV
const servers = [
  'Cerberus', 'Louisoix', 'Moogle', 'Omega', 'Phantom', 'Ragnarok', 'Sagittarius', 'Spriggan',
  'Alpha', 'Lich', 'Odin', 'Phoenix', 'Raiden', 'Shiva', 'Twintania', 'Zodiark'
];

const CharacterSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServer, setSelectedServer] = useState('');
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const inputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedValue = searchTerm.trim();

    // Vérification de la validité de l'entrée
    if (!trimmedValue || trimmedValue.length < 3) {
      // Message d'erreur adapté à la situation
      const errorMessage = !trimmedValue
        ? { title: 'Nom requis', description: 'Veuillez saisir un nom de personnage' }
        : { title: 'Nom trop court', description: 'Le nom du personnage doit contenir au moins 3 caractères' };

      toast({
        ...errorMessage,
        status: 'warning',
        duration: 2500,
        isClosable: true,
      });

      // Si l'entrée est vide (uniquement des espaces), on la vide
      if (!trimmedValue) {
        setSearchTerm("");
      }

      // Dans tous les cas, on redonne le focus
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const result = await searchCharacters(searchTerm, selectedServer);
      setCharacters(result);

      if (result.length === 0) {
        toast({
          title: 'Aucun résultat',
          description: 'Aucun personnage trouvé avec ces critères',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rechercher des personnages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterClick = (characterId) => {
    navigate(`/character/${characterId}`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6} textAlign="center">Rechercher un personnage FFXIV</Heading>

      <Box as="form" onSubmit={handleSearch} bg="gray.50" p={6} borderRadius="md" shadow="md" mb={8}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl flex="2">
            <FormLabel>Nom du personnage</FormLabel>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Entrez un nom de personnage"
              bg="white"
              ref={inputRef}
            />
          </FormControl>

          <FormControl flex="1">
            <FormLabel>Serveur (optionnel)</FormLabel>
            <Select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              placeholder="Tous les serveurs"
              bg="white"
            >
              {servers.map((server) => (
                <option key={server} value={server}>
                  {server}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl flex="0">
            <FormLabel opacity="0">Search</FormLabel>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              w="100%"
            >
              Rechercher
            </Button>
          </FormControl>
        </Flex>
      </Box>

      {characters.length > 0 && (
        <Box>
          <Heading size="md" mb={4}>Résultats de recherche ({characters.length})</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => handleCharacterClick(character.id)}
              />
            ))}
          </SimpleGrid>
        </Box>
      )}

      {!isLoading && characters.length === 0 && (
        <Box textAlign="center" p={10}>
          <Text fontSize="lg" color="gray.600">
            Entrez un nom de personnage pour commencer votre recherche
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default CharacterSearch;