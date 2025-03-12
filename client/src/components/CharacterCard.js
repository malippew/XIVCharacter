// src/components/CharacterCard.js
import React from 'react';
import { Box, Image, Text, VStack, HStack, Badge } from '@chakra-ui/react';

const CharacterCard = ({ character, onClick }) => {
  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      <Image
        src={character.avatar}
        alt={character.name}
        w="100%"
        h="215px"
        objectFit="cover"
      />
      
      <VStack p={4} align="start" spacing={1}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
          {character.name}
        </Text>
        
        <HStack>
          <Badge colorScheme="purple">{character.server}</Badge>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CharacterCard;