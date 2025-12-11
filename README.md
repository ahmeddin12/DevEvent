### DevEvent — Next.js Event Hub

A full‑stack Next.js application for discovering developer events (hackathons, meetups, conferences) and booking a spot. It features a public events listing, event detail pages, a booking form, image uploads to Cloudinary, MongoDB persistence via Mongoose, and basic product analytics with PostHog.

---

### Features
- Event listing pulled from a MongoDB database
- Event detail pages at `/events/[slug]`
- Upload event images directly from the browser to Cloudinary (multipart form)
- Server Actions for bookings (no separate booking API route required)
- Strongly‑typed Mongoose models with data normalization (slug, date, time)
- Next.js App Router, React 19, and built‑in caching via `cacheLife`
- Light, animated background using `ogl` (WebGL) in `LightRays` component
- PostHog client analytics (page and custom events)

---

### Tech Stack
- Next.js 16 (App Router) with TypeScript
- React 19
- MongoDB with Mongoose 9
- Cloudinary for image hosting
- PostHog for analytics (`posthog-js`)
- Styling: Tailwind CSS v4 + custom CSS in `app/globals.css`

Minimum Node.js: 18+ (LTS recommended).

---

### Project Structure
```
.
├─ app/
│  ├─ page.tsx                # Home page: fetches /api/events and lists cards
│  ├─ layout.tsx              # Global layout, fonts, navbar, LightRays background
│  ├─ globals.css             # Styles (mix of Tailwind and custom CSS)
│  └─ api/
│     └─ events/
│        ├─ route.ts         # GET (list events), POST (create + upload image)
│        └─ [slug]/route.ts  # GET event by slug
├─ components/
│  ├─ NavBar.tsx
│  ├─ ExploreBtn.tsx
│  ├─ EventCard.tsx          # Card used on listings and related events
│  ├─ EventDetails.tsx       # Event details composition + booking sidebar
│  ├─ BookEvent.tsx          # Client component; calls server action to book
│  └─ LightRays.tsx          # Visual background using OGL
├─ database/
│  ├─ event.model.ts         # Mongoose model (slug, date/time normalization, indexes)
│  └─ booking.model.ts       # Mongoose model (uniq booking per event/email)
├─ lib/
│  ├─ mongodb.ts             # Mongoose connection with global caching helper
│  └─ actions/
│     ├─ event.actions.ts    # getSimilarEventsBySlug (server action)
│     └─ booking.actions.ts  # createBooking (server action)
├─ instrumentation-client.ts # PostHog init hook (client‑side)
├─ next.config.ts            # Images, rewrites for PostHog, experimental cache
├─ public/                   # Static assets (icons, logo)
├─ package.json
└─ README.md
```

---

### Environment Variables
Create a `.env` file in the project root. Do not commit secrets to source control.

Required:
- `MONGODB_URI` — MongoDB connection string.
- `NEXT_PUBLIC_BASE_URL` — Base URL used by the app when fetching its own API.
  - Local development: `http://localhost:3000`
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key (client) if analytics is desired.
- `CLOUDINARY_URL` — Cloudinary connection string (in the format `cloudinary://<api_key>:<api_secret>@<cloud_name>`). Required for image uploads.

Notes:
- `next.config.ts` allows external images from `res.cloudinary.com`.
- Rewrites are set so the PostHog client uses `/ingest` in this app and forwards to PostHog’s US stack.

---

### Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` with the variables above.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

Scripts:
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start built app
- `npm run lint` — run ESLint

---

### API Overview
All routes are App Router (route handlers under `app/api`).

- `GET /api/events`
  - Returns: `{ events: IEvent[] }`, sorted by `createdAt` descending.
- `POST /api/events` — Create an event with an image upload
  - Content-Type: `multipart/form-data`
  - Fields:
    - `image`: File (required)
    - Other form fields map to `event.model.ts` properties.
    - `tags`: JSON string array, e.g. `["web","ai"]` (required)
    - `agenda`: JSON string array, e.g. `["Intro","Keynote"]` (required)
  - Validations performed by Mongoose model; image uploaded to Cloudinary into folder `DevEvent`.
- `GET /api/events/[slug]`
  - Returns: `{ event: IEvent }` or 404 if not found.

Server Actions:
- `createBooking({ eventId, slug, email })` — creates a booking in MongoDB.
  - Booking uniqueness is enforced by a compound index: one booking per event/email.
- `getSimilarEventsBySlug(slug)` — finds events sharing any tag with the current event, excluding itself.

---

### Data Models (Summary)
- Event (`database/event.model.ts`)
  - Fields: `title`, `slug`, `description`, `overview`, `image`, `venue`, `location`, `date`, `time`, `mode` (online|offline|hybrid), `audience`, `agenda[]`, `organizer`, `tags[]`.
  - Pre-save normalization: auto-generate `slug`; normalize `date` (`YYYY-MM-DD`) and `time` (`HH:MM`, 24h). Indexes on `slug` (unique) and `{ date, mode }`.
- Booking (`database/booking.model.ts`)
  - Fields: `eventId`, `email`. Indexes on `eventId`, `{ eventId, createdAt }`, `email`, and uniqueness on `{ eventId, email }`.

---

### Caching & Performance
- The home page and event details use the App Router cache (`'use cache'`) and `cacheLife('hours')` for longer‑lived responses.
- `next.config.ts` enables `experimental.cacheComponents`.
- Cloudinary images are optimized by Next Image, with the domain whitelisted in `next.config.ts`.

---

### Analytics (PostHog)
- Client hook: `instrumentation-client.ts` initializes PostHog via `NEXT_PUBLIC_POSTHOG_KEY`.
- Network is proxied via Next rewrites to `/ingest` to avoid third‑party origins in the browser.
- Custom events:
  - `event_booked` captured after a successful booking in `BookEvent.tsx`.

To disable analytics locally, omit `NEXT_PUBLIC_POSTHOG_KEY`.

---

### Deployment
- Vercel is recommended for Next.js. Ensure the following environment variables are configured in your hosting provider:
  - `MONGODB_URI`
  - `NEXT_PUBLIC_BASE_URL` (e.g. your production URL, `https://your-domain.com`)
  - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
  - `CLOUDINARY_URL`
- Set `NEXT_PUBLIC_BASE_URL` to the fully qualified public URL of the deployment so server components can fetch `/api/...` correctly.

---

### Troubleshooting
- MongoDB connection errors: verify `MONGODB_URI` is set; the app will throw early if missing.
- Image upload fails: ensure `CLOUDINARY_URL` is present and valid; verify that `next.config.ts` allows `res.cloudinary.com`.
- 404 on event detail: confirm an event with that `slug` exists in the database.
- Booking fails: the unique index prevents duplicate bookings per event/email.
- PostHog not sending: confirm `NEXT_PUBLIC_POSTHOG_KEY` and that rewrites to `/ingest` are active (see `next.config.ts`).

---

### Contributing
PRs are welcome. Please:
- Keep TypeScript types sound and avoid `any`.
- Follow the existing file structure and coding style.
- Avoid committing `.env` or secrets.
