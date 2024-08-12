// Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
      <h2 className="text-4xl font-extrabold text-center mb-8">Login</h2>
      <div className="bg-white rounded-lg shadow-2xl p-8 mt-4 mx-4 md:mx-12 lg:mx-20 md:min-w-[400px]">
        <form onSubmit={handleLogin} className="text-black space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label htmlFor="login-email" className="block mb-2 text-lg font-medium">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block mb-2 text-lg font-medium">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-blue-500 mt-2">Don't have an account? <a href="/register" className="underline">Register here</a></p>
            <p className="text-sm text-blue-500 mt-2">Forgot your password? <a href="/reset-password" className="underline">Reset it here</a></p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
