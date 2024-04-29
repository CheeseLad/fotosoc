import React from "react";
import Gallery from "./Gallery";

function GalleryTitle() {
  // Specify your image filenames here
  const images = ["hero_1.png", "hero_2.png", "hero_3.png", "hero_4.png", "hero_5.png", "hero_6.png"];

  return (
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Our Gallery</h2>
      <Gallery images={images} />
    </div>
  );
}

export default GalleryTitle;
