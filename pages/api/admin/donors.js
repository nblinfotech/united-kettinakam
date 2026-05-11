import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

export default async function handler(req, res) {
    await connectDB();

    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            // Admin sees ALL donors — verified and unverified
            const donors = await Donor.find({})
                .select('-verificationToken -__v')
                .sort({ name: 1 });
            return res.status(200).json({ success: true, donors });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}