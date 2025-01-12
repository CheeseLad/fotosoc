import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faInstagram, faFacebookF, faTwitter, faGithub, faYoutube, faTiktok, faSnapchatGhost } from "@fortawesome/free-brands-svg-icons";
import { faPlus, faEnvelope, faTrash, faGlobe, faLink } from "@fortawesome/free-solid-svg-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import Select from 'react-select';
import { getAuth } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";

const socialIcons = {
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  email: faEnvelope,
  facebook: faFacebookF,
  twitter: faTwitter,
  github: faGithub,
  youtube: faYoutube,
  tiktok: faTiktok,
  snapchat: faSnapchatGhost,
  website: faGlobe,
  link: faLink,
};

const socialOptions = Object.keys(socialIcons).map((key) => ({
  value: key,
  label: (
    <div className="flex items-center justify-center">
      <FontAwesomeIcon icon={socialIcons[key]} className="text-black" />
    </div>
  ),
}));

const EditMemberPortfolioForm = () => {
  const [memberInfo, setMemberInfo] = useState({
    name: "",
    bio: "",
    socialButtons: [
      { platform: "instagram", url: "" },
      { platform: "linkedin", url: "" },
      { platform: "email", url: "" },
    ],
    galleries: [{ title: "", images: [] }],
    portfolioLink: "",
    profileImage: "",
  });

  const { portfolioLink } = useParams(); // Get the portfolio link from the URL
  console.log(portfolioLink);
  const auth = getAuth();
  const user = "test"
  const navigate = useNavigate();

  // Fetch the portfolio data when the component mounts
  useEffect(() => {
    const fetchPortfolioData = async () => {
      const docRef = doc(db, "memberPortfolios", portfolioLink);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.userId !== user.uid) {
          alert("You are not authorized to edit this portfolio.");
          navigate("/"); // Redirect if the user is not the owner of the portfolio
          return;
        }

        setMemberInfo({
          name: data.name,
          bio: data.bio,
          socialButtons: data.socialButtons,
          galleries: data.galleries,
          portfolioLink: data.portfolioLink,
          profileImage: data.profileImage,
        });
      } else {
        alert("Portfolio not found.");
        navigate("/"); // Redirect if portfolio is not found
      }
    };

    fetchPortfolioData();
  }, [portfolioLink, user.uid, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo({ ...memberInfo, [name]: value });
  };

  const handleSocialButtonChange = (index, e) => {
    const { name, value } = e.target;
    const newSocialButtons = memberInfo.socialButtons.map((button, i) => {
      if (i === index) {
        return { ...button, [name]: value };
      }
      return button;
    });
    setMemberInfo({ ...memberInfo, socialButtons: newSocialButtons });
  };

  const handleGalleryChange = (index, e) => {
    const { name, value } = e.target;
    const newGalleries = memberInfo.galleries.map((gallery, i) => {
      if (i === index) {
        return { ...gallery, [name]: value };
      }
      return gallery;
    });
    setMemberInfo({ ...memberInfo, galleries: newGalleries });
  };

  const handleImageChange = (galleryIndex, e) => {
    const files = Array.from(e.target.files);
    const newGalleries = memberInfo.galleries.map((gallery, i) => {
      if (i === galleryIndex) {
        return { ...gallery, images: files };
      }
      return gallery;
    });
    setMemberInfo({ ...memberInfo, galleries: newGalleries });
  };

  const addGallery = () => {
    setMemberInfo({
      ...memberInfo,
      galleries: [...memberInfo.galleries, { title: "", images: [] }],
    });
  };

  const removeGallery = (index) => {
    const newGalleries = memberInfo.galleries.filter((_, i) => i !== index);
    setMemberInfo({ ...memberInfo, galleries: newGalleries });
  };

  const uploadImages = async (gallery, galleryIndex) => {
    const imageUrls = [];
    const uploadPromises = gallery.images.map(async (image) => {
      const userId = memberInfo.portfolioLink;
      const storagePath = `member-portfolios/${userId}/gallery_${galleryIndex + 1
        }/${Date.now()}_${image.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    });

    await Promise.all(uploadPromises);
    return imageUrls;
  };

  const uploadProfileImage = async (image) => {
    const userId = memberInfo.portfolioLink;
    const storagePath = `member-portfolios/${userId}/profile_${Date.now()}_${image.name
      }`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, image);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const galleriesWithUrls = await Promise.all(
        memberInfo.galleries.map(async (gallery, index) => {
          const imageUrls = await uploadImages(gallery, index);
          return { ...gallery, images: imageUrls };
        })
      );

      if (memberInfo.profileImage) {
        const profileImageUrl = await uploadProfileImage(
          memberInfo.profileImage
        );
        memberInfo.profileImage = profileImageUrl;
      }

      const docRef = doc(db, "memberPortfolios", portfolioLink);

      await updateDoc(docRef, {
        name: memberInfo.name,
        bio: memberInfo.bio,
        socialButtons: memberInfo.socialButtons,
        galleries: galleriesWithUrls,
        profileImage: memberInfo.profileImage || "",
        updatedAt: serverTimestamp(),
      });

      alert("Portfolio updated successfully!");
      navigate(`/portfolios/${portfolioLink}`);
    } catch (error) {
      console.error("Error updating portfolio: ", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-4xl font-extrabold text-center mb-8">Edit Portfolio</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded"
      >
        {/* The form structure stays similar to your add portfolio form */}
        {/* Use the same structure to allow editing */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Portfolio Link:</label>
          <input
            type="text"
            name="portfolioLink"
            value={memberInfo.portfolioLink}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled
          />
        </div>
        {/* Continue with the rest of the form fields */}
        {/* Same as your `AddMemberPortfolioForm`, but prefilled with data */}
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditMemberPortfolioForm;
