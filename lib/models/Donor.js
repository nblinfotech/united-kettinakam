import mongoose from 'mongoose';

const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18, max: 65 },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'], default: 'Prefer not to say' },
  phone: { type: String, required: true, trim: true },
  email: { type: String, default: null, trim: true, lowercase: true },
  location: { type: String, required: true, trim: true },
  lastDonation: { type: String, default: null },
  medicalNotes: { type: String, default: '' },
  canDonate: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },   // Admin must verify before showing
  verificationToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Index for search
DonorSchema.index({ name: 'text', location: 'text' });

export default mongoose.models.Donor || mongoose.model('Donor', DonorSchema);
