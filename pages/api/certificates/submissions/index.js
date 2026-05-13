import connectDB from '../../../../lib/mongodb';
import DonationSubmission from '../../../../lib/models/DonationSubmission';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    try {
        const adminKey = req.headers['x-admin-key'];

        if (adminKey !== process.env.ADMIN_SECRET) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        await connectDB();

        const submissions = await DonationSubmission.find({
            status: { $in: ['pending', 'approved'] },
        }).sort({
            status: 1,
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            submissions,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}