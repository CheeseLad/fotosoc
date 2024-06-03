import React, { useState } from 'react';
import logo from '../assets/logo/logo.png';
import JoinButton from './Joinbutton';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <a href="/"><img src={logo} alt="Logo" className="w-12 h-auto" /></a>
        <a href="/"><span className="text-white text-lg font-semibold ml-2">DCU Fotosoc</span></a>
      </div>
      <div className="block md:hidden">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none focus:bg-gray-700 px-2 py-1 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Desktop navigation */}
      <div className={`md:flex space-x-12 ${menuOpen ? 'block' : 'hidden'}`}>
        <a href="/" className="text-white text-2xl hover:text-gray-300">Home</a>
        <a href="/store" className="text-white text-2xl hover:text-gray-300">Store</a>
        <a href="/loans" className="text-white text-2xl hover:text-gray-300">Loans</a>
        <a href="/gallery" className="text-white text-2xl hover:text-gray-300">Gallery</a>
        <a href="/committee" className="text-white text-2xl hover:text-gray-300">Committee</a>
        <JoinButton />
      </div>
    </nav>
  );
}

export default Navbar;
