import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Gallery from '../gallery/Gallery';
import { useNavigate } from 'react-router-dom'; // For navigation

const MemberPortfolio = () => {
  const { portfolioLink } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false); // State to track ownership
  const auth = getAuth(); // Firebase Auth instance
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const portfoliosRef = collection(db, 'memberPortfolios');
        const q = query(portfoliosRef, where('portfolioLink', '==', portfolioLink));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setPortfolio(docData);

          // Check if the logged-in user is the owner
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid === docData.userId) {
            setIsOwner(true);
          }
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
  }, [portfolioLink, auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!portfolio) {
    return <div>No portfolio found for this link and user ID.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Member Portfolio: {portfolio.name}</h2>

      <div className="max-w-5xl w-full bg-white rounded-lg shadow-2xl p-6 m-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-center mb-4">
              <img
                src={portfolio.profileImage || "/fotosoc_logo.png"}
                alt={portfolio.name}
                className="w-64 h-64 rounded-full shadow-md transition-transform duration-300 transform hover:scale-105"
              />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-semibold">{portfolio.name}</h3>
              <p className="text-xl italic">{portfolio.position || "Member"}</p>
              <div className="flex justify-center mt-4">
                {portfolio.socialButtons.map((button, index) => (
                  <a
                    key={index}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-4 hvr-bob"
                  >
                    <FontAwesomeIcon
                      icon={socialIcons[button.platform]}
                      className="text-4xl text-white"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-lg text-black p-4">
              <p>{portfolio.bio}</p>
              
            </div>
          </div>
   
        </div>
        <div className="flex flex-col justify-center items-center">
          {isOwner && (
        <button
          onClick={() => navigate(`/edit-portfolio/${portfolioLink}`)} // Navigate to the edit page
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Edit Portfolio
        </button>
      )}
      </div>
      </div>



      <Gallery galleries={portfolio.galleries} returnValue="portfolios" />
    </div>
  );
};

const socialIcons = {
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  email: faEnvelope,
};

export default MemberPortfolio;
