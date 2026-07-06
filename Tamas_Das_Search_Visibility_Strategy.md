# TAMAS DAS — SEARCH VISIBILITY STRATEGY
### Getting found for "developer near me," "web designer near me," and branded searches
> Built from your Master Brand Briefing + a live audit of portfolio-tamas.vercel.app (July 2026)

---

## 0. The Honest Reality Check (read this first)

Before the tactics — a straight answer to the core question, because getting this wrong will waste your time.

**"Tamas Das developer" (branded search)** — You're already winning this. You show up #2 on Google, and Bing/Copilot Search is actually generating a solid AI summary of you. This is the easiest search to dominate completely, and Section 3–4 below will lock it down further.

**"Best web developer near me" / "best developer around me" (unbranded, "near me" search)** — This is a fundamentally different, much harder problem. Here's why:

- Google treats almost all "near me" and "best X around me" queries as **local intent**, and answers them primarily with the **Map Pack** (the 3 pins + reviews block at the top), not the organic blue links.
- The Map Pack is powered almost entirely by **Google Business Profile (GBP)** — reviews, category, proximity, and profile completeness.
- As a **remote freelance developer with no in-person client meetings**, you don't currently qualify for a legitimate GBP for your dev work (details in Section 5 — this matters, because the workaround-blogs telling freelancers to "just hide your address" are describing a policy meant for plumbers and mobile groomers who physically go to a customer's location, not someone who does everything over Zoom and Slack).
- So: you will **not** out-rank local agencies with GBP listings in the literal Map Pack for "web developer near me" — and trying to fake eligibility risks suspension and directly contradicts the truthfulness guardrails in your own brand doc (Section 17 of your briefing).

**What you *can* realistically win:**
- The organic results *beside/below* the map pack for "near me"-adjacent searches, through content, citations, and backlinks (Section 8–9).
- Fully-qualified searches with real commercial intent: *"freelance full-stack developer Kolkata," "hire Next.js developer Kolkata," "React developer for startup India"* — these behave like normal organic queries, not map-pack queries, and are winnable.
- **LinkedIn's Services Marketplace**, which is the modern, legitimate equivalent of a "near me" listing for solo service providers (Section 6) — this is probably your highest-leverage move and most guides miss it entirely.
- Every profile you own (LinkedIn, GitHub, portfolio) showing up together as a **"digital business card" cluster** whenever anyone searches your name or a close variant — this is what actually gets you inbound work, more than literal near-me ranking does for freelancers.

Keep this distinction in mind as you read the rest: **branded + qualified-intent search = winnable now. Raw "near me" Map Pack = not winnable without in-person GBP eligibility, so we route around it.**

---

## 1. Priority Checklist (do these in order)

**This week**
- [ ] Submit portfolio to Bing Webmaster Tools + import from Google Search Console (Section 2)
- [ ] Request indexing for every unindexed page individually via GSC URL Inspection (Section 2)
- [ ] Rewrite homepage `<title>` and meta description to include "Kolkata" + "Full-Stack Developer" (Section 3)
- [ ] Add one sentence to your homepage stating your location and service area explicitly (Section 3)
- [ ] Add Person + WebSite JSON-LD structured data to the portfolio (Section 4)
- [ ] Optimize your LinkedIn headline + About section with the same keyword set (Section 6)
- [ ] Turn on LinkedIn's "Provide services" / Services tab (Section 6)

**This month**
- [ ] Buy a custom domain and migrate off the `.vercel.app` subdomain (Section 5)
- [ ] Add `sitemap.ts` and `robots.ts` if not already present, and verify they're correct (Section 5)
- [ ] Set up IndexNow so new/updated pages get crawled within hours, not weeks (Section 2)
- [ ] Get listed on 4–6 relevant freelance/developer directories (Section 8)
- [ ] Publish your first LinkedIn Article (not a regular post) targeting a specific technical topic (Section 6)

**Ongoing**
- [ ] Publish one build-log/technical post a month on the portfolio (Section 9)
- [ ] Ask every freelance client for a written testimonial you can publish (with permission) — this is your substitute for GBP reviews (Section 8)
- [ ] Recheck Google Search Console + Bing Webmaster Tools performance reports monthly (Section 10)

---

## 2. Fix Indexing First (Google + Bing)

Your Google indexing is stuck because a new site simply takes time to get crawled beyond the homepage, and it's a strong signal that your internal linking + sitemap need to be handed to Google/Bing directly rather than waited on.

### Google Search Console
1. Go to **URL Inspection**, paste in each unindexed page (e.g. every `/projects/...` page), and click **Request Indexing**. Do this for every project page and the About/Process sections if they're separate routes.
2. Before requesting, click **Test Live URL** first — if it fails, there's a technical block (noindex tag, robots.txt rule, or a redirect issue) that needs fixing before resubmitting, or Google will just reject it again.
3. GSC caps you at roughly 10–12 manual requests per property per day, so if you have more than that, spread it over 2–3 days.
4. Check the **Page Indexing report** → "Why pages aren't indexed" table. If pages show "Discovered – currently not indexed," that usually means weak internal linking, not a quality problem — make sure every project page is linked from the homepage (yours already are, via "View Details," which is good).
5. Note: Search Console's Page Indexing report itself has had reporting lag issues in 2026 — if the dashboard numbers look stale, trust the URL Inspection tool's live result over the aggregate chart.

### Bing Webmaster Tools (this is why you're invisible on Bing)
You likely never submitted anything to Bing — it doesn't discover new sites automatically the way Google does from links alone.
1. Go to bing.com/webmasters → **Import from Google Search Console** (fastest path — pulls your verified site and sitemap in one step).
2. Confirm your sitemap is listed under **Sitemaps** and shows a non-zero URL count.
3. Use **Submit URLs** to manually push your key project pages (Bing allows a generous daily quota here, more forgiving than Google's).
4. Set up **IndexNow** (a free protocol Bing and Yandex both support): every time you deploy an update, you ping an API with the changed URLs and Bing typically crawls within 24 hours instead of waiting for its next scheduled crawl.

**Why Bing matters more than it looks like it should in 2026:** ChatGPT Search and several other AI answer engines retrieve their web results through Bing's index. A page Bing hasn't indexed can't be cited in an AI Overview or a ChatGPT answer either — so fixing Bing is also "AI search SEO" for someone building an AI-native personal brand.

---

## 3. Rewrite Your Portfolio's On-Page SEO

I fetched your live homepage. Here's the core problem: **there is no location signal anywhere on the page.** No "Kolkata," no "India," nothing that tells Google *where* to show you for geo-modified searches. Your title and meta description are also purely brand-voice ("Creative Developer," "clarity, intention, zero fluff") with zero keyword coverage — great for humans who already know your name, invisible for people searching by skill + location.

**Current:**
- Title: `Tamas Das | Creative Developer`
- Meta description: `I craft digital experiences with clarity, intention, and zero fluff.`

**Recommended:**
- Title: `Tamas Das | Full-Stack Developer in Kolkata, India`
- Meta description: `Freelance full-stack developer based in Kolkata, India. I build production web apps end-to-end with Next.js, React, and Node — AI-native, system-first, zero fluff.`

This keeps your voice (the tagline can live inside the page copy, it doesn't have to be the meta description) while giving search engines the two things they need most for these queries: **role + location.**

**On the page itself, add one explicit line** near the top (in "The Man" section or the hero), something like:
> *Based in Kolkata, India · Available for freelance work (remote or local) and full-time SDE roles from 2026.*

This single sentence does more for "near me"-adjacent and city-modified searches than almost anything else on this list, because it gives Google actual text to match against location queries — right now there's nothing to match.

**Per-project pages:** Give each `/projects/[slug]` page its own unique `<title>` and meta description (don't let Next.js fall back to a generic template). Example for CareTech:
- Title: `CareTech Health Solutions — Healthcare Platform Built by Tamas Das`
- Description: `A production healthcare services platform for a Kolkata-area client: Next.js, technical SEO, and appointment booking — built end-to-end.`

**Alt text:** Your images currently use generic alt text ("Portrait," "Teaching & Mentoring"). Make these descriptive and keyword-carrying where genuinely accurate, e.g. `alt="Tamas Das, full-stack developer based in Kolkata"` on your headshot.

---

## 4. Structured Data (JSON-LD) — Add This to Your `<head>`

This is what turns "a website about a guy named Tamas" into "a verified entity Google can connect to your LinkedIn, GitHub, and other profiles." It's also the foundation for eventually earning a Knowledge Panel on your name.

Add this to your root layout (`app/layout.tsx`) so it's present on every page:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://portfolio-tamas.vercel.app/#person",
  "name": "Tamas Das",
  "url": "https://portfolio-tamas.vercel.app/",
  "image": "https://portfolio-tamas.vercel.app/projects/me.webp",
  "jobTitle": "Full-Stack Developer",
  "description": "Full-stack developer based in Kolkata, India. AI-native, system-first — I build production web products end-to-end.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kolkata",
    "addressRegion": "West Bengal",
    "addressCountry": "IN"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Guru Nanak Institute of Technology"
  },
  "knowsAbout": [
    "Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS",
    "Flutter", "Technical SEO", "AI-assisted software engineering"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/tamas-das-12a6a6288",
    "https://github.com/tamasdas01",
    "https://leetcode.com/u/zdUq8EGvSA",
    "https://www.instagram.com/_tammy_anonymous_"
  ]
}
```

A few deliberate choices here, worth knowing:
- **No `telephone` field** — your brand doc flags your phone number as share-selectively-only, so it's left out of anything public and machine-readable on purpose.
- **No street address, only city/region** — you're not claiming a visitable business location, so the schema shouldn't imply one either. This stays honest and avoids any conflict with GBP-style claims.
- **`sameAs` is doing the heavy lifting** — it's the property Google uses most to confirm "the person behind this website is the same person behind this LinkedIn/GitHub." Keep it updated as you add profiles.

Also add a `WebSite` schema so search engines understand the site as a distinct entity:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://portfolio-tamas.vercel.app/",
  "name": "Tamas Das | Full-Stack Developer",
  "author": { "@id": "https://portfolio-tamas.vercel.app/#person" }
}
```

**Optional but useful — a `Service` block**, since it signals what you offer and where, without claiming a physical business (this is the schema-level equivalent of what a GBP would show, minus the map pin you're not eligible for):

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Full-Stack Web & Product Development",
  "provider": { "@id": "https://portfolio-tamas.vercel.app/#person" },
  "areaServed": ["Kolkata", "India", "Remote / Worldwide"],
  "description": "End-to-end web product development: architecture, frontend, backend, deployment, and technical SEO."
}
```

After adding any of this, validate with **Google's Rich Results Test** (search.google.com/test/rich-results) and **schema.org's validator** — a single misplaced comma breaks the whole block silently.

---

## 5. Technical Foundation

**Get a custom domain.** `portfolio-tamas.vercel.app` works, but a subdomain on someone else's platform reads as unfinished to both humans and, weakly, to ranking systems — a personal `.dev`, `.in`, or `.com` (e.g. `tamasdas.dev`) is cheap, easy to point at Vercel with no code changes, and instantly more credible on a resume, LinkedIn, or business card. Do this before you invest heavily in backlinks — links pointing at a domain you might migrate away from later are wasted effort.

**Confirm `sitemap.xml` and `robots.txt` exist and are correct.** If you're on the Next.js App Router (which you are, per your brand doc — Next.js 16), the clean way to do this is:

`app/sitemap.ts`
```ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://portfolio-tamas.vercel.app'
  const projects = [
    'the-stage-time',
    'nocap-papers',
    'rasmaya',
    'caretech-health-solutions',
  ]
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...projects.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
```

`app/robots.ts`
```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://portfolio-tamas.vercel.app/sitemap.xml',
  }
}
```

Once live, resubmit the sitemap URL in both Search Console and Bing Webmaster Tools — this is what tells both engines every project page exists in one shot, instead of relying on them to discover links one by one.

---

## 6. LinkedIn — Your Highest-Leverage Asset for "Near Me"-Style Discovery

This deserves its own section because LinkedIn now functions as a legitimate substitute for a local business listing for solo service providers, and it's the one place in this whole plan where you *can* directly compete for near-me-style discovery without needing GBP eligibility.

**Headline** — this is the single most heavily-weighted field for both LinkedIn's internal search and how your profile is titled in Google. Use one of the versions from your brand doc, but make sure it front-loads role + a location or market cue in the first ~45 characters, since that's what surfaces first on both platforms:
> `Full-Stack Developer · Kolkata, India · AI-Native Engineering — I build products zero → production`

**About section** — put your primary keywords (full-stack developer, Next.js, React, Node, Kolkata, freelance) naturally in the first 2–3 lines, since that's the indexable, scannable portion before "see more" truncates it.

**Turn on "Provide services"** (LinkedIn's Services tab/Marketplace) — this is the feature most freelancers never enable. It plugs your profile directly into LinkedIn's Services Marketplace search, which people use exactly like a "find a local/remote developer" search. List specific services ("Full-Stack Web Development," "Next.js Development," "Technical SEO") rather than a generic "Software Development" category — exact-match service names rank better inside the marketplace than broad ones.

**Publish LinkedIn Articles, not just posts.** This is a distinction most people miss: regular LinkedIn status posts are *not* indexed by Google in most cases, but native **Articles** (LinkedIn's long-form format) are — typically within 24–48 hours of publishing. Every technical article you write ("How I built X," "Where I let Claude drive vs. where I override it") is a separate URL that can rank on Google for its own topic, in addition to reinforcing your LinkedIn profile's relevance.

**Custom URL** — make sure your public profile URL is the clean `linkedin.com/in/tamas-das...` form (already the case) rather than a default numeric one — this affects how the URL displays in Google results.

---

## 7. Google Business Profile — The Honest Answer

You asked directly whether you need one, so here's the straight version instead of the generic "yes, freelancers should totally do this" advice you'll find everywhere.

**Google's actual eligibility rule:** a Business Profile requires either a physical location customers visit, *or* a business that physically travels to meet customers where they are. Service-area businesses (plumbers, mobile groomers, in-home tutors) qualify under the second path because there's genuine in-person contact at some point.

**Where a purely remote freelance developer falls:** if all of your work with clients happens over calls, email, and Slack — no in-person meetings — you don't genuinely meet either condition. Some SEO blogs will tell you to register anyway and "just hide your address," but that's describing the mechanism for a legitimately eligible service-area business, not creating eligibility for one that isn't. Doing it anyway risks suspension, and more importantly, it sits directly against the truthfulness guardrails you've already written into your own brand doc.

**The interesting wrinkle:** you're *already* listed on UrbanPro for home tutoring in Dum Dum, Kolkata — and that work genuinely involves in-person contact. That would make a GBP for **tutoring specifically** legitimately eligible if you ever wanted one. But it would need to be its own listing under the tutoring service, not merged with your developer/freelance-tech brand — mixing the two would misrepresent both.

**What to do instead for your dev work:**
1. Treat LinkedIn's Services Marketplace (Section 6) as your actual "near me" listing — it's built for exactly this and doesn't require in-person eligibility.
2. Get listed on freelance/developer directories that show up in searches like "hire developer Kolkata" (Section 8) — these function as citations even without a map pin.
3. If you genuinely start offering in-person consultations to local Kolkata businesses or founders (even occasional ones — an initial in-person meeting, a workshop, whatever's real), that would make you legitimately eligible for a service-area GBP down the line. Don't manufacture this — just know the door is open if your business model naturally moves that direction.

---

## 8. Off-Page: Directories, Citations, and Backlinks

Since a map pin isn't available to you, backlinks and directory citations become your main lever for anything resembling local/near-me visibility, and they double as straightforward authority signals for regular organic ranking.

**Developer/freelance directories worth claiming** (each is a citation + potential backlink):
- Clutch, GoodFirms, DesignRush — B2B service directories that show up for "hire [skill] developer" searches
- Wellfound (AngelList Talent) and Contra — freelance/startup-facing profiles
- dev.to and Hashnode — technical writing platforms that double as backlinks when you cross-post build logs
- Product Hunt — worth a "maker" profile if you ever launch one of your projects publicly

**India/Kolkata-specific:**
- You already appear on UrbanPro for tutoring — keep that profile accurate and active, it's already a working citation.
- JustDial and Sulekha are the Indian-market equivalents of Yelp for local service discovery and are worth a profile even without a storefront, since many list freelancers/consultants.

**Reviews/testimonials as your GBP-review substitute:** ask every freelance client (Happy to Learn Autism, CareTech, The Stage Time, NoCap Papers) for a short written testimonial you can publish on your portfolio and LinkedIn recommendations. This is the single best trust signal available to you without GBP, and LinkedIn recommendations specifically are both public and indexable.

**NAP consistency check:** even without a physical address, keep your **name, positioning, and location** worded identically everywhere — portfolio, LinkedIn, GitHub bio, Instagram, every directory. Right now your portfolio says nothing about Kolkata while your brand doc and other profiles do; fixing Section 3 also fixes this consistency gap.

---

## 9. Content Strategy for Discoverability

Your brand doc already has strong content pillars (Section 10 of your briefing) — the only addition needed here is aiming some of that content specifically at the query gap.

Write a small number of posts/pages (on your portfolio's blog, or as LinkedIn Articles) that naturally combine skill + location + intent, e.g.:
- "What it actually costs to hire a freelance full-stack developer in India" (naturally pulls in commercial-intent searches)
- "Technical SEO for small business sites: the JSON-LD + edge-delivery setup that got CareTech indexed" (you already have this exact idea in your content pillars — ship it)
- "Zero to production, solo: architecting [project] from scratch" (build-in-public, reinforces entity + expertise signals)

Each one is a new indexable URL, a chance to internally link back to your services/contact section, and — per your AI-native positioning — the kind of specific, well-structured content that AI answer engines (which increasingly pull from Bing's index, see Section 2) prefer to cite over vague marketing copy.

---

## 10. Measuring Progress

- **Google Search Console → Performance report**: check monthly for which queries are already generating impressions (even ones you haven't optimized for yet) — this tells you what Google *already* associates you with, which is often more informative than guessing.
- **Bing Webmaster Tools → Search Performance**: same idea, and cross-reference against ChatGPT/AI-search mentions if you can find them, since that traffic increasingly routes through Bing's index.
- **`site:portfolio-tamas.vercel.app` (or your new domain)** in both Google and Bing: a quick manual gut-check on how many pages are actually indexed.
- Track your own name + variants monthly ("Tamas Das developer," "Tamas Das Kolkata," "Tamas Das full stack") to watch the entity/knowledge-panel signals strengthen as Sections 4 and 6 take effect.

---

## 11. Sample Query Map (what wins each one)

| Query type | Example | What actually moves this |
|---|---|---|
| Branded | "Tamas Das developer" | Already winning — reinforce with Section 4 schema |
| Branded + skill | "Tamas Das full stack developer" | LinkedIn headline + portfolio title alignment (Sections 3, 6) |
| Skill + city, commercial | "hire full-stack developer Kolkata" | On-page location text + directories + backlinks (Sections 3, 8) |
| Skill + city, technical | "Next.js developer Kolkata" | Content pillar posts naming the stack + city (Section 9) |
| Generic "near me" / Map Pack | "best web developer near me" | Not winnable without in-person GBP eligibility — routed to LinkedIn Services instead (Sections 6–7) |
| Service marketplace intent | "freelance React developer for hire" | LinkedIn Services tab + Wellfound/Contra profiles (Sections 6, 8) |

---

## 12. Guardrails (carried over from your Brand Briefing)

- No fake or gamed Google Business Profile — Section 7 explains why you don't qualify as-is, and manufacturing eligibility isn't worth the suspension risk or the conflict with your own truthfulness rules.
- No fake reviews or incentivized testimonials — only ask real clients for honest ones.
- No keyword-stuffing the homepage copy — the location sentence in Section 3 is one clean sentence, not a wall of city names.
- Keep your phone number out of any public/machine-readable schema, per your own brand doc.

---

*This document is a living reference — update Section 11's query map every few months as new content and directory listings take effect, and re-run the priority checklist in Section 1 whenever you ship a new project to the portfolio.*
