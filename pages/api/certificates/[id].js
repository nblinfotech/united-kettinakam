import connectDB from '../../../lib/mongodb';
import Donor from '../../../lib/models/Donor';
import DonationSubmission from '../../../lib/models/DonationSubmission';

export default async function handler(req, res) {
  await connectDB();

  const { id, key } = req.query;

  if (key !== process.env.ADMIN_SECRET) {
    return res.status(401).send('Unauthorized');
  }

  const donor = await Donor.findById(id);

  if (!donor) {
    return res.status(404).send('Donor not found');
  }

  const submission = await DonationSubmission.findOne({
    donorId: donor._id,
    status: 'approved',
  }).sort({
    approvedAt: -1,
    donationDate: -1,
  });

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const donationDate = formatDate(
    submission?.donationDate || donor.lastDonation
  );

  const hospitalName =
    submission?.hospital ||
    submission?.hospitalName ||
    submission?.hospital_name ||
    donor.hospital ||
    '-';

  const logoSrc = '/logo.png';
  const stampSrc = '/stamp.png';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Blood Donation Certificate</title>

  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      width: 297mm;
      height: 210mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: Georgia, serif;
      background: #f5f5f5;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .certificate {
      width: 297mm;
      height: 210mm;
      position: relative;
      background: #fff;
      overflow: hidden;
      border: 10px solid #e4b100;
    }

    .inner-border {
      position: absolute;
      inset: 10px;
      border: 2px solid #e4b100;
    }

    .corner {
      position: absolute;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: linear-gradient(135deg, #9b0000, #ffcc00);
      opacity: 0.95;
    }

    .corner.top-left {
      top: -80px;
      left: -80px;
    }

    .corner.bottom-right {
      bottom: -80px;
      right: -80px;
    }

    .content {
      position: relative;
      z-index: 2;
      height: 100%;
      padding: 22px 40px;
      text-align: center;
    }

    .logo img {
      width: 92px;
      height: 92px;
      object-fit: contain;
    }

    .title {
      margin-top: 4px;
      font-size: 46px;
      font-weight: bold;
      color: #b40000;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .subtitle {
      margin-top: 4px;
      font-size: 18px;
      letter-spacing: 6px;
      color: #222;
      text-transform: uppercase;
    }

    .presented {
      margin-top: 20px;
      font-size: 18px;
      color: #222;
      font-family: Arial, sans-serif;
    }

    .name {
      margin-top: 10px;
      font-size: 58px;
      color: #b40000;
      font-style: italic;
      font-weight: 500;
      line-height: 1;
    }

    .message {
      width: 78%;
      margin: 18px auto 0;
      font-size: 16px;
      line-height: 1.5;
      color: #222;
      font-family: Arial, sans-serif;
    }

    .cards {
      margin-top: 22px;
      display: flex;
      justify-content: center;
      gap: 24px;
    }

    .card {
      width: 250px;
      min-height: 100px;
      border: 1.5px solid #e4b100;
      border-radius: 14px;
      background: #fffdf8;
      padding: 18px;
    }

    .card-label {
      font-size: 12px;
      letter-spacing: 1px;
      color: #222;
      font-family: Arial, sans-serif;
      text-transform: uppercase;
    }

    .card-value {
      margin-top: 8px;
      font-size: 16px;
      font-weight: bold;
      color: #b40000;
      font-family: Arial, sans-serif;
    }

    .hero {
      margin-top: 18px;
      display: inline-block;
      background: #c30000;
      color: #fff;
      padding: 10px 24px;
      border-radius: 999px;
      font-size: 18px;
      font-family: Arial, sans-serif;
      font-weight: bold;
    }

    .watermark {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.045;
      z-index: 1;
      pointer-events: none;
    }

    .watermark img {
      width: 520px;
      height: 520px;
      object-fit: contain;
    }

    .footer {
      position: absolute;
      bottom: 18px;
      left: 40px;
      right: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      z-index: 2;
    }

    .sign {
      width: 260px;
      text-align: center;
      position: relative;
    }

    .sign-line {
      border-top: 2px solid #d9b100;
      margin-top: 10px;
      padding-top: 10px;
      font-size: 15px;
      font-family: Arial, sans-serif;
    }

    .stamp {
      width: 100px;
      height: 100px;
      object-fit: contain;
      filter: grayscale(1) contrast(1.4);
      opacity: 0.92;
      margin-bottom: -18px;
      transform: rotate(-10deg);
    }

    .date {
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: #222;
      margin-top: 12px;
    }

    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999;
      background: #e4b100;
      border: none;
      padding: 12px 18px;
      cursor: pointer;
      font-weight: bold;
    }

    @media print {
      .print-btn {
        display: none;
      }

      html,
      body {
        width: 297mm;
        height: 210mm;
      }
    }
  </style>
</head>

<body>

<button class="print-btn" onclick="window.print()">
  Print Certificate
</button>

<div class="certificate">

  <div class="corner top-left"></div>
  <div class="corner bottom-right"></div>

  <div class="inner-border"></div>

  <div class="watermark">
    <img src="${logoSrc}" />
  </div>

  <div class="content">

    <div class="logo">
      <img src="${logoSrc}" />
    </div>

    <div class="title">
      Certificate of Appreciation
    </div>

    <div class="subtitle">
      Blood Donation Certificate
    </div>

    <div class="presented">
      This certificate is proudly presented to
    </div>

    <div class="name">
      ${donor.name || '-'}
    </div>

    <div class="message">
      In sincere appreciation for voluntarily donating blood
      and contributing to the noble cause of saving lives.
    </div>

    <div class="cards">

      <div class="card">
        <div class="card-label">Blood Group</div>
        <div class="card-value">
          ${donor.bloodGroup || '-'}
        </div>
      </div>

      <div class="card">
        <div class="card-label">Date of Donation</div>
        <div class="card-value">
          ${donationDate}
        </div>
      </div>

      <div class="card">
        <div class="card-label">Hospital</div>
        <div class="card-value">
          ${hospitalName}
        </div>
      </div>

    </div>

    <div class="hero">
      BE A HERO, DONATE BLOOD
    </div>

  </div>

  <div class="footer">

    <div class="sign">

      <img class="stamp" src="/stamp.png" />

      <div class="sign-line">
        Authorized Signature
      </div>

      <div class="date">
        UK Authority
      </div>
    </div>

    <div class="sign">

      <div class="sign-line">
        Date
      </div>

      <div class="date">
        ${formatDate(new Date())}
      </div>

    </div>

  </div>

</div>

</body>
</html>
`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}