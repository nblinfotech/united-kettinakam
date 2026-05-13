// pages/api/certificates/submissions/[id]/approve.js

import connectDB from '../../../../../lib/mongodb';

import DonationSubmission from '../../../../../lib/models/DonationSubmission';
import Donor from '../../../../../lib/models/Donor';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        });
    }

    try {
        // ADMIN KEY CHECK
        const adminKey = req.headers['x-admin-key'];

        if (adminKey !== process.env.ADMIN_SECRET) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        await connectDB();

        const { id } = req.query;

        // FIND SUBMISSION
        const submission =
            await DonationSubmission.findById(
                id
            );

        if (!submission) {
            return res.status(404).json({
                success: false,
                message:
                    'Certificate submission not found',
            });
        }

        // FIND DONOR
        const donor = await Donor.findById(
            submission.donorId
        );

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: 'Donor not found',
            });
        }

        // UPDATE LAST DONATION DATE
        donor.lastDonation =
            submission.donationDate;

        // OPTIONAL:
        // donor.available = false;

        await donor.save();

        // UPDATE SUBMISSION STATUS
        submission.status = 'approved';
        submission.approvedAt = new Date();

        await submission.save();

        return res.status(200).json({
            success: true,
            message:
                'Certificate approved successfully',
            donorId: donor._id,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}