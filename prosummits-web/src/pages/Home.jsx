import ThreeBackground from "../components/ThreeBackground";
import Hero            from "../components/Hero";
import Events          from "../components/Events";
import Speakers        from "../components/Speakers";
import Testimonials    from "../components/Testimonials";
import Gallery         from "../components/Gallery";
import Sponsors        from "../components/Sponsors";
import Organizers      from "../components/Organizers";
import CTA             from "../components/CTA";
import Footer          from "../components/Footer";

/**
 * Home page
 * Composes the full landing page by assembling all section components
 * in the correct order.
 */
export default function Home() {
  return (
    <>
      {/* 3-D animated background (fixed, z-index 0) */}
      <ThreeBackground />

      <div className="page-fade">
        {/* Hero + Marquee */}
        <Hero />

        {/* Upcoming Events grid */}
        <Events />

        {/* World-Class Speakers */}
        <Speakers />

        {/* Testimonials */}
        <Testimonials />

        {/* Conference Gallery */}
        <Gallery />

        {/* Associated Sponsors */}
        <Sponsors />

        {/* Organizers & Featured Partners */}
        <Organizers />

        {/* CTA + Newsletter */}
        <CTA />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}