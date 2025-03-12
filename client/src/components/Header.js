import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Heading, Image, Link } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box as="header" bg="gray.800" color="white" py={4} px={6}>
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
        <Flex align="center">
          <Image 
            src="https://img.finalfantasyxiv.com/lds/h/0/U2uGfVX4GdZgU1jASO0m9h_xLg.png" 
            alt="FFXIV Logo" 
            h="40px" 
            mr={3} 
          />
          <Heading as={RouterLink} to="/" size="lg" fontWeight="bold">
            FFXIV Character Viewer
          </Heading>
        </Flex>
        
        <Flex>
          <Link as={RouterLink} to="/" mr={4} fontWeight="medium">
            Recherche
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;