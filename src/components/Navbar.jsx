import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if admin and user are logged in
  useEffect(() => {
    const checkStatus = () => {
      const isAdmin = localStorage.getItem('tb_is_admin') === 'true';
      const isUser = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('user');

      setIsAdminLoggedIn(isAdmin);
      setIsUserLoggedIn(isUser);
      setUser(userData ? JSON.parse(userData) : null);
    };

    checkStatus();

    window.addEventListener('storage', checkStatus);

    return () => {
      window.removeEventListener('storage', checkStatus);
    };
  }, []);

  // User logout function
  const handleUserLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsUserLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  // ------------------------------------------------This is fron responsivness
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white rounded-2xl shadow-lg p-4 sticky top-0 z-[1] test-navbar-container">
      <div className="container mx-auto flex justify-between items-center">
        <div className="ml-10 flex items-center space-x-3 test-navbar-logo-container">
          <box-icon name='trip' animation='tada' ></box-icon>
          <span className="text-xl font-bold text-gray-800 test-navbar-brand-name">TripBuddy</span>
        </div>


        <div className="hidden md:flex items-center space-x-6 test-desktop-menu">
          <Link to="/" className="text-gray-600 hover:text-green-600 font-bold test-nav-home-link">
            Home
          </Link>
          <Link to="/deals" className="text-gray-600 hover:text-green-600 font-bold test-nav-deals-link">
            Deals
          </Link>
          <Link to="/my-bookings" className="text-gray-600 hover:text-green-600 font-bold test-nav-bookings-link">
            Booking
          </Link>       
          <Link to="/gallery" className="text-gray-600 hover:text-green-600 font-bold test-nav-gallery-link">
            Gallery
          </Link>
          <Link to="/contactus" className="text-gray-600 hover:text-green-600 font-bold mr-20 test-nav-contact-link">
            Contact
          </Link>
            
          {isUserLoggedIn ? (
            <div className="flex items-center space-x-3 test-user-profile-section">


              <span className="text-green-600 text-bold test-user-welcome-message">Welcome, {user?.name}</span>
              <button
                onClick={handleUserLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-800 shadow-xl transition test-user-logout-button"
              >
                Logout
              </button>


            </div>
          ) : (
            <Link to="/userlogin" className="test-nav-login-wrapper">
              <button className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-800 shadow-xl transition test-user-login-button">
                Login / Signup
              </button>
            </Link> 
          )}

          <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2  rounded-full font-semibold hover:bg-green-800 shadow-xl scale-lg transition test-nav-admin-dashboard-link">
              Admin
            </Link>
        </div>


        <div className="md:hidden flex items-center test-mobile-menu-toggle-container">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none test-mobile-hamburger-button">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>


      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4 test-mobile-menu-dropdown`}>
        <div className="flex flex-col space-y-2">
          <Link to="/" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-home-link">
            Home
          </Link>
          <Link to="/deals" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-deals-link">
            Deals
          </Link>
          <Link to="/gallery" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-gallery-link">
            Gallery
          </Link>
          <Link to="/contactus" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-contact-link">
            Contact Us
          </Link>
          {isAdminLoggedIn ? (
            <Link to="/dashboard" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-admin-dashboard-link">
              Dashboard
            </Link>
          ) : (
            <Link to="/admin" className="block text-gray-600 hover:text-red-600 font-medium py-2 test-mobile-nav-admin-login-link">
              Admin Login
            </Link>
          )}
          {isUserLoggedIn ? (
            <div className="mt-2 test-mobile-user-section">
              <Link to="/my-bookings" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-my-bookings-link">
                My Bookings
              </Link>
              <Link to="/my-gallery" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-my-gallery-link">
                My Gallery
              </Link>
              <Link to="/submit-gallery" className="block text-gray-600 hover:text-green-600 font-medium py-2 test-mobile-nav-submit-gallery-link">
                Submit Photo
              </Link>
              <div className="text-gray-600 mb-2 test-mobile-user-welcome-message">Welcome, {user?.name}</div>
              <button
                onClick={handleUserLogout}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-800 shadow-xl transition test-mobile-user-logout-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/userlogin" className="test-mobile-nav-login-wrapper">
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-800 shadow-xl transition mt-2 test-mobile-user-login-button">
                Login / Signup
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;