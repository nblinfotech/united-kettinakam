import nodemailer from 'nodemailer';

export async function sendAdminNotification(donor) {
  if (!process.env.SMTP_HOST || !process.env.ADMIN_EMAIL) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"UK Club" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Blood Donor Registration – ${donor.name} (${donor.bloodGroup})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:8px;">
        <h2 style="color:#F5C800;font-size:1.5rem;margin-bottom:8px;">United Kettinakam</h2>
        <p style="color:#aaa;margin-bottom:24px;">New blood donor registration awaiting verification</p>
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ['Name', donor.name],
            ['Blood Group', donor.bloodGroup],
            ['Age', donor.age],
            ['Gender', donor.gender],
            ['Phone', donor.phone],
            ['Email', donor.email],
            ['Location', donor.location],
            ['Last Donation', donor.lastDonation || 'First time'],
            ['Medical Notes', donor.medicalNotes || 'None'],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:10px 16px;color:#888;border-bottom:1px solid #222;width:140px;">${k}</td>
              <td style="padding:10px 16px;color:#fff;border-bottom:1px solid #222;">${v}</td>
            </tr>`).join('')}
        </table>
        <div style="margin-top:28px;padding:16px;background:#1a1a1a;border-radius:4px;">
          <p style="color:#aaa;font-size:0.85rem;">To verify this donor, use your admin panel or send a PATCH request to:</p>
          <code style="color:#F5C800;font-size:0.8rem;">/api/donors/${donor._id}</code>
          <p style="color:#aaa;font-size:0.8rem;margin-top:8px;">with header <code>x-admin-key: YOUR_ADMIN_SECRET</code></p>
        </div>
      </div>
    `,
  });
}
