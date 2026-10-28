import { Preloader } from "@/components/layout/Preloader";
import { ContactDrawerProvider } from "@/components/layout/ContactDrawer";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { MvpBanner } from "@/components/sections/MvpBanner";
import { Industries } from "@/components/sections/Industries";
import { Reviews } from "@/components/sections/Reviews";

export default function HomePage() {
  return (
    <ContactDrawerProvider>
      <Preloader />
      <Hero />
      <main>
        <About />
        <Projects />
        <Services />
        <MvpBanner />
        <Industries />
        <Reviews />
      </main>
      <Footer variant="drawer" />
    </ContactDrawerProvider>
  );
}
