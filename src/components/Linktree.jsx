import React, { useEffect, useState } from "react";
import linksData from '../data/links.json';
import PageHeading from './PageHeading';

const Linktree = ({ sheetUrl }) => {
  const [links, setLinks] = useState(linksData);

  const fetchLinktreeData = async (sheetUrl) => {
    try {
      const csvUrl = sheetUrl.replace("/edit", "/export?format=csv&");
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      const rows = csvText.split("\n").slice(1);
      const parsedLinks = rows
        .map((row) => {
          const [text, link] = row
            .split(",")
            .map((col) => col.trim().replace(/(^"|"$)/g, ""));
          return text && link ? { link_name: text, link_url: link } : null;
        })
        .filter((link) => link !== null);
      setLinks(parsedLinks);
    } catch (error) {
      console.error("Error fetching linktree data:", error);
    }
  };

  useEffect(() => {
    if (sheetUrl) {
      fetchLinktreeData(sheetUrl);
    }
  }, [sheetUrl]);

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 min-h-screen w-full">
      <PageHeading heading="Quick Links" />
      <div className="bg-white rounded-lg shadow-xl p-6 mx-4">
        {links.length > 0 ? (
          links.map((link, index) => (
            <a
              key={index}
              href={link.link_url}
              className="block w-full mb-4 last:mb-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="w-full bg-purple-500 text-white px-6 py-4 rounded-lg 
                           hover:bg-purple-600 active:bg-purple-700 
                           transition-colors 
                           text-lg font-medium
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {link.link_name}
              </button>
            </a>
          ))
        ) : (
          <p className="text-center text-white text-lg">Loading links...</p>
        )}
      </div>
    </div>
  );
};

export default Linktree;
