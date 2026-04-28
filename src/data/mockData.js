export const landingStats = [
  { label: "Live Partners", value: "42", accent: "text-match" },
  { label: "Open Volunteer Slots", value: "186", accent: "text-volunteer" },
  { label: "Critical Escalations", value: "07", accent: "text-urgent" },
];

export const ngoMetrics = [
  { label: "Total Unresolved Needs", value: 128, tone: "text-urgent" },
  { label: "Active Volunteers", value: 344, tone: "text-volunteer" },
  { label: "Recent Surveys", value: 29, tone: "text-survey" },
];

export const needsQueue = [
  {
    id: 1,
    title: "Flood Zone A Evacuation Vans",
    urgency: "Critical",
    eta: "5 min",
    priorityScore: 97,
    region: "Ward 11 River Belt",
    owner: "Municipal Rescue",
  },
  {
    id: 2,
    title: "Rural Clinic Generator Fuel",
    urgency: "High",
    eta: "12 min",
    priorityScore: 81,
    region: "North Periphery",
    owner: "Field Hospital Cluster",
  },
  {
    id: 3,
    title: "Food Kit Distribution Update",
    urgency: "Moderate",
    eta: "26 min",
    priorityScore: 56,
    region: "Transit Camp East",
    owner: "Relief Logistics Unit",
  },
  {
    id: 4,
    title: "Temporary Shelter Power Audit",
    urgency: "High",
    eta: "18 min",
    priorityScore: 74,
    region: "School Shelter 6",
    owner: "NGO Infra Team",
  },
];

export const sosTimeline = [
  { time: "00:00", event: "SOS broadcast initiated" },
  { time: "00:03", event: "12 volunteers notified" },
  { time: "00:06", event: "4 trauma nurses accepted" },
  { time: "00:11", event: "O+ donor route confirmed" },
];

export const ngoSurveyDrops = [
  { id: 1, name: "Block-C-rapid-assessment.pdf", pages: 12, status: "Queued OCR" },
  { id: 2, name: "riverbank-medical-needs.jpg", pages: 1, status: "Tagged urgent" },
  { id: 3, name: "shelter-occupancy-batch.zip", pages: 24, status: "Structured" },
];

export const hospitalQuickNeeds = [
  "Need O+ Blood",
  "Require 5 Trauma Nurses",
  "Ambulance Reroute",
  "Need 8 ICU Ventilator Operators",
];

export const volunteerTasks = [
  {
    id: 1,
    title: "Deliver pediatric kits",
    distance: "1.4 km",
    type: "Medical",
    urgency: "Critical",
    zone: "Children's Camp Delta",
    impact: 17,
  },
  {
    id: 2,
    title: "Assist shelter intake",
    distance: "3.1 km",
    type: "Logistics",
    urgency: "High",
    zone: "Shelter Transit Hub",
    impact: 29,
  },
  {
    id: 3,
    title: "Water rescue standby",
    distance: "5.7 km",
    type: "Rescue",
    urgency: "Critical",
    zone: "Canal Corridor",
    impact: 11,
  },
  {
    id: 4,
    title: "Route plasma courier",
    distance: "2.2 km",
    type: "Medical",
    urgency: "High",
    zone: "City Blood Bank",
    impact: 8,
  },
];
