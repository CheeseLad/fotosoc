import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo/logo.png';

const MemberPortfoliosGrid = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">
          Member Portfolios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {portfolios.map((portfolio) => (
            <Link
              to={`/portfolios/${portfolio.portfolioLink}`}
              key={portfolio.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-500 hover:scale-105"
            >
              <div className="relative pb-2/3">
                <img
                  className="absolute h-full w-full object-cover"
                  src={portfolio.profileImage || logo}
                  alt={portfolio.name}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{portfolio.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{portfolio.position || "Member"}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FontAwesomeIcon icon={faCamera} className="mr-2" />
                  <span>{portfolio.galleries?.length || 0} Galleries</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberPortfoliosGrid;