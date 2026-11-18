# SEO keyword map — Tamas Das portfolio

_Last updated: 18 Nov 2026. Source of truth for on-page copy lives in `src/lib/site.ts` (title, description, keywords) and `src/lib/projects.ts` (per-project `category`, `summary`, image `alt`)._

## How to read this

"Creative developer" on its own is a broad, browse-intent phrase with heavy competition. It works as your identity label, but rankings come from pairing it with **your name**, a **role**, a **location**, or a **specific stack**. So every keyword below is one of those combinations.

## 1. Branded (your name): top priority, most winnable

| Keyword | Where it's targeted |
|---|---|
| Tamas Das | `<title>`, `<h1>` (screen-reader text), About opening line, footer, JSON-LD `Person` |
| Tamas Das developer / web developer | `<title>`, meta description, Person `jobTitle` |
| Tamas Das portfolio | WebSite `alternateName`, OG `siteName` |
| Tamas Das Kolkata | hero location line, About, footer, Person `address` |
| Tamas Das full stack developer | title, description, Process accordion copy |
| Tamas Das GNIT / Guru Nanak Institute of Technology | Education block, Person `alumniOf` |

The connection that makes a name search show *all* your profiles together is **JSON-LD `sameAs`** (LinkedIn, GitHub, LeetCode, Instagram) plus `rel="me"` on the contact links. Keep that list in `site.ts` updated whenever you add a profile.

## 2. Role + location: winnable with on-page text + citations

- creative developer India / creative web developer Kolkata
- full-stack developer Kolkata
- freelance web developer Kolkata
- web designer and developer Kolkata
- Next.js developer Kolkata · React developer Kolkata

These need visible text on the page that says where you are, so a "Creative full-stack developer · Kolkata, India" line now sits in the hero, the About intro and the footer.

## 3. Hiring / service intent

- hire Next.js developer India
- freelance full-stack developer India
- technical SEO developer
- AI-native developer

Targeted through the meta keywords, the `Service` schema (`areaServed`: Kolkata, India, remote), and the "Who I work with" and "Let's connect" copy.

## 4. Long-tail: each project page ranks for its own niche

| Page | Primary phrase (in `<title>` via `category`) |
|---|---|
| /projects/the-stage-time | Event discovery & RSVP platform (PWA + Android) |
| /projects/happy-to-learn-autism | Autism therapy centre website (Next.js) |
| /projects/canvas-media | Digital agency platform (Next.js) |
| /projects/caretech-health-solutions | Home healthcare booking platform (Next.js) |
| /projects/nocap-papers | Exam papers web app (React) |
| /projects/wellness-brew | Tea discovery platform (Next.js) |

Each page also has its own meta description (`summary`), canonical URL, OG image, `CreativeWork` + `BreadcrumbList` schema, and descriptive alt text on every screenshot. Screenshots are listed in the image sitemap.

## 5. Not realistically winnable: "web developer near me"

Google answers this from the Map Pack, which comes from Google Business Profile listings. A remote freelancer without in-person client meetings isn't eligible for one (see Section 7 of `Tamas_Das_Search_Visibility_Strategy.md`). Route that demand through LinkedIn Services and directories instead.

## Things only you can do (off-site)

1. **Search Console:** resubmit `https://portfolio-tamas.vercel.app/sitemap.xml`, then use URL Inspection → *Request indexing* on the homepage and each `/projects/*` page.
2. **Bing Webmaster Tools:** *Import from Google Search Console*, then run `npm run indexnow` after each deploy.
3. **Custom domain:** `tamasdas.dev` doesn't currently resolve. When you buy a domain, set `NEXT_PUBLIC_SITE_URL` in Vercel and everything (canonical, sitemap, robots, OG, schema) follows it automatically.
4. **LinkedIn:** use the same headline wording ("Creative Full-Stack Developer · Kolkata, India") and turn on *Provide services*.
5. **Directories:** Wellfound, Contra, Clutch/GoodFirms, plus dev.to or Hashnode cross-posts. Each one is a citation and a backlink.
6. **Testimonials:** ask clients (Happy To Learn Autism, CareTech, The Stage Time) for LinkedIn recommendations.
