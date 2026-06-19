const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserAuth', 
    required: true 
  },
  tourId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'deals', 
    required: false // keeping it false in case we only want deal title for simplicity
  },
  tourTitle: {
    type: String,
    required: true
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  bookingStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'paid'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid'], 
    default: 'unpaid' 
  },
  paymentDate: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
