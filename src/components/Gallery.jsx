// Gallery.js
import React from "react";

const Gallery = ({ images }) => {
  return (
    <div className="flex justify-center">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="flex justify-center items-center bg-gray-200"
          style={{
            //width: `${Math.floor(Math.random() * 300) + 200}px`,
            //height: `${Math.floor(Math.random() * 300) + 200}px`,
            width: "300px",
            height: "300px",
          }}
        >
          <img
            src={`images/${image}`}
            alt={`Image ${index}`}
            className="object-cover"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ))}
    </div>
    </div>
  );
};

export default Gallery;
