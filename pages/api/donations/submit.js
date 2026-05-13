// /pages/api/donations/submit.js

import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';
import DonationSubmission from '../../../lib/models/DonationSubmission';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

export default async function handler(req, res) {
    await connectDB();

    // SEARCH DONORS
    if (req.method === 'GET') {
        try {
            const { search = '' } = req.query;

            const donors = await Donor.find({
                verified: true,
                $or: [
                    {
                        name: {
                            $regex: search,
                            $options: 'i',
                        },
                    },
                    {
                        phone: {
                            $regex: search,
                            $options: 'i',
                        },
                    },
                ],
            })
                .limit(10)
                .sort({ name: 1 });

            return res.status(200).json({
                success: true,
                donors,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Failed to search donors',
            });
        }
    }

    // SUBMIT DONATION
    if (req.method === 'POST') {
        try {
            const {
                donorId,
                donationDate,
                hospital,
                unitsDonated,
                notes,
                photo,
            } = req.body;

            if (!donorId || !donationDate || !hospital) {
                return res.status(400).json({
                    success: false,
                    message: 'Required fields missing',
                });
            }

            const donor = await Donor.findById(donorId);

            if (!donor) {
                return res.status(404).json({
                    success: false,
                    message: 'Donor not found',
                });
            }

            // 1. Block if already pending certificate request exists
            const pendingSubmission = await DonationSubmission.findOne({
                donorId,
                status: 'pending',
            });

            if (pendingSubmission) {
                return res.status(400).json({
                    success: false,
                    message:
                        'You already have a pending certificate request. Please wait for approval before submitting again.',
                });
            }

            // 2. Block if donation date is before donor's last donation date
            if (donor.lastDonation) {
                const lastDonationDate = new Date(donor.lastDonation);
                const currentDonationDate = new Date(donationDate);

                if (currentDonationDate < lastDonationDate) {
                    return res.status(400).json({
                        success: false,
                        message:
                            'Donation date cannot be before your previous donation date.',
                    });
                }
            }

            // 3. Block if last approved donation is less than 4 months ago
            const lastApprovedSubmission = await DonationSubmission.findOne({
                donorId,
                status: 'approved',
            }).sort({
                donationDate: -1,
                approvedAt: -1,
            });

            const lastDonationSource =
                lastApprovedSubmission?.donationDate ||
                donor.lastDonation;

            if (lastDonationSource) {
                const lastDonationDate = new Date(lastDonationSource);
                const nextAllowedDate = new Date(lastDonationDate);

                nextAllowedDate.setMonth(
                    nextAllowedDate.getMonth() + 4
                );

                const currentDonationDate = new Date(donationDate);

                if (currentDonationDate < nextAllowedDate) {
                    return res.status(400).json({
                        success: false,
                        message: `You can donate blood and submit another donation certificate only after ${formatDate(
                            nextAllowedDate
                        )}.`,
                    });
                }
            }

            const submission = await DonationSubmission.create({
                donorId,

                donorName: donor.name,
                phone: donor.phone,
                bloodGroup: donor.bloodGroup,
                location: donor.location,
                age: donor.age,
                gender: donor.gender,

                donationDate,
                hospital,
                unitsDonated: unitsDonated || 1,
                notes,
                photo,
                status: 'pending',
            });

            return res.status(201).json({
                success: true,
                message: 'Donation submitted successfully',
                submission,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: 'Failed to submit donation',
            });
        }
    }

    return res.status(405).json({
        success: false,
        message: 'Method not allowed',
    });
}