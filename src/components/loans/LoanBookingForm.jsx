import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function LoanBookingForm() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipmentList(data))
      .catch((err) => console.error("Error fetching equipment:", err));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = {
      user_email: email,
      equipment: selectedEquipment,
      quantity: quantity,
      start_datetime: startDateTime.toISOString().slice(0, 16).replace("T", " "),
      end_datetime: endDateTime.toISOString().slice(0, 16).replace("T", " ")
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();
      setMessage(res.ok ? "Booking successful!" : result.error || "Failed to book equipment.");
    } catch (err) {
      setMessage("Error connecting to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-xl font-bold mb-4">Book Equipment</h2>

      {message && (
        <div className="mb-4 text-center text-sm p-2 rounded bg-gray-100 text-gray-700">
          {message}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">

        {/* Email Input */}
        <div>
          <label className="block text-sm font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your email"
          />
        </div>

        {/* Equipment Dropdown */}
        <div>
          <label className="block text-sm font-semibold">Equipment:</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select Equipment</option>
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.name}>
                {eq.name} (Available: {eq.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time Pickers */}
        <div>
          <label className="block text-sm font-semibold">Start Date & Time:</label>
          <DatePicker
            selected={startDateTime}
            onChange={(date) => setStartDateTime(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">End Date & Time:</label>
          <DatePicker
            selected={endDateTime}
            onChange={(date) => setEndDateTime(date)}
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg">
          {loading ? "Booking..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
