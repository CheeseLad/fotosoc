import React, { useState, useEffect } from 'react';
import { Camera, Users, Image, Award } from 'lucide-react';

const StatBox = ({ icon: Icon, label, endValue }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const animateCount = () => {
      const duration = 2000;
      const framesPerSecond = 60;
      const totalFrames = (duration / 1000) * framesPerSecond;
      const increment = endValue / totalFrames;

      let currentFrame = 0;
      const timer = setInterval(() => {
        currentFrame++;
        setCount(Math.min(Math.round(increment * currentFrame), endValue));
        if (currentFrame === totalFrames) clearInterval(timer);
      }, 1000 / framesPerSecond);

      return () => clearInterval(timer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(document.getElementById(`stat-box-${label}`));

    return () => observer.disconnect();
  }, [endValue, label]);

  return (
    <div id={`stat-box-${label}`} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center w-60 h-60">
      <Icon className="text-blue-600 mb-2" size={64} />
      <h3 className="text-3xl font-bold mb-1 text-blue-900">{count}</h3>
      <p className="text-xl text-blue-600 text-center">{label}</p>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Fotostats</h2>
      <div className="flex flex-row justify-center items-center space-x-4">
        <StatBox icon={Camera} label="Photos Taken" endValue={5000} />
        <StatBox icon={Users} label="Active Members" endValue={1000} />
        <StatBox icon={Image} label="Gallery Uploads" endValue={10000} />
        <StatBox icon={Award} label="Contest Winners" endValue={50} />
      </div>
    </div>
  );
};

export default Stats;