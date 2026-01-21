import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import JoinButton from './../Joinbutton';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const ALLOWED_USER_ID = process.env.REACT_APP_ADMIN_USER_ID;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track logged-in user
  const [isAdmin, setIsAdmin] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state if logged in
      if (currentUser && currentUser.uid === ALLOWED_USER_ID) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen(!accountMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      alert("Logged out successfully");
      setAccountMenuOpen(false);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div>
      <nav className="bg-gray-800 p-4 flex justify-between items-center relative">
        <div className="flex items-center">
          <a href="/"><img src="/fotosoc_logo.png" width="100px" height="100px" alt="Logo" className="w-12 h-auto" /></a>
          <a href="/"><span className="text-white text-3xl ml-2 font-brushup">Fotosoc</span></a>
        </div>
        
        <div className="block md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:bg-gray-700 px-2 py-1 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        
        <div className="hidden md:flex space-x-12">
          <a href="/" className="text-white text-2xl hover:text-gray-300">Home</a>
          <a href="/portfolios" className="text-white text-2xl hover:text-gray-300">Portfolios</a>
          <a href="/workshops" className="text-white text-2xl hover:text-gray-300">Workshops</a>
          <a href="/gallery" className="text-white text-2xl hover:text-gray-300">Gallery</a>
          <a href="/committee" className="text-white text-2xl hover:text-gray-300">Committee</a>
          <a href="/links" className="text-white text-2xl hover:text-gray-300">Links</a>
          <a href="/contact" className="text-white text-2xl hover:text-gray-300">Contact</a>

          <div className="relative">
            <button
              onClick={toggleAccountMenu}
              className="flex items-center text-white text-2xl hover:text-gray-300 focus:outline-none transition duration-150 ease-in-out"
            >
              Account
              <ChevronDown className={`ml-1 h-5 w-5 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {user ? (
                  <>
                    <a href="/create-portfolio" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Create Portfolio
                    </a>
                    {isAdmin && (
                      <>
                        <a href="/create-gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Create Gallery
                        </a>
                        <a href="/caption-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Caption Dashboard
                        </a>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Register
                    </a>
                    <a href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Login
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <JoinButton />
        </div>
      </nav>

      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="bg-gray-800 flex flex-col items-left pl-5 space-y-4 py-4 relative">
          <a href="/" className="text-white text-2xl hover:text-gray-300">Home</a>
          <a href="/portfolios" className="text-white text-2xl hover:text-gray-300">Portfolios</a>
          <a href="/workshops" className="text-white text-2xl hover:text-gray-300">Workshops</a>
          <a href="/gallery" className="text-white text-2xl hover:text-gray-300">Gallery</a>
          <a href="/committee" className="text-white text-2xl hover:text-gray-300">Committee</a>
          <a href="/links" className="text-white text-2xl hover:text-gray-300">Links</a>
          <a href="/contact" className="text-white text-2xl hover:text-gray-300">Contact</a>

          <div className="relative mt-4">
            <button
              onClick={toggleAccountMenu}
              className="flex items-center text-white text-2xl hover:text-gray-300 focus:outline-none"
            >
              Account
              <ChevronDown className={`ml-1 h-5 w-5 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {accountMenuOpen && (
              <div className="mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1">
                {user ? (
                  <>
                    <a href="/create-portfolio" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">
                      Create Portfolio
                    </a>
                    {isAdmin && (
                      <>
                        <a href="/create-gallery" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">
                          Create Gallery
                        </a>
                        <a href="/caption-dashboard" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">
                          Caption Dashboard
                        </a>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/register" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">
                      Register
                    </a>
                    <a href="/login" className="block px-4 py-2 text-sm text-white hover:bg-gray-600">
                      Login
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <JoinButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
