import React, { useState } from 'react';

const items = [
  {
    id: 1,
    name: "Item 1",
    description: "Description for item 1",
    sizes: ["S", "M", "L"],
    price: "$20.00",
    image: "./images/hero_1.png"
  },
  {
    id: 2,
    name: "Item 2",
    description: "Description for item 2",
    sizes: ["S", "M", "L"],
    price: "$30.00",
    image: "./images/hero_2.png"
  },
  {
    id: 3,
    name: "Item 3",
    description: "Description for item 3",
    sizes: ["S", "M", "L"],
    price: "$25.00",
    image: "./images/hero_3.png"
  },
  {
    id: 4,
    name: "Item 4",
    description: "Description for item 4",
    sizes: ["S", "M", "L"],
    price: "$22.00",
    image: "./images/hero_4.png"
  }
];

const Store = () => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <div className="container mx-auto py-12 ">
    <div className="p-4">
      <div className="flex">
        <img src={selectedItem.image} alt={selectedItem.name} className="w-1/3" />
        <div className="w-2/3 pl-4">
          <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
          <p className="mt-2">{selectedItem.description}</p>
          <div className="mt-2">
            <span className="font-semibold">Sizes: </span>
            {selectedItem.sizes.join(", ")}
          </div>
          <div className="mt-2 text-xl font-bold">{selectedItem.price}</div>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Buy</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Google Form</button>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="border p-2 cursor-pointer" onClick={() => setSelectedItem(item)}>
            <img src={item.image} alt={item.name} className="w-full" />
            <h3 className="mt-2 text-center">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Store;
