import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import JoinButton from '../Joinbutton';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const ContinuousScrollZoom = () => {
  const [isZooming, setIsZooming] = useState(false);
  const [images, setImages] = useState([]);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [1, 1, 0.8] // Adjust scaling for smaller screens
  );
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.5, 0.6, 1], 
    [1, 1, 0, 0]
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'galleries'));
        const galleryData = querySnapshot.docs.map(doc => doc.data());

        const allImages = galleryData.flatMap(gallery => 
          gallery.galleries?.[0]?.images || []
        );
        setImages(allImages?.slice(0, 12));
      } catch (error) {
        console.error('Error fetching galleries: ', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const middleY = window.innerHeight / 4;

      if (rect.top <= middleY && rect.bottom >= middleY) {
        setIsZooming(true);
      } else {
        setIsZooming(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center overflow-hidden" 
      ref={containerRef}
    >
      <motion.div 
        className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-4"
        style={{ scale, opacity }}
      >
        {images.map((src, index) => (
          <div 
            key={index} 
            className="relative w-full h-0" 
            style={{ paddingBottom: '56.25%' }} // 16:9 Aspect Ratio
          >
            <img 
              src={src} 
              alt={`Gallery image ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md" 
            />
          </div>
        ))}
      </motion.div>

      <div className="relative z-30 text-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-sm sm:max-w-md lg:max-w-lg">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Join DCU Fotosoc</h2>
        <p className="text-lg sm:text-xl lg:text-2xl mb-6">
          What are you waiting for? Become a member on DCU Clubs & Socs today!
        </p>
        <JoinButton />
      </div>
    </div>
  );
};

export default ContinuousScrollZoom;
