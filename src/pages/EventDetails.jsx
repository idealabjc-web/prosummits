import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import "../styles/EventDetails.css";

/**
 * EventDetails page
 * Displays full details for a single event.
 * Now fetches live data from Sanity.
 */
export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEvent = async () => {
      try {
        const data = await client.fetch(`*[_type == "event" && _id == $id][0]{ ..., eventYear-> }`, { id });
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

              <Link to={`/register?event=${event._id}`} className="btn-register-gold">Register Now</Link>
              <Link to="/events" className="btn-browse-outline">← Browse All Events</Link>
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

            {/* CTA */}
            <div className="ed-actions">
              <Link to={event.eventYear?.year ? `/events?year=${event.eventYear.year}` : "/events"} className="btn-o">
                ← Back to {event.eventYear?.year ? `${event.eventYear.year} Series` : "All Events"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}