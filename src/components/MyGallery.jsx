import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const MyGallery = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/userlogin');
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/gallery/user/${user.id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to load submissions');
        setSubmissions(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete');
      setSubmissions(submissions.filter(s => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600 test-mygallery-loading">Loading your submissions...</div>;
  if (error) return <div className="p-8 text-center text-red-500 text-red-700 test-mygallery-error">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 test-mygallery-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 test-mygallery-header">
          <h2 className="text-3xl font-bold text-gray-800 test-mygallery-heading">My Gallery Submissions</h2>
          <button
            onClick={() => navigate('/submit-gallery')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition shadow-sm test-mygallery-create-button"
          >
            + Submit New Photo
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center test-mygallery-empty-state">
            <p className="text-gray-500 mb-4 test-mygallery-empty-text">You haven't submitted any photos yet.</p>
            <button
              onClick={() => navigate('/submit-gallery')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold test-mygallery-empty-cta-button"
            >
              Submit Your First Photo
            </button>
          </div>
        ) : (
          <div className="space-y-4 test-mygallery-list">
            {submissions.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col sm:flex-row gap-4 items-start test-mygallery-item"
              >
                {/* Image */}
                <div className="w-full sm:w-36 h-28 rounded-lg overflow-hidden border border-gray-100 shrink-0 test-mygallery-image-wrapper">
                  <img
                    src={item.imageUrl}
                    alt={item.placeName}
                    className="w-full h-full object-cover test-mygallery-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Image'; }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 test-mygallery-details">
                  <div className="flex flex-wrap gap-2 items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate test-mygallery-item-title">{item.placeName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[item.status] || 'bg-gray-100 text-gray-700'} test-mygallery-status-badge`}>
                      {item.status}
                    </span>
                  </div>
                  <a
                    href={item.placeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm truncate block mb-1 test-mygallery-item-map-link"
                  >
                    {item.placeLink}
                  </a>
                  {item.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2 test-mygallery-item-description">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-400 test-mygallery-timestamp">
                    Submitted on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 test-mygallery-actions-wrapper">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-4 py-1.5 border border-red-300 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition test-mygallery-delete-button"
                    >
                      Delete
                    </button>
                  )}
                  {item.status === 'approved' && (
                    <span className="text-green-600 text-sm font-medium test-mygallery-approved-label">✓ Live on Gallery</span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="text-red-500 text-sm font-medium test-mygallery-rejected-label">✗ Rejected</span>
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

export default MyGallery;