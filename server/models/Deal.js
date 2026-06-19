const mongoose = require('mongoose');

// Schema for travel deals offered on the platform
const DealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // price stored as string for simple display (could be Number for currency later)
  price: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('deals', DealSchema);



