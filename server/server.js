import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Task from './models/Task.js';
import Volunteer from './models/Volunteer.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import requireNgoAdmin from './middleware/requireNgoAdmin.js';
import { sanitizeAndGeocodeVolunteer } from './utils/sanitizeAndGeocodeVolunteer.js';

dotenv.config();
mongoose.set('bufferCommands', false);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  // Connection options are no longer strictly required in Mongoose 6+
  // but we provide simple connect call
})
.then(() => console.log('✅ MongoDB Connected successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

app.use((req, res, next) => {
  if (req.path === '/') {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database unavailable. Check MongoDB Atlas network access or local MongoDB availability.',
    });
  }

  next();
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Smart Resource Response API' });
});

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, fullName, skills } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // 1. Create Profile if Volunteer
    let profileId = null;
    if (role === 'volunteer') {
      const volunteer = new Volunteer({
        name: fullName || 'New Volunteer',
        skills: skills || [],
        maxDistance: 15, // Default
        hoursLogged: 0,
        tasksCompleted: 0,
        livesImpacted: 0,
        avatar: (fullName || 'V').split(' ').map(n => n[0]).join('')
      });
      await volunteer.save();
      profileId = volunteer._id;
    }

    // 2. Create User
    const user = new User({ email, password, role, profileId });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, profileId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    res.status(200).json({
      message: 'OTP sent successfully',
      smsPlaceholder: 'TODO: integrate SMS sending provider here'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const user = await User.findOne({ phoneNumber });

    if (!user || !user.otp) {
      return res.status(404).json({ message: 'OTP not found for this phone number' });
    }

    if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Verification Successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/ngo/bulk-upload-volunteers', requireNgoAdmin, async (req, res) => {
  try {
    const volunteers = Array.isArray(req.body) ? req.body : req.body.volunteers;

    if (!Array.isArray(volunteers) || volunteers.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of volunteers' });
    }

    const seenPhoneNumbers = new Set();
    const failedRows = [];
    const operations = [];

    for (const [index, rawVolunteer] of volunteers.entries()) {
      try {
        const sanitizedVolunteer = await sanitizeAndGeocodeVolunteer(rawVolunteer);

        if (!sanitizedVolunteer.phoneNumber) {
          throw new Error('Missing phone number');
        }

        if (seenPhoneNumbers.has(sanitizedVolunteer.phoneNumber)) {
          throw new Error('Duplicate phone number in upload payload');
        }

        if (
          !sanitizedVolunteer.location ||
          sanitizedVolunteer.location.type !== 'Point' ||
          !Array.isArray(sanitizedVolunteer.location.coordinates) ||
          sanitizedVolunteer.location.coordinates.length !== 2
        ) {
          throw new Error('Location must be formatted as a GeoJSON Point [longitude, latitude]');
        }

        seenPhoneNumbers.add(sanitizedVolunteer.phoneNumber);

        operations.push({
          updateOne: {
            filter: { phoneNumber: sanitizedVolunteer.phoneNumber },
            update: {
              $set: {
                name: sanitizedVolunteer.name,
                phoneNumber: sanitizedVolunteer.phoneNumber,
                address: sanitizedVolunteer.address,
                location: sanitizedVolunteer.location,
                skills: sanitizedVolunteer.skills,
                status: sanitizedVolunteer.status,
              },
              $setOnInsert: {
                hoursLogged: 0,
                tasksCompleted: 0,
                livesImpacted: 0,
              },
            },
            upsert: true,
          },
        });
      } catch (error) {
        failedRows.push({
          row: index + 1,
          reason: error.message,
          data: rawVolunteer,
        });
      }
    }

    let bulkResult = null;

    if (operations.length > 0) {
      bulkResult = await Volunteer.bulkWrite(operations, { ordered: false });
    }

    res.status(failedRows.length > 0 ? 207 : 200).json({
      message: 'Volunteer bulk upload processed',
      received: volunteers.length,
      successfulRows: operations.length,
      createdCount: bulkResult?.upsertedCount || 0,
      updatedCount: bulkResult?.modifiedCount || 0,
      failedRows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message, failedRows: [] });
  }
});

// API Routes for Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/tasks/:id/assign', async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'assigned', assignedVolunteer: volunteerId },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Routes for Volunteers
app.get('/api/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/volunteers/:id/stats', async (req, res) => {
  try {
    const { hours, completed, impact } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { 
        $inc: { 
          hoursLogged: hours || 0, 
          tasksCompleted: completed || 0, 
          livesImpacted: impact || 0 
        } 
      },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
