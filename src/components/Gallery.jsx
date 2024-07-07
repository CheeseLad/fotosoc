// src/components/Gallery.jsx
import React from "react";

// Use require.context to import all images from the folder
const importAll = (r) => r.keys().map(r);
const images = importAll(require.context('../images/gallery/main', false, /\.(png|jpe?g|svg)$/));

const Gallery = () => {
  return (
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Our Gallery</h2>
    <div className="text-center">
      <a href='/gallery/exhibition-2024'><button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">Fotosoc Exhibition 2024</button></a>
      <a href='/gallery/remixer-2024'><button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">Fotosoc Re-Mixer 2024</button></a>
      <a href='/gallery/foto-of-the-week-winners'><button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">Foto of the Week Winners</button></a>
    </div>
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-gray-200"
            style={{
              width: "300px",
              height: "300px",
            }}
          >
            <img
              src={image}
              alt={`Gallery Item ${index}`}
              className="object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Gallery;
