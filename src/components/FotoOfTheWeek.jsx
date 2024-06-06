import React from 'react';
import fotooftheweek from '../assets/fotooftheweek/19-03-2024.png';

const FotoOfTheWeek = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-4">Foto of the Week</h2>
      <p className="text-lg mb-8 px-2 text-center">
        Discover the best photograph taken by our talented members every week! Check out this week's featured photo and learn more about the photographer.
      </p>
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col md:flex-row items-center md:items-start max-w-4xl w-full">
        <div className="w-full md:w-1/2">
          <img 
            src={fotooftheweek}
            alt="Photo of the Week" 
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div className="mt-6 md:mt-0 md:ml-8 w-full md:w-1/2">
          <h3 className="text-xl font-bold mb-2 text-black">✨ Foto of the Week ✨</h3>
          <p className="text-md mb-4 text-black">
            <b>Caption:</b> Same time tomorrow?
          </p>
          <p className="text-md mb-4 text-black">
            <b>Shot By:</b> Daniel McCarthy
          </p>
          <a 
            href="https://www.instagram.com/danielmc_1604" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-pink-600 text-white py-2 px-4 mb-4 mr-4 rounded-lg shadow-md hover:bg-pink-700 transition duration-300"
          >
            Check out @danielmc_1604 on Instagram
          </a>
          <a 
            href="/gallery/foto-of-the-week" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-purple-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
          >
            View Previous Winners
          </a>
        </div>
      </div>
    </div>
  );
};

export default FotoOfTheWeek;
