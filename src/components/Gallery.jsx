import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/gallery');
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load gallery');
        setItems(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 test-gallery-container">
      <div className="max-w-6xl mx-auto mb-xl" style={{ marginBottom: '15rem' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 test-gallery-header">
          <h2 className="text-2xl font-bold text-gray-800 test-gallery-heading">Travel Gallery</h2>
          {isLoggedIn && (
            <button
              onClick={() => navigate('/submit-gallery')}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition shadow-sm test-gallery-share-button"
            >
              + Share Your Photo
            </button>
          )}
        </div>

        {loading && <p className="text-center text-gray-500 py-12 test-gallery-loading-indicator">Loading gallery...</p>}
        
        {error && (
          <p className="text-center text-red-500 py-12 text-red-700 test-gallery-error-message">
            {error}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow test-gallery-empty-state">
            <p className="text-gray-500 text-lg mb-2 test-gallery-empty-title">No approved photos yet.</p>
            <p className="text-gray-400 text-sm mb-5 test-gallery-empty-subtitle">Be the first to share your travel experience!</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 test-gallery-grid">
            {items.map(item => (
              <div key={item._id} className="overflow-hidden rounded-xl shadow-md bg-white group test-gallery-card">
                <div className="h-56 overflow-hidden test-gallery-image-wrapper">
                  <img
                    src={item.imageUrl}
                    alt={item.placeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 test-gallery-card-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                  />
                </div>
                <div className="p-4 test-gallery-card-body">
                  <h3 className="font-semibold text-gray-800 text-lg test-gallery-card-title">{item.placeName}</h3>
                  {item.description && (
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2 test-gallery-card-description">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 test-gallery-card-footer">
                    <span className="text-xs text-gray-400 test-gallery-card-author">By {item.userName}</span>
                    <a
                      href={item.placeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-700 font-medium test-gallery-card-map-link"
                    >
                      View on Map →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA banner for logged-out users */}
        {!isLoggedIn && !loading && (
          <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6 text-center test-gallery-login-cta">
            <h3 className="text-lg font-bold text-green-800 mb-1 test-gallery-cta-title">Have a travel photo to share?</h3>
            <p className="text-green-700 text-sm mb-4 test-gallery-cta-subtitle">Login and submit your travel photo to be featured in our gallery.</p>
            <button
              onClick={() => navigate('/userlogin')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold test-gallery-cta-login-button"
            >
              Login to Submit
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;