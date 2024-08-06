import React, { useState } from 'react';

const testimonials = [
  { message: "This is the best platform I've ever used!", name: "John Doe", course: "Computer Science" },
  { message: "Amazing experience and very helpful community.", name: "Jane Smith", course: "Mathematics" },
  { message: "Learned so much in such a short time.", name: "Samuel Green", course: "Physics" },
  { message: "Highly recommend to anyone looking to improve their skills.", name: "Emily White", course: "Chemistry" },
  { message: "The resources available are top-notch.", name: "Michael Brown", course: "Biology" }
];

const WhatOurMembersSay = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length);
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">What Our Members Say</h2>
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg rounded-lg p-6">
        <p className="text-lg italic">"{testimonials[currentIndex].message}"</p>
        <p className="mt-4 font-semibold">{testimonials[currentIndex].name}</p>
        <p className="text-sm text-gray-800">{testimonials[currentIndex].course}</p>
        <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          className="text-gray-800 hover:text-gray-900 text-3xl font-bold py-2 px-4 rounded-l"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="text-gray-800 hover:text-gray-900 text-3xl font-bold py-2 px-4 rounded-r"
        >
          &gt;
        </button>
      </div>
      <div className="flex justify-center mt-4">
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`mx-1 w-3 h-3 rounded-full ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      </div>

     
    </div>
  );
};

export default WhatOurMembersSay;
