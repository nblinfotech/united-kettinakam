import mongoose from 'mongoose';

const CertificateSubmissionSchema =
    new mongoose.Schema(
        {
            donorId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Donor',
            },

            name: String,
            bloodGroup: String,
            phone: String,
            location: String,

            donationDate: String,

            units: {
                type: Number,
                default: 1,
            },

            status: {
                type: String,
                default: 'pending',
            },

            approvedAt: Date,
        },
        {
            timestamps: true,
        }
    );

export default mongoose.models
    .CertificateSubmission ||
    mongoose.model(
        'CertificateSubmission',
        CertificateSubmissionSchema
    );