import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Flex,
  Spinner,
  VStack,
  Badge,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { searchMounts } from '../services/api/xivCollect.js';

const MountsPage = () => {
  const { characterId } = useParams();
  const [mounts, setMounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  
  useEffect(() => {
    const fetchMounts = async () => {
      setIsLoading(true);
      try {
        const data = await searchMounts();
        setMounts(data);
      } catch (error) {
        console.error('Erreur lors du chargement des montures:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la liste des montures',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMounts();
  }, [toast]);

  // Filter mounts based on search term
  const filteredMounts = mounts.filter(mount => 
    mount.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Back button to character details */}
      <Button
        as={RouterLink}
        to={`/character/${characterId}`}
        leftIcon={<ChevronLeftIcon />}
        mb={6}
        size="sm"
        variant="outline"
        colorScheme="blue"
      >
        Retour au personnage
      </Button>
      
      <Heading mb={6}>Montures FFXIV</Heading>
      
      {/* Search bar */}
      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input 
            placeholder="Rechercher une monture..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderRadius="md"
          />
        </InputGroup>
      </Box>
      
      {/* Mount grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
        {filteredMounts.map(mount => (
          <Box 
            key={mount.id} 
            bg="white" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-5px)' }}
          >
            <Image 
              src={mount.image} 
              alt={mount.name}
              h="200px"
              w="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/200?text=Image+non+disponible"
            />
            <VStack align="start" p={4} spacing={2}>
              <Heading size="md">{mount.name}</Heading>
              <Text noOfLines={2} color="gray.600" fontSize="sm">
                {mount.description || "Aucune description disponible"}
              </Text>
              <Flex wrap="wrap" gap={2} mt={2}>
                <Badge colorScheme="purple">{mount.movement}</Badge>
                {mount.enhanced && <Badge colorScheme="green">Enhanced</Badge>}
                {mount.sources && mount.sources.length > 0 && (
                  <Badge colorScheme="blue">{mount.sources[0].type}</Badge>
                )}
              </Flex>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      
      {filteredMounts.length === 0 && (
        <Flex justify="center" p={8}>
          <Text>Aucune monture trouvée</Text>
        </Flex>
      )}
    </Container>
  );
};

export default MountsPage;