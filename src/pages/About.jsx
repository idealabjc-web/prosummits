import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/pages.css";

/**
 * About page
 * Company overview, mission, values, milestones, and contact info.
 */
export default function About() {
  /* scroll to top on mount */
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const missions = [
    { icon: "🌍", title: "Global Reach", desc: "We host hybrid conferences across Tokyo, Dubai, Paris, Miami, New York, and Toronto — connecting professionals worldwide.", color: "#7B2FBE" },
    { icon: "🎯", title: "Impact-Driven", desc: "Every event is designed around a mission: advancing Women's Rights, Mental Health, Cancer Research, AI, Entrepreneurship, and Autism Sciences.", color: "#E01F5C" },
    { icon: "💻", title: "Hybrid First", desc: "Our world-class hybrid platform ensures every delegate can attend fully online or in person with an identical, premium experience.", color: "#F47B20" },
    { icon: "🤝", title: "Inclusive Access", desc: "Early Bird access is free for all events. We believe knowledge should be accessible, regardless of geography or budget.", color: "#6DBE45" },
    { icon: "🔬", title: "Research-Led", desc: "All conference tracks are curated in partnership with research bodies, medical institutions, and academic consortia.", color: "#00A79D" },
    { icon: "🏆", title: "Award-Winning", desc: "Recognised by leading industry bodies for innovation in conference delivery and delegate engagement.", color: "#F9C515" },
  ];

  const values = [
    { icon: "💡", title: "Innovation", desc: "We push the boundaries of what a conference can be — leveraging AI, immersive tech, and cutting-edge event design.", color: "#7B2FBE" },
    { icon: "🌱", title: "Sustainability", desc: "Our hybrid model reduces travel footprint while maximising knowledge sharing, making events greener and more accessible.", color: "#6DBE45" },
    { icon: "⚡", title: "Excellence", desc: "From keynote speakers to networking sessions, every detail is crafted to deliver a world-class delegate experience.", color: "#F47B20" },
    { icon: "❤️", title: "Community", desc: "We build lasting communities around each conference theme — networks that continue to collaborate long after the event.", color: "#E01F5C" },
  ];

  const milestones = [
    { year: "2019", title: "ProSummits Founded", desc: "Established in Dubai with a mission to redefine global conferences through hybrid technology.", color: "#7B2FBE" },
    { year: "2020", title: "First Virtual Congress", desc: "Pivoted to fully virtual events, hosting our first Women's Empowerment Summit with 2,000+ delegates.", color: "#E01F5C" },
    { year: "2021", title: "Global Expansion", desc: "Expanded to 4 countries with 6 concurrent conference themes and 5,000+ registered delegates.", color: "#F47B20" },
    { year: "2023", title: "Hybrid Platform Launch", desc: "Launched our proprietary hybrid platform enabling seamless in-person and virtual experiences.", color: "#6DBE45" },
    { year: "2025", title: "19 Events Planned", desc: "Record calendar with 19 upcoming events across 6 global cities and all 6 conference themes.", color: "#00A79D" },
  ];

  const contacts = [
    { icon: "📍", title: "Headquarters", lines: ["BLVD Heights, Dubai Opera District", "Dubai, UAE"], color: "#7B2FBE" },
    { icon: "📧", title: "Email Us", lines: [{ text: "contact@prosummits.org", href: "mailto:contact@prosummits.org" }], color: "#F47B20" },
    { icon: "📞", title: "Call Us", lines: [{ text: "+1 (716) 217-1471", href: "tel:+17162171471" }], color: "#00A79D" },
  ];

  return (
    <>
      <div className="page-fade">
        {/* Hero */}
        <section className="page-hero">
          <Link to="/" className="page-hero-back">← Back to Home</Link>
          <span className="page-hero-tag" style={{ color: "#7B2FBE" }}>About ProSummits</span>
          <h1>
            Where Speaker Rules<br />
            Meet <em>Global Impact</em>
          </h1>
          <p className="page-hero-desc">
            ProSummits is a Dubai-based global conference company dedicated to creating
            world-class hybrid events that drive real change in Women's Rights, Mental Health,
            Cancer Research, AI, Entrepreneurship, and Autism Sciences.
          </p>
        </section>

        <div className="page-content">
          {/* Mission Cards */}
          <div className="sec-head ctr" style={{ marginBottom: 40 }}>
            <span className="section-tag" style={{ color: "#F47B20" }}>Our Mission</span>
            <h2 className="section-title">
              What <em style={{ color: "#F47B20" }}>Drives Us</em>
            </h2>
          </div>

          <div className="info-grid">
            {missions.map((m, i) => (
              <div
                key={i}
                className="info-card"
                style={{ borderColor: m.color + "33" }}
                onMouseEnter={ev => ev.currentTarget.style.borderColor = m.color + "88"}
                onMouseLeave={ev => ev.currentTarget.style.borderColor = m.color + "33"}
              >
                <span className="info-card-icon">{m.icon}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="sec-head ctr" style={{ marginBottom: 40 }}>
            <span className="section-tag" style={{ color: "#6DBE45" }}>Our Values</span>
            <h2 className="section-title">
              Built on <em style={{ color: "#6DBE45" }}>Strong Foundations</em>
            </h2>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div
                key={i}
                className="value-card"
                style={{ borderColor: v.color + "33" }}
                onMouseEnter={ev => ev.currentTarget.style.borderColor = v.color + "77"}
                onMouseLeave={ev => ev.currentTarget.style.borderColor = v.color + "33"}
              >
                <div
                  className="value-icon"
                  style={{ background: v.color + "18", border: `1px solid ${v.color}44` }}
                >
                  {v.icon}
                </div>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Milestones Timeline */}
          <div className="sec-head ctr" style={{ marginBottom: 40 }}>
            <span className="section-tag" style={{ color: "#E01F5C" }}>Milestones</span>
            <h2 className="section-title">
              Our <em style={{ color: "#E01F5C" }}>Journey So Far</em>
            </h2>
          </div>

          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" style={{ borderColor: m.color, background: m.color + "33" }} />
                <span className="timeline-year" style={{ color: m.color }}>{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="sec-head ctr" style={{ marginBottom: 16 }}>
            <span className="section-tag" style={{ color: "#00A79D" }}>Get in Touch</span>
            <h2 className="section-title">
              Contact <em style={{ color: "#00A79D" }}>ProSummits</em>
            </h2>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              Have questions about an upcoming event, partnership opportunities, or
              media enquiries? We'd love to hear from you.
            </p>
          </div>

          <div className="contact-grid">
            {contacts.map((c, i) => (
              <div
                key={i}
                className="contact-card"
                style={{ borderColor: c.color + "33" }}
                onMouseEnter={ev => ev.currentTarget.style.borderColor = c.color + "77"}
                onMouseLeave={ev => ev.currentTarget.style.borderColor = c.color + "33"}
              >
                <span className="contact-icon">{c.icon}</span>
                <h3>{c.title}</h3>
                {c.lines.map((line, j) =>
                  typeof line === "string"
                    ? <p key={j}>{line}</p>
                    : <a key={j} href={line.href} style={{ display: "block" }}>{line.text}</a>
                )}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <Link to="/#events" className="btn-g" style={{ marginRight: 14 }}>
              Explore Events
            </Link>
            <Link to="/contact" className="btn-o">
              Contact Us
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );

}
