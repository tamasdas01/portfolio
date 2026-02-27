import { IntroSequence } from "@/components/intro/IntroSequence";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { HeroIdentity } from "@/components/sections/HeroIdentity";
import { StatementSection } from "@/components/sections/StatementSection";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { AboutSection } from "@/components/sections/AboutSection";
import { CinematicProcess } from "@/components/sections/CinematicProcess";
import { MindMap } from "@/components/sections/MindMap";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      {/* Fixed Three.js dotted wave background — z-index: 0 */}
      <DottedSurface />

      {/* All page content sits above the dotted surface — z-index: 1 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <IntroSequence />
        <Header />

        <main>
          <HeroIdentity />
          <AboutSection />
          <StatementSection />
          <SelectedWork />
          <CinematicProcess />
          <MindMap />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}
