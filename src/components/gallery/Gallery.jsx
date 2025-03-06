import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const Gallery = ({ galleries, returnValue }) => {
  const [captions, setCaptions] = useState({});

  const handleAddCaption = (imageKey) => {
    setCaptions((prev) => ({
      ...prev,
      [imageKey]: prev[imageKey] ? null : { name: '', caption: '' },
    }));
  };

  const handleCaptionChange = (imageKey, field, value) => {
    setCaptions((prev) => ({
      ...prev,
      [imageKey]: { ...prev[imageKey], [field]: value },
    }));
  };

  const handleSubmitCaption = async (imageKey) => {
    if (captions[imageKey]) {
      try {
        const captionRef = doc(db, 'captions', imageKey);
        const docSnap = await getDoc(captionRef);

        if (docSnap.exists()) {
          await updateDoc(captionRef, {
            captions: arrayUnion(captions[imageKey]),
          });
        } else {
          await setDoc(captionRef, {
            captions: [captions[imageKey]],
          });
        }

        setCaptions((prev) => ({
          ...prev,
          [imageKey]: null,
        }));
        alert('Caption saved successfully!');
      } catch (error) {
        alert(`Error saving caption: ${error}`);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-white py-8">
      <div className="w-full">
        {galleries.map((gallery, galleryIndex) => {
          const hasCaption = gallery.title.includes("Captions");

          return (
            <div key={galleryIndex} className="mb-8">
              <h3 className="text-3xl font-bold text-center mb-8">{gallery.title}</h3>
              <div className="bg-white rounded-lg shadow-xl p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {gallery.images.map((image, imageIndex) => {
                  const imageKey = `${imageIndex + 1}`;
                  return (
                    <div key={imageKey}>
                      <div
                        className="relative m-2 overflow-hidden rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                        style={{ width: '300px', height: '300px' }}
                      >
                        <img
                          src={image}
                          alt={`Gallery Item ${imageIndex}`}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="flex justify-between">
                            <div></div>
                            <a href={image} download onClick={(e) => { e.preventDefault(); const link = document.createElement('a'); link.href = image; link.download = image.split('/').pop(); document.body.appendChild(link); link.click(); document.body.removeChild(link); }}
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                      {hasCaption && (
                        <div className="mt-4 text-center">
                          {captions[imageKey] ? (
                            <button
                              onClick={() => handleAddCaption(imageKey)}
                              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Close
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddCaption(imageKey)}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Add Caption to Photo {imageIndex + 1}
                            </button>
                          )}
                          {captions[imageKey] && (
                            <div className="mt-2 flex flex-col items-center">
                              <input
                                type="text"
                                placeholder="Enter your name"
                                value={captions[imageKey].name}
                                onChange={(e) => handleCaptionChange(imageKey, 'name', e.target.value)}
                                className="mt-2 p-2 border-2 border-blue-500 rounded text-black"
                              />
                              <input
                                type="text"
                                placeholder="Enter your caption"
                                value={captions[imageKey].caption}
                                onChange={(e) => handleCaptionChange(imageKey, 'caption', e.target.value)}
                                className="mt-2 p-2 border-2 border-blue-500 rounded text-black"
                              />
                              <button
                                onClick={() => handleSubmitCaption(imageKey)}
                                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Submit Caption
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
