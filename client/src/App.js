import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import ffxivTheme from './theme.js';
import Header from './components/Header.js';
import CharacterSearch from './pages/CharacterSearch.js';
import CharacterDetails from './pages/CharacterDetails.js';


function App() {
  return (
    <ChakraProvider theme={ffxivTheme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<CharacterSearch />} />
          <Route path="/character/:id" element={<CharacterDetails />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;