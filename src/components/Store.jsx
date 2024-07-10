import React, { useState } from 'react';
import connection_iii from '../images/store/connection-iii.png';
import connection_iv from '../images/store/connection-iv.png';
import hoodies from '../images/store/hoodies.png';
import tote_bag from '../images/store/tote-bag.png';
import getStripe from '../scripts/getStripe';

// const stripePriceID = process.env.REACT_APP_STRIPE_PRICE_ID;
const stripePriceID = window._env_.REACT_APP_STRIPE_PRICE_ID;

const items = [
  {
    id: 1,
    name: "Fotosoc Hoodie",
    description: "A Fotosoc hoodie to keep you warm and stylish!",
    sizes: ["XS", "S", "M", "L", "XL"],
    price: "€25.00",
    image: hoodies
  },
  {
    id: 2,
    name: "Fotosoc Tote Bag",
    description: "A Fotosoc tote bag to carry your camera gear!",
    sizes: null,
    price: "€10.00",
    image: tote_bag
  },
  {
    id: 3,
    name: "Connection III: Reflection",
    description: "Check out our latest zine, Connection III: Reflection!",
    sizes: null,
    price: "€10.00",
    image: connection_iii
  },
  {
    id: 4,
    name: "Connection IV: Balance",
    description: "Check out our latest zine, Connection IV: Balance!",
    sizes: null,
    price: "€10.00",
    image: connection_iv
  }
];

async function handleCheckout() {
  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    lineItems: [
      {
        price: stripePriceID,
        quantity: 1,
      },
    ],
    mode: 'payment',
    successUrl: `http://localhost:3000/success`,
    cancelUrl: `http://localhost:3000/store`,
  });
  console.warn(error.message);
}

const Store = () => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-600">
    <div className="container mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8 text-white">Store</h2>
    <div className="p-4 bg-white rounded-lg shadow-xl">
      <div className="flex">
        <img src={selectedItem.image} alt={selectedItem.name} className="w-1/3 object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105" />
        <div className="w-2/3 pl-4">
          <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
          <p className="mt-2">{selectedItem.description}</p>
          {selectedItem.sizes && (
  <div className="mt-2">
    <span className="font-semibold">Sizes: </span>
    {selectedItem.sizes.join(", ")}
  </div>
)}
          <div className="mt-2 text-xl font-bold">{selectedItem.price}</div>
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleCheckout}>Buy Now</button>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-4 md:grid-rows-1">
        {items.map(item => (
          <div key={item.id} className="border p-2 cursor-pointer" onClick={() => setSelectedItem(item)}>
            <img src={item.image} alt={item.name} className="w-full object-cover rounded shadow-md transition-transform duration-300 transform hover:scale-105" />
            <h3 className="mt-2 text-center">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
};

export default Store;
