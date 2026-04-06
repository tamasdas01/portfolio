/* ─────────────────────────────────────────────────────────
   Placeholder data – replace with your real projects later
   ───────────────────────────────────────────────────────── */

export interface ProjectData {
    slug: string;
    title: string;
    description: string;
    role: string;
    techStack: string[];
    thumbnail: string;
    images: string[];
    year: string;
    liveUrl?: string;
    sourceCode?: string;
}

export const PLACEHOLDER_WORKS: ProjectData[] = [
    {
        slug: "the-stage-time",
        title: "The Stage Time",
        description:
            "The Stage Time is a full-scale event discovery and booking platform built for performing arts communities. It operates as both a Progressive Web App and a native Android application, delivering a seamless cross-platform experience.\n\nThe platform allows users to discover upcoming events, filter by categories, search by artist or venue, and explore detailed event pages with SEO-friendly URLs. It includes an intelligent similar-events recommendation system to increase engagement and session depth.\n\nA complete RSVP system was built with real-time updates, allowing users to confirm attendance, manage bookings, and receive automated event reminders. Push notifications were integrated using Firebase Cloud Messaging for reminders, updates, and promotional events, including deep linking directly into specific event screens.\n\nThe application includes an admin dashboard for managing events, uploading media, publishing/unpublishing listings, and controlling role-based access. Cloudflare Images is used for optimized global image delivery, improving performance and scalability.\n\nPerformance optimizations include caching strategies, efficient database querying, CDN-backed assets, and mobile-first responsive layouts. The product is production-ready and deployed with a custom domain and Android Play Store distribution.",
        role: "Founder & Lead Engineer — End-to-End Product Ownership\n\nThe Stage Time is the most comprehensive project I have built to date. I conceptualized, designed, architected, and executed the entire platform independently — from idea validation to production deployment.\n\nI designed the complete system architecture across frontend, backend, database, and mobile layers. I structured the Supabase database schema, implemented authentication flows, built the RSVP system, integrated real-time updates, and engineered deep linking between web and native Android environments.\n\nI handled multiple production-level integrations, including Firebase Cloud Messaging for push notifications, Cloudflare Images and CDN optimization, Google OAuth authentication, deep linking (custom scheme + HTTPS app links), Google Calendar integration, email workflows including welcome emails and transactional notifications, and SEO implementation including meta tags, Open Graph, structured data, sitemap generation, and robots configuration.\n\nBeyond development, I independently managed the entire Play Store deployment lifecycle — configuring build settings, generating signed release builds, conducting internal testing, closed testing, production rollout, and release management via Google Play Console.\n\nThis project represents my full-stack capability, product thinking, and ability to independently take a complex idea from zero to production.",
        techStack: ["React", "TypeScript", "Vite", "Supabase", "PostgreSQL", "Capacitor", "Firebase", "Cloudflare", "Tailwind CSS", "shadcn/ui"],
        thumbnail: "/projects/stagetime-thumb.webp",
        images: [
            "/projects/stagetime-img1.webp",
            "/projects/stagetime-img2.webp",
        ],
        year: "2025",
        liveUrl: "https://thestagetime.com",
    },
    {
        slug: "nocap-papers",
        title: "NoCap Papers",
        description:
            "NoCap Papers is a Gen-Z–focused academic web platform designed to help students discover and manage university exam papers through a bold neo-brutalist interface.\n\nThe application follows a structured academic hierarchy: University → Course → Stream → Semester → Subject → Paper. This layered navigation system ensures intuitive browsing across complex academic data structures.\n\nA custom-built PDF viewer enables zoom, pan, dark mode reading, bookmarking, and native sharing functionality. The viewer is optimized for mobile devices with gesture-based interactions and responsive rendering.\n\nGlobal search includes real-time filtering with debouncing, recent search history, and trending topics for faster discovery. Download management allows students to store and organize papers locally with metadata and sharing capabilities.\n\nThe entire interface follows a neo-brutalist design system: high-contrast colors, bold borders, sharp shadows, expressive typography, and Lucide iconography. Accessibility is handled using semantic HTML and Radix primitives.\n\nThe application is structured with clean context-based state management and modular component architecture, making it scalable for future backend integration.",
        role: "Frontend Architect & UI Engineer — Designed the complete design system, structured application state, built reusable components, implemented PDF rendering and interaction logic, handled responsive architecture, and optimized the app for mobile-first performance.",
        techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion", "React Router", "React Query"],
        thumbnail: "/projects/nocap-thumb.webp",
        images: [
            "/projects/nocap-thumb.webp",
            "/projects/nocap-img1.webp",
            "/projects/nocap-img2.webp",
        ],
        year: "2025",
        liveUrl: "https://nocappapers.com",
    },
    {
        slug: "rasmaya",
        title: "Rasmaya",
        description:
            "Rasmaya is a modern cloud kitchen frontend application built to deliver a premium food ordering experience through refined UI and smooth interaction design.\n\nThe application features a dynamic menu system with category filtering, veg-only toggles, spice-level indicators, and price-based filtering. All updates are handled client-side with real-time responsiveness.\n\nA scalable cart system was implemented using Zustand for predictable and lightweight state management. Users can add items, update quantities, remove products, and view live cart summaries through a slide-in cart drawer interface.\n\nThe UI emphasizes clean component architecture with reusable building blocks such as MenuCard, Navigation, Button variants, and CartDrawer. Framer Motion powers subtle micro-interactions including hover states, transitions, and interaction feedback.\n\nThe system is structured using design tokens for spacing, typography, and visual consistency, ensuring scalability and maintainability across future expansions.",
        role: "Frontend Developer — Architected the component system, implemented cart state logic, built interactive filtering systems, integrated animation flows, and structured a scalable, maintainable frontend architecture.",
        techStack: ["React", "TypeScript", "Vite", "Zustand", "Framer Motion", "React Router", "CSS Design Tokens"],
        thumbnail: "/projects/rasmaya-thumb1.webp",
        images: [
            "/projects/rasmaya-thumb.webp",
            "/projects/rasmaya-img1.webp",
            "/projects/rasmaya-img2.webp",
        ],
        year: "2024",
        liveUrl: "https://rasmaya1-xfdif.kinsta.page/",
    },
    {
        slug: "caretech-health-solutions",
        title: "CareTech Healthcare Website",
        description:
            "CareTech Health Solutions is a comprehensive full-stack healthcare services platform built for delivering professional medical care at home across Kolkata and South 24 Parganas. The platform operates as a modern Progressive Web App with SEO-optimized pages, dynamic routing, and real-time appointment booking capabilities.\n\nThe platform enables users to book and manage 8 distinct healthcare services — Nursing at Home, Transection Visit, Doctor Consultancy, Physiotherapy at Home, Lab Test at Home, Medical Equipment at Home, Consumables & Surgical Items, and Cancer Care at Home — each with dedicated pages, detailed information, and dynamic routing.\n\nA product catalog features 20+ medical equipment items available for rent or purchase, including respiratory equipment (CPAP/BiPAP, oxygen concentrators, nebulizers), mobility solutions (hospital beds, wheelchairs, walkers), and monitoring devices. A dual-mode toggle switches between rental and purchase views with contextual pricing and CTAs.\n\nThe booking system is powered by EmailJS integration with real-time form validation, automatic email delivery to care coordinators, error handling, service pre-selection from detail pages, and success confirmation with auto-reset. Physiotherapy pricing features three tiered packages (Silver, Gold, Platinum) with flexible day plans (7, 15, 30 days).\n\nSEO features include a dynamic XML sitemap, robots.txt, JSON-LD MedicalBusiness schema, Open Graph tags, and 4 additional high-value local search pages. Performance is delivered through intelligent caching headers, image optimization, and Babel React Compiler integration. Vercel Analytics and Speed Insights handle monitoring.\n\nThe UI includes a sticky scroll-aware navbar, mobile bottom bar, floating WhatsApp button, testimonial carousel, animated hero with quick service chips, and scroll-triggered Framer Motion animations throughout.",
        role: "Full-Stack Developer & Project Owner — Designed the complete system architecture from concept to production. Built all 11+ pages and dynamic routes using Next.js App Router, developed responsive layouts with Tailwind CSS (mobile-first), and created interactive components with real-time state management.\n\nImplemented EmailJS integration for appointment booking with comprehensive form validation, multi-step form flows with pre-filled service context, and automatic email delivery to business accounts.\n\nGenerated dynamic sitemaps, implemented robots.txt, added JSON-LD structured data for Local Business schema, and configured intelligent caching headers. Deployed on Vercel with CI/CD pipeline, environment variable management, and Vercel Analytics integration.\n\nDesigned the cohesive color scheme (blue/teal gradient for healthcare trust), built the branded logo component, implemented the testimonial carousel, and created the 'Why Us' trust indicators section. Built the pricing package system with flexible duration/rate plans and the dual-mode product toggle (Rent vs. Buy).\n\nKey Achievements: 8 healthcare services fully documented and bookable · 20+ medical products with dual rent/buy functionality · EmailJS form integration · Dynamic pricing for physiotherapy (3 packages, 3 durations) · SEO-optimized for local healthcare keywords · Mobile-responsive with high Lighthouse scores · 24/7 contact accessibility through multiple channels · JSON-LD structured data for search engine visibility.",
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "EmailJS",
            "Vercel Analytics",
            "Lucide React",
            "ESLint",
        ],
        thumbnail: "/projects/caretech_thumb.webp",
        images: [
            "/projects/caretech-img1.webp",
            "/projects/caretech-img2.webp",
        ],
        year: "2026 - Present",
        liveUrl: "https://caretechhealthsolutions.com",
    },
];
