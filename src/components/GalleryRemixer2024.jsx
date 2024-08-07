// src/components/Gallery.jsx
import React from "react";
import ReturnGalleryButton from "./ReturnGalleryButton";

// Use require.context to import all images from the folder
const importAll = (r) => r.keys().map(r);
const images = importAll(require.context('../images/gallery/remixer2024', false, /\.(png|jpe?g|svg)$/));

const GalleryExhibition2024 = () => {
  return (
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Fotosoc Re-Mixer 2024</h2>
    <div className="text-center">
      <ReturnGalleryButton />
    </div>
    <div className="flex justify-center">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex justify-center items-center bg-gray-200 m-2"
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

export default GalleryExhibition2024;
