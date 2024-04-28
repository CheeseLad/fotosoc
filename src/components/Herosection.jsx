import React from 'react';
import hero_1 from '../assets/hero/hero_1.png';
import hero_2 from '../assets/hero/hero_2.png';
import hero_3 from '../assets/hero/hero_3.png';
import hero_4 from '../assets/hero/hero_4.png';
import hero_5 from '../assets/hero/hero_5.png';
import hero_6 from '../assets/hero/hero_6.png';
import JoinButton from './Joinbutton';

function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-24">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex-1 mr-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">DCU Fotosoc - DCU's Photography Society </h1>
            <p className="text-lg mb-4">Are you someone who has always wanted to give photography a go? Or maybe you're someone with a bit of experience looking for like-minded people and classes to hone your craft? Either way, fotosoc is for you. Join fotosoc for free equipment rentals, free classes, trips, inter-varsity and inter-society events, guest speakers, society nights out, student exhibitions, competitions and more!</p>
            <div>
              <JoinButton />
              <button className="bg-purple-500 text-white px-4 py-2 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50">View Gallery</button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            {/* Replace the image URLs with your images */}
            <div className="relative">
              <img src={hero_1} alt="Hero" className="w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105" />
            </div>
            <div className="relative">
              <img src={hero_2} alt="Hero" className="w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105"/>
            </div>
            <div className="relative">
              <img src={hero_3} alt="Hero" className="w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105"/>
            </div>
            <div className="relative">
              <img src={hero_4} alt="Hero" className="w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105"/>
            </div>
            <div className="relative">
              <img src={hero_5} alt="Hero" className="w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105"/>
            </div>
            <div className="relative">
              <img src={hero_6} alt="Hero" className="w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
