const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserAuth', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  placeName: { 
    type: String, 
    required: true,
    minlength: 2
  },
  placeLink: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    maxlength: 500 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
