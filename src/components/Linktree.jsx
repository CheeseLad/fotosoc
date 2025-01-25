import React from 'react'

const links = [
  {
    "link_name": "Check out our new Website!",
    "link_url": "https://www.dcufotosoc.ie"
  },
  {
    "link_name": "Connection V Submissions!",
    "link_url": "https://docs.google.com/forms/d/e/1FAIpQLSe2o0WBruUOY5xadXjzjCUE0gy-h1cm-yDB2snhkSZd4qzkfQ/viewform?vc=0&c=0&w=1&flr=0"
  },

  {
    "link_name": "Sign up here! - DCU Clubs & Socs",
    "link_url": "https://dcuclubsandsocs.ie/society/fotosoc"
  },
  {
    "link_name": "Instagram",
    "link_url": "https://www.instagram.com/dcufotosoc"
  },
  {
    "link_name": "TikTok",
    "link_url": "https://www.tiktok.com/@dcufotosoc"
  }
]

const Linktree = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 min-h-screen w-full">
      <h2 className="text-3xl font-bold text-center mb-8">Quick Links</h2>
      <div className="bg-white rounded-lg shadow-xl p-6 mx-4">
        {links.map((link, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default Linktree;