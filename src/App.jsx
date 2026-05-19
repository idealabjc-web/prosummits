import { useEffect, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home            from "./pages/Home";
import EventDetails    from "./pages/EventDetails";
import EventsPage      from "./pages/EventsPage";
import SpeakersPage    from "./pages/SpeakersPage";
import Blog            from "./pages/Blog";
import GalleryPage     from "./pages/GalleryPage";
import SponsorsPage    from "./pages/SponsorsPage";
import About           from "./pages/About";
import Contact         from "./pages/Contact";
import RegisterPage    from "./pages/RegisterPage";
import PoliciesPage    from "./pages/PoliciesPage";
import Navbar          from "./components/Navbar";
import "./styles/global.css";

/**
 * ScrollToHash
 * Forces the page to jump to the top on navigation, or to a hash if present.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Aggressively disable browser scroll memory
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    } else {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
}

/**
 * App
 * Root component — client-side routing for all pages:
 *   /              → Home (landing)
 *   /events        → All Events
 *   /events/:id    → Single Event Detail
 *   /ambassadors   → Brand Ambassadors
 *   /gallery       → Conference Gallery
 *   /sponsors      → Sponsors & Organizers
 *   /about         → About Us
 *   /contact       → Contact Us (Integrated FAQ)
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/"             element={<Home />}            />
        <Route path="/events"       element={<EventsPage />}      />
        <Route path="/events/:id"   element={<EventDetails />}    />
        <Route path="/speakers"     element={<SpeakersPage />}    />
        <Route path="/ambassadors"  element={<SpeakersPage />}    />
        <Route path="/blog"         element={<Blog />}            />
        <Route path="/gallery"      element={<GalleryPage />}     />
        <Route path="/sponsors"     element={<SponsorsPage />}    />
        <Route path="/about"        element={<About />}           />
        <Route path="/contact"      element={<Contact />}         />
        <Route path="/register"     element={<RegisterPage />}    />
        <Route path="/policies"     element={<PoliciesPage />}    />
      </Routes>
    </BrowserRouter>
  );
}