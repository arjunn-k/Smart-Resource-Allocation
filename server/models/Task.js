import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  urgency: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  requiredSkill: {
    type: String,
    required: true,
  },
  distanceKm: {
    type: Number,
  },
  locationCoords: {
    lat: { type: Number },
    lng: { type: Number },
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed'],
    default: 'open',
  },
  zone: {
    type: String,
  },
  assignedVolunteer: {
    type: String, // String (ID) to mimic initial format, could be ObjectId later
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', TaskSchema);
