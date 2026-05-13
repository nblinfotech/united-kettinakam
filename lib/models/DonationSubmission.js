import mongoose from 'mongoose';

const DonationSubmissionSchema = new mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor',
            required: true,
        },

        donorName: String,
        bloodGroup: String,
        phone: String,
        location: String,
        age: Number,
        gender: String,

        donationDate: {
            type: Date,
            required: true,
        },

        hospital: {
            type: String,
            required: true,
        },

        unitsDonated: String,

        notes: String,

        photo: String,

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },

        certificateGenerated: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.DonationSubmission ||
    mongoose.model(
        'DonationSubmission',
        DonationSubmissionSchema
    );