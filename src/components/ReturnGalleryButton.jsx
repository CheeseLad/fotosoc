import React from 'react';

function ReturnGalleryButton() {
  return (
    <a href='/gallery' >
      <button className="bg-purple-500 text-white px-4 py-2 my-4 mr-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">Return To Gallery Homepage</button>
      </a>
  );
}

export default ReturnGalleryButton;
