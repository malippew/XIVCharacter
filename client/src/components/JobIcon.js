import React from 'react';
import { Image, Box } from '@chakra-ui/react';

// Mapping des noms de classes vers les URLs d'icônes
const jobIconUrls = {
  "Paladin": "https://img.finalfantasyxiv.com/lds/h/U/F5JzG9RPIKmKnlX6f5oFVVEYiA.png",
  "Warrior": "https://img.finalfantasyxiv.com/lds/h/V/2puzat59h7CNcx9PZy0xqK1pvy.png",
  "Dark Knight": "https://img.finalfantasyxiv.com/lds/h/i/HM0_cHVFGDqxLJXBP1hrnFB_nE.png",
  "Gunbreaker": "https://img.finalfantasyxiv.com/lds/h/8/FsfoI8nBhgG-XZI6sFKXs334iQ.png",
  "White Mage": "https://img.finalfantasyxiv.com/lds/h/7/i20QvSPcSQTRODWKr8mCymBZvw.png",
  "Scholar": "https://img.finalfantasyxiv.com/lds/h/V/YgY8fc5XFkRdpBZVQkbyh-y_KY.png",
  "Astrologian": "https://img.finalfantasyxiv.com/lds/h/1/U9WNvX6tkpqjSB8jWaIyknibds.png",
  "Sage": "https://img.finalfantasyxiv.com/lds/h/5/GDV1Lig4-AvC_v9FG0mRsv6tU0.png",
  "Monk": "https://img.finalfantasyxiv.com/lds/h/K/HW6tKODyxdcimzjXryBJFGNUZM.png",
  "Dragoon": "https://img.finalfantasyxiv.com/lds/h/y/A3UhbjZvDeN3tf-6ndDqoea0uo.png",
  "Ninja": "https://img.finalfantasyxiv.com/lds/h/0/Fso5hanZVEEF2e5tJmBqbZNRrk.png",
  "Samurai": "https://img.finalfantasyxiv.com/lds/h/q/0DXrrqHBXzLGVLDnF9y4eOPZRw.png",
  "Reaper": "https://img.finalfantasyxiv.com/lds/h/C/BZalyUp9uQFfpEBNJD3jEQDcuQ.png",
  "Bard": "https://img.finalfantasyxiv.com/lds/h/m/KndG72XtDZV-6AhMj2IQrlJOvY.png",
  "Machinist": "https://img.finalfantasyxiv.com/lds/h/E/vmtbIlf6Uv8rVp_2cgmT3tUt1k.png",
  "Dancer": "https://img.finalfantasyxiv.com/lds/h/P/Pj8axb8lNX8vxIogQ6GAhbFCkS4.png",
  "Black Mage": "https://img.finalfantasyxiv.com/lds/h/s/2xKik74KbRGXPJpZgG_0kzVZxo.png",
  "Summoner": "https://img.finalfantasyxiv.com/lds/h/E/KowSCSH7fTCFPiW0OZV1cGb5bk.png",
  "Red Mage": "https://img.finalfantasyxiv.com/lds/h/l/5CZEvDOMYMyVn2td9LZigsgw9s.png",
  "Blue Mage": "https://img.finalfantasyxiv.com/lds/h/f/vmtbIlf6Uv8rVp_2cgmT3tUt1k.png",
  
  // Classes de base et métiers
  "Gladiator": "https://img.finalfantasyxiv.com/lds/h/s/gl62VOTBJrm7D_eSICEIcvTvBc.png",
  "Marauder": "https://img.finalfantasyxiv.com/lds/h/d/3z1zGP79_QEsHaLEFf3zAjHkIw.png", 
  "Conjurer": "https://img.finalfantasyxiv.com/lds/h/C/ZpqMpzxQedARaBdNCxRFmuUm-c.png",
  "Arcanist": "https://img.finalfantasyxiv.com/lds/h/H/4ghjpyyuNelzw1Bl7K-Uk95Q0o.png",
  "Thaumaturge": "https://img.finalfantasyxiv.com/lds/h/9/PcxEZoIqBKbfVZY6KB5ygDe-5U.png",
  "Archer": "https://img.finalfantasyxiv.com/lds/h/4/QYYDQ8Y4_h2Qo1dgXbPsca_hJE.png",
  "Lancer": "https://img.finalfantasyxiv.com/lds/h/w/4cLvEfGpVxQAZEdtJ4HbUQGtsY.png",
  "Pugilist": "https://img.finalfantasyxiv.com/lds/h/V/jdV_bjn9ROIXyqOWAtBMh9YGqs.png",
  "Rogue": "https://img.finalfantasyxiv.com/lds/h/R/NdLJ0eoiDNbkQT6Ij2IXHdFQEg.png",
  
  // Métiers manuels
  "Carpenter": "https://img.finalfantasyxiv.com/lds/h/5/Nl4xQa3t9_wcmCi1DBHIUILnIo.png",
  "Blacksmith": "https://img.finalfantasyxiv.com/lds/h/F/KWI-9P3RX4IEqx1GgNIT4ZV7wk.png",
  "Armorer": "https://img.finalfantasyxiv.com/lds/h/L/LbEjgw0cwO_2gQSmkFh_5boKO8.png",
  "Goldsmith": "https://img.finalfantasyxiv.com/lds/h/k/Lbj9K-AxdZ_nFiH70GrXV7Nzxs.png",
  "Leatherworker": "https://img.finalfantasyxiv.com/lds/h/k/FwSU6BMwwcI6V6o5E26y_qIcGo.png",
  "Weaver": "https://img.finalfantasyxiv.com/lds/h/M/1kMI-1na2-vILsQoKj_MJ7hX7s.png",
  "Alchemist": "https://img.finalfantasyxiv.com/lds/h/1/jBuM3Yq33zQr_xIhukLFGKKSgk.png",
  "Culinarian": "https://img.finalfantasyxiv.com/lds/h/H/j9I0A6dqRmGcUADJ8NyJwm7U8c.png",
  
  // Récolteurs
  "Miner": "https://img.finalfantasyxiv.com/lds/h/F/5CZEvDOMYMyVn2td9LZigsgw9s.png",
  "Botanist": "https://img.finalfantasyxiv.com/lds/h/v/1S570FsyS0H5qTlCbq2lq_NqI8.png",
  "Fisher": "https://img.finalfantasyxiv.com/lds/h/G/Kj7Cf3nXHW5B6ZlJ-8YpHlAFhg.png"
};

const JobIcon = ({ job, ...props }) => {
  const iconUrl = jobIconUrls[job] || "https://img.finalfantasyxiv.com/lds/h/W/aM3C9X7f7qOS8YhGzxu1AIxsM.png"; // Icône par défaut

  return (
    <Box {...props}>
      <Image src={iconUrl} alt={job} />
    </Box>
  );
};

export default JobIcon;