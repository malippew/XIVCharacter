import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FormControl, FormLabel } from '@chakra-ui/form-control';

import CharacterCard from '../components/CharacterCard.js';
import { searchCharacters } from '../services/api/back.js';

// Structure des Data Centers et serveurs FFXIV
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

const CharacterSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDataCenter, setSelectedDataCenter] = useState('');
  const [selectedServer, setSelectedServer] = useState('');
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const inputRef = useRef(null);

  // Reset le serveur sélectionné quand le data center change
  const handleDataCenterChange = (dataCenter) => {
    setSelectedDataCenter(dataCenter);
    setSelectedServer('');
  };

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
        colorScheme: 'red',
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
      const result = await searchCharacters(searchTerm, selectedServer, selectedDataCenter);
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
      <Heading
        mb={6}
        textAlign="center"
        size="xl"
        color="ffxiv.gold"
        textShadow="1px 1px 2px rgba(0,0,0,0.8)"
      >
        Rechercher un personnage FFXIV
      </Heading>

      <Box
        as="form"
        onSubmit={handleSearch}
        bg="ffxiv.darkGray"
        p={6}
        borderRadius="2px"
        borderWidth="1px"
        borderColor="ffxiv.gold"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        mb={8}
      >
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} wrap="wrap">
          <FormControl flex={{ base: '100%', md: '2' }}>
            <FormLabel color="ffxiv.lightGray">Nom du personnage</FormLabel>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Entrez un nom de personnage"
              bg="ffxiv.black"
              color="ffxiv.white"
              borderColor="ffxiv.mediumGray"
              _hover={{ borderColor: "ffxiv.gold" }}
              _focus={{ borderColor: "ffxiv.gold", boxShadow: "0 0 0 1px #E7BD69" }}
              ref={inputRef}
            />
          </FormControl>

          <FormControl flex={{ base: '100%', md: '1' }}>
            <FormLabel color="ffxiv.lightGray">Centre de données</FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="ffxiv.black"
                color="ffxiv.white"
                borderColor="ffxiv.mediumGray"
                borderWidth="1px"
                _hover={{ borderColor: "ffxiv.gold" }}
                _expanded={{
                  borderColor: "ffxiv.gold",
                  boxShadow: "0 0 0 1px #E7BD69",
                  bg: "ffxiv.darkGray"
                }}
                _active={{
                  bg: "ffxiv.darkGray"
                }}
                iconcolor="ffxiv.gold"
                width="100%"
                textAlign="left"
                justifyContent="space-between"
              >
                {selectedDataCenter || "Tous les Data Centers"}
              </MenuButton>
              <MenuList
                bg="ffxiv.darkGray"
                borderColor="ffxiv.gold"
                _focus={{ outline: "none" }}
              >
                <MenuItem
                  onClick={() => handleDataCenterChange("")}
                  bg="ffxiv.darkGray"
                  color="ffxiv.white"
                  _hover={{ bg: "ffxiv.darkBlue" }}
                >
                  Tous les Data Centers
                </MenuItem>
                {Object.keys(dataCenters).map((dataCenter) => (
                  <MenuItem
                    key={dataCenter}
                    onClick={() => handleDataCenterChange(dataCenter)}
                    bg="ffxiv.darkGray"
                    color="ffxiv.white"
                    _hover={{ bg: "ffxiv.darkBlue" }}
                  >
                    {dataCenter}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>

          <FormControl flex={{ base: '100%', md: '1' }}>
            <FormLabel color="ffxiv.lightGray">Serveur (optionnel)</FormLabel>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="ffxiv.black"
                color="ffxiv.white"
                borderColor="ffxiv.mediumGray"
                borderWidth="1px"
                _hover={{ borderColor: "ffxiv.gold" }}
                _expanded={{
                  borderColor: "ffxiv.gold",
                  boxShadow: "0 0 0 1px #E7BD69",
                  bg: "ffxiv.darkGray"
                }}
                _active={{
                  bg: "ffxiv.darkGray"
                }}
                iconcolor="ffxiv.gold"
                width="100%"
                textAlign="left"
                justifyContent="space-between"
                isDisabled={!selectedDataCenter}
              >
                {selectedServer || (selectedDataCenter ? "Tous les serveurs" : "Sélectionnez un Data Center")}
              </MenuButton>
              <MenuList
                bg="ffxiv.darkGray"
                borderColor="ffxiv.gold"
                _focus={{ outline: "none" }}
              >
                {selectedDataCenter && (
                  <>
                    <MenuItem
                      onClick={() => setSelectedServer("")}
                      bg="ffxiv.darkGray"
                      color="ffxiv.white"
                      _hover={{ bg: "ffxiv.darkBlue" }}
                    >
                      Tous les serveurs
                    </MenuItem>
                    {dataCenters[selectedDataCenter].map((server) => (
                      <MenuItem
                        key={server}
                        onClick={() => setSelectedServer(server)}
                        bg="ffxiv.darkGray"
                        color="ffxiv.white"
                        _hover={{ bg: "ffxiv.darkBlue" }}
                      >
                        {server}
                      </MenuItem>
                    ))}
                  </>
                )}
              </MenuList>
            </Menu>
          </FormControl>

          <FormControl flex={{ base: '100%', md: 'auto' }}>
            <FormLabel opacity="0" color="ffxiv.lightGray">Search</FormLabel>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              w="100%"
              _hover={{
                bg: 'ffxiv.darkGold',
                color: 'ffxiv.white',
              }}
              loadingText="Recherche..."
            >
              Rechercher
            </Button>
          </FormControl>
        </Flex>
      </Box>

      {characters.length > 0 && (
        <Box>
          <Heading
            size="md"
            mb={4}
            color="ffxiv.gold"
            borderBottom="1px solid"
            borderColor="ffxiv.darkGold"
            pb={2}
          >
            Résultats de recherche ({characters.length})
          </Heading>
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
        <Box
          textAlign="center"
          p={10}
          borderWidth="1px"
          borderRadius="2px"
          borderColor="ffxiv.mediumGray"
          bg="ffxiv.darkGray"
          opacity={0.8}
        >
          <Text fontSize="lg" color="ffxiv.lightGray">
            Entrez un nom de personnage pour commencer votre recherche
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default CharacterSearch;