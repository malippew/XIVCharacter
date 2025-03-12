import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import Header from './components/Header.js';
import CharacterSearch from './pages/CharacterSearch.js';
import CharacterDetails from './pages/CharacterDetails.js';

const theme = extendTheme({});

function App() {
  return (
    <ChakraProvider theme={theme}>
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