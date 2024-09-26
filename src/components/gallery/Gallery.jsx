import React from 'react';

const Gallery = ({ galleries }) => {
  return (
    <div className="flex flex-col justify-center items-center text-white py-8">

      <div className="w-full">
        {galleries.map((gallery, galleryIndex) => (
          <div key={galleryIndex} className="mb-8">
            <h3 className="text-3xl font-bold text-center mb-8">{gallery.title}</h3>
            
            <div className="bg-white rounded-lg shadow-xl p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gallery.images.map((image, imageIndex) => (
                <div
                  key={`${galleryIndex}-${imageIndex}`}
                  className="relative m-2 overflow-hidden rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                  style={{
                    width: '300px',
                    height: '300px',
                  }}
                >
                  <img
                    src={image}
                    alt={`Gallery Item ${imageIndex}`}
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
        ))}
         <div className="flex flex-col justify-center items-center">
            <a
              href="/gallery"
              className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
            >
              Return to Gallery Homepage
            </a>
          </div>
      </div>
    </div>
  );
};

export default Gallery;
