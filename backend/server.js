const fetch = require('node-fetch'); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const app = express();

// APP MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Velocity Database Matrix Connected Securely'))
  .catch((err) => {
    console.error('❌ Database connection crash!');
    console.error(err);
  });


// SCHEMAS

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error("Encryption hook failed:", err);
    throw err; 
  }
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

// OTP Schema
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

const Car = mongoose.model("Car", carSchema);

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

// Send OTP
const sendOTPEmail = async (email, otp) => {
  const senderEmail = process.env.EMAIL_FROM; 
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: "Velocity Rentals", email: senderEmail },
      to: [{ email: email }],
      subject: 'Your Velocity Verification Code',
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #f59e0b; text-align: center; font-weight: 800; letter-spacing: 1px;">VELOCITY</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Use the verification code below to complete your action on Velocity Rentals.</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: 8px; background-color: #f8fafc; padding: 12px 24px; border-radius: 8px; border: 1px dashed #cbd5e1;">${otp}</span>
          </div>
        </div>
      `
    })
  });

  if (!response.ok) throw new Error("Email engine pipeline failure");
  return response;
};

// Send Booking Confirmation
const sendBookingConfirmationEmail = async (email, userName, bookingDetails) => {
  const senderEmail = process.env.EMAIL_FROM; 
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000/cars";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: "Velocity Rentals", email: senderEmail },
      to: [{ email: email }],
      subject: '🚗 Booking Confirmed! Your Ride is Ready',
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #f59e0b; text-align: center; font-weight: 800; letter-spacing: 1px;">VELOCITY</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Your car rental reservation has been successfully confirmed. Here are your booking details:</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #cbd5e1;">
            <p style="margin: 4px 0;"><strong>Car Model:</strong> ${bookingDetails.carName}</p>
            <p style="margin: 4px 0;"><strong>Duration:</strong> ${bookingDetails.startDate} to ${bookingDetails.endDate}</p>
          </div>

          <p style="color: #475569; font-size: 16px; line-height: 1.6;">You can view your real-time booking status or manage your order anytime on our platform:</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${frontendUrl}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 16px;">
              View My Bookings
            </a>
          </div>
        </div>
      `
    })
  });

  if (!response.ok) throw new Error("Booking email delivery failed");
  return response;
};


// ROUTE HANDLERS

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
    res.status(200).json({ message: 'Verification security token sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
});

// Verify OTP Route
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and verification code are required.' });

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired authorization code.' });

    res.status(200).json({ success: true, message: 'Identity security parameters verified successfully!' });
  } catch (error) {
    console.error("OTP Route Verification Failure:", error);
    res.status(500).json({ message: 'Internal validation handling crash.' });
  }
});

// Reset Password Route
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and new password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = password;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    console.error("Password Reset Failure:", error);
    res.status(500).json({ message: 'Internal server error during password reset.' });
  }
});

// User Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired authorization code.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already occupied.' });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const newProfile = new Profile({ userId: newUser._id });
    await newProfile.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'Account initialized', 
      token, 
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      profile: newProfile 
    });
  } catch (error) {
    console.error("Signup Route Failure:", error);
    res.status(500).json({ message: 'Registration handling crash.' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing validation keys.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const userProfile = await Profile.findOne({ userId: user._id });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({ 
      message: 'Welcome back', 
      token, 
      user: { id: user._id, name: user.name, email: user.email },
      profile: userProfile || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal engine error.' });
  }
});

// Get all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
});

// Create Car Booking
app.post('/api/bookings', authenticateUser, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required booking details." });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car model not found." });

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

    res.status(201).json({
      success: true,
      message: "Booking secured! Confirmation email dispatched.",
      booking: newBooking
    });

  } catch (error) {
    console.error("Booking API processing failure:", error);
    res.status(500).json({ message: "Internal handling error while processing booking." });
  }
});

app.get('/', (req, res) => {
  res.json({ 
    service: "Core Engine Online", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" 
  });
});

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Core Engine firing on port ${PORT}`));