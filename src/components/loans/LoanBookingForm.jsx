import React, { useState, useEffect } from "react";
import PageHeading from '../PageHeading';

export default function LoanBookingForm() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [amount, setAmount] = useState(1);
  const [email, setEmail] = useState("");
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

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipmentList(data))
      .catch((err) => console.error("Error fetching equipment:", err));
  }, []);

  const validateEmail = (email) => {
    return (
      email.endsWith("@mail.dcu.ie") ||
      email.endsWith("@dcu.ie")
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!validateEmail(email)) {
      setEmailError("Email must end with @mail.dcu.ie or @dcu.ie");
      return;
    }
    setLoading(true);

    const bookingData = {
      user_email: email,
      equipment: selectedEquipment,
      amount: amount,
      start_datetime: startDateTime.replace("T", " "),
      end_datetime: endDateTime.replace("T", " "),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();
      setMessage(res.ok ? "Booking successful! Check your email for the confirmation. If you don't see it, check your spam folder." : result.error || "Failed to book equipment.");
    } catch (err) {
      setMessage("Error connecting to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="px-8 flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] py-8 min-h-screen">
      <PageHeading 
        heading="Loan Equipment" 
        subheading="Fill in the form to loan equipment from us!"
        className="text-white"
      />
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">

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
            placeholder="Enter your student email (@mail.dcu.ie or @dcu.ie)"
          />
          {emailError && (
            <div className="text-red-500 text-xs mt-1">{emailError}</div>
          )}
        </div>

        {/* Equipment Dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-2">Equipment:</label>
          <select
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">No Equipment Selected</option>
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.name}>
                {eq.name} (Available: {eq.amount})
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
            min="1"
          />
        </div>

        {/* Start Date & Time */}
        <div>
          <label className="block text-sm font-semibold">Start Date & Time:</label>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* End Date & Time */}
        <div>
          <label className="block text-sm font-semibold">End Date & Time:</label>
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white w-full px-4 py-2 mt-4 mr-4 rounded-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-600/50">
          {loading ? "Submitting..." : "Submit Loan Request"}
        </button>
      </form>
    </div>
    </div>
  );
}
