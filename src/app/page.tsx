import { IntroSequence } from "@/components/intro/IntroSequence";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { HeroIdentity } from "@/components/sections/HeroIdentity";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <IntroSequence />
      <Header />

      <main>
        <HeroIdentity />
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
