import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/pages.css";
import "../styles/Events.css";

/**
 * EventsPage
 * Dedicated page showing all upcoming events with full details.
 */
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [eventYears, setEventYears] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const eventsGridRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch events and year categories from Sanity
    const fetchContent = async () => {
      try {
        const [eventsData, yearsData] = await Promise.all([
          client.fetch(`*[_type == "event"]{..., eventYear->} | order(date asc)`),
          client.fetch(`*[_type == "eventYear"]{..., events[]->} | order(year asc)`)
        ]);
        setEvents(eventsData);
        setEventYears(yearsData);
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Handle URL year parameter and auto-scroll
  useEffect(() => {
    const yearParam = searchParams.get("year");
    if (yearParam && !loading && eventYears.length > 0) {
      setActiveYear(yearParam);
      setTimeout(() => {
        eventsGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [searchParams, loading, eventYears]);

  const handleYearClick = (year) => {
    const isClosing = activeYear === year;
    setActiveYear(isClosing ? null : year);

    if (!isClosing) {
      setTimeout(() => {
        eventsGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const stats = [
    { n: "24+", l: "Upcoming Events", c: "#F9C515", icon: "📅" },
    { n: "20+", l: "Conference Themes", c: "#7B2FBE", icon: "🎯" },
    { n: "4", l: "Global Cities", c: "#00A79D", icon: "🌍" },
    // { n: "Free", l: "Early Bird Access", c: "#6DBE45", icon: "🎟️" },
  ];

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="page-hero-tag" style={{ color: "#F47B20" }}>Conference Calendar 2026–2027</span>
        <h1>
          Upcoming<br />
          <em>Events & Conferences</em>
        </h1>
        <p className="page-hero-desc">
          Explore our full calendar of world-class hybrid conferences across
          Women's Rights, Mental Health, Cancer Research, AI, Entrepreneurship,
          and Autism Sciences.
        </p>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">Explore Calendar</span>
        </div>
      </section>

      <div className="page-content">
        {/* Stats Bar */}
        <div className="ev-stats-bar">
          {stats.map((s, i) => (
            <div key={i} className="ev-stat-item">
              <span className="ev-stat-icon">{s.icon}</span>
              <span className="ev-stat-num" style={{ color: s.c }}>{s.n}</span>
              <span className="ev-stat-label">{s.l}</span>
            </div>
          ))}
        </div>

        {/* Yearly Summits Section */}
        {!loading && eventYears.length > 0 && (
          <section className="yearly-summits">
            <div className="sec-head ctr" style={{ marginBottom: 40 }}>
              <span className="section-tag" style={{ color: "#7B2FBE" }}>Conference Series</span>
              <h2 className="section-title">
                Global <em style={{ color: "#7B2FBE" }}>Yearly Summits</em>
              </h2>
            </div>
            <div className="year-grid">
              {eventYears.map((y) => (
                <div key={y._id} className={`year-card ${activeYear === y.year ? 'active' : ''}`}
                  onClick={() => handleYearClick(y.year)}
                  style={{ '--accent': y.accentColor || '#F47B20', cursor: 'pointer' }}>
                  <div className="year-img">
                    <img src={y.image ? urlFor(y.image).width(800).url() : "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"} alt={y.title} />
                    <div className="year-overlay">
                      <div className="year-badge">Series {y.year}</div>
                      <div className="year-info">
                        <span className="year-subtitle">{y.subtitle}</span>
                        <h3>{y.title}</h3>
                        <p>{y.description}</p>
                        <div className="year-btn">
                          {activeYear === y.year ? 'Close Selection' : `View ${y.year} Events →`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Filtered Events Grid */}
        {activeYear && (
          <section ref={eventsGridRef} className="filtered-events page-fade-in" style={{ marginTop: 60 }}>
            <div className="sec-head ctr" style={{ marginBottom: 40 }}>
              <span className="section-tag" style={{
                color: eventYears.find(y => y.year === activeYear)?.accentColor || "#F47B20"
              }}>
                {activeYear} Calendar
              </span>
              <h2 className="section-title">
                {activeYear} <em style={{
                  color: eventYears.find(y => y.year === activeYear)?.accentColor || "#F47B20"
                }}>Conferences</em>
              </h2>
            </div>

            {/* Year About Section */}
            <AnimatePresence mode="wait">
              {eventYears.find(y => y.year === activeYear)?.about && (
                <motion.div
                  key={activeYear}
                  className="year-about-section"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="year-about-decoration" />
                  <div className="year-about-split">
                    <div className="year-about-text">
                      <PortableText value={eventYears.find(y => y.year === activeYear).about} />
                    </div>
                    <div className="year-about-media">
                      <img
                        src={eventYears.find(y => y.year === activeYear)?.aboutImage
                          ? urlFor(eventYears.find(y => y.year === activeYear).aboutImage).width(600).url()
                          : "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"}
                        alt="Series Overview"
                        className="year-about-img"
                      />
                    </div>
                  </div>
                </motion.div>
              )}\n            </AnimatePresence>

            {/* Year Themes Section */}
            {eventYears.find(y => y.year === activeYear)?.themes?.length > 0 && (
              <motion.div
                className="year-themes-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="year-themes-header">
                  <h3 className="year-themes-title">Conference Themes</h3>
                  <p className="year-themes-sub">Key focus areas for {activeYear}</p>
                </div>
                <div className="year-themes-grid">
                  {eventYears.find(y => y.year === activeYear).themes.map((theme, i) => (
                    <motion.div
                      key={i}
                      className="year-theme-card"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                    >
                      <span className="year-theme-icon">{theme.icon || '🎯'}</span>
                      <h4 className="year-theme-name">{theme.title}</h4>
                      {theme.description && (
                        <p className="year-theme-desc">{theme.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {loading ? (
              <div className="loading-state" style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,.4)' }}>
                Updating events...
              </div>
            ) : (
              <div className="ev-grid">
                {(() => {
                  const currentYearDoc = eventYears.find(y => y.year === activeYear);
                  // Get events that point to this year via reference
                  const linkedEvents = events.filter(e => e.eventYear?.year === activeYear);
                  // Get events manually added to the year's events array
                  const manualEvents = currentYearDoc?.events || [];

                  // Merge and deduplicate by ID
                  const allVisibleEvents = [...linkedEvents];
                  manualEvents.forEach(me => {
                    if (!allVisibleEvents.find(e => e._id === me._id)) {
                      allVisibleEvents.push(me);
                    }
                  });

                  return allVisibleEvents.length > 0 ? (
                    allVisibleEvents.map((e, i) => (
                      <div key={e._id || i} className="ev-card">
                        <div className="ev-thumb">
                          <img src={e.image ? urlFor(e.image).width(600).url() : (e.legacyImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80")} alt={e.title} />
                          <div className="ev-shade" />
                          <div className="ev-badge" style={{ background: e.bdColor || "#7B2FBE" }}>{e.badge}</div>
                          <div className="ev-type">{e.type}</div>
                        </div>
                        <div className="ev-body">
                          <div className="ev-title">{e.title}</div>
                          <div className="ev-meta">
                            <div className="ev-date" style={{ color: e.dateColor || "#fff" }}>📅 {e.date}, 📍 {e.loc || e.location}</div>
                          </div>
                          <div className="ev-foot">
                            {/* <div className="ev-price" style={{ color: e.dateColor || "#fff" }}>
                              {e.price || "Free"}<small>Early Bird Access</small>
                            </div> */}
                            <Link to={`/events/${e._id}`} className="btn-sm">
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '60px 0', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>No events found for {activeYear} yet.</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </section>
        )}

        {/* Themes Section */}
        <div className="sec-head ctr" style={{ marginTop: 80, marginBottom: 40 }}>
          <span className="section-tag" style={{ color: "#7B2FBE" }}>Conference Themes</span>
          <h2 className="section-title">
            Six Pillars of <em style={{ color: "#7B2FBE" }}>Impact</em>
          </h2>
        </div>

        <div className="info-grid">
          {[
            { icon: "👩‍⚖️", title: "Women's Rights & Leadership", desc: "Advancing gender equality, women's empowerment, and leadership development through global dialogue and actionable policy.", color: "#E01F5C" },
            { icon: "🧠", title: "Mental Health & Wellness", desc: "Bringing together psychiatrists, psychologists, and wellness advocates to address global mental health challenges.", color: "#7B2FBE" },
            { icon: "🔬", title: "Cancer Research", desc: "Highlighting breakthroughs in oncology, MedTech innovation, and collaborative research across borders.", color: "#F47B20" },
            { icon: "🤖", title: "Artificial Intelligence", desc: "Exploring the future of AI, machine learning, and how emerging technologies will reshape industries globally.", color: "#2D73BE" },
            { icon: "💡", title: "Entrepreneurship & Innovation", desc: "Empowering startup founders, business leaders, and innovators with the knowledge and connections to scale.", color: "#F9C515" },
            { icon: "🧩", title: "Autism & Behavioural Sciences", desc: "Creating inclusive platforms for researchers, educators, and families to advance understanding and support systems.", color: "#6DBE45" },
          ].map((t, i) => (
            <div key={i} className="info-card" style={{ borderColor: t.color + "33" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = t.color + "88"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = t.color + "33"}
            >
              <span className="info-card-icon">{t.icon}</span>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link to="/about" className="btn-g" style={{ marginRight: 14 }}>
            About ProSummits
          </Link>
          <Link to="/contact" className="btn-o">
            Contact Support
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
