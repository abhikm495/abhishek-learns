# Abhishek Learns

Interview prep hub — DSA patterns with brute-force to optimal C++ solutions, real-world use cases, and a dynamic admin CMS.

## Stack

- **Next.js 15** (App Router)
- **Apollo GraphQL** (server + client)
- **MongoDB** + Mongoose
- **TypeScript** + Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB URI (local or [MongoDB Atlas](https://www.mongodb.com/atlas)) and admin credentials:

```
MONGODB_URI=mongodb://localhost:27017/abhishek-learns

# Admin auth (quote the password if it contains # or spaces)
ADMIN_PASSWORD="your-admin-password"
# Generate: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
JWT_SECRET="a-long-random-string"
```

The admin panel and all content mutations are protected. Visiting any `/admin` page prompts
for `ADMIN_PASSWORD` once, then keeps you signed in for **30 days** via a signed JWT cookie.

### 3. Start MongoDB

If using local MongoDB:

```bash
mongod
```

### 4. Generate seed data (optional — already committed)

```bash
npm run seed:build   # regenerate scripts/seed-data.json from build script
```

### 5. Seed the database

```bash
npm run seed
```

This populates **33 DSA patterns** and **196 questions** with LeetCode links, use cases, and sample C++ solutions.

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — learning tracks |
| `/dsa` | All DSA patterns |
| `/dsa/[pattern]` | Questions in a pattern |
| `/dsa/[pattern]/[question]` | Solutions + use cases |
| `/admin` | Manage patterns, questions, solutions |

## Admin Workflow

1. Go to `/admin`
2. **Add Pattern** — create a new DSA pattern
3. **Add Question** — attach LeetCode/GFG links
4. **Edit Question** — add brute/better/optimal C++ solutions
5. **Add Use Case** — document real-world tech applications

All content is stored in MongoDB and served via GraphQL at `/api/graphql`.

## GraphQL Playground

Visit [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql) in the browser or use any GraphQL client.

Example query:

```graphql
query {
  patterns(categorySlug: "dsa") {
    title
    questionCount
    questions {
      title
      difficulty
      links { platform url }
    }
  }
}
```

## Project Structure

```
src/
├── app/                  # Next.js pages
│   ├── api/graphql/      # Apollo Server route
│   ├── dsa/              # Public DSA pages
│   └── admin/            # Admin CMS
├── components/           # UI components
├── graphql/              # Schema, resolvers, queries
├── lib/                  # DB, Apollo client, server fetch
└── models/               # Mongoose models
scripts/
└── seed.ts               # Database seed script
```

## Deploy to Vercel

### Prerequisites

1. [MongoDB Atlas](https://www.mongodb.com/atlas) cluster with data seeded (`npm run seed` using your Atlas URI locally)
2. Atlas **Network Access** → allow `0.0.0.0/0` (or Vercel IP ranges)
3. A [Vercel](https://vercel.com) account

### Option A — GitHub (recommended)

```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USER/abhishek-learns.git
git push -u origin main
```

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Vercel auto-detects Next.js — no build settings needed
4. Add **Environment Variables**:
   - `MONGODB_URI` = your Atlas connection string
   - `ADMIN_PASSWORD` = your admin password
   - `JWT_SECRET` = a long random string (see generator command above)
5. Deploy

`VERCEL_URL` is set automatically — no need to configure `NEXT_PUBLIC_APP_URL` unless you add a custom domain later.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

When prompted, link the project and add `MONGODB_URI` in the Vercel dashboard under **Settings → Environment Variables**.

### After deploy

- Open your `*.vercel.app` URL → `/dsa` should show all patterns
- Admin and solution editing work the same as local
- First request after idle may take a few seconds (cold start + Atlas connect)

## Next Steps

- Add auth for admin routes (NextAuth)
- Add LLD, HLD, React, Next.js categories
- Add ISR caching on public pages for faster loads
