import React, { useState, useEffect } from 'react';
import PageHeading from '../PageHeading';

const EquipmentList = () => {

  const [equipmentList, setEquipmentList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [bookingRequest, setBookingRequest] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => {
        setEquipmentList(data);
        // Initialize quantities to 0 for each equipment
        const initialQuantities = {};
        data.forEach((equipment, index) => {
          initialQuantities[index] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("Error fetching equipment:", err));
  }, []);

  const adjustQuantity = (index, change) => {
    setQuantities(prev => ({
      ...prev,
      [index]: Math.max(0, Math.min(prev[index] + change, equipmentList[index]?.amount || 0))
    }));
  };

  const addToRequest = (equipment, index) => {
    const quantity = quantities[index];
    if (quantity > 0) {
      const existingItem = bookingRequest.find(item => item.name === equipment.name);
      if (existingItem) {
        setBookingRequest(prev => 
          prev.map(item => 
            item.name === equipment.name 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setBookingRequest(prev => [...prev, {
          name: equipment.name,
          quantity: quantity,
          image_link: equipment.image_link
        }]);
      }
      // Reset quantity to 0 after adding to request
      setQuantities(prev => ({ ...prev, [index]: 0 }));
    }
  };

  const clearBookingRequest = () => {
    setBookingRequest([]);
  };

  const removeFromRequest = (itemName) => {
    setBookingRequest(prev => prev.filter(item => item.name !== itemName));
  };

  return (
    <div className="bg-gradient-to-r from-[#1E464B] to-[#2A6268] flex flex-col justify-center items-center text-white py-8">
      <div className="w-full max-w-6xl">
      <PageHeading 
        heading="Loan Equipment" 
        subheading="Fill in the form to loan equipment from us!"
        className="text-white"
      />
        
        
        <div className="bg-white rounded-lg shadow-xl p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {equipmentList.map((equipment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{equipment.name}</h3>
                <p className="text-sm text-gray-600 mb-3">Available: {equipment.amount}</p>
                {equipment.image_link && (
                  <div className="mb-3">
                    <img
                      src={equipment.image_link}
                      alt={equipment.name}
                      className="w-32 h-32 object-cover rounded-md mx-auto"
                    />
                  </div>
                )}
                
                {/* Quantity Controls */}
                <div className="mb-3">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => adjustQuantity(index, -1)}
                      disabled={quantities[index] <= 0}
                      className="bg-red-500 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold text-gray-800 min-w-[2rem]">
                      {quantities[index] || 0}
                    </span>
                    <button
                      onClick={() => adjustQuantity(index, 1)}
                      disabled={quantities[index] >= equipment.amount}
                      className="bg-green-500 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Request Button */}
                <button 
                  onClick={() => addToRequest(equipment, index)}
                  disabled={quantities[index] <= 0}
                  className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300"
                >
                  Add to Request
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Booking Request Summary */}
        {bookingRequest.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Booking Request</h2>
            <div className="space-y-2">
              {bookingRequest.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <span className="text-gray-800 font-medium">{item.name}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => removeFromRequest(item.name)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm transition-colors duration-300"
                      title="Remove from request"
                    >
                      ×
                    </button>
                    <span className="text-gray-600">Quantity: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                onClick={clearBookingRequest}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Clear All
              </button>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
                Submit Request
              </button>
            </div>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default EquipmentList;
