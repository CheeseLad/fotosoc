import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from '../../firebase';

const RandomPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [randomPortfolios, setRandomPortfolios] = useState([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const portfoliosRef = collection(db, 'memberPortfolios');
        const querySnapshot = await getDocs(portfoliosRef);
        const portfolioData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPortfolios(portfolioData);
      } catch (error) {
        console.error('Error fetching portfolios: ', error);
      }
    };

    fetchPortfolios();
  }, []);

  useEffect(() => {
    if (portfolios.length > 0) {
      const randomIndexes = new Set();

      while (randomIndexes.size < 3) {
        randomIndexes.add(Math.floor(Math.random() * portfolios.length));
      }

      setRandomPortfolios([...randomIndexes].map(index => portfolios[index]));
    }
  }, [portfolios]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
          <div className="container mx-auto py-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Featured Portfolios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {randomPortfolios.map((portfolio) => (
            <Link
              to={`/portfolios/${portfolio.portfolioLink}`}
              key={portfolio.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{portfolio.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{portfolio.position || "Member"}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCamera} className="mr-2" />
                    <span>{portfolio.galleries?.length || 0} Galleries</span>
                  </div>
                </div>
                <div className="relative w-1/3">
                  <img
                    className="h-20 w-20 object-cover rounded-full"
                    src={portfolio.profileImage || "/fotosoc_logo.png"}
                    alt={portfolio.name}
                  />
                </div>
              </div>
            </Link>
        ))}
      </div>
      
      <div className="p-4 text-center">
                <a
                  href="/portfolios"
                  className="inline-block bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors"
                >
                  View All Portfolios
                </a>
              </div>
    </div>
    </div>
  );
};

export default RandomPortfolios;
