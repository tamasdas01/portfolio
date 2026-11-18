// Ping IndexNow (Bing, Yandex, Seznam, Naver…) with every URL in the live sitemap.
// Run after a deploy:   npm run indexnow
// Uses the key file already hosted at /5aa23f1c4e844d8198ef92f27cf041a0.txt
// Override the domain with SITE_URL=https://your-domain npm run indexnow

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-tamas.vercel.app").replace(/\/$/, "");
const KEY = "5aa23f1c4e844d8198ef92f27cf041a0";

const sitemap = await fetch(`${SITE_URL}/sitemap.xml`).then((r) => {
    if (!r.ok) throw new Error(`Could not fetch sitemap: ${r.status}`);
    return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("No <loc> entries found in sitemap");

const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList,
    }),
});

console.log(`IndexNow: ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
urlList.forEach((u) => console.log("  •", u));
if (res.status >= 400) process.exitCode = 1;
