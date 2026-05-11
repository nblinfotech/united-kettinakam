import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const total = await Donor.countDocuments({ verified: true });
      const available = await Donor.countDocuments({ verified: true, available: true });
      const groups = await Donor.distinct('bloodGroup', { verified: true });
      const universal = await Donor.countDocuments({ verified: true, bloodGroup: { $in: ['O+', 'O-'] } });

      return res.status(200).json({ success: true, stats: { total, available, groups: groups.length, universal } });
    } catch (err) {
      return res.status(500).json({ success: false });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
