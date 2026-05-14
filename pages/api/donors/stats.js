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

      // 4 months back date
      const fourMonthsAgo = new Date();
      fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

      // Get all verified donors
      const donors = await Donor.find({
        verified: true,
        canDonate: true,
        blocked: { $ne: true },
      });

      // Filter eligible donors
      const available = donors.filter((donor) => {

        // Never donated
        if (!donor.lastDonation) return true;

        const lastDonationDate = new Date(donor.lastDonation);

        // Invalid date safeguard
        if (isNaN(lastDonationDate.getTime())) return true;

        // Eligible after 4 months
        return lastDonationDate <= fourMonthsAgo;

      }).length;

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
      console.log(err);

      return res.status(500).json({
        success: false,
      });
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
  });
}