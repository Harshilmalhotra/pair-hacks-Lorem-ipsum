import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import './Navbar.css'; // Ensure you have the CSS file

export default function Navbar({ toggleTheme, isDarkMode }) {
  return (
    <nav className={`p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Secure Docs - A PDF Data Masking App
        </div>
        <div>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
            onClick={toggleTheme}
          >
            <CSSTransition
              in={isDarkMode}
              timeout={300}
              classNames="icon"
            >
              {isDarkMode ?<FaMoon className="icon" />:<FaSun className="icon text-yellow-400"/>}
            </CSSTransition>
            {/* <span className="ml-2">{isDarkMode ? '' : ''}</span> */}
          </button>
        </div>
      </div>
    </nav>
  );
}
