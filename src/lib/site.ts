/* ─────────────────────────────────────────────────────────
   Single source of truth for SEO / identity data.

   When you move to a custom domain, set NEXT_PUBLIC_SITE_URL
   in Vercel (e.g. https://tamasdas.dev) — canonical URLs,
   sitemap, robots.txt, Open Graph and JSON-LD all follow it.
   ───────────────────────────────────────────────────────── */

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-tamas.vercel.app"
).replace(/\/$/, "");

export const PERSON = {
    name: "Tamas Das",
    shortName: "Tamas",
    jobTitle: "Creative Full-Stack Developer",
    email: "das.tamas13@gmail.com",
    image: "/projects/me.webp",
    city: "Kolkata",
    region: "West Bengal",
    country: "IN",
    countryName: "India",
    alumniOf: "Guru Nanak Institute of Technology",
    sameAs: [
        "https://www.linkedin.com/in/tamas-das-12a6a6288",
        "https://github.com/tamasdas01",
        "https://leetcode.com/u/zdUq8EGvSA",
        "https://www.instagram.com/_tammy_anonymous_",
    ],
    knowsAbout: [
        "Creative Development",
        "Full-Stack Web Development",
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "Supabase",
        "Firebase",
        "Flutter",
        "Capacitor",
        "Framer Motion",
        "GSAP",
        "Three.js",
        "Technical SEO",
        "Progressive Web Apps",
        "AI-assisted Software Engineering",
    ],
} as const;

export const SEO = {
    // ≤ 60 chars — role + location up front, brand kept.
    title: "Tamas Das — Creative Full-Stack Developer in Kolkata, India",
    // ≤ 160 chars
    description:
        "Tamas Das is a creative full-stack developer in Kolkata, India, building fast Next.js, React & Node.js web apps end-to-end. Open to freelance work & SDE roles.",
    keywords: [
        "Tamas Das",
        "Tamas Das developer",
        "Tamas Das portfolio",
        "Tamas Das Kolkata",
        "creative developer",
        "creative developer India",
        "creative web developer Kolkata",
        "full-stack developer Kolkata",
        "freelance web developer Kolkata",
        "web designer and developer Kolkata",
        "Next.js developer Kolkata",
        "React developer Kolkata",
        "hire Next.js developer India",
        "freelance full-stack developer India",
        "technical SEO developer",
        "AI-native developer",
    ],
} as const;

export const absoluteUrl = (path = "/") =>
    `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
