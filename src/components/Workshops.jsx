import React, { useState } from "react";

const Workshops = () => {
  const presentationUrls = [
    "https://drive.google.com/file/d/1kxtmNjMrZSQsU8akMax9RirwO7q-RhwE/preview",
    "https://drive.google.com/file/d/1zjaZoUlE3uCooeTgu5o7mxop4vZMDDnh/preview",
    "https://drive.google.com/file/d/1wtT3g9z5TdRej5IEBDEXSqJtRMahFTu-/preview",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % presentationUrls.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + presentationUrls.length) % presentationUrls.length
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 text-white">
      <div className="flex flex-col flex-1">
        <h2 className="text-3xl font-bold text-center mt-8 mb-4">Workshops</h2>
        <p className="text-lg px-2 text-center">
          View the PowerPoint presentations for the workshops below.
        </p>
        <div className="flex-1 flex flex-col items-center justify-center">
          <iframe
            src={presentationUrls[currentIndex]}
            width="80%"
            height="600"  
            frameBorder="0"
            allow="autoplay"
            title="Workshops Presentation"
          >
            Loading…
          </iframe>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={goToPrevious}
              className="px-4 py-2 bg-purple-500 text-white my-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow"
            >
              Previous
            </button>
            <button
              onClick={goToNext}
              className="px-4 py-2 bg-purple-500 text-white my-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshops;
