// src/theme.js
import { extendTheme } from '@chakra-ui/react';

// Thème inspiré de Final Fantasy XIV
const ffxivTheme = extendTheme({
  // Palettes de couleurs inspirées de FFXIV
  colors: {
    // Couleurs principales inspirées de l'interface du jeu
    ffxiv: {
      gold: "#E7BD69",
      darkGold: "#BF9B56",
      blue: "#3E71B7",
      darkBlue: "#1A2E4A",
      red: "#AF282F",
      white: "#F0F0F0",
      black: "#111921",
      darkGray: "#333844",
      mediumGray: "#5A6270",
      lightGray: "#9BA2B0",
    },
    // Couleurs des classes et jobs
    jobs: {
      tank: "#3E71B7",       // Bleu
      healer: "#5ABA62",     // Vert
      dps: "#AF282F",        // Rouge
      caster: "#9861C7",     // Violet
      ranged: "#7D6B4A",     // Brun
    },
    // Couleurs d'éléments
    elements: {
      fire: "#CC3232",
      ice: "#5AC8D8",
      wind: "#8ACC32",
      earth: "#CCA032",
      lightning: "#CC32CC",
      water: "#3232CC",
    },
  },
  
  // Typographie inspirée de FFXIV
  fonts: {
    heading: `'Cinzel', serif`,
    body: `'Noto Sans', sans-serif`,
  },
  
  // Personnalisation des composants pour ressembler à l'UI de FFXIV
  components: {
    Button: {
      baseStyle: {
        fontFamily: 'Cinzel, serif',
        fontWeight: '600',
        borderRadius: '1px',
        _focus: {
          boxShadow: '0 0 0 2px #E7BD69',
        },
      },
      variants: {
        primary: {
          bg: 'ffxiv.gold',
          color: 'ffxiv.black',
          border: '1px solid',
          borderColor: 'ffxiv.darkGold',
          _hover: {
            bg: 'ffxiv.darkGold',
            color: 'ffxiv.white',
          },
        },
        secondary: {
          bg: 'ffxiv.darkBlue',
          color: 'ffxiv.white',
          border: '1px solid',
          borderColor: 'ffxiv.blue',
          _hover: {
            bg: 'ffxiv.blue',
          },
        },
        job: {
          bg: 'jobs.dps',
          color: 'ffxiv.white',
          _hover: {
            opacity: 0.8,
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          background: 'ffxiv.darkGray',
          color: 'ffxiv.white',
          borderRadius: '2px',
          border: '1px solid',
          borderColor: 'ffxiv.gold',
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'ffxiv.gold',
        fontFamily: 'Cinzel, serif',
        letterSpacing: '1px',
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            background: 'ffxiv.black',
            color: 'ffxiv.white',
            borderColor: 'ffxiv.mediumGray',
            _hover: {
              borderColor: 'ffxiv.gold',
            },
            _focus: {
              borderColor: 'ffxiv.gold',
              boxShadow: '0 0 0 1px #E7BD69',
            },
          },
        },
      },
    },
    // Personnalisation de la Modal pour ressembler aux fenêtres de dialogue FFXIV
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'ffxiv.darkGray',
          borderRadius: '2px',
          border: '1px solid',
          borderColor: 'ffxiv.gold',
        },
        header: {
          bg: 'ffxiv.darkBlue',
          color: 'ffxiv.gold',
          fontFamily: 'Cinzel, serif',
        },
      },
    },
  },
  
  // Styles globaux
  styles: {
    global: {
      body: {
        bg: 'ffxiv.black',
        color: 'ffxiv.white',
      },
      a: {
        color: 'ffxiv.gold',
        _hover: {
          textDecoration: 'none',
          color: 'ffxiv.darkGold',
        },
      },
    },
  },
});

export default ffxivTheme;