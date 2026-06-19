import React from 'react'
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <>
    <footer className="bg-green-600 m-1 text-white py-12 px-4 sm:px-6 lg:px-8 mt-10 rounded-xl overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
      <div className="flex flex-col items-start space-y-4">

        <div className="flex items-center space-x-2">
           <box-icon color="white" name='trip' animation='tada' ></box-icon>
          <span className="text-xl font-bold">Tripbuddy</span>
        </div>
        <p className="text-white text-sm">Innovating for a better tomorrow.</p>

        
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to="/" className="text-white hover:text-white transition-colors duration-200">Home</Link>
          </li>
          <li>
            <Link to="/aboutus" className="text-white hover:text-white transition-colors duration-200">About Us</Link>
          </li>
          <li>
            <Link to="/contactus" className="text-white hover:text-white transition-colors duration-200">Contact Us</Link>
          </li>
          
        </ul>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt text-white"></i>
            <span className="text-white">123 Corporate Blvd, Suite 456</span>
          </li>
          <li className="flex items-center space-x-2">
            <i className="fas fa-phone-alt text-white"></i>
            <a href="tel:123-456-7890" className="text-white hover:text-white transition-colors duration-200">(123) 456-7890</a>
          </li>
          <li className="flex items-center space-x-2">
            <i className="fas fa-envelope text-white"></i>
            <a href="mailto:info@company.com" className="text-white hover:text-white transition-colors duration-200">info@company.com</a>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-start">
        <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:opacity-80 transition-opacity"><box-icon name='facebook-square' type='logo' animation='tada' color="white" size="30px"></box-icon></a>
          <a href="#" className="hover:opacity-80 transition-opacity"><box-icon name='instagram' type='logo' animation='tada' color="white" size="30px"></box-icon></a>
          <a href="#" className="hover:opacity-80 transition-opacity"><box-icon name='twitter' type='logo' animation='tada' color="white" size="30px"></box-icon></a>
        </div>
      </div>
      
    </div>

    {/* Copyright Section */}
    <div className="mt-12 pt-8 border-t border-gray-800 text-center">
      <p className="text-white text-sm">
        &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Tripbuddy</span>. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    
    </>
  )
}

export default Footer;