import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col items-center justify-center sm:flex-row sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-400 text-center sm:text-left mx-8">
            DCU Fotosoc &copy; 2003 - {new Date().getFullYear()}. Designed and maintained by <a 
              href="https://www.jakefarrell.ie/" 
              aria-label="Jake Farrell's Personal Website" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-500 hover:shadow-blue-500 text-white"
            >Jake Farrell</a>
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-end">
          <a 
            href="https://www.tiktok.com/@dcufotosoc" 
            aria-label="DCU Fotosoc TikTok" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-gray-400 mx-2 text-2xl"
          >
            <FontAwesomeIcon icon={faTiktok} />
          </a>
          <a 
            href="https://www.instagram.com/dcufotosoc" 
            aria-label="DCU Fotosoc Instagram" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-gray-400 mx-2 text-2xl"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a 
            href="mailto:committee@dcufotosoc.ie" 
            aria-label="DCU Fotosoc Email" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-gray-400 mx-2 text-2xl"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a 
            href="https://www.youtube.com/@dcufotosoc3388" 
            aria-label="DCU Fotosoc YouTube" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-gray-400 mx-2 text-2xl"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
