import posthog from "posthog-js"

// Automatically initializes PostHog in the Next.js app and captures pageviews
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2025-05-24",
  capture_exceptions: true, // Enable error tracking
  debug: process.env.NODE_ENV === "development",
});