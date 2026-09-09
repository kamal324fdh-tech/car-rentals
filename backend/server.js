const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const serverless = require('serverless-http');

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database Connected Successfully'))
  .catch((err) => {
    console.error('❌ Database Connection Error:');
    console.error(err);
  });

// SCHEMAS & MODELS

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

// Profile Schema
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  avatar: { type: String, default: "https://via.placeholder.com/150" },
  bio: { type: String, default: "" }
});

const Profile = mongoose.model('Profile', profileSchema);

// OTP Schema (expires in 5 mins)
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } 
});

const OTP = mongoose.model('OTP', otpSchema);

// Car Schema
const carSchema = new mongoose.Schema({
  name: String,
  type: String,
  transmission: String,
  fuel: String,
  description: String,
  price: Number,
  imageUrl: String,
  available: { type: Boolean, default: true }
});

const Car = mongoose.model('Car', carSchema);

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: String,
  endDate: String,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// AUTHENTICATION MIDDLEWARE
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authentication token missing." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session token." });
  }
};

// EMAIL UTILITIES (BREVO)
const sendOTPEmail = async (email, otp) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: "Velocity Rentals", email: process.env.EMAIL_FROM },
      to: [{ email }],
      subject: 'Your Verification Code',
      htmlContent: `<p>Your OTP code is: <strong>${otp}</strong></p>`
    })
  });

  if (!response.ok) throw new Error("Email sending failed.");
  return response;
};

const sendBookingConfirmationEmail = async (email, userName, bookingDetails) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: "Velocity Rentals", email: process.env.EMAIL_FROM },
      to: [{ email }],
      subject: '🚗 Booking Confirmed!',
      htmlContent: `
        <h2>Hello ${userName},</h2>
        <p>Your booking for <strong>${bookingDetails.carName}</strong> from ${bookingDetails.startDate} to ${bookingDetails.endDate} is confirmed!</p>
        <a href="${frontendUrl}">View Bookings</a>
      `
    })
  });

  if (!response.ok) throw new Error("Booking email failed.");
  return response;
};

// ROUTES

// Health Check / Root Route
app.get('/', (req, res) => {
  res.json({ 
    service: "Velocity Rentals API Online", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" 
  });
});

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, type } = req.body; 
    if (!email) return res.status(400).json({ message: 'Email required.' });

    const existingUser = await User.findOne({ email });
    if (type === 'signup' && existingUser) return res.status(400).json({ message: 'Email already registered.' });
    if (type === 'forgot' && !existingUser) return res.status(400).json({ message: 'No user matches this email.' });

    const otp = crypto.randomInt(100000, 999999).toString();
    await OTP.findOneAndDelete({ email });
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required.' });

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    res.status(200).json({ success: true, message: 'OTP verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed.' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed.' });
  }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists.' });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const newProfile = new Profile({ userId: newUser._id });
    await newProfile.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'Account created', 
      token, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      profile: newProfile 
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const userProfile = await Profile.findOne({ userId: user._id });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, name: user.name, email: user.email },
      profile: userProfile || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.' });
  }
});

// Get Cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cars.' });
  }
});

// Create Booking
app.post('/api/bookings', authenticateUser, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;
    if (!carId || !startDate || !endDate) return res.status(400).json({ message: "Missing booking details." });

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found." });

    const newBooking = new Booking({
      userId: req.user._id,
      carId,
      startDate,
      endDate,
      totalPrice
    });
    await newBooking.save();

    await sendBookingConfirmationEmail(req.user.email, req.user.name, {
      carName: car.name,
      startDate,
      endDate
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed." });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const serverless = require('serverless-http');

// Export the handler for Netlify Serverless Functions
module.exports = app;
module.exports.handler = serverless(app);