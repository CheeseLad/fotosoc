import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const GalleryHomepage = () => {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'galleries'));
        const galleryData = querySnapshot.docs.map(doc => doc.data());
        setGalleries(galleryData);
      } catch (error) {
        console.error('Error fetching galleries: ', error);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <div className="w-full">
           <h3 className="text-3xl font-bold text-center mb-8">Gallery Homepage</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleries.map((gallery, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            {gallery.galleries[0]?.images[0] && (
              <img
                src={gallery.galleries[0].images[0]}
                alt={`Gallery ${index + 1}`}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-black mb-2">{gallery.title}</h2>
              <a
                href={`/gallery/${gallery.link}`} // Adjust link as needed
                className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
              >
                View Gallery
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default GalleryHomepage;
