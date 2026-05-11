# United Kettinakam – Sports Club Website

A full-stack Next.js website with MongoDB storage, deployable on Vercel.

## Features
- **Home** – Hero section with animated counters
- **About Us** – Club story and values
- **Events** – Fetched from MongoDB (auto-seeded on first load)
- **Blood Donation** – Interactive donor directory with search, filter, and registration form
- **Admin Panel** – `/admin` – verify/reject donor registrations before they go public

---

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a new **free cluster** (M0 tier)
3. Under **Database Access** → Add a user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all, required for Vercel)
5. Click **Connect** → **Connect your application** → Copy the connection string
6. Replace `<password>` in the string with your actual password

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/united-kettinakam.git
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `ADMIN_SECRET` | Any strong secret string (e.g. `uk-admin-2024-xyz`) |
| `SMTP_HOST` | `smtp.gmail.com` (optional) |
| `SMTP_PORT` | `587` (optional) |
| `SMTP_USER` | Your Gmail (optional) |
| `SMTP_PASS` | Gmail App Password (optional) |
| `ADMIN_EMAIL` | Where admin notifications go (optional) |

3. Click **Deploy** — done!

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Copy env template
cp .env.local.example .env.local
# → Edit .env.local with your MongoDB URI and admin key

# Run dev server
npm run dev
# → Open http://localhost:3000
```

---

## 🔐 Admin Panel

Visit `/admin` on your deployed site.

- Enter your `ADMIN_SECRET` key to log in
- See all pending donor registrations (name, email, blood group, etc.)
- **Verify & Publish** → donor appears in the public list
- **Remove** → reject false/invalid registration

---

## 📧 Email Notifications (Optional)

For Gmail SMTP:
1. Enable 2FA on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Generate an app password for "Mail"
4. Use that as `SMTP_PASS`

---

## Project Structure

```
uk-app/
├── pages/
│   ├── index.js          # Main website
│   ├── admin.js          # Admin verification panel
│   └── api/
│       ├── donors/
│       │   ├── index.js  # GET (list) / POST (register)
│       │   ├── [id].js   # PATCH (verify) / DELETE (remove)
│       │   ├── pending.js# GET unverified (admin only)
│       │   └── stats.js  # GET donor counts
│       └── events/
│           └── index.js  # GET events (auto-seeds defaults)
├── components/           # React components
├── lib/
│   ├── mongodb.js        # DB connection
│   ├── mailer.js         # Email notifications
│   └── models/
│       ├── Donor.js      # Donor schema
│       └── Event.js      # Event schema
├── public/
│   └── logo.png          # Club logo
└── styles/
    └── globals.css
```
