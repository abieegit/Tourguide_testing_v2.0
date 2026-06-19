import React from "react";
import { Link } from "react-router-dom";
import Aboutus from "./Aboutus";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
        <div className="homeimg bg-white px-6 py-12 md:p-12 text-center w-full min-h-screen flex flex-col justify-center test-home-hero-container">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-600 mb-5 test-home-hero-heading">
            Your Next Adventure Awaits
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8 leading-relaxed test-home-hero-subheading">
            Find incredible travel deals, share your experiences, and connect with
            fellow explorers on TripBuddy.
          </p>
          <button className=" max-w-2xl mx-auto bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-800 duration-300 transform hover:scale-105 test-home-explore-deals-button">
            <Link to="/deals">Explore Deals</Link>
          </button>
        </div>

        <Aboutus/>
        <Footer/>
    </>

  );
};

export default Home;