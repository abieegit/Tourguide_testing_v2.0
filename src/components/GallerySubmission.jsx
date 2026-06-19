import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidImageUrl = (str) => {
  if (!isValidUrl(str)) return false;
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(str);
};

const GallerySubmission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    placeName: '',
    placeLink: '',
    imageUrl: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.placeName.trim() || formData.placeName.trim().length < 2) {
      newErrors.placeName = 'Place name must be at least 2 characters.';
    }
    if (!formData.placeLink.trim()) {
      newErrors.placeLink = 'Place link is required.';
    } else if (!isValidUrl(formData.placeLink)) {
      newErrors.placeLink = 'Please enter a valid URL (starting with http:// or https://).';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required.';
    } else if (!isValidImageUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL ending in .jpg, .jpeg, .png, or .webp.';
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('You must be logged in to submit.');
      navigate('/userlogin');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          placeName: formData.placeName.trim(),
          placeLink: formData.placeLink.trim(),
          imageUrl: formData.imageUrl.trim(),
          description: formData.description.trim()
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed');
      alert('Your photo has been submitted! It will appear publicly once approved by an admin.');
      navigate('/my-gallery');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 transition ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start test-submit-gallery-container">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mt-4 test-submit-gallery-card">
        <h2 className="text-2xl font-bold mb-1 text-gray-800 test-submit-gallery-heading">Submit Your Travel Photo</h2>
        <p className="text-gray-500 text-sm mb-6 test-submit-gallery-subheading">
          Share a beautiful place you've visited. Your photo will be reviewed by an admin before appearing publicly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 test-submit-gallery-form" noValidate>
          {/* Place Name */}
          <div className="test-submit-gallery-field-wrapper-name">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Place Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="placeName"
              value={formData.placeName}
              onChange={handleChange}
              placeholder="e.g. Hunza Valley"
              className={`${inputClass('placeName')} test-submit-gallery-name-input`}
            />
            {errors.placeName && (
              <p className="text-red-500 text-xs mt-1 text-red-700 test-submit-gallery-name-error">
                {errors.placeName}
              </p>
            )}
          </div>

          {/* Place Link */}
          <div className="test-submit-gallery-field-wrapper-link">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Place Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="placeLink"
              value={formData.placeLink}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
              className={`${inputClass('placeLink')} test-submit-gallery-link-input`}
            />
            {errors.placeLink && (
              <p className="text-red-500 text-xs mt-1 text-red-700 test-submit-gallery-link-error">
                {errors.placeLink}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="test-submit-gallery-field-wrapper-image">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/my-photo.jpg"
              className={`${inputClass('imageUrl')} test-submit-gallery-image-input`}
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1 text-red-700 test-submit-gallery-image-error">
                {errors.imageUrl}
              </p>
            )}
            
            {/* Live image preview */}
            {formData.imageUrl && isValidImageUrl(formData.imageUrl) && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-40 test-submit-gallery-preview-wrapper">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover test-submit-gallery-preview-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="test-submit-gallery-field-wrapper-description">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this place..."
              rows={3}
              className={`${inputClass('description')} resize-none test-submit-gallery-description-textarea`}
            />
            <div className="flex justify-between items-center mt-1 test-submit-gallery-description-metadata">
              {errors.description ? (
                <p className="text-red-500 text-xs text-red-700 test-submit-gallery-description-error">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400 test-submit-gallery-char-counter">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          <div className="pt-2 space-y-3 test-submit-gallery-actions">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } test-submit-gallery-submit-button`}
            >
              {loading ? 'Submitting...' : 'Submit Photo'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="w-full py-3 rounded-lg font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition test-submit-gallery-cancel-button"
            >
              Back to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GallerySubmission;