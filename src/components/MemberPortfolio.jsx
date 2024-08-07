import React from 'react';
import jake_farrell from '../images/committee/jake_farrell.png';
import Gallery from './Gallery';

const MemberPortfolio = ({ name, description }) => {
  return (
<div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
  <h2 className="text-3xl font-bold text-center mb-8">Member Portfolio: {name}</h2>

  <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
    <div className="flex flex-col items-center md:items-start">
      <img src={jake_farrell} alt={name} className="w-64 h-64 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105 mb-4" />
      <div className="flex justify-center mb-4">
        <a href="" target="_blank" rel="noopener noreferrer" className="mx-2 hvr-bob">
          <i className="fab fa-instagram text-3xl text-blue-600"></i>
        </a>
        <a href="" target="_blank" rel="noopener noreferrer" className="mx-2 hvr-bob">
          <i className="fab fa-linkedin text-3xl text-blue-600"></i>
        </a>
        <a href="" target="_blank" rel="noopener noreferrer" className="mx-2 hvr-bob">
          <i className="fa fa-envelope text-3xl text-blue-600"></i>
        </a>
      </div>
    </div>
    
    <div className="flex flex-auto">
      <p className="text-lg text-black">
        This is a brief description about {name}. You can include any relevant details, achievements, or background information here. Feel free to update this text to better reflect the individual's profile.
      </p>
    </div>
  </div>
    <Gallery />
</div>



  );
};

export default MemberPortfolio;
