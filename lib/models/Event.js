import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
  color: { type: String, enum: ['red', 'gold', 'green'], default: 'gold' },
  tag: { type: String, default: 'Open Registration' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
