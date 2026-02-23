import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { IntroProvider } from "@/providers/IntroProvider";
import { LenisProvider } from "@/providers/LenisProvider";
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
  title: "Your Name — Designer & Developer",
  description:
    "I design and build digital experiences with clarity and intention.",
  metadataBase: new URL("https://yourname.com"),
  openGraph: {
    title: "Your Name — Designer & Developer",
    description:
      "I design and build digital experiences with clarity and intention.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="font-sans text-text-primary antialiased">
        <IntroProvider>
          <LenisProvider>{children}</LenisProvider>
        </IntroProvider>
      </body>
    </html>
  );
}
