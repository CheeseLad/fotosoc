// Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmailDomain = (email) => {
    return email.endsWith('@mail.dcu.ie') || email.endsWith('@dcu.ie');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate email domain before attempting registration
    if (!validateEmailDomain(email)) {
      setError("Only @mail.dcu.ie or @dcu.ie email addresses are allowed for registration.");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-[#1E464B] to-[#2A6268] text-white min-h-screen">
      <h2 className="text-4xl font-extrabold text-center mb-8">Register</h2>
      <div className="bg-white rounded-lg shadow-2xl p-8 mt-4 mx-4 md:mx-12 lg:mx-20 md:min-w-[400px]">
        <form onSubmit={handleRegister} className="text-black space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="register-email" className="block mb-2 text-lg font-medium">Email Address</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@mail.dcu.ie"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">Only @mail.dcu.ie or @dcu.ie email addresses are accepted</p>
          </div>
          <div>
            <label htmlFor="register-password" className="block mb-2 text-lg font-medium">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
