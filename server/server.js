const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');
const DealModel = require('./models/Deal');
const UserAuth = require('./models/UserAuth');
const BookingModel = require('./models/Booking');
const PaymentModel = require('./models/Payment');
const GalleryModel = require('./models/Gallery');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/trip')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
  });

// --- Custom Error Class ---
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Async Handler ---
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// --- Validation Helpers ---
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

// --- Middleware ---
const isAdmin = (req, res, next) => {
  if (req.headers['x-admin'] !== 'true') {
    return next(new AppError('Forbidden: Admins only', 403));
  }
  next();
};

// --- Endpoints ---

// User Registration
app.post('/api/register', catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email, and password', 400));
  }
  
  if (!validateEmail(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }
  
  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }
  
  const existingUser = await UserAuth.findOne({ email });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 400));
  }
  
  const user = new UserAuth({ name, email, password });
  await user.save();
  
  res.status(201).json({ 
    success: true,
    message: 'User created successfully',
    data: { id: user._id, name: user.name, email: user.email }
  });
}));

// User Login
app.post('/api/login', catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  
  const user = await UserAuth.findOne({ email });
  if (!user || user.password !== password) {
    return next(new AppError('Invalid email or password', 401));
  }
  
  res.json({
    success: true,
    message: 'Login successful',
    data: { id: user._id, name: user.name, email: user.email }
  });
}));

// Contact endpoints
app.post('/api/contact', catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return next(new AppError('Please provide name, email, and message', 400));
  }
  
  if (!validateEmail(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }
  
  const created = await UserModel.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Contact message submitted successfully',
    data: created
  });
}));

app.get('/api/contact', isAdmin, catchAsync(async (req, res, next) => {
  const items = await UserModel.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'Contact queries fetched successfully',
    data: items
  });
}));

// Deals endpoints
app.get('/api/deals', catchAsync(async (req, res, next) => {
  const items = await DealModel.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'Deals fetched successfully',
    data: items
  });
}));

app.post('/api/deals', isAdmin, catchAsync(async (req, res, next) => {
  const { title, description, price, imageUrl } = req.body;
  if (!title || !description || !price || !imageUrl) {
    return next(new AppError('Missing required fields for deal', 400));
  }
  if (isNaN(Number(price))) {
    return next(new AppError('Price must be a valid number', 400));
  }
  
  const created = await DealModel.create({ title, description, price, imageUrl });
  res.status(201).json({
    success: true,
    message: 'Deal created successfully',
    data: created
  });
}));

app.put('/api/deals/:id', isAdmin, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid deal ID', 400));
  }
  
  const { title, description, price, imageUrl } = req.body;
  if (price && isNaN(Number(price))) {
    return next(new AppError('Price must be a valid number', 400));
  }

  const updated = await DealModel.findByIdAndUpdate(
    id,
    { title, description, price, imageUrl },
    { new: true, runValidators: true }
  );
  if (!updated) {
    return next(new AppError('Deal not found', 404));
  }
  
  res.json({
    success: true,
    message: 'Deal updated successfully',
    data: updated
  });
}));

app.delete('/api/deals/:id', isAdmin, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid deal ID', 400));
  }

  const deleted = await DealModel.findByIdAndDelete(id);
  if (!deleted) {
    return next(new AppError('Deal not found', 404));
  }
  
  res.json({ 
    success: true,
    message: 'Deal deleted successfully',
    data: null
  });
}));

// Booking Endpoints
app.post('/api/bookings', catchAsync(async (req, res, next) => {
  const { userId, tourId, tourTitle } = req.body;
  if (!userId || !tourTitle) {
    return next(new AppError('Missing required fields for booking', 400));
  }
  if (!isValidObjectId(userId)) {
    return next(new AppError('Invalid user ID format', 400));
  }
  
  const existing = await BookingModel.findOne({ userId, tourTitle, bookingStatus: 'pending' });
  if (existing) {
    return next(new AppError('You already have a pending booking for this tour', 400));
  }

  const booking = new BookingModel({ userId, tourId, tourTitle });
  await booking.save();
  
  res.status(201).json({ 
    success: true,
    message: 'Booking created successfully', 
    data: booking 
  });
}));

app.get('/api/bookings/user/:userId', catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(new AppError('Invalid user ID', 400));
  }
  
  const bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'User bookings fetched',
    data: bookings
  });
}));

app.put('/api/bookings/:id/cancel', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid booking ID', 400));
  }

  const booking = await BookingModel.findById(id);
  
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  
  if (booking.bookingStatus !== 'pending' && booking.bookingStatus !== 'approved') {
    return next(new AppError('Cannot cancel booking in current status', 400));
  }
  
  await BookingModel.findByIdAndDelete(id);
  
  res.json({ 
    success: true,
    message: 'Booking cancelled successfully',
    data: null
  });
}));

app.get('/api/bookings/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid booking ID', 400));
  }
  
  const booking = await BookingModel.findById(id).populate('tourId');
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  
  res.json({
    success: true,
    message: 'Booking fetched successfully',
    data: booking
  });
}));

app.post('/api/bookings/:id/pay', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { cardName, cardNumber, expiry, cvv, tourTitle: reqTourTitle } = req.body;

  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid booking ID', 400));
  }

  if (!cardName || !cardNumber || !expiry || !cvv) {
    return next(new AppError('Missing required payment details', 400));
  }

  const booking = await BookingModel.findById(id);
  
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  
  if (booking.bookingStatus !== 'approved') {
    return next(new AppError('Booking must be approved before payment', 400));
  }
  
  const finalTourTitle = booking.tourTitle || reqTourTitle;
  if (!finalTourTitle) {
    return next(new AppError('Missing tourTitle in both booking and request', 400));
  }
  
  // Fix legacy missing tourTitle
  if (!booking.tourTitle) {
    booking.tourTitle = finalTourTitle;
  }
  
  booking.bookingStatus = 'paid';
  booking.paymentStatus = 'paid';
  booking.paymentDate = new Date();
  await booking.save();
  
  const maskedCard = cardNumber.slice(-4).padStart(cardNumber.length, '*');

  const payment = new PaymentModel({
    bookingId: booking._id,
    tourTitle: finalTourTitle,
    userId: booking.userId,
    paymentStatus: 'paid',
    paymentMethod: {
      cardName,
      cardNumberMasked: maskedCard
    }
  });
  await payment.save();
  
  res.json({ 
    success: true,
    message: 'Payment successful', 
    data: booking 
  });
}));

// --- Gallery Endpoints ---
app.post('/api/gallery', catchAsync(async (req, res, next) => {
  const { userId, userName, placeName, placeLink, imageUrl, description } = req.body;
  if (!userId || !userName || !placeName || !placeLink || !imageUrl) {
    return next(new AppError('Missing required fields for gallery submission', 400));
  }
  
  if (!isValidObjectId(userId)) {
    return next(new AppError('Invalid user ID', 400));
  }
  
  // Basic URL validation
  const urlRegex = /^(https?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (!urlRegex.test(placeLink)) {
    return next(new AppError('Please provide a valid URL for the place link', 400));
  }
  if (!urlRegex.test(imageUrl)) {
    return next(new AppError('Please provide a valid image URL', 400));
  }

  const galleryItem = new GalleryModel({
    userId, userName, placeName, placeLink, imageUrl, description
  });
  await galleryItem.save();
  
  res.status(201).json({
    success: true,
    message: 'Gallery item submitted successfully',
    data: galleryItem
  });
}));

// Public route to fetch approved gallery items
app.get('/api/gallery', catchAsync(async (req, res, next) => {
  const items = await GalleryModel.find({ status: 'approved' }).sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'Gallery fetched successfully',
    data: items
  });
}));

// Fetch gallery items for a specific user
app.get('/api/gallery/user/:userId', catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(new AppError('Invalid user ID', 400));
  }
  
  const items = await GalleryModel.find({ userId }).sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'User gallery fetched successfully',
    data: items
  });
}));

// Admin route to fetch all gallery items
app.get('/api/gallery/all', isAdmin, catchAsync(async (req, res, next) => {
  const items = await GalleryModel.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'All gallery items fetched successfully',
    data: items
  });
}));

// Admin route to update gallery item status
app.put('/api/gallery/:id/status', isAdmin, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid gallery ID', 400));
  }
  
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }
  
  const updated = await GalleryModel.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  
  if (!updated) {
    return next(new AppError('Gallery item not found', 404));
  }
  
  res.json({
    success: true,
    message: `Gallery item ${status}`,
    data: updated
  });
}));

// Delete gallery item (admin or owner of pending item)
app.delete('/api/gallery/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body; // user ID requesting the deletion
  const isAdminRequest = req.headers['x-admin'] === 'true';
  
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid gallery ID', 400));
  }
  
  const item = await GalleryModel.findById(id);
  if (!item) {
    return next(new AppError('Gallery item not found', 404));
  }
  
  // If not admin, the user must own it AND it must be pending
  if (!isAdminRequest) {
    if (item.userId.toString() !== userId) {
      return next(new AppError('Not authorized to delete this item', 403));
    }
    if (item.status !== 'pending') {
      return next(new AppError('Can only delete pending submissions', 400));
    }
  }
  
  await GalleryModel.findByIdAndDelete(id);
  
  res.json({
    success: true,
    message: 'Gallery item deleted successfully'
  });
}));

app.get('/api/bookings', isAdmin, catchAsync(async (req, res, next) => {
  const bookings = await BookingModel.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json({
    success: true,
    message: 'All bookings fetched',
    data: bookings
  });
}));

app.put('/api/bookings/:id/status', isAdmin, catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid booking ID', 400));
  }

  const { status } = req.body;
  if (!['pending', 'approved', 'rejected', 'paid'].includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }
  
  const booking = await BookingModel.findByIdAndUpdate(
    id, 
    { bookingStatus: status },
    { new: true, runValidators: true }
  );
  
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  
  res.json({ 
    success: true,
    message: `Booking status updated to ${status}`, 
    data: booking 
  });
}));

// --- Global 404 Handler ---
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = 'Duplicate field value entered. Please use another value.';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    const messages = Object.values(err.errors).map(val => val.message);
    err.message = `Invalid input data. ${messages.join('. ')}`;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err.stack // Basic error passing
  });
});

app.listen(5000, ()=>{
    console.log('Server is running on http://localhost:5000');
});