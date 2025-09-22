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
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white py-8 min-h-screen w-full">
      <PageHeading heading="Quick Links" />
      <div className="rounded-lg shadow-2xl p-4 bg-white
 m-3">
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
                className="w-full bg-[#3774aa] text-white px-6 py-4 rounded-lg 
                           hover:bg-[#2e5f8f]
                           transition-colors 
                           text-lg font-medium"
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
