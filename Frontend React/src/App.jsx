import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import Body from './components/Body.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return(
    <>
   <div className={isDarkMode ? 'dark' : 'light'}>
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <Body isDarkMode={isDarkMode} />
      <Footer />
    </div>
    </>
  );
}

export default App;