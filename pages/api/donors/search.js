import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

export default async function handler(req, res) {

    await connectDB();

    const { q } = req.query;

    try {

        const donors = await Donor.find({
            verified: true,
            $or: [
                {
                    name: {
                        $regex: q,
                        $options: 'i',
                    },
                },
                {
                    phone: {
                        $regex: q,
                        $options: 'i',
                    },
                },
            ],
        })
            .limit(8);

        res.status(200).json({
            success: true,
            donors,
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: 'Server Error',
        });

    }
}