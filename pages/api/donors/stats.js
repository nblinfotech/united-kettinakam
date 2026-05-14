import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {

      // Total verified donors
      const total = await Donor.countDocuments({
        verified: true,
      });

      // Donors eligible to donate now
      const available = await Donor.countDocuments({
        verified: true,
        canDonate: true, // better field name
        blocked: { $ne: true },
      });

      // Blood groups
      const groups = await Donor.distinct(
        'bloodGroup',
        { verified: true }
      );

      // Universal donors
      const universal = await Donor.countDocuments({
        verified: true,
        bloodGroup: { $in: ['O+', 'O-'] },
      });

      return res.status(200).json({
        success: true,
        stats: {
          total,
          available,
          groups: groups.length,
          universal,
        },
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
      });
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  });
}