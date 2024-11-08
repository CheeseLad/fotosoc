import React, { useState } from "react";

const Workshops = () => {
  const presentations = [
    {
      id: 1,
      url: "https://drive.google.com/file/d/1kxtmNjMrZSQsU8akMax9RirwO7q-RhwE/preview",
      title: "Developing Your Own Photography Style",
      thumbnail: "/workshops/1.png"
    },
    {
      id: 2,
      url: "https://drive.google.com/file/d/1zjaZoUlE3uCooeTgu5o7mxop4vZMDDnh/preview",
      title: "Lighting Walkshop",
      thumbnail: "/workshops/2.png"
    },
    {
      id: 3,
      url: "https://drive.google.com/file/d/1wtT3g9z5TdRej5IEBDEXSqJtRMahFTu-/preview",
      title: "Everything You Need To Know About Film",
      thumbnail: "/workshops/3.png"
    }
  ];

  const [selectedPresentation, setSelectedPresentation] = useState(null);

  const openPresentation = (presentation) => {
    setSelectedPresentation(presentation);
  };

  const closePresentation = () => {
    setSelectedPresentation(null);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mt-8 mb-4">Workshops</h2>
        <p className="text-lg text-center mb-8">
          Click on a workshop presentation to view it in full screen.
        </p>

        {!selectedPresentation && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <div
                key={presentation.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => openPresentation(presentation)}
              >
                <div className="aspect-video relative">
                  <img
                    src={presentation.thumbnail}
                    alt={presentation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg font-semibold">
                      Click to View
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{presentation.title}</h3>
                  <p className="text-sm text-gray-300 mt-2">
                    Click to view presentation in full screen
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedPresentation && (
          <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 bg-black/50">
              <h3 className="text-xl font-semibold">
                {selectedPresentation.title}
              </h3>
              <button
                onClick={closePresentation}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <iframe
                src={selectedPresentation.url}
                className="w-full h-full max-w-7xl"
                frameBorder="0"
                allow="autoplay"
                title={selectedPresentation.title}
              >
                Loading…
              </iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshops;