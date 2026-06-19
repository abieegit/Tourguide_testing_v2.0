import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load booking');
        
        const b = data.data;
        if (!b) throw new Error('Booking not found');
        if (b.bookingStatus !== 'approved') throw new Error('Booking is not approved for payment');
        if (b.paymentStatus === 'paid') throw new Error('Booking is already paid');
        
        setBooking(b);
      } catch (err) {
        setError(err.message);
      } finally {
        setPageLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Strict validation
    if (!formData.cardName.trim()) {
      alert("Please enter card holder name");
      setLoading(false);
      return;
    }
    
    const cardNumClean = formData.cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumClean)) {
      alert("Card number must be 16 digits");
      setLoading(false);
      return;
    }
    
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiry)) {
      alert("Expiry date must be in MM/YY format");
      setLoading(false);
      return;
    }
    
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      alert("CVV must be 3 or 4 digits");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: formData.cardName,
          cardNumber: cardNumClean,
          expiry: formData.expiry,
          cvv: formData.cvv,
          tourTitle: booking?.tourTitle || ''
        })
      });
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Payment failed');
      }
      
      alert(data.message || 'Payment successful!');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="p-8 text-center test-checkout-loading">Loading checkout...</div>;
  if (error) return <div className="p-8 text-center text-red-500 test-checkout-error">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center test-checkout-container">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md test-checkout-card">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 test-checkout-heading">Secure Checkout</h2>
        <p className="text-center text-gray-500 mb-6 test-checkout-subheading">Paying for: <span className="font-semibold test-checkout-tour-title">{booking?.tourTitle}</span></p>
        
        <form onSubmit={handlePayment} className="space-y-4 test-checkout-form">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
            <input 
              type="text" 
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 test-card-name-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input 
              type="text" 
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9101 1121"
              maxLength="19"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 test-card-number-input"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input 
                type="text" 
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 test-expiry-input"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input 
                type="text" 
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 test-cvv-input"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition mt-6 test-submit-payment-button
              ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/my-bookings')}
            className="w-full py-3 rounded-lg font-bold text-gray-600 border border-gray-300 hover:bg-gray-50 transition test-cancel-payment-button"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;