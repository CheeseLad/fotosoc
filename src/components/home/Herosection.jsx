import React, { useEffect, useState } from 'react';
import JoinButton from '../Joinbutton';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function HeroSection() {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    const images = ["/hero/hero_1.png", 
                    "/hero/hero_2.png",
                    "/hero/hero_3.png",
                    "/hero/hero_4.png",
                    "/hero/hero_5.png",
                    "/hero/hero_6.png"];                    
    setShuffledImages(shuffleArray(images));
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-24">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex-1 mr-8 ml-3">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">DCU Fotosoc - DCU's Photography Society</h1>
            <p className="text-lg mb-4">Are you someone who has always wanted to give photography a go? Or maybe you're someone with a bit of experience looking for like-minded people and classes to hone your craft? Either way, Fotosoc is for you.</p>
            <p className="text-lg mb-4">Join Fotosoc for free equipment rentals, free classes, trips, inter-varsity and inter-society events, guest speakers, society nights out, student exhibitions, competitions and more!</p>
            <div>
              <JoinButton />
              <a href='/gallery' ><button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">View Gallery</button></a>
              <a href='/links' ><button className="bg-orange-400 text-white px-4 py-2 mr-4 rounded-lg hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/50 hvr-grow">View Linktree</button></a>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mr-3">
            {shuffledImages.map((image, index) => (
              <div className="relative" key={index}>
                <img src={image} alt={`Hero ${index + 1}`} className="w-48 md:w-full h-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
