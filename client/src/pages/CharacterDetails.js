// src/pages/CharacterDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
  Spinner,
  Divider,
  useToast,
  Button,
  Link,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getCharacterDetails } from '../services/api';
import JobIcon from '../components/JobIcon';

const CharacterDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      setIsLoading(true);
      
      try {
        const data = await getCharacterDetails(id);
        setCharacter(data);
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les détails du personnage',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterDetails();
  }, [id, toast]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  if (!character) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Heading>Personnage non trouvé</Heading>
          <Button as={RouterLink} to="/" leftIcon={<ChevronLeftIcon />}>
            Retour à la recherche
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Button
        as={RouterLink}
        to="/"
        leftIcon={<ChevronLeftIcon />}
        mb={6}
        size="sm"
        variant="outline"
      >
        Retour à la recherche
      </Button>

      {/* Informations principales */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        mb={8}
      >
        <Box w={{ base: '100%', md: '300px' }} bg="gray.100">
          <Image
            src={character.portrait || character.avatar}
            alt={character.name}
            w="100%"
            h={{ base: '300px', md: '400px' }}
            objectFit="cover"
          />
        </Box>

        <Box p={6} flex="1">
          <VStack align="start" spacing={4}>
            <Heading size="xl">{character.name}</Heading>
            
            <HStack>
              <Badge colorScheme="purple" fontSize="md" px={2} py={1}>
                {character.server}
              </Badge>
              <Badge colorScheme="teal" fontSize="md" px={2} py={1}>
                {character.dataCenter}
              </Badge>
            </HStack>
            
            {character.freeCompany && (
              <Box>
                <Text fontWeight="bold" mb={1}>Free Company</Text>
                <Text>{character.freeCompany.name}</Text>
              </Box>
            )}
            
            <Box w="100%">
              <Link
                href={character.profileUrl}
                isExternal
                color="blue.500"
                fontSize="sm"
                display="inline-flex"
                alignItems="center"
              >
                Voir sur Lodestone <ExternalLinkIcon mx={1} />
              </Link>
            </Box>
          </VStack>
        </Box>
      </Flex>

      {/* Classes et niveaux */}
      <Box bg="white" borderRadius="lg" p={6} boxShadow="md" mb={8}>
        <Heading size="md" mb={4}>Classes et Métiers</Heading>
        <Divider mb={4} />
        
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={4}>
          {character.jobs
            .sort((a, b) => b.level - a.level)
            .map((job) => (
              <HStack
                key={job.name}
                bg={job.level === 90 ? 'yellow.50' : 'gray.50'}
                p={3}
                borderRadius="md"
                borderWidth={job.level === 90 ? 2 : 1}
                borderColor={job.level === 90 ? 'yellow.400' : 'gray.200'}
              >
                <JobIcon job={job.name} boxSize={8} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight={job.level === 90 ? 'bold' : 'medium'}>
                    {job.name}
                  </Text>
                  <Text fontSize="sm" color={job.level === 90 ? 'yellow.700' : 'gray.600'}>
                    Nv. {job.level}
                  </Text>
                </VStack>
              </HStack>
            ))}
        </SimpleGrid>
      </Box>
      
      {/* Placeholder pour futures fonctionnalités */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4}>Hauts Faits</Heading>
          <Divider mb={4} />
          <Text color="gray.500">
            Fonctionnalité à venir dans une prochaine version
          </Text>
        </Box>
        
        <Box bg="white" borderRadius="lg" p={6} boxShadow="md">
          <Heading size="md" mb={4}>Montures & Mascottes</Heading>
          <Divider mb={4} />
          <Text color="gray.500">
            Fonctionnalité à venir dans une prochaine version
          </Text>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default CharacterDetails;