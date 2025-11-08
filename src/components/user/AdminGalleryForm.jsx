import React, { useState } from "react";
import { db, storage, auth } from "../../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, doc, updateDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import imageCompression from "browser-image-compression";

const ALLOWED_USER_ID = process.env.REACT_APP_ADMIN_USER_ID; 


const AddGalleryPageForm = () => {

  const navigate = useNavigate();
  const { link } = useParams();
  const isEditMode = !!link;
  const [galleryId, setGalleryId] = useState("");

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
        return { ...gallery, images: [...gallery.images, ...files] };
      }
      return gallery;
    });
    setGalleryInfo({ ...galleryInfo, galleries: newGalleries });
  };

  const moveImageLeft = (galleryIndex, imageIndex) => {
    if (imageIndex === 0) return; // Already at the start
    const newGalleries = [...galleryInfo.galleries];
    const images = [...newGalleries[galleryIndex].images];
  
    [images[imageIndex - 1], images[imageIndex]] = [images[imageIndex], images[imageIndex - 1]];
    newGalleries[galleryIndex].images = images;
  
    setGalleryInfo({ ...galleryInfo, galleries: newGalleries });
  };
  
  const moveImageRight = (galleryIndex, imageIndex) => {
    const images = galleryInfo.galleries[galleryIndex].images;
    if (imageIndex === images.length - 1) return; // Already at the end
  
    const newGalleries = [...galleryInfo.galleries];
    const updatedImages = [...newGalleries[galleryIndex].images];
  
    [updatedImages[imageIndex + 1], updatedImages[imageIndex]] = [updatedImages[imageIndex], updatedImages[imageIndex + 1]];
    newGalleries[galleryIndex].images = updatedImages;
  
    setGalleryInfo({ ...galleryInfo, galleries: newGalleries });
  };
  
  const removeImage = (galleryIndex, imageIndex) => {
    const newGalleries = galleryInfo.galleries.map((gallery, i) => {
      if (i === galleryIndex) {
        const updatedImages = gallery.images.filter((_, idx) => idx !== imageIndex);
        return { ...gallery, images: updatedImages };
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

  const removeGallery = (index) => {
    const newGalleries = galleryInfo.galleries.filter((_, i) => i !== index);
    setGalleryInfo({ ...galleryInfo, galleries: newGalleries });
  };

  const uploadImages = async (gallery, galleryIndex) => {
    const uploadPromises = gallery.images.map(async (image) => {
      // Skip uploading if the image is already a URL
      if (typeof image === "string") {
        return image;
      }
  
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
        const storagePath = `galleries/${galleryInfo.link}/gallery_${
          galleryIndex + 1
        }/${Date.now()}_${compressedImage.name}`;
        const storageRef = ref(storage, storagePath);
  
        // Upload the compressed image
        await uploadBytes(storageRef, compressedImage);
  
        // Get the download URL
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (error) {
        console.error("Error compressing or uploading image: ", error);
        throw error;
      }
    });
  
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
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

      if (isEditMode) {
        // Update existing gallery
        const docRef = doc(db, "galleries", galleryId);
        await updateDoc(docRef, {
          title: galleryInfo.title,
          link: galleryInfo.link,
          galleries: galleriesWithUrls,
          updatedAt: serverTimestamp(),
        });
        alert("Gallery updated successfully!");
        navigate(`/gallery/${galleryInfo.link}`);
      } else {
        // Create new gallery
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
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} gallery: `, error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} gallery. Please try again.`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        alert("You need to log in to access this page.");
        navigate("/login");
        return;
      }
      
      if (user.uid !== ALLOWED_USER_ID) {
        alert("You are not authorized to access this page.");
        navigate("/");
        return;
      }

      // Fetch gallery data if in edit mode
      if (isEditMode && link) {
        try {
          const q = query(
            collection(db, "galleries"),
            where("link", "==", link)
          );
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              setGalleryId(doc.id);
    
              setGalleryInfo({
                title: data.title,
                link: data.link,
                galleries: data.galleries || [{ title: "", images: [] }],
              });
            });
          } else {
            alert("Gallery not found.");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching gallery: ", error);
        }
      }
    });
  
    return () => unsubscribe();
  }, [navigate, isEditMode, link]);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center mb-8">
        {isEditMode ? "Edit Gallery" : "Create Gallery"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded"
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
            readOnly={isEditMode}
            disabled={isEditMode}
          />
        </div>

        {galleryInfo.galleries.map((gallery, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-bold mb-2 text-gray-700">Gallery {index + 1}</h3>
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

            {/* Existing Images */}
            {gallery.images.length > 0 && (
              <div className="mb-2">
                <h4 className="text-gray-700 font-bold">Existing Images:</h4>
                <div className="flex flex-wrap gap-2">
                  {gallery.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="relative flex flex-col items-center">
                      <img
                        src={typeof image === "string" ? image : URL.createObjectURL(image)}
                        alt={`Gallery ${index + 1}, ${imageIndex + 1}`}
                        className="w-24 h-24 object-cover rounded border border-gray-300 mb-1"
                      />
                    
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImageLeft(index, imageIndex)}
                          className="bg-gray-200 text-black text-xs px-2 rounded hover:bg-gray-300"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageRight(index, imageIndex)}
                          className="bg-gray-200 text-black text-xs px-2 rounded hover:bg-gray-300"
                        >
                          →
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index, imageIndex)}
                          className="bg-red-500 text-white text-xs px-2 rounded"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {isEditMode ? "Add New Images:" : "Images:"}
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(index, e)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required={!isEditMode || gallery.images.length === 0}
              />
            </div>

            {isEditMode && (
              <button
                type="button"
                onClick={() => removeGallery(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              >
                <FontAwesomeIcon icon={faTrash} /> Remove Gallery
              </button>
            )}
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
          {isEditMode ? "Save Changes" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddGalleryPageForm;
