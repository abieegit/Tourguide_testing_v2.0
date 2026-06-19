import React from 'react';

const Aboutus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To empower businesses and individuals through innovative technology solutions that simplify complex challenges and drive meaningful progress.
            </p>
            <p className="text-gray-600">
              We believe in creating products that are not only functional but also delightful to use, with a focus on user experience and accessibility.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
              alt="Our team collaborating" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>


      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-green-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're a passionate team dedicated to creating innovative solutions that make a difference in people's lives.
          </p>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">We constantly push boundaries and explore new possibilities.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">Great things happen when people work together with shared purpose.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-leaf"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">We build solutions that have a positive impact on society and environment.</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">
                <i className="fas fa-star"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for the highest quality in everything we do.</p>
            </div>
          </div>
        </div>
      </section>


      
    </div>
  );
};

export default Aboutus;