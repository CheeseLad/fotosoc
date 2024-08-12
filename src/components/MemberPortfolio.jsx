import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Gallery from './Gallery';

const MemberPortfolio = () => {
  const { portfolioLink } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const portfoliosRef = collection(db, 'memberPortfolios');
        const q = query(
          portfoliosRef,
          where('portfolioLink', '==', portfolioLink),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setPortfolio(docData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching portfolio: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioLink]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!portfolio) {
    return <div>No portfolio found for this link and user ID.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Member Portfolio: {portfolio.name}</h2>

      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center md:items-start">
          <img
            src={portfolio.profileImage || 'default-image.png'}
            alt={portfolio.name}
            className="w-64 h-64 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105 mb-4 aspect-square"
          />
          <div className="flex justify-center mb-4">
            {portfolio.socialButtons.map((button, index) => (
              <a
                key={index}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 hvr-bob"
              >
                <FontAwesomeIcon
                  icon={socialIcons[button.platform]}
                  className="text-3xl text-blue-600"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-auto">
          <p className="text-lg text-black">
            {portfolio.bio}
          </p>
        </div>
      </div>

      <Gallery galleries={portfolio.galleries} />
    </div>
  );
};

const socialIcons = {
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  email: faEnvelope,
};

export default MemberPortfolio;
