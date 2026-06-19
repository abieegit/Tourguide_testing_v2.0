import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [deals, setDeals] = useState([]);
  const [queries, setQueries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  const [newDeal, setNewDeal] = useState({ title: "", description: "", price: "", imageUrl: "" });
  const [editingId, setEditingId] = useState("");
  const [editingDeal, setEditingDeal] = useState({ title: "", description: "", price: "", imageUrl: "" });

  useEffect(() => {
    const isAdmin = localStorage.getItem("tb_is_admin") === "true";
    if (!isAdmin) {
      navigate("/admin", { replace: true });
      return;
    }

    fetch("http://localhost:5000/api/deals")
      .then((res) => res.json())
      .then((data) => setDeals(data.data || []));

    fetch("http://localhost:5000/api/contact", { headers: { "x-admin": "true" } })
      .then((res) => res.json())
      .then((data) => setQueries(data.data || []));

    fetch("http://localhost:5000/api/bookings", {
      headers: { "x-admin": "true" }
    })
      .then((res) => res.json())
      .then((data) => setBookings(data.data || []))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/gallery/all", {
      headers: { "x-admin": "true" }
    })
      .then((res) => res.json())
      .then((data) => setGalleryItems(data.data || []))
      .catch(err => console.error(err));
  }, [navigate]);

  // Handle form input
  const handleChange = (e) => {
    setNewDeal({ ...newDeal, [e.target.name]: e.target.value });
  };

  // Add new deal
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!newDeal.title || !newDeal.description || !newDeal.price || !newDeal.imageUrl) {
      alert('All fields are required');
      return;
    }
    if (isNaN(Number(newDeal.price))) {
      alert('Price must be a valid number');
      return;
    }

    fetch("http://localhost:5000/api/deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin": "true"
      },
      body: JSON.stringify(newDeal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDeals([data.data, ...deals]);
          setNewDeal({ title: "", description: "", price: "", imageUrl: "" });
        } else {
          alert(data.message);
        }
      });
  };

  // Delete deal
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/deals/${id}`, {
      method: "DELETE",
      headers: { "x-admin": "true" }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setDeals(deals.filter((d) => d._id !== id));
        else alert(data.message);
      });
  };

  // Start editing
  const startEdit = (deal) => {
    setEditingId(deal._id);
    setEditingDeal({
      title: deal.title,
      description: deal.description,
      price: deal.price,
      imageUrl: deal.imageUrl,
    });
  };

  // Save edited deal
  const saveEdit = (id) => {
    if (isNaN(Number(editingDeal.price))) {
      alert('Price must be a valid number');
      return;
    }

    fetch(`http://localhost:5000/api/deals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin": "true"
      },
      body: JSON.stringify(editingDeal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDeals(deals.map((d) => (d._id === id ? data.data : d)));
          setEditingId("");
          setEditingDeal({ title: "", description: "", price: "", imageUrl: "" });
        } else {
          alert(data.message);
        }
      });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId("");
    setEditingDeal({ title: "", description: "", price: "", imageUrl: "" });
  };

  // Update booking status
  const handleBookingStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin": "true"
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(bookings.map((b) => (b._id === id ? { ...b, bookingStatus: newStatus } : b)));
        } else {
          alert(data.message);
        }
      });
  };

  // Gallery management handlers
  const handleGalleryStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/gallery/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin": "true"
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGalleryItems(galleryItems.map(g => g._id === id ? { ...g, status: newStatus } : g));
        } else {
          alert(data.message);
        }
      });
  };

  const handleGalleryDelete = (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this submission?')) return;
    fetch(`http://localhost:5000/api/gallery/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin": "true"
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGalleryItems(galleryItems.filter(g => g._id !== id));
        } else {
          alert(data.message);
        }
      });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("tb_is_admin");
    navigate("/admin", { replace: true });
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.bookingStatus === 'pending').length;
  const approvedBookings = bookings.filter(b => b.bookingStatus === 'approved').length;
  const rejectedBookings = bookings.filter(b => b.bookingStatus === 'rejected').length;
  const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-lg h-auto flex flex-col mt-0 border-r border-gray-200 z-10">
        {/* Top Section: Header */}
        <div className="p-4 md:p-6 border-b flex justify-between items-center shrink-0">
          <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="md:hidden bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-sm transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Middle Section: Navigation Links */}
        <div className="overflow-x-auto md:overflow-y-auto flex-1 py-2 md:py-4 scrollbar-hide">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 px-4 md:min-w-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-left px-4 py-2 md:py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Analytics 
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`text-left px-4 py-2 md:py-3 rounded-lg font-medium transition-colors ${activeTab === 'deals' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Deals Management
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`text-left px-4 py-2 md:py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              className={`text-left px-4 py-2 md:py-3 rounded-lg font-medium transition-colors ${activeTab === 'queries' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Contact Queries
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`text-left px-4 py-2 md:py-3 rounded-lg font-medium transition-colors ${activeTab === 'gallery' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Gallery Management
            </button>
          </nav>
        </div>

        {/* Bottom Section: Desktop Logout (Guaranteed Visible) */}
        <div className="p-4 border-t border-gray-200 bg-white ">
          <button
            onClick={handleLogout}
            className="test-admin-desktop-logout w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors shadow-sm mb-20"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6 md:mb-8 flex justify-between items-center bg-white p-4 md:p-6 rounded-xl shadow-sm">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' :
                activeTab === 'deals' ? 'Manage Deals' :
                  activeTab === 'bookings' ? 'Manage Bookings' :
                    activeTab === 'gallery' ? 'Gallery Management' : 'Contact Queries'}
            </h1>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gray-500">
                <p className="text-sm text-gray-500 font-semibold uppercase">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500 font-semibold uppercase">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 font-semibold uppercase">Approved</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{approvedBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-500 font-semibold uppercase">Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{paidBookings}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-gray-500 font-semibold uppercase">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{rejectedBookings}</p>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Add Deal */}
              <div className="w-full xl:w-1/3 bg-white p-6 rounded-xl shadow-sm h-fit">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Deal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input name="title" placeholder="Title" value={newDeal.title} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none bg-gray-50" required />
                  <textarea name="description" placeholder="Description" value={newDeal.description} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none bg-gray-50 h-32" required />
                  <input name="price" placeholder="Price (e.g., 5000)" value={newDeal.price} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none bg-gray-50" required />
                  <input name="imageUrl" placeholder="Image URL" value={newDeal.imageUrl} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none bg-gray-50" required />
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm">Launch Deal</button>
                </form>
              </div>

              {/* Deals List */}
              <div className="w-full xl:w-2/3 bg-white p-6 rounded-xl shadow-sm max-h-[700px] overflow-y-auto border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Current Deals</h2>
                {deals.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No deals available</p>
                ) : (
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <div key={deal._id} className="border border-gray-200 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start bg-white hover:shadow-md transition-shadow">
                        {editingId === deal._id ? (
                          <div className="flex-1 space-y-3 w-full">
                            <input className="w-full p-2 border rounded bg-gray-50" value={editingDeal.title} onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })} />
                            <textarea className="w-full p-2 border rounded bg-gray-50" value={editingDeal.description} onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })} />
                            <input className="w-full p-2 border rounded bg-gray-50" value={editingDeal.price} onChange={(e) => setEditingDeal({ ...editingDeal, price: e.target.value })} />
                            <input className="w-full p-2 border rounded bg-gray-50" value={editingDeal.imageUrl} onChange={(e) => setEditingDeal({ ...editingDeal, imageUrl: e.target.value })} />
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => saveEdit(deal._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Save</button>
                              <button onClick={cancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <img src={deal.imageUrl} alt={deal.title} className="w-32 h-24 object-cover rounded-lg shadow-sm" />
                            <div className="flex-1 w-full">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-gray-800">{deal.title}</h3>
                                <span className="text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">RS {deal.price}</span>
                              </div>
                              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{deal.description}</p>
                              <div className="mt-4 flex gap-2">
                                <button onClick={() => startEdit(deal)} className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">Edit</button>
                                <button onClick={() => handleDelete(deal._id)} className="px-4 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">Delete</button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No bookings found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tour</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((b) => (
                        <tr key={b._id} data-testid={`booking-row-${b._id}`} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{b.userId?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{b.userId?.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{b.tourTitle}</div>
                            <div className="text-xs text-gray-400">ID: {b._id.substring(b._id.length - 6)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(b.bookingDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span data-testid={`booking-status-${b._id}`}  className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase rounded-full 
                              ${b.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                b.bookingStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
                                  b.bookingStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'}`}>
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span data-testid={`booking-status-${b._id}`}  className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase rounded-full 
                              ${b.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {b.paymentStatus === 'paid' ? (
                              <span className="text-gray-400 italic">No actions (Paid)</span>
                            ) : (
                              <div className="flex gap-2">
                                {b.bookingStatus === 'pending' && (
                                  <>
                                    <button onClick={() => handleBookingStatus(b._id, 'approved')} className="text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors font-semibold">Approve</button>
                                    <button onClick={() => handleBookingStatus(b._id, 'rejected')} className="text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors font-semibold">Reject</button>
                                  </>
                                )}
                                {b.bookingStatus === 'approved' && (
                                  <button onClick={() => handleBookingStatus(b._id, 'rejected')} className="text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors font-semibold">Reject</button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-[750px] overflow-y-auto">
              {queries.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No queries found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {queries.map((q) => (
                    <div key={q._id} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-4 border-b pb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{q.name}</h3>
                          <a href={`mailto:${q.email}`} className="text-sm text-green-600 hover:text-green-800 font-medium">{q.email}</a>
                        </div>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {new Date(q.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Subject: {q.subject || 'N/A'}</p>
                        <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[100px]">
                          {q.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {galleryItems.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No gallery submissions found.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {galleryItems.map((g) => (
                    <div key={g._id} className="flex flex-col sm:flex-row gap-4 p-5 hover:bg-gray-50 transition-colors items-start">
                      <div className="w-full sm:w-36 h-28 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={g.imageUrl}
                          alt={g.placeName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800 text-lg">{g.placeName}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                            g.status === 'approved' ? 'bg-green-100 text-green-800' :
                            g.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>{g.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">By <span className="font-medium text-gray-700">{g.userName}</span></p>
                        {g.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-1">{g.description}</p>
                        )}
                        <a
                          href={g.placeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`place-link-${g._id}`}
                          className="text-xs text-green-600 hover:text-green-700 truncate block"
                        >
                          {g.placeLink}
                        </a>
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(g.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col gap-2">
                        {g.status !== 'approved' && (
                          <button
                            onClick={() => handleGalleryStatus(g._id, 'approved')}
                            data-testid="approve-button"
                            className="px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {g.status !== 'rejected' && (
                          <button
                            onClick={() => handleGalleryStatus(g._id, 'rejected')}
                            data-testid="reject-button"
                            className="px-4 py-1.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleGalleryDelete(g._id)}
                          data-testid="delete-button"
                          className="px-4 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
