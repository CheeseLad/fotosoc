import React from 'react';
import jake_farrell from '../images/committee/jake_farrell.png';
import GalleryExhibition2024 from './GalleryRemixer2024';

const MemberPortfolio = ({ name, description }) => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Member Portfolio: {name}</h2>
      <div className="bg-white rounded-lg shadow-xl p-6 mx-10 flex flex-row">
        <div className="flex flex-col items-center pr-20 md:min-w-[500px] sm:min-w-[400px]">
          <img src={jake_farrell} alt={name} className="w-64 h-64 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105 mb-4" />
          <div className="flex justify-center">
            <a href="" target="_blank" rel="noopener noreferrer" className="mx-4 hvr-bob">
              <i className="fab fa-instagram text-4xl text-blue-600"></i>
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="mx-4 hvr-bob">
              <i className="fab fa-linkedin text-4xl text-blue-600"></i>
            </a>
            <a href="" className="mx-4 hvr-bob">
              <i className="fa fa-envelope text-4xl text-blue-600"></i>
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center ml-10">
          <h3 className="text-xl font-bold mb-2 mx-10 text-black text-left">{description}</h3>
        </div>
      </div>
    <GalleryExhibition2024 />
    </div>
  );
};

export default MemberPortfolio;
