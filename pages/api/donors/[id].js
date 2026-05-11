import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  // Simple admin key check — set ADMIN_SECRET in env
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'PATCH') {
    try {
      const donor = await Donor.findByIdAndUpdate(
        id,
        { verified: true },
        { new: true }
      ).select('-verificationToken -__v');

      if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });

      return res.status(200).json({ success: true, donor });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Donor.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Donor removed' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // GET unverified list
  if (req.method === 'GET') {
    try {
      const donors = await Donor.find({ verified: false }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, donors });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
