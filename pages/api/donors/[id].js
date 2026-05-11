import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

function isAdmin(req) {
  return req.headers['x-admin-key'] === process.env.ADMIN_SECRET;
}

export default async function handler(req, res) {
  await connectDB();
  if (!isAdmin(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { id } = req.query;

  // ── GET single donor (admin) ──────────────────────────────
  if (req.method === 'GET') {
    try {
      const donor = await Donor.findById(id).select('-verificationToken -__v');
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
      return res.status(200).json({ success: true, donor });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // ── PATCH — verify OR update specific fields ──────────────
  if (req.method === 'PATCH') {
    try {
      const updates = req.body || {};
      // If body is empty or only has verified=true → simple verify action
      if (Object.keys(updates).length === 0) updates.verified = true;

      const donor = await Donor.findByIdAndUpdate(id, updates, { new: true }).select('-verificationToken -__v');
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
      return res.status(200).json({ success: true, donor });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // ── PUT — full update ─────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      const { name, age, bloodGroup, gender, phone, email, location, lastDonation, medicalNotes, available, verified } = req.body;
      const donor = await Donor.findByIdAndUpdate(
        id,
        { name, age, bloodGroup, gender, phone, email, location, lastDonation, medicalNotes, available, verified },
        { new: true, runValidators: true }
      ).select('-verificationToken -__v');
      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
      return res.status(200).json({ success: true, donor });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // ── DELETE ────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    try {
      await Donor.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Donor removed' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}