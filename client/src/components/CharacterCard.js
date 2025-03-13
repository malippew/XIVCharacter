import React from 'react';
import { Box, Image, Text, VStack, HStack, Badge } from '@chakra-ui/react';

const CharacterCard = ({ character, onClick }) => {
  return (
    <Box
      bg="ffxiv.darkGray"
      borderWidth="1px"
      borderColor="ffxiv.gold"
      borderRadius="2px"
      overflow="hidden"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.4)"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.5)',
        borderColor: 'ffxiv.darkGold',
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
        borderBottom="1px"
        borderColor="ffxiv.mediumGray"
      />

      <VStack p={4} align="start" spacing={1}>
        <Text
          fontWeight="bold"
          fontSize="lg"
          noOfLines={1}
          fontFamily="Cinzel, serif"
          color="ffxiv.white"
        >
          {character.name}
        </Text>

        <HStack>
          <Badge
            bg="ffxiv.darkBlue"
            color="ffxiv.white"
            px={2}
            py={1}
            borderRadius="1px"
            
            fontSize="xs"
            letterSpacing="0.5px"
          >
            {`${character.server} [${character.dataCenter}]`}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CharacterCard;