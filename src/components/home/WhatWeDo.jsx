import React from 'react'

const whatWeDo = [
  { id: 1,
    name: "Fun Events",
    position: "The moment you’ve all been waiting for: Semester 2 Photocrawl! Meet up at the Student Union, 6 PM on the 7th.",
    image: "/whatwedo/fotocrawl.png",
  },
  { id: 2,
    name: "Yearly Photobook Issue",
    position: "Up your photography game this Thursday for our workshop on capturing your photography style through the lens.",
    image: "/whatwedo/connection.png",
  },
  { id: 3,
    name: "Photography Discounts",
    position: "Welcome everyone to the announcement of our yearly FotoSoc Trip (A Tradition started last year…) Spots are very limited so it is first come first served.",
    image: "/whatwedo/johngunn.png",
  }
]

const WhatWeDo = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white text-black">
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Why Join DCU Fotosoc?</h2>
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white">
      {whatWeDo.map(member => (
        <div key={member.id} className="rounded-lg shadow-2xl p-4 bg-gradient-to-r from-blue-400 to-blue-500 m-3">
          <div className="flex items-center justify-center my-4">
            <img src={member.image} alt={member.name} className="w-90 h-90 shadow-md border-8 transition-transform duration-300 transform hover:scale-105" />
          </div>
          <div className="text-center mb-3">
            <h3 className="text-3xl font-semibold mb-4">{member.name}</h3>
            <p className="text-xl italic">{member.position}</p>
          </div>
        </div>
      ))}
    </div>
    </div>
    </div>
  </div>
  )
}

export default WhatWeDo