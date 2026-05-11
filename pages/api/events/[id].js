import connectDB from '../../../lib/mongodb';
import Event from '../../../lib/models/Event';

function isAdmin(req) {
    return req.headers['x-admin-key'] === process.env.ADMIN_SECRET;
}

export default async function handler(req, res) {
    await connectDB();
    if (!isAdmin(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const { date, name, description, type, color, tag } = req.body;
            const event = await Event.findByIdAndUpdate(
                id,
                { date, name, description, type, color, tag },
                { new: true, runValidators: true }
            );
            if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
            return res.status(200).json({ success: true, event });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await Event.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: 'Event deleted' });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}