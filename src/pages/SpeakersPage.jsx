import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import { SPEAKERS } from "../data/constants";
import "../styles/pages.css";
import "../styles/Ambassadors.css";
import AnimatedSpeakersGallery from "../components/AnimatedSpeakersGallery";
import coverImg from "../assets/ambassadors/Ambassador-img.png";
import banner2Img from "../assets/ambassadors/S_Calleri.jpg";
import banner1Img from "../assets/ambassadors/T_Calleri.jpg";

/**
 * SpeakersPage
 * Dedicated page showcasing all event speakers with expanded bios.
 */
export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const isAmbassadorsPage = location.pathname.includes("ambassadors");

  useEffect(() => { 
    window.scrollTo(0, 0); 
    
    const fetchSpeakers = async () => {
      try {
        const query = isAmbassadorsPage 
          ? `*[_type == "speaker" && personType == "ambassador"]`
          : `*[_type == "speaker" && (personType == "speaker" || !defined(personType))]`;
          
        const data = await client.fetch(query);
        const fallbackData = SPEAKERS.filter(s => 
          isAmbassadorsPage ? s.personType === "ambassador" : s.personType !== "ambassador"
        );
        if (data && data.length > 0) {
          // Merge: use Sanity data + any local speakers not already in Sanity (by name)
          const sanityNames = new Set(data.map(s => s.name?.toLowerCase()));
          const extras = fallbackData.filter(s => !sanityNames.has(s.name?.toLowerCase()));
          setSpeakers([...data, ...extras]);
        } else {
          setSpeakers(fallbackData);
        }
      } catch (err) {
        console.error("Error fetching speakers:", err);
        setSpeakers(SPEAKERS.filter(s => 
          isAmbassadorsPage ? s.personType === "ambassador" : s.personType !== "ambassador"
        ));
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, [isAmbassadorsPage]);

  const roles = [
    { icon: "🎤", title: "Expert Keynotes", desc: "Our speakers deliver high-impact keynote presentations at global conferences and panel discussions.", color: "#7B2FBE" },
    { icon: "🌐", title: "Thought Leadership", desc: "They lead conversations on emerging trends, connecting professionals and advocates in their regions.", color: "#E01F5C" },
    { icon: "📢", title: "Global Advocacy", desc: "Speakers amplify our mission through scientific insight, public speaking, and grassroots engagement.", color: "#F47B20" },
    { icon: "🤝", title: "Expert Mentorship", desc: "They mentor emerging leaders, supporting delegates in their scientific and professional growth journeys.", color: "#6DBE45" },
  ];

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="page-hero-tag" style={{ color: "#7B2FBE" }}>
          {isAmbassadorsPage ? "Global Brand Ambassadors" : "Global Thought Leaders"}
        </span>
        <h1>
          Meet Our<br />
          <em>{isAmbassadorsPage ? "Brand Ambassadors" : "World-Class Speakers"}</em>
        </h1>
        <p className="page-hero-desc">
          {isAmbassadorsPage 
            ? "Meet the dedicated brand ambassadors who represent and amplify the ProSummits mission across the globe."
            : "Meet the visionary experts, industry leaders, and researchers who shape the conversations at ProSummits conferences worldwide."
          }
        </p>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">Meet {isAmbassadorsPage ? "Ambassadors" : "Speakers"}</span>
        </div>
      </section>

      {/* Featured Cover Image */}
      <div className="page-content" style={{ paddingTop: 0 }}>
        <motion.div className="featured-banner" {...fadeIn}>
          <img
            src={coverImg}
            alt="ProSummits Homepage Cover"
          />
        </motion.div>
      </div>

      {/* Full-Page Side-by-Side Banners */}
      <div className="page-content" style={{ paddingTop: 0 }}>
        <div className="poster-grid">
          <motion.div {...fadeIn}>
            <img
              src={banner2Img}
              alt="Ambassador Info 2"
            />
          </motion.div>
          <motion.div {...fadeIn}>
            <img
              src={banner1Img}
              alt="Ambassador Info 1"
            />
          </motion.div>
        </div>
      </div>

      <div className="page-content">
        <div style={{ marginBottom: 64 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,.4)' }}>
              Loading speakers...
            </div>
          ) : isAmbassadorsPage ? (
            <div className="amb-grid">
              {speakers.map((s, i) => {
                const imgUrl = s.image
                  ? urlFor(s.image).width(400).url()
                  : s.img || s.legacyImageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80";
                
                return (
                  <div key={s._id || i} className="amb-card">
                    <div className="amb-av">
                      {imgUrl ? <img src={imgUrl} alt={s.name || `Ambassador ${i}`} /> : (s.initials || "A")}
                    </div>
                    <div className="amb-name">{s.name}</div>
                    <div className="amb-role">{s.role}</div>
                    <div className="amb-loc">{s.location}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <AnimatedSpeakersGallery speakers={speakers} />
          )}
        </div>

        {/* What Speakers Do */}
        <div className="sec-head ctr" style={{ marginBottom: 40 }}>
          <span className="section-tag" style={{ color: "#E01F5C" }}>Speaker Program</span>
          <h2 className="section-title">
            Our Speaker <em style={{ color: "#E01F5C" }}>Contributions</em>
          </h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Our speakers play a vital role in extending ProSummits' reach and impact
            around the world through expert knowledge, advocacy, and mentorship.
          </p>
        </div>

        <div className="values-grid" style={{ marginBottom: 64 }}>
          {roles.map((r, i) => (
            <div key={i} className="value-card"
              style={{ borderColor: r.color + "33" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = r.color + "77"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = r.color + "33"}
            >
              <div className="value-icon"
                style={{ background: r.color + "18", border: `1px solid ${r.color}44` }}
              >
                {r.icon}
              </div>
              <div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Speaker CTA */}
        <div className="sec-head ctr" style={{ marginBottom: 32 }}>
          <span className="section-tag" style={{ color: "#F9C515" }}>Collaborate</span>
          <h2 className="section-title">
            Join Our <em style={{ color: "#F9C515" }}>Global Faculty</em>
          </h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Are you a researcher, leader, or innovator with a story to tell? We're always looking
            for world-class speakers to join our global network.
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/register" className="btn-g" style={{ marginRight: 14 }}>
            Apply to Speak
          </Link>
          <Link to="/events" className="btn-o">
            Explore Events
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
