/**
 * United Kettinakam – Donor Seed Script
 * 
 * Usage:
 *   node seed-donors.js
 * 
 * Make sure to set MONGODB_URI in .env.local or export it before running:
 *   export MONGODB_URI="mongodb+srv://..."
 *   node seed-donors.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set. Add it to .env.local or export it.');
  process.exit(1);
}

// ── Donor Schema (mirrors lib/models/Donor.js) ──────────────
const DonorSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  age:               { type: Number, default: null },
  bloodGroup:        { type: String, required: true },
  gender:            { type: String, default: 'Male' },
  phone:             { type: String, required: true },
  email:             { type: String, default: null },
  location:          { type: String, required: true },
  lastDonation:      { type: String, default: null },
  medicalNotes:      { type: String, default: '' },
  available:         { type: Boolean, default: true },
  verified:          { type: Boolean, default: true },   // pre-verified — trusted data
  createdAt:         { type: Date,    default: Date.now },
});

const Donor = mongoose.models.Donor || mongoose.model('Donor', DonorSchema);

// ── Donor Data ───────────────────────────────────────────────
const donors = [
  { name: "Ashik TK",               blood: "O-",  gender: "Male",   phone: "0540322132",         location: "Edakkad"     },
  { name: "Afsar",                   blood: "B+",  gender: "Male",   phone: "9961505777",         location: "Kulam Bazar" },
  { name: "Aamir",                   blood: "B+",  gender: "Male",   phone: "9567258444",         location: "Kettinakam"  },
  { name: "Adil",                    blood: "O+",  gender: "Male",   phone: "9946587901",         location: "Kettinakam"  },
  { name: "Afjan Ahammed RK",        blood: "A+",  gender: "Male",   phone: "9946221244",         location: "Kettinakam"  },
  { name: "Afsi",                    blood: "A+",  gender: "Female", phone: "7356055013",         location: "Edakkad"     },
  { name: "Althaf",                  blood: "A+",  gender: "Male",   phone: "9895896303",         location: "Kettinakam"  },
  { name: "Ameen",                   blood: "O+",  gender: "Male",   phone: "+971553109129",      location: "Edakkad"     },
  { name: "Aswad",                   blood: "O+",  gender: "Male",   phone: "9895264263",         location: "Kettinakam"  },
  { name: "Azarudhenn CK",           blood: "O+",  gender: "Male",   phone: "8129742868",         location: "Kettinakam"  },
  { name: "Basim Ismail",            blood: "O+",  gender: "Male",   phone: "8281522239",         location: "Ussan Mukku" },
  { name: "Fadhil",                  blood: "O+",  gender: "Male",   phone: "9995600458",         location: "Kettinakam"  },
  { name: "Faheem",                  blood: "O+",  gender: "Male",   phone: "7034428999",         location: "Kettinakam"  },
  { name: "Faiz",                    blood: "A-",  gender: "Male",   phone: "971501996170",       location: "Kettinakam"  },
  { name: "Farhad KP",               blood: "O+",  gender: "Male",   phone: "9995552589",         location: "Kettinakam"  },
  { name: "Huwais",                  blood: "A+",  gender: "Male",   phone: "9747387139",         location: "Kettinakam"  },
  { name: "Imran",                   blood: "O+",  gender: "Male",   phone: "8848678933",         location: "Kettinakam"  },
  { name: "Kirash",                  blood: "O+",  gender: "Male",   phone: "00971559554525",     location: "Kettinakam"  },
  { name: "Mishal",                  blood: "O+",  gender: "Male",   phone: "9562922642",         location: "Kettinakam"  },
  { name: "Mohammed Rashid",         blood: "B+",  gender: "Male",   phone: "9895956567",         location: "Kettinakam"  },
  { name: "Mohammed Risham",         blood: "O+",  gender: "Male",   phone: "9995558851",         location: "Kettinakam"  },
  { name: "Mohammed Shanid M",       blood: "A+",  gender: "Male",   phone: "8870773007",         location: "Kettinakam"  },
  { name: "Mohammed Rizjan PP",      blood: "A+",  gender: "Male",   phone: "8086633837",         location: "Madam"       },
  { name: "Mohsin",                  blood: "O+",  gender: "Male",   phone: "525347879",          location: "Madam"       },
  { name: "Mubashir TC",             blood: "O+",  gender: "Male",   phone: "8139034846",         location: "Kettinakam"  },
  { name: "Muhammed Nihal",          blood: "A+",  gender: "Male",   phone: "8129482373",         location: "Kettinakam"  },
  { name: "Muhammed Ramshid",        blood: "O+",  gender: "Male",   phone: "919567839070",       location: "Kettinakam"  },
  { name: "Muhseer",                 blood: "O+",  gender: "Male",   phone: "0561969514",         location: "Kettinakam"  },
  { name: "Muneef",                  blood: "O+",  gender: "Male",   phone: "+966534303899",      location: "Kettinakam"  },
  { name: "Nabil",                   blood: "O+",  gender: "Male",   phone: "9633008613",         location: "Kettinakam"  },
  { name: "Nadeer",                  blood: "O+",  gender: "Male",   phone: "9037500289",         location: "Edakkad"     },
  { name: "Nibras",                  blood: "O+",  gender: "Male",   phone: "9895881724",         location: "Kettinakam"  },
  { name: "Rafan AP",                blood: "O-",  gender: "Male",   phone: "8921349385",         location: "Kulam Bazar" },
  { name: "Rahil",                   blood: "O+",  gender: "Male",   phone: "8324294232",         location: "Kettinakam"  },
  { name: "Ramshid",                 blood: "O+",  gender: "Male",   phone: "9567839070",         location: "Kettinakam"  },
  { name: "Rashid Nazeer",           blood: "B+",  gender: "Male",   phone: "+971507608683",      location: "Kettinakam"  },
  { name: "Razique",                 blood: "A+",  gender: "Male",   phone: "9447674965",         location: "Kettinakam"  },
  { name: "Rijas",                   blood: "A-",  gender: "Male",   phone: "+97339575053",       location: "Kettinakam"  },
  { name: "Rizwan MA",               blood: "O+",  gender: "Male",   phone: "9895441123",         location: "Kettinakam"  },
  { name: "Sabique",                 blood: "B+",  gender: "Male",   phone: "7026309142",         location: "Kettinakam"  },
  { name: "Sabith AK",               blood: "B+",  gender: "Male",   phone: "8075422773",         location: "Kettinakam"  },
  { name: "Salah CK",                blood: "AB+", gender: "Male",   phone: "9995348888",         location: "Kettinakam"  },
  { name: "Sanfaras EK",             blood: "O+",  gender: "Male",   phone: "9986883908",         location: "Kettinakam"  },
  { name: "Shahabaz (Shebu)",        blood: "O+",  gender: "Male",   phone: "+971566371636",      location: "Kettinakam"  },
  { name: "Shahsad",                 blood: "O+",  gender: "Male",   phone: "9567977937",         location: "Kettinakam"  },
  { name: "Shajil",                  blood: "O+",  gender: "Male",   phone: "9656972203",         location: "Kettinakam"  },
  { name: "Shammaz",                 blood: "A+",  gender: "Male",   phone: "9895735873",         location: "Kettinakam"  },
  { name: "Shiras",                  blood: "A+",  gender: "Male",   phone: "8129049990",         location: "Kettinakam"  },
  { name: "Shuhaib MCT",             blood: "O-",  gender: "Male",   phone: "+96894253050",       location: "Kettinakam"  },
  { name: "Shuhail",                 blood: "B+",  gender: "Male",   phone: "9995572089",         location: "Kettinakam"  },
  { name: "Siyad Kettinakam",        blood: "B+",  gender: "Male",   phone: "9847980324",         location: "Kettinakam"  },
  { name: "Thanveer KP",             blood: "B+",  gender: "Male",   phone: "9846667944",         location: "Edakkad"     },
  { name: "Thanveer Abdulkayyum",    blood: "O+",  gender: "Male",   phone: "9895576854",         location: "Edakkad"     },
  { name: "Thouseef EK",             blood: "O+",  gender: "Male",   phone: "9895143188",         location: "Kettinakam"  },
  { name: "Vahab",                   blood: "AB+", gender: "Male",   phone: "7561849864",         location: "Kettinakam"  },
  { name: "Zeba",                    blood: "AB+", gender: "Female", phone: "9846667944",         location: "Edakkad"     },
];

// ── Seed ─────────────────────────────────────────────────────
async function seed() {
  console.log('\n🔗  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅  Connected.\n');

  // Optional: clear existing donors first
  const args = process.argv.slice(2);
  if (args.includes('--reset')) {
    await Donor.deleteMany({});
    console.log('🗑   Cleared existing donors.\n');
  } else {
    const existing = await Donor.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️   Found ${existing} existing donors.`);
      console.log('    Run with --reset to clear before seeding.\n');
    }
  }

  // Build docs — skip duplicates by phone
  let inserted = 0, skipped = 0;

  for (const d of donors) {
    const exists = await Donor.findOne({ phone: d.phone, name: d.name });
    if (exists) {
      console.log(`  ⏭  Skipped (already exists): ${d.name}`);
      skipped++;
      continue;
    }

    await Donor.create({
      name:        d.name,
      age:         null,
      bloodGroup:  d.blood,
      gender:      d.gender,
      phone:       d.phone,
      email:       null,
      location:    d.location,
      lastDonation: null,
      medicalNotes: '',
      available:   true,
      verified:    true,   // trusted data — skip admin verification
    });

    console.log(`  ✓  ${d.name.padEnd(28)} ${d.blood.padEnd(4)}  ${d.location}`);
    inserted++;
  }

  console.log(`\n📊  Done! Inserted: ${inserted}  |  Skipped: ${skipped}`);

  // Summary by blood group
  const groups = await Donor.aggregate([
    { $match: { verified: true } },
    { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log('\n🩸  Blood group breakdown:');
  groups.forEach(g => console.log(`    ${g._id.padEnd(4)}  →  ${g.count} donor${g.count > 1 ? 's' : ''}`));
  console.log(`\n    Total verified donors: ${await Donor.countDocuments({ verified: true })}\n`);

  await mongoose.disconnect();
  console.log('🔌  Disconnected. All done!\n');
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
