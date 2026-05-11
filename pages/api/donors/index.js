import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { bloodGroup, search } = req.query;
      let query = { verified: true };

      if (bloodGroup && bloodGroup !== 'All') {
        query.bloodGroup = bloodGroup;
      }

      let donors = await Donor.find(query)
        .select('-email -verificationToken -__v')
        .sort({ createdAt: -1 });

      if (search) {
        const s = search.toLowerCase();
        donors = donors.filter(d =>
          d.name.toLowerCase().includes(s) ||
          d.location.toLowerCase().includes(s) ||
          d.bloodGroup.toLowerCase().includes(s)
        );
      }

      return res.status(200).json({ success: true, donors });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, age, bloodGroup, gender, phone, email, location, lastDonation, medicalNotes } = req.body;

      // Basic validation
      if (!name || !age || !bloodGroup || !phone || !email || !location) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
      }

      if (age < 18 || age > 65) {
        return res.status(400).json({ success: false, message: 'Age must be between 18 and 65.' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
      }

      // Check if email already registered (only if email provided)
      if (email) {
        const existing = await Donor.findOne({ email: email.toLowerCase() });
        if (existing) {
          return res.status(409).json({ success: false, message: 'This email is already registered.' });
        }
      }

      // Create donor (unverified)
      const donor = await Donor.create({
        name, age: parseInt(age), bloodGroup, gender, phone,
        email: email.toLowerCase(), location,
        lastDonation: lastDonation || null,
        medicalNotes: medicalNotes || '',
        verified: false,
      });

      // Send email notification to admin (if SMTP configured)
      try {
        const { sendAdminNotification } = await import('../../../lib/mailer');
        await sendAdminNotification(donor);
      } catch (_) {
        // Mailer not configured — skip silently
      }

      return res.status(201).json({
        success: true,
        message: `Thank you ${name}! Your registration is received. Our team will verify your details and notify you at ${email}.`
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
