import connectDB from '../../../lib/mongodb';
import Event from '../../../lib/models/Event';

const DEFAULT_EVENTS = [
  { date: 'JAN 26, 2025', name: 'Republic Day Cricket Tournament', description: 'Annual inter-ward cricket tournament celebrating Republic Day with 8 teams competing across 2 days.', type: 'upcoming', color: 'green', tag: 'Open Registration' },
  { date: 'DEC 15, 2024', name: 'Blood Donation Camp', description: 'Our biggest blood donation drive in collaboration with local hospitals. Over 45 units collected.', type: 'past', color: 'red', tag: 'Completed' },
  { date: 'NOV 10, 2024', name: 'UK Football League – Season 3', description: 'The third edition of our flagship football league saw 10 teams and hundreds of spectators.', type: 'past', color: 'gold', tag: 'Completed' },
  { date: 'FEB 14, 2025', name: 'Youth Sports Day', description: 'A full-day sports carnival for youth aged 8-18, featuring athletics, kabaddi, and throwball events.', type: 'upcoming', color: 'gold', tag: 'Open Registration' },
  { date: 'MAR 5, 2025', name: 'Community Health Walk', description: 'A 5km awareness walk through Kettinakam promoting healthy lifestyles and community bonding.', type: 'upcoming', color: 'green', tag: 'Free Entry' },
  { date: 'OCT 2, 2024', name: 'Gandhi Jayanthi Clean-Up Drive', description: 'Community clean-up of Kettinakam streets and public spaces with 80+ volunteers participating.', type: 'past', color: 'red', tag: 'Completed' },
];

function isAdmin(req) {
  return req.headers['x-admin-key'] === process.env.ADMIN_SECRET;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      let events = await Event.find({}).sort({ createdAt: -1 });
      if (events.length === 0) {
        await Event.insertMany(DEFAULT_EVENTS);
        events = await Event.find({}).sort({ createdAt: -1 });
      }
      return res.status(200).json({ success: true, events });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
    try {
      const { date, name, description, type, color, tag } = req.body;
      if (!date || !name || !description) {
        return res.status(400).json({ success: false, message: 'date, name and description are required.' });
      }
      const event = await Event.create({ date, name, description, type: type || 'upcoming', color: color || 'gold', tag: tag || 'Open Registration' });
      return res.status(201).json({ success: true, event });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}