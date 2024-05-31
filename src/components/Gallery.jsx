// src/components/Gallery.jsx
import React from "react";

// Use require.context to import all images from the folder
const importAll = (r) => r.keys().map(r);
const images = importAll(require.context('../images/gallery', false, /\.(png|jpe?g|svg)$/));

const Gallery = () => {
  return (
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Our Gallery</h2>
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
              className="object-cover"
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
