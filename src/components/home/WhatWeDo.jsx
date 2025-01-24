import React from 'react'

const whatWeDo = [
  { id: 1,
    name: "Fun & Educational Events",
    position: "We host workshops that are aimed at all levels of photographers, from beginners to advanced. We also host a yearly Fotocrawl around Dublin City Centre.",
    image: "/whatwedo/fotocrawl.png",
  },
  { id: 2,
    name: "Yearly Photobook Issue",
    position: "Each year we release a photobook that showcases the best photos taken by our members. This is a great way to get your work published and seen by others. This year's theme is 'Wild'.",
    image: "/whatwedo/connection.png",
  },
  { id: 3,
    name: "Photography Discounts",
    position: "We have partnered up with John Gunn Camera Shop in Dublin to provide all DCU Fotosoc members with a 10% discount on development, scanning and printing services.",
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
        <div key={member.id} className="rounded-lg shadow-2xl p-6 bg-gradient-to-r from-blue-400 to-blue-500 m-3">
          <div className="flex items-center justify-center mb-4">
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