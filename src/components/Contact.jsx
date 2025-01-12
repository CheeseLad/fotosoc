import React from "react";

const Contact = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-4xl font-extrabold text-center mb-8">Contact Us</h2>
      <p className="text-lg px-6 sm:px-12 md:px-20 text-center mb-8">
        Fill in the form or send us an email at
        <a
          className="hover:underline ml-1"
          href="mailto:committee@dcufotosoc.ie"
        >
          committee@dcufotosoc.ie
        </a>
      </p>
      <div className="bg-white rounded-lg shadow-2xl p-8 mt-4 mx-4 md:mx-12 lg:mx-20 md:min-w-[500px] sm:min-w-[400px]">
        <form
          action="https://formspree.io/f/mvgoavrb"
          method="POST"
          className="text-black space-y-6"
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block mb-2 text-lg font-medium"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="contact-name"
              placeholder="Jake Farrell"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block mb-2 text-lg font-medium"
            >
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="webmaster@dcufotosoc.ie"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block mb-2 text-lg font-medium"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Type your message here..."
              rows="8"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
