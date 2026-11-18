import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { IntroProvider } from "@/providers/IntroProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PerfWatchdog } from "@/components/ui/PerfWatchdog";
import { JsonLd } from "@/components/seo/JsonLd";
import { PERF_BOOT_SCRIPT } from "@/lib/perf";
import { PERSON, SEO, SITE_URL } from "@/lib/site";
import { siteGraph } from "@/lib/structured-data";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-var",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-var",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-var",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.title,
    template: "%s | Tamas Das",
  },
  description: SEO.description,
  keywords: [...SEO.keywords],
  applicationName: "Tamas Das Portfolio",
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: "Tamas",
    lastName: "Das",
    url: "/",
    siteName: "Tamas Das",
    title: SEO.title,
    description: SEO.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  verification: {
    google: "JdgvqgjiD3XNFuWNUqOV1Wad3DCGSluVgTRlECFPhlw",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${mono.variable} ${display.variable}`}
      // data-perf is set by the boot script below before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PERF_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans text-text-primary antialiased">
        <JsonLd data={siteGraph()} />
        <PerfWatchdog />
        <CustomCursor />
        <IntroProvider>
          <LenisProvider>{children}</LenisProvider>
        </IntroProvider>
      </body>
    </html>
  );
}
