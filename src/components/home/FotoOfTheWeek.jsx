import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const FotoOfTheWeek = () => {
  const [fotoData, setFotoData] = useState(null);
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1sQn28bsUxjjHVorSmlKv-DwS6E9NK84faTDjChm1_BQ/edit";

  const fetchFotoData = async (sheetUrl) => {
    try {
      const csvUrl = sheetUrl.replace("/edit", "/export?format=csv&");
      const response = await fetch(csvUrl);
      const csvText = await response.text();

      // Get first data row (after headers)
      const [headerLine, ...rows] = csvText.split("\n").filter(Boolean);
      const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());
      const firstRow = rows[0]
        .split(",")
        .map((col) => col.trim().replace(/(^"|"$)/g, ""));

      const fotoObj = {};
      headers.forEach((h, i) => {
        fotoObj[h] = firstRow[i] || "";
      });

      setFotoData(fotoObj);
    } catch (error) {
      console.error("Error fetching Foto of the Week data:", error);
    }
  };

  useEffect(() => {
    if (sheetUrl) {
      fetchFotoData(sheetUrl);
    }
  }, [sheetUrl]);

  if (!fotoData) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Foto of the Week
        </h2>
        <p className="text-lg mb-8 px-2 text-center">
          Loading Foto of the Week...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-4">Foto of the Week</h2>
      <p className="text-lg mb-8 px-2 text-center">
        Discover the best photograph taken by our talented members every week!
        Check out this week's featured photo and learn more about the
        photographer.
      </p>
      <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col md:flex-row items-center md:items-start max-w-4xl w-full">
        <div className="w-full md:w-1/2">
          <img
            src={fotoData.photo_link || "/fotosoc_logo.png"}
            alt="Foto of the Week"
            className="rounded-lg w-full h-auto shadow-md transition-transform duration-300 transform hover:scale-105"
          />
        </div>
        <div className="mt-6 md:mt-0 md:ml-8 w-full md:w-1/2">
          <h3 className="text-xl font-bold mb-2 text-black">
            ✨ Foto of the Week ✨
          </h3>
          <p className="text-md mb-2 text-black">
            <b>Caption:</b> {fotoData.caption}
          </p>
          <p className="text-md text-black">
            <b>Shot By:</b> {fotoData.photographer_name}
          </p>

          {fotoData.instagram_link && (
            <a
              href={fotoData.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-pink-600 text-white py-2 px-4 mr-4 my-4 rounded-lg shadow-md hover:bg-pink-700 transition duration-300 hvr-grow"
            >
              <FontAwesomeIcon icon={faInstagram} className="mr-2 text-2xl" />
              {fotoData.instagram_username}
            </a>
          )}
          <a
            href="/gallery/foto-of-the-week"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-600 transition duration-300 hvr-grow"
          >
            View Previous Winners
          </a>
        </div>
      </div>
    </div>
  );
};

export default FotoOfTheWeek;
