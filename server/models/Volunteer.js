import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  skills: [{
    type: String,
  }],
  status: {
    type: String,
    default: 'available',
  },
  address: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      validate: {
        validator(value) {
          return !value || value.length === 2;
        },
        message: 'Location coordinates must be [longitude, latitude]',
      },
    },
  },
  maxDistance: {
    type: Number,
  },
  hoursLogged: {
    type: Number,
    default: 0,
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  livesImpacted: {
    type: Number,
    default: 0,
  },
  badges: [{
    type: String,
  }],
  avatar: {
    type: String,
  }
}, {
  timestamps: true
});

VolunteerSchema.index({ location: '2dsphere' });

export default mongoose.model('Volunteer', VolunteerSchema);
