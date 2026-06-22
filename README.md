# Atelier — Independent Clothing Store

A minimal clothing storefront for a small independent seller. Built with Next.js, Supabase, Cloudinary, and Tailwind CSS.

## Features

- **Public storefront** — browse items with photos, name, price, and description
- **Request to Buy** — customers submit their name and contact info for any item
- **Admin panel** — password-protected page to add items, delete sold items, and view purchase requests
- **Image uploads** — photos stored on Cloudinary

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open the SQL Editor and run the contents of `supabase/schema.sql`
3. Copy your project URL, anon key, and service role key from **Settings → API**

### 2. Cloudinary

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Copy your **Cloud name**, **API Key**, and **API Secret** from the dashboard

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Generate a random session token for `ADMIN_SESSION_TOKEN` (e.g. `openssl rand -hex 32`).

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example` in the Vercel project settings
4. Deploy

Vercel will detect Next.js automatically. No extra config needed.

## Admin access

Go to `/admin` and sign in with the password you set in `ADMIN_PASSWORD`. The session lasts 7 days via an httpOnly cookie.

## Project structure

```
src/
  app/
    page.tsx              # Storefront
    admin/page.tsx        # Admin panel
    api/                  # API routes
  components/             # UI components
  lib/                    # Supabase, Cloudinary, auth helpers
supabase/
  schema.sql              # Database schema
```
