import React, { useState, useEffect } from "react";
import PageHeading from "../PageHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faTrash } from "@fortawesome/free-solid-svg-icons";

const LoanBooking = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [bookingRequest, setBookingRequest] = useState([]);
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Helper to get local datetime string for input[type="datetime-local"]
  const getLocalDateTimeString = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [startDateTime, setStartDateTime] = useState(getLocalDateTimeString());
  const getEndDateTimeString = () => {
    const start = new Date();
    start.setHours(start.getHours() + 2);
    const offset = start.getTimezoneOffset();
    const local = new Date(start.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };
  const [endDateTime, setEndDateTime] = useState(getEndDateTimeString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [studentIdError, setStudentIdError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/equipment`)
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
    const equipment = equipmentList[index];
    if (!equipment) return;
    
    const availableQuantity = getAvailableQuantity(equipment.name);
    
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max(
        0,
        Math.min(prev[index] + change, availableQuantity)
      ),
    }));
  };

  const addToRequest = (equipment, index) => {
    const quantity = quantities[index];
    if (quantity > 0) {
      const existingItem = bookingRequest.find(
        (item) => item.name === equipment.name
      );
      if (existingItem) {
        setBookingRequest((prev) =>
          prev.map((item) =>
            item.name === equipment.name
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setBookingRequest((prev) => [
          ...prev,
          {
            name: equipment.name,
            quantity: quantity,
            image_link: equipment.image_link,
          },
        ]);
      }
      // Reset quantity to 0 after adding to request
      setQuantities((prev) => ({ ...prev, [index]: 0 }));
    }
  };

  const clearBookingRequest = () => {
    setBookingRequest([]);
  };

  const removeFromRequest = (itemName) => {
    setBookingRequest((prev) => prev.filter((item) => item.name !== itemName));
  };

  const validateEmail = (email) => {
    return (
      email.endsWith("@mail.dcu.ie") ||
      email.endsWith("@dcu.ie")
    );
  };

  const validateStudentId = (studentId) => {
    // Must be alphanumeric and max 9 characters
    const regex = /^[a-zA-Z0-9]{1,9}$/;
    return regex.test(studentId);
  };

  const validatePhoneNumber = (phone) => {
    // Basic phone validation - allows various formats
    const regex = /^[+]?[1-9][\d]{0,15}$/;
    return phone.length >= 7 && regex.test(phone.replace(/[\s\-()]/g, ''));
  };

  // Calculate real-time availability for equipment
  const getAvailableQuantity = (equipmentName) => {
    const equipment = equipmentList.find(eq => eq.name === equipmentName);
    if (!equipment) return 0;
    
    const totalAvailable = equipment.amount;
    const bookedQuantity = bookingRequest.find(item => item.name === equipmentName)?.quantity || 0;
    
    return Math.max(0, totalAvailable - bookedQuantity);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setEmailError("");
    setStudentIdError("");
    setPhoneError("");
    
    if (!validateEmail(email)) {
      setEmailError("Email must end with @mail.dcu.ie or @dcu.ie");
      return;
    }
    
    if (!validateStudentId(studentId)) {
      setStudentIdError("Student ID must be alphanumeric and maximum 9 characters");
      return;
    }
    
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    
    if (bookingRequest.length === 0) {
      setMessage("Please add at least one equipment item to your booking request.");
      return;
    }
    
    setLoading(true);

    const bookingData = {
      user_email: email,
      student_id: studentId,
      user_phone: phoneNumber,
      equipment: bookingRequest, // Send the entire booking request array
      start_datetime: startDateTime.replace("T", " "),
      end_datetime: endDateTime.replace("T", " "),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();
      if (res.ok) {
        const successMsg = "Booking successful! Check your email for the confirmation. If you don't see it, check your spam folder.";
        setMessage(successMsg);
        alert(successMsg);
        // Clear the booking request after successful submission
        setBookingRequest([]);
        setEmail("");
        setStudentId("");
        setPhoneNumber("");
        setMessage("");
      } else {
        setMessage(result.error || "Failed to book equipment.");
        alert(result.error || "Failed to book equipment.");
      }
    } catch (err) {
      setMessage("Error connecting to the server.");
      alert("Error connecting to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-[#1E464B] to-[#2A6268] min-h-screen py-8">
      <div className="w-full max-w-7xl mx-auto px-4">
        <PageHeading
          heading="Loan Equipment"
          subheading="Select equipment and fill in the form to make a booking request"
          className="text-white text-center mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Equipment Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Available Equipment</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {equipmentList.map((equipment, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      getAvailableQuantity(equipment.name) === 0 
                        ? 'bg-gray-200 opacity-75' 
                        : 'bg-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {equipment.name}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        getAvailableQuantity(equipment.name) === 0 
                          ? 'text-red-600 font-semibold' 
                          : getAvailableQuantity(equipment.name) <= 2 
                            ? 'text-yellow-600 font-semibold' 
                            : 'text-gray-600'
                      }`}>
                        Available: {getAvailableQuantity(equipment.name)}
                        {getAvailableQuantity(equipment.name) === 0 && ' (Out of Stock)'}
                        {getAvailableQuantity(equipment.name) > 0 && getAvailableQuantity(equipment.name) <= 2 && ' (Low Stock)'}
                      </p>
                        <div className="mb-3">
                          <img
                            src={equipment.image_link || "/fotosoc_logo_square.png"}
                            alt={equipment.name}
                            className="w-24 h-24 object-cover rounded-md mx-auto"
                          />
                        </div>

                      {/* Quantity Controls */}
                      <div className="mb-3">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => adjustQuantity(index, -1)}
                            disabled={quantities[index] <= 0}
                            className="bg-red-500 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold text-gray-800 min-w-[2rem]">
                            {quantities[index] || 0}
                          </span>
                          <button
                            onClick={() => adjustQuantity(index, 1)}
                            disabled={quantities[index] >= getAvailableQuantity(equipment.name)}
                            className="bg-green-500 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-1 px-3 rounded-full transition-colors duration-300"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to Request Button */}
                      <button
                        onClick={() => addToRequest(equipment, index)}
                        disabled={quantities[index] <= 0 || getAvailableQuantity(equipment.name) <= 0}
                        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded w-full transition-colors duration-300"
                      >
                        {getAvailableQuantity(equipment.name) <= 0 ? 'Out of Stock' : 'Add to Request'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Cart and Booking Form */}
          <div className="space-y-6">
            {/* Booking Request Summary */}
            {bookingRequest.length > 0 ? (
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Booking Cart ({bookingRequest.length} item{bookingRequest.length !== 1 ? 's' : ''})
                </h2>
                <div className="space-y-3">
                  {bookingRequest.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-300 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {item.image_link && (
                          <img
                            src={item.image_link}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="text-gray-800 font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600 font-medium">
                          Amount: {item.quantity}
                        </span>
                        <button
                          type="button"
                          title="Remove from request"
                          onClick={() => removeFromRequest(item.name)}
                          className="bg-red-500 text-white text-xl px-2 py-1 rounded hover:bg-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-300">
                  <div className="text-sm font-semibold text-gray-800">
                    Total items: {bookingRequest.reduce((sum, item) => sum + item.quantity, 0)}
                  </div>
                  <button
                    onClick={clearBookingRequest}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-xl p-6 text-center">
                <div className="text-gray-500 mb-4 text-5xl mt-4">
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Select equipment from the left to add items to your booking request.</p>
              </div>
            )}

            {/* Booking Form */}
            {bookingRequest.length > 0 && (
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h2>
                
                {message && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${
                    message.includes('successful') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your student email (@mail.dcu.ie or @dcu.ie)"
                    />
                    {emailError && (
                      <div className="text-red-500 text-xs mt-1">
                        {emailError}
                      </div>
                    )}
                  </div>

                  {/* Student ID Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                      required
                      maxLength="9"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your student ID (max 9 characters)"
                    />
                    {studentIdError && (
                      <div className="text-red-500 text-xs mt-1">
                        {studentIdError}
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number (e.g., +353 1 234 5678)"
                    />
                    {phoneError && (
                      <div className="text-red-500 text-xs mt-1">
                        {phoneError}
                      </div>
                    )}
                  </div>

                  {/* Start Date & Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={startDateTime}
                      onChange={(e) => setStartDateTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* End Date & Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white w-full px-4 py-3 mt-6 rounded-lg font-semibold transition-colors duration-300 shadow-lg"
                  >
                    {loading ? "Submitting..." : `Submit Loan Request (${bookingRequest.length} item${bookingRequest.length !== 1 ? 's' : ''})`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanBooking;
