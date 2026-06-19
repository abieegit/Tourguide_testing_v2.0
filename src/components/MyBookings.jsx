import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/userlogin');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/bookings/user/${user.id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load bookings');
        setBookings(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to cancel booking');
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckout = (bookingId) => {
    navigate(`/checkout/${bookingId}`);
  };

  if (loading) return <div className="p-8 text-center">Loading bookings...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div data-testid="no-bookings" className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
            <button 
              onClick={() => navigate('/deals')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Browse Deals
            </button>
          </div>
        ) : (
          <div data-testid="bookings-list" className="space-y-4">
            {bookings.map(booking => (
              <div data-testid="booking-item" key={booking._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-800">{booking.tourTitle}</h3>
                  <p className="text-gray-500 text-sm">
                    Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.bookingStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
                        booking.bookingStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'}`}>
                      Status: {booking.bookingStatus}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                      ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      Payment: {booking.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {(booking.bookingStatus === 'pending' || booking.bookingStatus === 'approved') && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      data-testid="cancel-btn"
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {booking.bookingStatus === 'approved' && booking.paymentStatus === 'unpaid' && (
                    <button 
                      onClick={() => handleCheckout(booking._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Checkout
                    </button>
                  )}
                  
                  {booking.bookingStatus === 'paid' && (
                    <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;