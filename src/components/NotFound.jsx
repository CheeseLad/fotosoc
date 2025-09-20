import React from "react";
import PageHeading from "./PageHeading";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6 my-32 mx-10 md:min-w-[500px] sm:min-w-[400px]">
        <PageHeading 
          heading="404 Page Not Found" 
          subheading="The page you are looking for does not exist. Please check the page link and try again."
          className="text-black"
        />
        <div className="flex justify-center items-center mt-8">
          <a href="/">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">
              Return Home
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
