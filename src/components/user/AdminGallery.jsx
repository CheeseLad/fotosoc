import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Gallery from '../Gallery'; 

const MemberGallery = () => {
  const { portfolioLink } = useParams(); 
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const portfoliosRef = collection(db, 'galleries');
        const q = query(
          portfoliosRef,
          where('link', '==', portfolioLink),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          
          const docData = querySnapshot.docs[0].data();
          setGallery(docData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching gallery: ', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchGallery();
  }, [portfolioLink]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!gallery) {
    return <div>No gallery found for this link and user ID.</div>; 
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <Gallery galleries={gallery.galleries} />
    </div>
  );
};


const socialIcons = {
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  email: faEnvelope,
};

export default MemberGallery;