import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex flex-col items-center justify-center sm:flex-row sm:justify-between">
<div className="mb-4 sm:mb-0">
  <p className="text-gray-400 text-center sm:text-left mx-2">
    DCU Fotosoc &copy; {new Date().getFullYear()}. Designed and maintained by 
    <a href="https://www.jakefarrell.ie/" aria-label="Jake Farrell's Personal Website" target="_blank" rel="noopener noreferrer" class="hover:text-blue-500 hover:shadow-blue-500 text-white"> Jake Farrell</a>
  </p>
</div>

        <div className="flex items-center justify-center sm:justify-end">
          <a href="https://www.facebook.com/DCUPhotographySociety" aria-label="DCU Fotosoc Facebook" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 mx-2 text-2xl">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="mailto:webmasterdcufotosoc@gmail.com" aria-label="DCU Fotosoc Email" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 mx-2 text-2xl">
            <i className="fa fa-envelope"></i>
          </a>
          <a href="https://www.instagram.com/dcufotosoc" aria-label="DCU Fotosoc Instagram" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 mx-2 text-2xl">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/company/dcufotosoc" aria-label="DCU Fotosoc LinkedIn" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 mx-2 text-2xl">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/@dcufotosoc3388" aria-label="DCU Fotosoc YouTube" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 mx-2 text-2xl">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
