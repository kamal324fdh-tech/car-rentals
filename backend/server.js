const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load settings from your .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================================================================
// DATABASE CONNECTION (Clean Mongoose Implementation)
// =========================================================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🛡️ Velocity Database Matrix Connected Securely'))
  .catch((err) => {
    console.error('❌ Database connection crash! Check your password or IP whitelist.');
    console.error(err);
  });

// =========================================================================
// DATA SCHEMAS & MODELS
// =========================================================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
});

// FIXED: Removed 'next' because modern Mongoose handles async/await natively.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // Just return to skip

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() needed here. When this block finishes, Mongoose saves automatically.
  } catch (err) {
    console.error("Encryption hook failed:", err);
    throw err; // Throwing the error passes it along to your signup catch block
  }
});

const User = mongoose.model('User', userSchema);

// =========================================================================
// AUTHENTICATION ROUTES
// =========================================================================

// Registration (Signup) End-Point
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email address is already registered.' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log('\n=============================================');
    console.log('👤 NEW USER WRITTEN TO BACKEND DATABASE!');
    console.log(`Name:      ${newUser.name}`);
    console.log(`Email:     ${newUser.email}`);
    console.log(`Password:  ${newUser.password} (SECURE HASH)`);
    console.log('=============================================\n');

    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account initialized successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error('Signup Route Error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// Authentication (Login) End-Point
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all login credentials.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Welcome back to Velocity',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login Route Error:', error);
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
});

app.get('/', async (req, res) => {
  try {
    // Get the total number of users without pulling their private data
    const totalUsers = await User.countDocuments();

    res.json({
      service: "Velocity Rentals Core Engine",
      status: "Online 🛡️",
      version: "1.0.0",
      uptime: `${Math.floor(process.uptime())} seconds`,
      database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      stats: {
        totalRegisteredUsers: totalUsers
      },
      documentation: {
        authentication: {
          signup: "POST /api/auth/signup",
          login: "POST /api/auth/login"
        },
        vehicles: {
          listAll: "GET /api/cars (Coming Soon)",
          getOne: "GET /api/cars/:id (Coming Soon)"
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Engine misfire." });
  }
});

// Launch Process Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Core Engine firing on port ${PORT}`));