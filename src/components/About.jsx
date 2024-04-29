import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
    <h2 className="text-3xl font-bold text-center mb-8">About Fotosoc</h2>
      <p className="text-lg mb-4">Get to know DCU's Elite Photography Society</p>
      <div className="video-container rounded-xl overflow-hidden shadow-2xl">
  <iframe
    width={560 * 1.5}
    height={315 * 1.5}
    src="https://www.youtube.com/embed/ftJThlcZk8Y"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>
<div className="bg-white rounded-lg shadow-xl p-6 mt-10">
  <h3 className="text-xl font-bold mb-2 text-black text-center">Follow Us:</h3>
  <ul className="flex space-x-4">
    <li>
      <a href="https://facebook.com/YourPage" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-facebook text-blue-500 hover:text-blue-700 text-5xl" />
      </a>
    </li>
    <li>
      <a href="https://twitter.com/YourHandle" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-twitter text-blue-400 hover:text-blue-600 text-5xl" />
      </a>
    </li>
    <li>
      <a href="https://instagram.com/YourHandle" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-instagram text-pink-500 hover:text-pink-700 text-5xl" />
      </a>
    </li>
    <li>
      <a href="https://linkedin.com/company/YourCompany" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin text-black hover:text-black-200 text-5xl" />
      </a>
    </li>
    <li>
      <a href="https://linkedin.com/company/YourCompany" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin text-green-700 hover:text-green-900 text-5xl" />
      </a>
    </li>
  </ul>
</div>
    </div>
  );
};

export default About;
