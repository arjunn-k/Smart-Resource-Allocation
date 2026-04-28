import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['volunteer', 'ngoAdmin', 'hospitalStaff'],
    default: 'volunteer',
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer', // Optional: Link to a specific profile if needed
  }
}, {
  timestamps: true
});

UserSchema.pre('validate', function(next) {
  if (!this.email && !this.phoneNumber) {
    return next(new Error('Either email or phone number is required'));
  }

  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
