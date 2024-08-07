import React from 'react';

const GalleryButtonGrid = () => {
  // Define the button data within the component
  const buttonData = [
    {
      label: 'Fotosoc Exhibition 2024',
      link: '/gallery/exhibition-2024',
    },
    {
      label: 'Fotosoc Re-Mixer 2024',
      link: '/gallery/remixer-2024',
    },
    {
      label: 'Foto of the Week Winners',
      link: '/gallery/foto-of-the-week-winners',
    },
  ];

  return (
    <div className="text-center mb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-1">
        {buttonData.map((item, index) => (
          <a key={index} href={item.link}>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">
              {item.label}
            </button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GalleryButtonGrid;
