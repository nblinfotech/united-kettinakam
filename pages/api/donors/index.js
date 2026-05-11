import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';

function isAdmin(req) {
  return req.headers['x-admin-key'] === process.env.ADMIN_SECRET;
}

export default async function handler(req, res) {
  await connectDB();

  // ── GET — public donor list (verified only) ───────────────
  if (req.method === 'GET') {
    try {
      const { bloodGroup, search } = req.query;
      let query = { verified: true };
      if (bloodGroup && bloodGroup !== 'All') query.bloodGroup = bloodGroup;

      let donors = await Donor.find(query)
        .select('-email -verificationToken -__v')
        .sort({ name: 1 });

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

  // ── POST — public registration (unverified) ───────────────
  if (req.method === 'POST') {
    try {
      const { name, age, bloodGroup, gender, phone, email, location, lastDonation, medicalNotes } = req.body;

      if (!name || !bloodGroup || !phone || !location) {
        return res.status(400).json({ success: false, message: 'Name, blood group, phone and location are required.' });
      }
      if (age && (parseInt(age) < 18 || parseInt(age) > 65)) {
        return res.status(400).json({ success: false, message: 'Age must be between 18 and 65.' });
      }
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ success: false, message: 'Invalid email address.' });
        }
        const existing = await Donor.findOne({ email: email.toLowerCase() });
        if (existing) {
          return res.status(409).json({ success: false, message: 'This email is already registered.' });
        }
      }

      // Admins bypass verification
      const verifiedByAdmin = isAdmin(req);

      const donor = await Donor.create({
        name, age: age ? parseInt(age) : null, bloodGroup, gender: gender || 'Prefer not to say',
        phone, email: email ? email.toLowerCase() : null, location,
        lastDonation: lastDonation || null,
        medicalNotes: medicalNotes || '',
        verified: verifiedByAdmin,
      });

      if (verifiedByAdmin) {
        return res.status(201).json({ success: true, message: `Donor ${name} added and published.`, donor });
      }

      try {
        const { sendAdminNotification } = await import('../../../lib/mailer');
        await sendAdminNotification(donor);
      } catch (_) { }

      return res.status(201).json({
        success: true,
        message: `Thank you ${name}! Your registration is received. Our team will verify your details and notify you at ${email || 'the contact provided'}.`
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}