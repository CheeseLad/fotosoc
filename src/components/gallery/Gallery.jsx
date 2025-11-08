import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Gallery = ({ galleries, returnValue }) => {
  const [captions, setCaptions] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const [currentGallery, setCurrentGallery] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const handleNextImage = useCallback(() => {
    if (currentGallery !== null && galleries[currentGallery]) {
      const galleryImages = galleries[currentGallery].images;
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setModalImage(galleryImages[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  }, [currentGallery, currentIndex, galleries]);

  const handlePrevImage = useCallback(() => {
    if (currentGallery !== null && galleries[currentGallery]) {
      const galleryImages = galleries[currentGallery].images;
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setModalImage(galleryImages[prevIndex]);
      setCurrentIndex(prevIndex);
    }
  }, [currentGallery, currentIndex, galleries]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }

      if (event.key === 'ArrowLeft') {
        handlePrevImage();
      }

      if (event.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextImage, handlePrevImage]);

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

  const handleImageClick = (image, galleryIndex, imageIndex) => {
    setModalImage(image);
    setCurrentGallery(galleryIndex);
    setCurrentIndex(imageIndex);
  };

  return (
    <div className="flex flex-col justify-center items-center text-white py-8">
      <div className="w-full">
        {galleries.map((gallery, galleryIndex) => {
          const hasCaption = gallery.title.includes("Captions");

          return (
            <div key={galleryIndex} className="mb-8">
              <h3 className="text-3xl font-bold text-center mb-8">{gallery.title}</h3>
              <h4 className="text-xl font-semibold text-center mb-4">Click on a photo to view it in full size!</h4>
              <div className="bg-white rounded-lg shadow-xl p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {gallery.images.map((image, imageIndex) => {
                  const imageKey = `${imageIndex + 1}`;
                  return (
                    <div key={imageKey}>
                      <div
                        className="relative m-2 overflow-hidden rounded-xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                        style={{ width: '300px', height: '300px' }}
                        onClick={() => handleImageClick(image, galleryIndex, imageIndex)}
                      >
                        <img
                          src={image}
                          alt={`Gallery Item ${imageIndex}`}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="flex justify-between">
                            <div></div>
                            <a 
                                          href={image}
                                          target='_blank'
                                          rel='noreferrer'
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                              onClick={(e) => e.stopPropagation()}
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
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={handleCloseModal}>
          <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
          <button className="absolute top-0 right-0 text-white text-5xl" onClick={handleCloseModal}>
          <FontAwesomeIcon icon={faXmark} />
          </button>
          <button className="text-white text-5xl mr-4" onClick={handlePrevImage}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="relative flex flex-col items-center">
            <img src={modalImage} alt="Large Preview" className="max-w-[70vw] md:max-w-[80vw] lg:max-w-[90vw] max-h-[80vh]" />
            <div className="bg-white text-black py-4 px-4 w-full text-lg font-semibold text-center sm:text-left">
              {galleries[currentGallery]?.title}
            </div>
            <a
              href={modalImage}
              target='_blank'
              rel='noreferrer'
              className="sm:absolute mt-4 sm:mt-0 bottom-2 right-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              Download
            </a>
          </div>
          <button className="text-white text-5xl ml-4" onClick={handleNextImage}>
          <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      )}

    </div>
  );
};

export default Gallery;
