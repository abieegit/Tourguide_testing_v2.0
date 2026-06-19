import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/deals');
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load deals');
        setDeals(data.data || []);
      } catch (err) {
        setError(err.message || 'Error loading deals');
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  const handleBookNow = async (deal) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      alert('Please login to book this deal!');
      navigate('/userlogin');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          tourId: deal._id,
          tourTitle: deal.title
        })
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create booking');
      }
      
      alert(data.message || `Booking requested for ${deal.title}! Please check 'My Bookings' for status.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    if (!debouncedQuery) return true;
    const q = debouncedQuery.toLowerCase();
    return (
      (deal.title || '').toLowerCase().includes(q) ||
      (deal.description || '').toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchError('');
      return;
    }
    if (debouncedQuery.length < 2) {
      setSearchError('Please enter at least 2 characters to search.');
      return;
    }
    setSearchError('');
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto">
        {loading && <p className="mb-4">Loading deals...</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <div className="mb-6">
          <div className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deals by title or description..."
              aria-label="Search deals"
              className="w-full px-4 py-3 rounded-2xl border border-green-200 bg-white shadow-sm placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-green-200 text-green-600 hover:bg-green-50 px-3 py-1 rounded-full text-sm shadow-sm"
                data-testid="Clear-search"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">{debouncedQuery ? `Searching for "${debouncedQuery}"` : ''}</div>
        </div>

        {searchError && <p className="mb-4 text-yellow-700">{searchError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredDeals.map(deal => (
            <div key={deal._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-102">
              <div className="h-56 overflow-hidden">
                <img 
                  src={deal.imageUrl} 
                  alt={deal.title}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {deal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {deal.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Starting from</span>
                  <span className="font-bold text-xl text-green-600">RS {deal.price}/-</span>
                </div>
                <button 
                  onClick={() => handleBookNow(deal)}
                  data-testid="book-now-btn"
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white py-2 rounded-lg transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}

          {!loading && !error && filteredDeals.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              {debouncedQuery && !searchError ? (
                <>
                  <p className="mb-2">No deals matched "{debouncedQuery}".</p>
                  <p className="text-sm text-gray-400">Try different keywords or check spelling.</p>
                </>
              ) : (
                <p>No deals available.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Deals;