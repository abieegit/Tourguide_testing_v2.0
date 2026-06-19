import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//-----------------------------------------------------Components
import Home from "./components/Home"
import Navbar from './components/Navbar';
import Deals from './components/Deals'
import AdminLogin from "./Adminlogin"; 
import AdminDashboard from "./Admindashboard";
import Userlogin from './Userlogin';
import ContactUs from './components/Contactus';
// import Aboutus from './components/Aboutus';
import Gallery from './components/Gallery';
import MyBookings from './components/MyBookings';
import Checkout from './components/Checkout';
import GallerySubmission from './components/GallerySubmission';
import MyGallery from './components/MyGallery';
import "./App.css"
import 'boxicons'
//---------------------------------------------------------------
 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/userlogin" element={< Userlogin/>} />
        <Route path="/contactus" element={< ContactUs/>} />
        {/* <Route path="/aboutus" element={< Aboutus/>} /> */}
        <Route path="/gallery" element={< Gallery/>} />
        <Route path="/my-bookings" element={< MyBookings/>} />
        <Route path="/checkout/:id" element={< Checkout/>} />
        <Route path="/submit-gallery" element={<GallerySubmission />} />
        <Route path="/my-gallery" element={<MyGallery />} />
        
      </Routes>
    </Router>
  </StrictMode>
);