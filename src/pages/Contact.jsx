import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client } from "../lib/sanity";
import "../styles/pages.css";

/**
 * Contact Us Page
 * Professional, CMS-driven contact hub with real email delivery.
 */

const CAT_COLORS = {
  "General": "#7B2FBE",
  "Events & Attendance": "#F47B20",
  "Speakers & Content": "#6DBE45",
  "Partnerships & Sponsorship": "#00A79D",
  "Policies": "#E01F5C",
};

export default function Contact() {
  const [faqs, setFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  /* scroll to top and load Calendly resources */
  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch FAQs from Sanity
    const fetchFaqs = async () => {
      try {
        const data = await client.fetch(`*[_type == "faq"]`);
        setFaqs(data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();

    // Load Calendly CSS for popup modal
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Calendly JS script
    let script;
    if (!window.Calendly) {
      script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const toggleItem = (idx) => {
    setOpenIndex(prev => prev === idx ? null : idx);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setOpenIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.target);
    // This is a verified access key for contact@prosummits.org
    formData.append("access_key", "55a1608e-176c-4860-93a0-569429ba7d96");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form error:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = faqs.filter(f => f.category === activeCategory);
  const accentColor = CAT_COLORS[activeCategory];

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="page-hero-tag" style={{ color: "#00A79D" }}>Get in Touch</span>
        <h1>
          Contact<br />
          <em>Us</em>
        </h1>
        <p className="page-hero-desc">
          Have questions about our events, partnerships, or registration?
          We're here to help you navigate your ProSummits journey.
        </p>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">Reach Out</span>
        </div>
      </section>

      <div className="page-content">
        {/* Calendly Section */}
        <div className="sec-head ctr" style={{ marginBottom: 40 }}>
          <span className="section-tag" style={{ color: "#7B2FBE" }}>Schedule a Call</span>
          <h2 className="section-title">
            Book a <em style={{ color: "#7B2FBE" }}>Meeting</em>
          </h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Select a time that works for you to discuss partnership or speaker opportunities.
          </p>
        </div>

        <div className="booking-cta-card" style={{
          background: 'linear-gradient(135deg, rgba(4, 16, 28, 0.6) 0%, rgba(12, 30, 50, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          marginBottom: '80px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle decorative glow circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '150px',
            height: '150px',
            background: 'rgba(123, 47, 190, 0.15)',
            filter: 'blur(50px)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'rgba(0, 167, 157, 0.15)',
            filter: 'blur(50px)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
            <h3 style={{ 
              fontFamily: 'var(--fd)', 
              fontSize: '2rem', 
              fontWeight: 700, 
              color: '#ffffff', 
              marginBottom: '16px' 
            }}>
              Schedule a 1-on-1 Discovery Call
            </h3>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.65)', 
              maxWidth: '600px', 
              margin: '0 auto 32px',
              fontSize: '1.05rem',
              lineHeight: 1.6
            }}>
              Have questions about ProSummits 2026? Speak directly with our event coordination team. Select a convenient time for a 15-minute virtual consultation.
            </p>
            <button 
              onClick={() => {
                if (window.Calendly) {
                  window.Calendly.initPopupWidget({
                    url: 'https://calendly.com/prosummitsvirtual/15min?hide_gdpr_banner=1'
                  });
                } else {
                  window.open('https://calendly.com/prosummitsvirtual/15min?hide_gdpr_banner=1', '_blank');
                }
              }}
              className="booking-btn"
              style={{
                background: 'linear-gradient(135deg, #7B2FBE 0%, #00A79D 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '100px',
                padding: '16px 36px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(123, 47, 190, 0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(123, 47, 190, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(123, 47, 190, 0.3)';
              }}
            >
              Book Appointment Now
            </button>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-container" style={{ marginBottom: 100 }}>
          <div className="contact-main-grid">
            {/* Form */}
            <div className="contact-form-card">
              <h3>Send us a Message</h3>
              <form className="c-form" onSubmit={handleSubmit}>
                <div className="f-row">
                  <div className="f-group">
                    <label>Full Name</label>
                    <input type="text" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="f-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="f-row">
                  <div className="f-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+971 XX XXX XXXX" required />
                  </div>
                  <div className="f-group">
                    <label>Subject</label>
                    <select name="subject">
                      <option>General Enquiry</option>
                      <option>Event Registration</option>
                      <option>Sponsorship Opportunity</option>
                      <option>Speaker Application</option>
                    </select>
                  </div>
                </div>
                <div className="f-group">
                  <label>Your Message</label>
                  <textarea name="message" placeholder="How can we help you?" rows="5" required></textarea>
                </div>

                <button type="submit" className="btn-g" style={{ width: "100%" }} disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                  <p style={{ color: "#6DBE45", marginTop: 15, textAlign: "center", fontWeight: 500 }}>
                    ✓ Thank you! Your message has been sent to our team.
                  </p>
                )}
                {status === "error" && (
                  <p style={{ color: "#E01F5C", marginTop: 15, textAlign: "center", fontWeight: 500 }}>
                    ✕ Something went wrong. Please email us at contact@prosummits.org
                  </p>
                )}
              </form>
            </div>

            {/* Info */}
            <div className="contact-info-list">
              <div className="c-info-item">
                <div className="c-icon">📅</div>
                <div>
                  <h4>Schedule a Call</h4>
                  <p>Book a 15-minute discovery call.</p>
                  <a href="https://calendly.com/prosummitsvirtual/15min?background_color=04101c&text_color=ffffff&primary_color=7b2fbe" target="_blank" rel="noreferrer" style={{ color: "#7B2FBE", fontWeight: 600 }}>Book Appointment →</a>
                </div>
              </div>

              <div className="c-info-item">
                <div className="c-icon">📧</div>
                <div>
                  <h4>Official Email</h4>
                  <p>contact@prosummits.org</p>
                </div>
              </div>

              <div className="c-info-item">
                <div className="c-icon">📍</div>
                <div>
                  <h4>Dubai Headquarters</h4>
                  <p>Dubai Silicon Oasis, DDP, Building A2, Dubai, UAE.</p>
                </div>
              </div>

              <div className="c-info-item">
                <div className="c-icon">🏙️</div>
                <div>
                  <h4>Global Offices</h4>
                  <p>New York, USA | Hyderabad, India | Paris, France</p>
                </div>
              </div>

              <div className="c-info-item">
                <div className="c-icon">🔗</div>
                <div>
                  <h4>Follow Us</h4>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <a href="https://www.linkedin.com/company/prosummits-events/" target="_blank" rel="noreferrer" className="soc-a" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>in</a>
                    <a href="https://x.com/prosummits" target="_blank" rel="noreferrer" className="soc-a" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>𝕏</a>
                    <a href="https://www.facebook.com/prosummits" target="_blank" rel="noreferrer" className="soc-a" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>f</a>
                    <a href="https://www.instagram.com/prosummits" target="_blank" rel="noreferrer" className="soc-a" style={{ width: '36px', height: '36px', borderRadius: '8px' }}>📷</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section" style={{ marginBottom: 80, borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.1)' }}>
          <iframe
            title="Dubai HQ"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.345!2d55.385!3d25.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f65!2sDubai%20Silicon%20Oasis!5e0!3m2!1sen!2sae!4v1234567890"
            width="100%" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy"
          ></iframe>
        </div>

        {/* FAQ Section */}
        <div id="faqs" className="faq-sec-anchor"></div>
        <div className="sec-head ctr" style={{ marginBottom: 40 }}>
          <span className="section-tag" style={{ color: "#F47B20" }}>FAQ</span>
          <h2 className="section-title">
            Frequently Asked <em style={{ color: "#F47B20" }}>Questions</em>
          </h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Quick answers to common questions about our global events.
          </p>
        </div>

        <div className="faq-tabs">
          {Object.keys(CAT_COLORS).map(cat => (
            <button
              key={cat}
              className={`faq-tab${activeCategory === cat ? " active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
              style={activeCategory === cat ? {
                background: CAT_COLORS[cat] + "20",
                borderColor: CAT_COLORS[cat],
                color: CAT_COLORS[cat],
              } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="faq-list" style={{ marginBottom: 64 }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div
                key={faq._id || i}
                className={`faq-item${openIndex === i ? " open" : ""}`}
                style={openIndex === i ? { borderColor: accentColor + "55" } : {}}
              >
                <button className="faq-question" onClick={() => toggleItem(i)}>
                  <span>{faq.question}</span>
                  <span className="faq-chevron">▼</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="ctr" style={{ opacity: 0.5, padding: "40px" }}>Select a category to view questions.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
