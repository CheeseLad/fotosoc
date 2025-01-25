import React, { useState } from "react";
import { db, storage, auth } from "../../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import imageCompression from "browser-image-compression";

const ALLOWED_USER_ID = process.env.REACT_APP_ADMIN_USER_ID || window._env_.REACT_APP_ADMIN_USER_ID; 


const AddGalleryPageForm = () => {

  const navigate = useNavigate();

  const [galleryInfo, setGalleryInfo] = useState({
    title: "",
    link: "",
    galleries: [{ title: "", images: [] }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGalleryInfo({ ...galleryInfo, [name]: value });
  };

  const handleGalleryChange = (index, e) => {
    const { name, value } = e.target;
    const newGalleries = galleryInfo.galleries.map((gallery, i) => {
      if (i === index) {
        return { ...gallery, [name]: value };
      }
      return gallery;
    });
    setGalleryInfo({ ...galleryInfo, galleries: newGalleries });
  };

  const handleImageChange = (galleryIndex, e) => {
    const files = Array.from(e.target.files);
    const newGalleries = galleryInfo.galleries.map((gallery, i) => {
      if (i === galleryIndex) {
        return { ...gallery, images: files };
      }
      return gallery;
    });
    setGalleryInfo({ ...galleryInfo, galleries: newGalleries });
  };

  const addGallery = () => {
    setGalleryInfo({
      ...galleryInfo,
      galleries: [...galleryInfo.galleries, { title: "", images: [] }],
    });
  };

  const uploadImages = async (gallery, galleryIndex) => {
    const imageUrls = [];
    
    const uploadPromises = gallery.images.map(async (image) => {
      try {
        // Compression options
        const options = {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 1024, // Resize dimensions
          useWebWorker: true, // Use web worker for better performance
        };
  
        // Compress the image
        const compressedImage = await imageCompression(image, options);
  
        // Generate a storage path
        const storagePath = `galleries/${gallery.link}/gallery_${
          galleryIndex + 1
        }/${Date.now()}_${compressedImage.name}`;
        const storageRef = ref(storage, storagePath);
  
        // Upload the compressed image
        await uploadBytes(storageRef, compressedImage);
  
        // Get the download URL
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      } catch (error) {
        console.error("Error compressing or uploading image: ", error);
      }
    });
  
    await Promise.all(uploadPromises);
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!auth.currentUser) {
      alert("You must be logged in to submit this form.");
      navigate("/login");
      return;
    }

    if (auth.currentUser.uid !== ALLOWED_USER_ID) {
      alert("You are not authorized to submit this form.");
      return;
    }

    try {
      const galleriesWithUrls = await Promise.all(
        galleryInfo.galleries.map(async (gallery, index) => {
          const imageUrls = await uploadImages(gallery, index);
          return { ...gallery, images: imageUrls };
        })
      );

      await addDoc(collection(db, "galleries"), {
        title: galleryInfo.title,
        link: galleryInfo.link,
        galleries: galleriesWithUrls,
        createdAt: serverTimestamp(),
      });

      alert("Gallery added successfully!");
      setGalleryInfo({
        title: "",
        link: "",
        galleries: [{ title: "", images: [] }],
      });
    } catch (error) {
      console.error("Error adding gallery: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("You need to log in to access this page.");
        navigate("/login");
      } else if (user.uid !== ALLOWED_USER_ID) {
        alert("You are not authorized to access this page.");
        navigate("/");
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center mb-8">
        Create Gallery
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gallery Title:
          </label>
          <input
            type="text"
            name="title"
            value={galleryInfo.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Gallery Link:
          </label>
          <input
            type="text"
            name="link"
            value={galleryInfo.link}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {galleryInfo.galleries.map((gallery, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-bold mb-2">Gallery {index + 1}</h3>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={gallery.title}
                onChange={(e) => handleGalleryChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Images:
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addGallery}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 mr-2"
        >
          <FontAwesomeIcon icon={faPlus} /> Add Gallery
        </button>

        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddGalleryPageForm;
