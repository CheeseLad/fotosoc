import React from 'react';

// Use require.context to import all images from the folder
const importAll = (r) => r.keys().map(r);

const CustomGallery = ({ imagesFolder, galleryTitle }) => {
  // Import images based on the folder provided through props
  const images = importAll(
    require.context(`../images/gallery/${imagesFolder}`, false, /\.(png|jpe?g|svg)$/)
  );

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-3xl font-bold text-center mb-8">{galleryTitle}</h2>

      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative m-2 overflow-hidden rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              style={{
                width: '300px',
                height: '300px',
              }}
            >
              <img
                src={image}
                alt={`Gallery Item ${index}`}
                className="object-cover w-full h-full"
                style={{ zIndex: 1 }}
              />
              <div
                className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{ zIndex: 2 }}
              >
                <div className="flex justify-between">
                  <div></div>
                  <a
                    href={image}
                    download={image.split('/').pop()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomGallery;
