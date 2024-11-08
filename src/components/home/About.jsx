import React from 'react';
import YouTubePlayer from '../YouTubePlayer';

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
    <h2 className="text-3xl font-bold text-center mb-8">About Fotosoc</h2>
      <p className="text-lg mb-4">Get to know DCU's Elite Photography Society</p>
      <div className="video-container rounded-xl overflow-hidden shadow-2xl">
      <YouTubePlayer />
</div>
<div className="bg-white rounded-lg shadow-xl p-6 mt-10">
  <h3 className="text-xl font-bold mb-2 text-black text-center">Check Out Our Socials!</h3>
  <ul className="flex space-x-4">
  <li>
      <a href="https://chat.whatsapp.com/KcWm0mU78nyHKMibl3Vlko" aria-label="DCU Fotosoc WhatsApp" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-whatsapp text-green-500 hover:text-green-700 text-5xl hvr-bob" />
      </a>
    </li>
    <li>
      <a href="https://www.tiktok.com/@dcufotosoc" aria-label="DCU Fotosoc TikTok" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-tiktok text-gray-500 hover:text-gray-700 text-5xl hvr-bob" />
      </a>
    </li>
    <li>
      <a href="https://instagram.com/dcufotosoc" aria-label="DCU Fotosoc Instagram" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-instagram text-pink-500 hover:text-pink-700 text-5xl hvr-bob" />
      </a>
    </li>
    <li>
      <a href="mailto:committee@dcufotosoc.ie" aria-label="DCU Fotosoc Email" target="_blank" rel="noopener noreferrer">
        <i className="fa fa-envelope text-gray-600 hover:text-black- text-5xl hvr-bob" />
      </a>
    </li>

    <li>
      <a href="https://www.youtube.com/@dcufotosoc3388" aria-label="DCU Fotosoc YouTube" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-youtube text-red-600 hover:text-red-800 text-5xl hvr-bob" />
      </a>
    </li>
    <li>
      <a href="https://facebook.com/DCUPhotographySociety" aria-label="DCU Fotosoc Facebook" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-facebook text-blue-500 hover:text-blue-700 text-5xl hvr-bob" />
      </a>
    </li>
    <li>
      <a href="https://www.linkedin.com/company/dcufotosoc" aria-label="DCU Fotosoc LinkedIn" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin text-blue-600 hover:text-blue-800 text-5xl hvr-bob" />
      </a>
    </li>

  </ul>
</div>
    </div>
  );
};

export default About;
