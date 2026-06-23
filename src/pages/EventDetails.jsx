import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/EventDetails.css";

const AGENDA_SLIDES = [
  { src: "/VS-2026/EST.jpg", title: "EST Time Zone Schedule" },
  { src: "/VS-2026/Paris.jpg", title: "Paris Time Zone Schedule" }
];

/**
 * EventDetails page
 * Displays full details for a single event.
 * Now fetches live data from Sanity.
 */
export default function EventDetails() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentAgendaSlide, setCurrentAgendaSlide] = useState(0);

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentAgendaSlide((prev) => (prev + 1) % AGENDA_SLIDES.length);
  };
  
  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentAgendaSlide((prev) => (prev - 1 + AGENDA_SLIDES.length) % AGENDA_SLIDES.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (zoomedImage) {
         if (e.key === "ArrowRight") {
            const currentIndex = AGENDA_SLIDES.findIndex(s => s.src === zoomedImage);
            if(currentIndex !== -1) {
                setZoomedImage(AGENDA_SLIDES[(currentIndex + 1) % AGENDA_SLIDES.length].src);
            }
         } else if (e.key === "ArrowLeft") {
            const currentIndex = AGENDA_SLIDES.findIndex(s => s.src === zoomedImage);
            if(currentIndex !== -1) {
                setZoomedImage(AGENDA_SLIDES[(currentIndex - 1 + AGENDA_SLIDES.length) % AGENDA_SLIDES.length].src);
            }
         } else if (e.key === "Escape") {
            setZoomedImage(null);
         }
         return;
      }

      // If we are showing the Tentative Agenda section (which is when event.date matches)
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedImage]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEvent = async () => {
      try {
        // Try slug first, fall back to _id for backward compat with old UUID URLs
        let data = await client.fetch(
          `*[_type == "event" && slug.current == $slug][0]{ ..., eventYear-> }`,
          { slug }
        );
        if (!data) {
          data = await client.fetch(
            `*[_type == "event" && _id == $slug][0]{ ..., eventYear-> }`,
            { slug }
          );
        }
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-fade">
        <div className="loading-state" style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,.4)' }}>
          Loading event details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-fade">
        <div className="ed-not-found">
          <h2>Event not found</h2>
          <Link to="/events" className="btn-g">← Back to Events</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImg = event.image ? urlFor(event.image).width(1200).url() : (event.legacyImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80");

  return (
    <div className="page-fade">
      <div className="event-details-page">
        {/* Hero image */}
        <div
          className="ed-hero"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="ed-hero-overlay" />

          <div className="ed-hero-container">
            <div className="ed-hero-content">
              <div
                className="ev-badge"
                style={{ background: event.bdColor || "#7B2FBE" }}
              >
                {event.badge}
              </div>
              <h1 className="ed-hero-title">{event.title}</h1>
              <div className="ed-hero-meta-row">
                <div>
                  <div className="ed-meta-label">Date</div>
                  <div className="ed-meta-value">{event.date}</div>
                </div>
                <div className="ed-meta-sep" />
                <div>
                  <div className="ed-meta-label">Location</div>
                  <div className="ed-meta-value">{event.loc || event.location}</div>
                </div>
              </div>
            </div>

            {/* Floating Registration Card */}
            <div className="ed-floating-card">
              <div className="ed-card-tag">Secure Your Spot</div>
              <h3 className="ed-card-event-title">{event.title}</h3>

              <div className="ed-card-info">
                <div className="ed-info-row">
                  <span className="ed-info-label">📅 Date</span>
                  <span className="ed-info-val">{event.date}</span>
                </div>
                <div className="ed-info-row">
                  <span className="ed-info-label">📍 Venue</span>
                  <span className="ed-info-val">{event.loc || event.location}</span>
                </div>
              </div>

              <Link to={`/register?event=${event.slug?.current || event._id}`} className="btn-register-gold">Register Now</Link>
              <Link to={event.eventYear?.year ? `/events?year=${event.eventYear.year}` : "/events"} className="btn-browse-outline">
                ← Browse {event.eventYear?.year ? `${event.eventYear.year} Events` : "All Events"}
              </Link>
            </div>
          </div>
          <div className="scroll-indicator">
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <span className="scroll-text">Scroll for Details</span>
          </div>
        </div>

        {/* Details card */}
        <div className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <div className="ed-card">
            {/* Meta */}
            <div className="ed-meta">
              <div>
                <div className="ed-meta-label">Date</div>
                <div className="ed-meta-value" style={{ color: event.dateColor || "#fff" }}>📅 {event.date}</div>
              </div>
              <div>
                <div className="ed-meta-label">Location</div>
                <div className="ed-meta-value">📍 {event.loc || event.location}</div>
              </div>
              <div>
                <div className="ed-meta-label">Format</div>
                <div className="ed-meta-value">{event.type}</div>
              </div>
              {/* <div>
                <div className="ed-meta-label">Access</div>
                <div className="ed-meta-value" style={{ color: event.dateColor || "#fff", fontFamily: "var(--fd)", fontSize: "1.1rem" }}>
                  {event.price || "Free Early Bird"}
                </div>
              </div> */}
            </div>

            {/* About Section - Inspired by SignatureTalks wide layout */}
            <motion.div
              className="ed-about-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="ed-section-title-alt">About the Conference</h2>
              <div className="ed-about-split">
                <div className="ed-about-text">
                  <PortableText value={event.about || event.description} />
                </div>
                <div className="ed-about-visual">
                  <div className="ed-about-img-frame">
                    <img
                      src={event.aboutImage ? urlFor(event.aboutImage).url() : "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop"}
                      alt="About Conference"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Conference Themes */}
            {event.themes && event.themes.length > 0 && (
              <div className="ed-themes-note">
                <h4 className="ed-themes-note-title">Conference Theme</h4>
                <ul className="ed-themes-note-list">
                  {event.themes.map((theme, i) => (
                    <li key={i} className="ed-themes-note-item">
                      <span className="ed-themes-note-icon">{theme.icon || '🎯'}</span>
                      <div>
                        <strong>{theme.title}</strong>
                        {theme.description && (
                          <span className="ed-themes-note-desc"> — {theme.description}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Topics / Tags Section */}
            {event.chips && event.chips.length > 0 && (
              <div className="ed-topics-section">
                <h4 className="ed-topics-title">Key Conference Topics</h4>
                <div className="ed-topics-grid">
                  {event.chips.map((c, i) => (
                    <motion.span
                      key={c}
                      className="ed-topic-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
            <div className="ed-actions">
              <Link to={event.eventYear?.year ? `/events?year=${event.eventYear.year}` : "/events"} className="btn-o">
                ← Back to {event.eventYear?.year ? `${event.eventYear.year} Events` : "All Events"}
              </Link>
            </div>

            {event.date && event.date.toLowerCase().includes("jul") && event.date.includes("20") && event.date.includes("2026") && (
              <div style={{ marginTop: "50px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px", position: "relative" }}>
                <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>
                  Tentative <em style={{ color: "#F47B20", fontStyle: "normal" }}>Agenda</em>
                </h2>
                
                <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto", padding: "0 50px" }}>
                  <button 
                    onClick={prevSlide}
                    style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "2rem", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}
                    onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                    onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                  >
                    &#8249;
                  </button>

                  <div style={{ overflow: "hidden" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentAgendaSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 style={{ marginBottom: "15px", color: "#F47B20", textAlign: "center", fontSize: "1.2rem" }}>
                          {AGENDA_SLIDES[currentAgendaSlide].title}
                        </h3>
                        <div 
                          style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "center", background: "rgba(255,255,255,0.02)", padding: "10px", cursor: "pointer" }} 
                          onClick={() => setZoomedImage(AGENDA_SLIDES[currentAgendaSlide].src)}
                        >
                          <img 
                            src={AGENDA_SLIDES[currentAgendaSlide].src} 
                            alt={AGENDA_SLIDES[currentAgendaSlide].title} 
                            style={{ maxWidth: "100%", height: "auto", display: "block", borderRadius: "8px" }} 
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={nextSlide}
                    style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: "2rem", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}
                    onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                    onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                  >
                    &#8250;
                  </button>
                  
                  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "25px" }}>
                    {AGENDA_SLIDES.map((_, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setCurrentAgendaSlide(idx)}
                        style={{ 
                          width: "12px", height: "12px", borderRadius: "50%", cursor: "pointer",
                          background: currentAgendaSlide === idx ? "#F47B20" : "rgba(255,255,255,0.3)",
                          transition: "background 0.3s"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Fullscreen Image Overlay */}
      {zoomedImage && createPortal(
        <div 
          onClick={() => setZoomedImage(null)} 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', cursor: 'pointer' }}
        >
          <button 
            onClick={() => setZoomedImage(null)} 
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: '#fff', fontSize: '40px', cursor: 'pointer', zIndex: 1000000 }}
          >
            &times;
          </button>
          
          {AGENDA_SLIDES.find(s => s.src === zoomedImage) && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = AGENDA_SLIDES.findIndex(s => s.src === zoomedImage);
                if(currentIndex !== -1) {
                  setZoomedImage(AGENDA_SLIDES[(currentIndex - 1 + AGENDA_SLIDES.length) % AGENDA_SLIDES.length].src);
                }
              }}
              style={{ position: 'absolute', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '3rem', width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: "background 0.3s" }}
              onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
              onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
              &#8249;
            </button>
          )}

          <img src={zoomedImage} alt="Zoomed Schedule" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} onClick={(e) => e.stopPropagation()} />

          {AGENDA_SLIDES.find(s => s.src === zoomedImage) && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = AGENDA_SLIDES.findIndex(s => s.src === zoomedImage);
                if(currentIndex !== -1) {
                  setZoomedImage(AGENDA_SLIDES[(currentIndex + 1) % AGENDA_SLIDES.length].src);
                }
              }}
              style={{ position: 'absolute', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '3rem', width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', zIndex: 1000000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: "background 0.3s" }}
              onMouseOver={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
              onMouseOut={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
            >
              &#8250;
            </button>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}