/* ─────────────────────────────────────────────────────────
   Project data — powers the home list, /projects/[slug]
   pages, the sitemap (incl. image sitemap) and JSON-LD.
   ───────────────────────────────────────────────────────── */

export interface ProjectImage {
    src: string;
    /** Descriptive alt text — shown to screen readers and indexed by Google Images. */
    alt: string;
}

export interface ProjectData {
    slug: string;
    title: string;
    /** Short label used in the <title> tag, e.g. "Event Booking Platform". */
    category: string;
    /** ≤ 160 chars — used as the meta description and in structured data. */
    summary: string;
    description: string;
    role: string;
    techStack: string[];
    thumbnail: string;
    images: ProjectImage[];
    year: string;
    lastModified: string; // ISO date string, e.g. "2025-06-01" — update whenever you edit this project
    liveUrl?: string;
    sourceCode?: string;
}

export const PLACEHOLDER_WORKS: ProjectData[] = [
    {
        slug: "the-stage-time",
        title: "The Stage Time",
        category: "Event Discovery & RSVP Platform (PWA + Android)",
        summary:
            "The Stage Time: an event discovery and RSVP platform for live shows, built end-to-end by Tamas Das with React, Supabase, Capacitor and Firebase.",
        lastModified: "2026-11-18",
        description:
            "The Stage Time is a full-scale event discovery and booking platform built for performing arts communities. It operates as both a Progressive Web App and a native Android application, delivering a seamless cross-platform experience.\n\nThe platform allows users to discover upcoming events, filter by categories, search by artist or venue, and explore detailed event pages with SEO-friendly URLs. It includes an intelligent similar-events recommendation system to increase engagement and session depth.\n\nA complete RSVP system was built with real-time updates, allowing users to confirm attendance, manage bookings, and receive automated event reminders. Push notifications were integrated using Firebase Cloud Messaging for reminders, updates, and promotional events, including deep linking directly into specific event screens.\n\nThe application includes an admin dashboard for managing events, uploading media, publishing/unpublishing listings, and controlling role-based access. Cloudflare Images is used for optimized global image delivery, improving performance and scalability.\n\nPerformance optimizations include caching strategies, efficient database querying, CDN-backed assets, and mobile-first responsive layouts. The product is production-ready and deployed with a custom domain and Android Play Store distribution.",
        role: "Founder & Lead Engineer — End-to-End Product Ownership\n\nThe Stage Time is the most comprehensive project I have built to date. I conceptualized, designed, architected, and executed the entire platform independently — from idea validation to production deployment.\n\nI designed the complete system architecture across frontend, backend, database, and mobile layers. I structured the Supabase database schema, implemented authentication flows, built the RSVP system, integrated real-time updates, and engineered deep linking between web and native Android environments.\n\nI handled multiple production-level integrations, including Firebase Cloud Messaging for push notifications, Cloudflare Images and CDN optimization, Google OAuth authentication, deep linking (custom scheme + HTTPS app links), Google Calendar integration, email workflows including welcome emails and transactional notifications, and SEO implementation including meta tags, Open Graph, structured data, sitemap generation, and robots configuration.\n\nBeyond development, I independently managed the entire Play Store deployment lifecycle — configuring build settings, generating signed release builds, conducting internal testing, closed testing, production rollout, and release management via Google Play Console.\n\nThis project represents my full-stack capability, product thinking, and ability to independently take a complex idea from zero to production.",
        techStack: ["React", "TypeScript", "Vite", "Supabase", "PostgreSQL", "Capacitor", "Firebase", "Cloudflare", "Tailwind CSS", "shadcn/ui"],
        thumbnail: "/projects/stagetime-thumb-v2.webp",
        images: [
            { src: "/projects/stagetime-home.webp", alt: "The Stage Time homepage with a featured live event carousel and city selector" },
            { src: "/projects/stagetime-top-events.webp", alt: "The Stage Time top events and popular events grid with RSVP buttons" },
            { src: "/projects/stagetime-browse.webp", alt: "The Stage Time browse by category and browse by city sections" },
            { src: "/projects/stagetime-all-events.webp", alt: "The Stage Time all events page with city, date and category filters" },
            { src: "/projects/stagetime-event-detail.webp", alt: "The Stage Time event detail page with date, venue, pricing and RSVP" },
            { src: "/projects/stagetime-about.webp", alt: "The Stage Time about page explaining the community event platform" },
        ],
        year: "2025",
        liveUrl: "https://thestagetime.com",
    },
    {
        slug: "happy-to-learn-autism",
        title: "Happy To Learn Autism",
        category: "Autism Therapy Centre Website (Next.js)",
        summary:
            "Happy To Learn Autism: an accessible, mobile-first Next.js website for a Kolkata autism therapy centre, with MDX blog and Resend email flows.",
        lastModified: "2026-11-18",
        description:
            "Happy To Learn Autism is a comprehensive, mobile-first web platform dedicated to providing specialized therapy services and resources for neurodivergent children and their families. Operating as a highly performant application, the platform offers detailed insights into core services like Behavior Modification (ABA), Special Education, Parental Training, and Occupational Therapy.\n\nThe platform is powered by a robust MDX-based content engine that seamlessly integrates educational blog posts and in-depth case studies with the core UI. This architecture enables dynamic routing and statically optimized pages, ensuring blazing-fast load times and exceptional search engine visibility.\n\nVisually, this is one of the most meticulously crafted interfaces I've built. The UI/UX was designed from the ground up with a strict mobile-first philosophy, keeping in mind the sensitivity and trust required for a therapy website. Utilizing a custom Tailwind CSS configuration and a comprehensive design token system, the layout ensures pixel-perfect consistency across all viewports. Careful attention was given to mobile usability, including precisely calibrated tap targets, optimized form inputs to prevent auto-zoom, and a responsive spacing rhythm that breathes on large screens and compacts elegantly on mobile.\n\nThe experience is elevated by a custom animation layer utilizing Framer Motion and intersection observers. Scroll-triggered reveals, animated statistics, and subtle micro-interactions create an interface that feels dynamic, warm, and inviting, while fully adhering to strict accessibility standards and reduced-motion preferences.",
        role: "Full-stack Developer & UI/UX Designer — Directed the entire technical and visual execution of the platform, bridging both frontend and backend functionality. Designed a highly accessible, premium landing page and user interface that strictly adheres to modern UX principles, ensuring an inviting and trustworthy digital presence for parents seeking therapy services.\n\nEngineered the full-stack architecture using Next.js 15, React 19, and TypeScript. Developed backend API routes for robust form handling and automated communications. Designed and implemented custom email templates using Resend, ensuring seamless transactional emails are delivered to users upon form submission, alongside real-time notifications to the 'Happy To Learn' administrative team. I also integrated Mailchimp to seamlessly manage audiences and newsletters.\n\nImplemented strict UI/UX best practices, ensuring contrast compliance (WCAG AA), semantic HTML structures, and flawless keyboard navigation. Constructed the layout with a responsive 8pt spacing system and fluid typography.\n\nKey Achievements:\nDesigned a visually stunning landing page tailored for high user trust · Developed full-stack API routes for form handling and data processing · Engineered custom transactional email workflows using Resend · Integrated Mailchimp for audience management · Architected a scalable MDX content engine for blogs and case studies · Enforced strict accessibility and mobile usability standards.",
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript 5",
            "Tailwind CSS 4",
            "Framer Motion",
            "MDX",
            "Resend",
            "Mailchimp",
            "Cloudflare Pages",
            "Lucide React"
        ],
        thumbnail: "/projects/htla-thumb.webp",
        images: [
            { src: "/projects/htla-img1.webp", alt: "Happy To Learn Autism homepage hero with appointment request form" },
            { src: "/projects/htla-img5.webp", alt: "Happy To Learn Autism experience stats and about section" },
            { src: "/projects/htla-services.webp", alt: "Happy To Learn Autism therapy services: ABA, special education, occupational therapy, parent training" },
            { src: "/projects/htla-testimonials.webp", alt: "Happy To Learn Autism parent reviews and testimonials section" },
            { src: "/projects/htla-aba.webp", alt: "Happy To Learn Autism ABA therapy service page" },
            { src: "/projects/htla-contact-form.webp", alt: "Happy To Learn Autism contact page with lead form and map" },
            { src: "/projects/htla-img4.webp", alt: "Happy To Learn Autism blog with articles for parents" },
        ],
        year: "2026 - Present",
        liveUrl: "https://www.happytolearnautism.com",
    },
    {
        slug: "canvas-media",
        title: "Canvas Media",
        category: "Digital Agency Platform (Next.js)",
        summary:
            "Canvas Media: a mobile-first Next.js agency platform for GST, MSME and marketplace services, with dynamic SEO landing pages — built by Tamas Das.",
        lastModified: "2026-07-09",
        description:
            "Canvas Media is a modern digital agency platform designed to deliver professional compliance and e-commerce services. The platform operates as a high-performance web application, providing seamless access to essential business services ranging from GST and MSME registrations to marketplace management for Amazon, Flipkart, Myntra, and Meesho.\n\nThe platform features a robust dynamic service page architecture that automatically generates highly targeted, SEO-optimized landing pages for every service category. Utilizing Next.js 15's App Router, the system handles dynamic metadata generation, canonical URLs, and automated sitemap updates. These technical SEO improvements have drastically increased search engine visibility for niche compliance and marketplace keywords, resulting in a high volume of organic clicks and search impressions.\n\nThe user interface was engineered with a strict mobile-first philosophy, utilizing a custom Tailwind CSS configuration and a comprehensive design token system. It maintains brand consistency through a curated color palette (Navy, Mint, Amber) and exact typographic scales combining Fraunces for display, Plus Jakarta Sans for body text, and JetBrains Mono for technical accents.\n\nAn advanced animation layer powered by Framer Motion and custom Intersection Observer hooks elevates the user experience. The platform features scroll-triggered reveals, animated statistic counters, staggered component entrances, and micro-interactions that feel responsive and alive, all while adhering to accessibility standards including reduced-motion preferences.",
        role: "Full-Stack Developer & Project Owner — Designed the complete system architecture from the ground up using Next.js 15. Developed a highly maintainable, component-driven codebase governed by strict mobile-first design rules, fluid typography, and type-safe TypeScript integrations.\n\nArchitected the dynamic routing engine that scales to handle an expanding catalog of specialized compliance, e-commerce, and marketing services. I ensured each service page is statically optimized for performance and deployed via a seamless CI/CD pipeline to Cloudflare Pages edge infrastructure.\n\nDesigned and implemented the core UI foundation, meticulously building accessible form components, interactive service catalogs, and pricing tiers. I engineered the animation architecture to ensure a premium feel without sacrificing Lighthouse performance scores.\n\nKey Achievements:\nExecuted comprehensive SEO improvements driving a significant surge in organic clicks and impressions · Engineered dynamic routing for diverse compliance and e-commerce services · Implemented a strict mobile-first design system with custom Tailwind tokens · Built custom scroll-aware animations and animated counters using Framer Motion · Automated SEO metadata and sitemap generation · Achieved zero-configuration edge deployment on Cloudflare Pages.",
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "Cloudflare Pages",
            "Lucide React",
            "ESLint",
        ],
        thumbnail: "/projects/canvasmedia-thumb.webp",
        images: [
            { src: "/projects/canvasmedia-img1.webp", alt: "Canvas Media agency website homepage built with Next.js" },
            { src: "/projects/canvasmedia-img2.webp", alt: "Canvas Media compliance and e-commerce services section" },
            { src: "/projects/canvasmedia-img3.webp", alt: "Canvas Media service landing page layout" },
        ],
        year: "2026 - Present",
        liveUrl: "https://canvasmedia.live/",
    },
    {
        slug: "caretech-health-solutions",
        title: "CareTech Health Solutions",
        category: "Home Healthcare Booking Platform (Next.js)",
        summary:
            "CareTech Health Solutions: a Next.js home-healthcare platform for Kolkata with service booking, equipment rental and local SEO — built by Tamas Das.",
        lastModified: "2026-05-01",
        description:
            "CareTech Health Solutions is a comprehensive full-stack healthcare services platform built for delivering professional medical care at home across Kolkata and South 24 Parganas. The platform operates as a modern Progressive Web App with SEO-optimized pages, dynamic routing, and real-time appointment booking capabilities.\n\nThe platform enables users to book and manage 8 distinct healthcare services — Nursing at Home, Transection Visit, Doctor Consultancy, Physiotherapy at Home, Lab Test at Home, Medical Equipment at Home, Consumables & Surgical Items, and Cancer Care at Home — each with dedicated pages, detailed information, and dynamic routing.\n\nA product catalog features 20+ medical equipment items available for rent or purchase, including respiratory equipment (CPAP/BiPAP, oxygen concentrators, nebulizers), mobility solutions (hospital beds, wheelchairs, walkers), and monitoring devices. A dual-mode toggle switches between rental and purchase views with contextual pricing and CTAs.\n\nThe booking system is powered by EmailJS integration with real-time form validation, automatic email delivery to care coordinators, error handling, service pre-selection from detail pages, and success confirmation with auto-reset. Physiotherapy pricing features three tiered packages (Silver, Gold, Platinum) with flexible day plans (7, 15, 30 days).\n\nSEO features include a dynamic XML sitemap, robots.txt, JSON-LD MedicalBusiness schema, Open Graph tags, and 4 additional high-value local search pages. Performance is delivered through intelligent caching headers, image optimization, and Babel React Compiler integration. Cloudflare Analytics and Speed Insights handle monitoring.\n\nThe UI includes a sticky scroll-aware navbar, mobile bottom bar, floating WhatsApp button, testimonial carousel, animated hero with quick service chips, and scroll-triggered Framer Motion animations throughout.",
        role: "Full-Stack Developer & Project Owner — Designed the complete system architecture from concept to production. Built all 11+ pages and dynamic routes using Next.js App Router, developed responsive layouts with Tailwind CSS (mobile-first), and created interactive components with real-time state management.\n\nImplemented EmailJS integration for appointment booking with comprehensive form validation, multi-step form flows with pre-filled service context, and automatic email delivery to business accounts.\n\nGenerated dynamic sitemaps, implemented robots.txt, added JSON-LD structured data for Local Business schema, and configured intelligent caching headers. Deployed on Cloudflare Pages with CI/CD pipeline, environment variable management, and Cloudflare Analytics integration.\n\nDesigned the cohesive color scheme (blue/teal gradient for healthcare trust), built the branded logo component, implemented the testimonial carousel, and created the 'Why Us' trust indicators section. Built the pricing package system with flexible duration/rate plans and the dual-mode product toggle (Rent vs. Buy).\n\nKey Achievements: 8 healthcare services fully documented and bookable · 20+ medical products with dual rent/buy functionality · EmailJS form integration · Dynamic pricing for physiotherapy (3 packages, 3 durations) · SEO-optimized for local healthcare keywords · Mobile-responsive with high Lighthouse scores · 24/7 contact accessibility through multiple channels · JSON-LD structured data for search engine visibility.",
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Framer Motion",
            "EmailJS",
            "Cloudflare Pages",
            "Lucide React",
            "ESLint",
        ],
        thumbnail: "/projects/caretech_thumb.webp",
        images: [
            { src: "/projects/caretech-img1.webp", alt: "CareTech Health Solutions homepage with home healthcare services" },
            { src: "/projects/caretech-img2.webp", alt: "CareTech Health Solutions services and booking layout" },
        ],
        year: "2026 - Present",
        liveUrl: "https://caretechhealthsolutions.com",
    },
    {
        slug: "nocap-papers",
        title: "NoCap Papers",
        category: "Exam Papers Web App (React)",
        summary:
            "NoCap Papers: a neo-brutalist React web app for browsing university exam papers, with a custom mobile PDF viewer and instant search — by Tamas Das.",
        lastModified: "2025-06-01",
        description:
            "NoCap Papers is a Gen-Z–focused academic web platform designed to help students discover and manage university exam papers through a bold neo-brutalist interface.\n\nThe application follows a structured academic hierarchy: University → Course → Stream → Semester → Subject → Paper. This layered navigation system ensures intuitive browsing across complex academic data structures.\n\nA custom-built PDF viewer enables zoom, pan, dark mode reading, bookmarking, and native sharing functionality. The viewer is optimized for mobile devices with gesture-based interactions and responsive rendering.\n\nGlobal search includes real-time filtering with debouncing, recent search history, and trending topics for faster discovery. Download management allows students to store and organize papers locally with metadata and sharing capabilities.\n\nThe entire interface follows a neo-brutalist design system: high-contrast colors, bold borders, sharp shadows, expressive typography, and Lucide iconography. Accessibility is handled using semantic HTML and Radix primitives.\n\nThe application is structured with clean context-based state management and modular component architecture, making it scalable for future backend integration.",
        role: "Frontend Architect & UI Engineer — Designed the complete design system, structured application state, built reusable components, implemented PDF rendering and interaction logic, handled responsive architecture, and optimized the app for mobile-first performance.",
        techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion", "React Router", "React Query"],
        thumbnail: "/projects/nocap-thumb.webp",
        images: [
            { src: "/projects/nocap-thumb.webp", alt: "NoCap Papers mobile view with neo-brutalist design" },
            { src: "/projects/nocap-img1.webp", alt: "NoCap Papers university and course browser" },
            { src: "/projects/nocap-img2.webp", alt: "NoCap Papers exam paper listing and search" },
        ],
        year: "2025",
        liveUrl: "https://nocappapers.com",
    },
    {
        slug: "wellness-brew",
        title: "WellnessBrew",
        category: "Tea Discovery Platform (Next.js)",
        summary:
            "WellnessBrew: a curated tea discovery platform with tea-type guides, brand profiles and buying guides, built with Next.js and Tailwind CSS by Tamas Das.",
        lastModified: "2026-11-18",
        description:
            "WellnessBrew is a curated tea discovery platform built for tea lovers to explore varieties, discover brands, learn how to brew and find their next favourite cup. It is designed as a calm, editorial, content-first experience rather than a cluttered store.\n\nThe catalogue is organised by tea type — green, black, white, oolong, matcha, herbal, chai, pu-erh, rooibos and fruit blends — with taste-based filters (floral, fresh, citrus, spiced, malty, earthy) so visitors can browse by type, taste or brand. Every tea type has its own page with origin notes, brewing temperature, steep time and a filterable collection.\n\nA brand directory profiles independent tea makers, while the Launchpad highlights new launches and first-flush releases. Best Picks guides compare teas in at-a-glance tables with transparent affiliate disclosures, and the Journal publishes beginner-friendly brewing guides and tasting notes.\n\nThe UI is built from reusable building blocks such as tea cards, brand cards, filter chips, comparison tables and a sticky category bar, on a warm, nature-inspired design system of cream, forest green and gold that pairs a serif display face with clean sans-serif body text.\n\nEvery page is statically generated with Next.js and served from Cloudflare's edge network, with clean URLs, descriptive metadata and a mobile-first layout for fast, SEO-friendly delivery.",
        role: "Frontend Developer & UI Designer — Designed the visual system, structured the content architecture across tea types, brands, guides and the journal, built reusable Next.js components styled with Tailwind CSS, implemented taste and category filtering, and shipped a statically generated, mobile-first site on Cloudflare Pages.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Radix UI", "Lucide React", "Cloudflare Pages"],
        thumbnail: "/projects/wellnessbrew-thumb.webp",
        images: [
            { src: "/projects/wellnessbrew-home.webp", alt: "WellnessBrew homepage hero — Find Your Perfect Cup" },
            { src: "/projects/wellnessbrew-tea-types.webp", alt: "WellnessBrew tea type catalogue: green, black, white, oolong, matcha, herbal and more" },
            { src: "/projects/wellnessbrew-launches.webp", alt: "WellnessBrew Launchpad section with featured new tea launches" },
            { src: "/projects/wellnessbrew-matcha.webp", alt: "WellnessBrew matcha guide page with brewing temperature and steep time" },
        ],
        year: "2026",
        liveUrl: "https://wellnessbrew.pages.dev/",
    },
];
