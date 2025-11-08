import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PageHeading from "../PageHeading";
import Button from "../Button";

const ALLOWED_USER_ID = process.env.REACT_APP_ADMIN_USER_ID;

const GalleryHomepage = () => {
  const [galleries, setGalleries] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "galleries"));
        const galleryData = querySnapshot.docs.map((doc) => doc.data());
        setGalleries(galleryData);
      } catch (error) {
        console.error("Error fetching galleries: ", error);
      }
    };

    fetchGalleries();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ALLOWED_USER_ID) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 min-h-screen">
      <div className="w-full px-4 md:px-8 text-white">
        <PageHeading heading="Fotosoc Gallery" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {gallery.galleries[0]?.images.length > 0 && (
                <img
                  src={getRandomImage(gallery.galleries[0].images)}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-80 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-black">
                  {gallery.title}
                </h2>
                <div className="flex gap-1">
                  <Button
                    href={`/gallery/${gallery.link}`}
                    text="View Gallery"
                    color="purple"
                  />
                  {isAdmin && (
                    <Button
                      href={`/edit-gallery/${gallery.link}`}
                      text="Edit Gallery"
                      color="green"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryHomepage;
