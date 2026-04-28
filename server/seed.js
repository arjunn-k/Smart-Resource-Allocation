import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/Task.js';
import Volunteer from './models/Volunteer.js';
import User from './models/User.js';

dotenv.config();

const initialUsers = [
  {
    email: "volunteer@example.com",
    password: "password123",
    role: "volunteer",
  },
  {
    email: "admin@ngo.org",
    password: "password123",
    role: "ngoAdmin",
  },
  {
    email: "staff@hospital.com",
    password: "password123",
    role: "hospitalStaff",
  }
];

const initialTasks = [
  {
    title: "Pediatric Trauma Support",
    urgency: 10,
    requiredSkill: "Medical",
    distanceKm: 1.4,
    locationCoords: { lat: 40.7128, lng: -74.006 },
    status: "open",
    zone: "Children's Camp Delta",
  },
  {
    title: "Shelter Intake Translation",
    urgency: 6,
    requiredSkill: "Logistics",
    distanceKm: 3.1,
    locationCoords: { lat: 40.7138, lng: -74.007 },
    status: "open",
    zone: "Shelter Transit Hub",
  },
  {
    title: "Canal Water Rescue Operations",
    urgency: 9,
    requiredSkill: "Rescue",
    distanceKm: 5.7,
    locationCoords: { lat: 40.7158, lng: -74.009 },
    status: "open",
    zone: "Canal Corridor",
  },
  {
    title: "Route Plasma Courier",
    urgency: 8,
    requiredSkill: "Medical",
    distanceKm: 2.2,
    locationCoords: { lat: 40.7118, lng: -74.002 },
    status: "open",
    zone: "City Blood Bank",
  },
  {
    title: "Debris Clearance Heavy Machinery",
    urgency: 5,
    requiredSkill: "Engineering",
    distanceKm: 8.5,
    locationCoords: { lat: 40.7228, lng: -74.016 },
    status: "open",
    zone: "North District",
  },
];

const initialVolunteers = [
  {
    name: "Dr. Sarah Jenkins",
    skills: ["Medical", "Triage", "Pediatrics"],
    maxDistance: 10,
    hoursLogged: 126,
    tasksCompleted: 42,
    livesImpacted: 318,
    badges: ["First Responder", "Night Owl", "Life Saver"],
    avatar: "SJ",
  },
  {
    name: "Marc Reyes",
    skills: ["Logistics", "Translation", "Driving"],
    maxDistance: 5,
    hoursLogged: 45,
    tasksCompleted: 15,
    livesImpacted: 60,
    badges: ["Community Bridge", "Road Warrior"],
    avatar: "MR",
  },
  {
    name: "Lena Rostova",
    skills: ["Rescue", "Climbing", "First Aid"],
    maxDistance: 15,
    hoursLogged: 210,
    tasksCompleted: 85,
    livesImpacted: 512,
    badges: ["First Responder", "Heroic Effort", "Iron Core"],
    avatar: "LR",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Task.deleteMany({});
    await Volunteer.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data.");

    // Seed data
    await Task.insertMany(initialTasks);
    await Volunteer.insertMany(initialVolunteers);
    
    // Create users (middleware will hash passwords)
    for (const userData of initialUsers) {
      const user = new User(userData);
      await user.save();
    }
    
    console.log("Database seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
