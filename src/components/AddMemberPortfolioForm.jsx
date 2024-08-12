import React, { useState } from "react";
import { db, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faPlus, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const socialIcons = {
  instagram: faInstagram,
  linkedin: faLinkedinIn,
  email: faEnvelope,
};

const AddMemberPortfolioForm = () => {
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

    const linkExists = await checkLinkExists(memberInfo.portfolioLink);

    if (linkExists) {
      alert(
        "The portfolio link is already taken. Please choose a different link."
      );
      return;
    }

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

      await addDoc(collection(db, "memberPortfolios"), {
        name: memberInfo.name,
        bio: memberInfo.bio,
        socialButtons: memberInfo.socialButtons,
        galleries: galleriesWithUrls,
        portfolioLink: memberInfo.portfolioLink,
        profileImage: memberInfo.profileImage || "",
        createdAt: serverTimestamp(),
      });

      alert(
        `Member portfolio added successfully! Share your link: /portfolio/${memberInfo.portfolioLink}`
      );
      setMemberInfo({
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

      for (let i = 0; i < memberInfo.socialButtons.length; i++) {
        if (memberInfo.socialButtons[i].platform === "email") {
          memberInfo.socialButtons[
            i
          ].url = `mailto:${memberInfo.portfolioLink}`;
        }
      }
    } catch (error) {
      console.error("Error adding member portfolio: ", error);
    }
  };

  const checkLinkExists = async (link) => {
    const docRef = doc(db, "memberPortfolios", link);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-4xl font-extrabold text-center mb-8">
        Create Portfolio
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Portfolio Link:
          </label>
          <input
            type="text"
            name="portfolioLink"
            value={memberInfo.portfolioLink}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={memberInfo.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bio:
          </label>
          <textarea
            name="bio"
            value={memberInfo.bio}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profile Image:
          </label>
          <input
            type="file"
            onChange={(e) =>
              setMemberInfo({ ...memberInfo, profileImage: e.target.files[0] })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {memberInfo.socialButtons.map((button, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{`Social ${index + 1
              }:`}</label>
            <div className="flex items-center">
              <select
                name="platform"
                value={button.platform}
                onChange={(e) => handleSocialButtonChange(index, e)}
                className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {Object.keys(socialIcons).map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="url"
                value={button.url}
                onChange={(e) => handleSocialButtonChange(index, e)}
                className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                placeholder="URL"
              />
              <div className="ml-2 text-2xl">
                <FontAwesomeIcon icon={socialIcons[button.platform]} />
              </div>
            </div>
          </div>
        ))}
        {memberInfo.galleries.map((gallery, index) => (
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
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
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

export default AddMemberPortfolioForm;
