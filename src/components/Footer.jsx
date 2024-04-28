import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <p className="text-gray-400">DCU Fotosoc &copy; {new Date().getFullYear()}. Designed and maintained by <a href="https://www.jakefarrell.ie/" target='_blank'> Jake Farrell</a></p>
        </div>
        <div>
          {/* Font Awesome icons */}
          <a href="/" className="text-white hover:text-gray-400 mx-2">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="/" className="text-white hover:text-gray-400 mx-2">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="/" className="text-white hover:text-gray-400 mx-2">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="/" className="text-white hover:text-gray-400 mx-2">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="/" className="text-white hover:text-gray-400 mx-2">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
