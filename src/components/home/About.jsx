import React from "react";
import YouTubePlayer from "../YouTubePlayer";

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-4">About Fotosoc</h2>
      <p className="text-lg mb-4">
        Watch this video to learn all about DCU's Photography Society
      </p>
      <div className="video-container rounded-xl overflow-hidden shadow-2xl mb-8">
        <YouTubePlayer />
      </div>
     <div className="bg-white rounded-lg shadow-xl p-6 mt-10 w-full max-w-sm sm:max-w-md md:max-w-lg">
  <h3 className="text-xl font-bold mb-4 text-black text-center pb-4">
    Check Out Our Socials!
  </h3>
  <ul className="flex flex-wrap justify-center gap-6 items-center">
  <li className="p-2">
    <a
      href="https://chat.whatsapp.com/KcWm0mU78nyHKMibl3Vlko"
      aria-label="DCU Fotosoc WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-whatsapp text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>
  <li className="p-2">
    <a
      href="https://www.tiktok.com/@dcufotosoc"
      aria-label="DCU Fotosoc TikTok"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-tiktok text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>
  <li className="p-2">
    <a
      href="https://instagram.com/dcufotosoc"
      aria-label="DCU Fotosoc Instagram"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-instagram text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>
  <li className="p-2">
    <a
      href="mailto:committee@dcufotosoc.ie"
      aria-label="DCU Fotosoc Email"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fa fa-envelope text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>
  <li className="p-2">
    <a
      href="https://www.youtube.com/@dcufotosoc3388"
      aria-label="DCU Fotosoc YouTube"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-youtube text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>
  <li className="p-2">
    <a
      href="https://facebook.com/DCUPhotographySociety"
      aria-label="DCU Fotosoc Facebook"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-facebook text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>

  <li className="p-2">
    <a
      href="https://www.linkedin.com/company/dcufotosoc"
      aria-label="DCU Fotosoc LinkedIn"
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className="fab fa-linkedin text-gray-800 hover:text-gray-600 text-5xl hvr-bob" />
    </a>
  </li>
</ul>

</div>

    </div>
  );
};

export default About;
