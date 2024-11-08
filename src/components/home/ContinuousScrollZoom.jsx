import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import JoinButton from '../Joinbutton';


const ContinuousScrollZoom = () => {
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.6, 1], [1, 1, 0, 0]);

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

  const images = [
    "/hero/hero_1.png",
    "/hero/hero_2.png",
    "/hero/hero_3.png",
    "/hero/hero_4.png",
    "/hero/hero_5.png",
    "/hero/hero_6.png",
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={containerRef}>
      <motion.div 
        className="absolute inset-0 grid grid-cols-3 gap-4 p-4"
        style={{ scale, opacity }}
      >
        {images.map((src, index) => (
          <img 
            key={index} 
            src={src} 
            alt={`Grid image ${index + 1}`} 
            className={`w-full h-full object-cover ${index === 4 ? 'z-20' : 'z-10'}`} 
          />
        ))}
      </motion.div>
      
      <div className="relative z-30 text-center bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4">Join DCU Fotosoc</h2>
        <p className="text-xl mb-6">Become a member on DCU Clubs & Socs today!</p>
        <JoinButton />
      </div>
      
    </div>
  );
};

export default ContinuousScrollZoom;