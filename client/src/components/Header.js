import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Heading, Image, Link } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box as="header" bg="ffxiv.darkBlue" color="ffxiv.white" py={4} px={6} borderBottom="1px" borderColor="ffxiv.gold">
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
        <Flex align="center">
          <Image
            src="https://img.finalfantasyxiv.com/lds/h/0/U2uGfVX4GdZgU1jASO0m9h_xLg.png"
            alt="FFXIV Logo"
            h="40px"
            mr={3}
          />
          <Heading 
            as={RouterLink} 
            to="/" 
            size="lg" 
            fontWeight="bold"
            fontFamily="Cinzel, serif"
            color="ffxiv.gold"
            letterSpacing="1px"
            _hover={{
              textDecoration: "none",
              color: "ffxiv.darkGold"
            }}
          >
            FFXIV Character Viewer
          </Heading>
        </Flex>
       
        <Flex>
          <Link 
            as={RouterLink} 
            to="/" 
            mr={4} 
            fontWeight="medium"
            color="ffxiv.white"
            position="relative"
            px={4}
            py={2}
            _hover={{
              textDecoration: "none",
              color: "ffxiv.gold",
              _after: {
                content: '""',
                position: "absolute",
                bottom: "-5px",
                left: "0",
                right: "0",
                height: "2px",
                bg: "ffxiv.gold"
              }
            }}
            _active={{
              color: "ffxiv.gold",
            }}
          >
            Connexion
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;