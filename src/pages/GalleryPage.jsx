import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { GALLERY_IMGS } from "../data/constants";
import "../styles/pages.css";
import "../styles/Gallery.css";

/**
 * GalleryPage
 * Dedicated page showcasing conference photography and event moments.
 */
export default function GalleryPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* Extra gallery images for the full page */
  const extraImages = [
    { src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80", lbl: "Delegate Networking — Tokyo", gradient: "linear-gradient(135deg,rgba(249,197,21,.7),rgba(123,47,190,.7))" },
    { src: "https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?w=400&q=80", lbl: "Panel Discussion", gradient: "linear-gradient(135deg,rgba(45,115,190,.7),rgba(109,190,69,.7))" },
    { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80", lbl: "Opening Ceremony — Dubai", gradient: "linear-gradient(135deg,rgba(224,31,92,.7),rgba(196,24,122,.7))" },
    { src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80", lbl: "Breakout Sessions — Paris", gradient: "linear-gradient(135deg,rgba(0,167,157,.7),rgba(249,197,21,.7))" },
    { src: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&q=80", lbl: "Awards Ceremony", gradient: "linear-gradient(135deg,rgba(244,123,32,.7),rgba(224,31,92,.7))" },
    { src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80", lbl: "Community Meet & Greet", gradient: "linear-gradient(135deg,rgba(123,47,190,.7),rgba(45,115,190,.7))" },
  ];

  const allImages = [...GALLERY_IMGS, ...extraImages];

  const highlights = [
    { icon: "📸", title: "Professional Coverage", desc: "Every ProSummits event is captured by professional photographers and videographers to document the experience.", color: "#7B2FBE" },
    { icon: "🎬", title: "Live Streaming", desc: "Key sessions are live-streamed and recorded, making every moment accessible to our global hybrid audience.", color: "#F47B20" },
    { icon: "🌟", title: "Social Media", desc: "Join the conversation with our event hashtags and share your own moments across social platforms.", color: "#E01F5C" },
  ];

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="page-hero-tag" style={{ color: "#6DBE45" }}>Conference Gallery</span>
        <h1>
          Moments That<br />
          <em>Define Our Events</em>
        </h1>
        <p className="page-hero-desc">
          A glimpse into the world-class in-person and hybrid experiences
          we create across our global conference venues — from keynote stages
          to networking galas and everything in between.
        </p>
      </section>

      <div className="page-content">
        {/* Full Gallery Grid */}
        <div className="gallery-grid" style={{ marginBottom: 64 }}>
          {allImages.map((g, i) => (
            <div key={i} className="g-cell">
              <img src={g.src} alt={g.lbl} />
              <div className="g-ov" style={{ background: g.gradient }}>
                <span className="g-ov-txt">{g.lbl}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="sec-head ctr" style={{ marginBottom: 40 }}>
          <span className="section-tag" style={{ color: "#00A79D" }}>How We Capture</span>
          <h2 className="section-title">
            Event <em style={{ color: "#00A79D" }}>Coverage</em>
          </h2>
        </div>

        <div className="info-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 48 }}>
          {highlights.map((h, i) => (
            <div key={i} className="info-card" style={{ borderColor: h.color + "33" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = h.color + "88"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = h.color + "33"}
            >
              <span className="info-card-icon">{h.icon}</span>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/events" className="btn-g" style={{ marginRight: 14 }}>
            Explore Events
          </Link>
          <Link to="/about" className="btn-o">
            About ProSummits
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
