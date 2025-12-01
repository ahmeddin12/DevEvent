// Centralized constants for events used across the app
// The `events` array can be imported directly into components like `EventsCard`.
// Image paths point to files under `public/images`.

export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string; // Human-readable date (kept as string for simple rendering)
  time: string; // Human-readable time window
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "JSConf EU 2026",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "May 23–24, 2026",
    time: "09:00 AM – 6:00 PM CEST",
  },
  {
    image: "/images/event2.png",
    title: "React Summit 2026",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "June 10–12, 2026",
    time: "09:30 AM – 5:30 PM CEST",
  },
  {
    image: "/images/event3.png",
    title: "KubeCon + CloudNativeCon Europe 2026",
    slug: "kubecon-cloudnativecon-eu-2026",
    location: "Vienna, Austria",
    date: "March 25–27, 2026",
    time: "09:00 AM – 6:00 PM CET",
  },
  {
    image: "/images/event4.png",
    title: "Next.js Conf 2026",
    slug: "nextjs-conf-2026",
    location: "San Francisco, USA (hybrid)",
    date: "October 21, 2026",
    time: "10:00 AM – 4:00 PM PDT",
  },
  {
    image: "/images/event5.png",
    title: "Google I/O 2026",
    slug: "google-io-2026",
    location: "Mountain View, USA (Shoreline Amphitheatre)",
    date: "May 12–14, 2026",
    time: "09:00 AM – 5:00 PM PDT",
  },
  {
    image: "/images/event6.png",
    title: "AWS re:Invent 2026",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, USA",
    date: "December 1–5, 2026",
    time: "09:00 AM – 6:00 PM PST",
  },
  {
    image: "/images/event-full.png",
    title: "Hack the North 2026",
    slug: "hack-the-north-2026",
    location: "Waterloo, Canada",
    date: "September 18–20, 2026",
    time: "48-hour hackathon",
  },
  {
    image: "/images/event3.png",
    title: "ETHGlobal New York 2026",
    slug: "ethglobal-new-york-2026",
    location: "New York City, USA",
    date: "August 7–9, 2026",
    time: "Hackathon weekend",
  },
];
