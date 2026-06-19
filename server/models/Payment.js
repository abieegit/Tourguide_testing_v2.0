const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  tourTitle: {
    type: String,
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserAuth', 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'paid', 'failed'], 
    default: 'paid' 
  },
  paymentMethod: {
    cardName: { type: String, required: true },
    cardNumberMasked: { type: String, required: true }
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
