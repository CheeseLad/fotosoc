import React from 'react';
import logo from '../assets/logo/logo.png';
import JoinButton from './Joinbutton';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* Your logo */}
        <img src={logo} alt="Logo" className="w-12 h-auto" />
        <span className="text-white text-lg font-semibold ml-2">DCU Fotosoc</span>
      </div>
      <div className="flex space-x-12">
        <a href="/" className="text-white text-2xl hover:text-gray-300">Home</a>
        <a href="/gallery" className="text-white text-2xl hover:text-gray-300">Gallery</a>
        <a href="/committee" className="text-white text-2xl hover:text-gray-300">Committee</a>
        <JoinButton />
      </div>
    </nav>
  );
}

export default Navbar;
