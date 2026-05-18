import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/pages.css";

const POSTS = [
  { id: 1, date: "May 12, 2026", cat: "Leadership", title: "The Future of Hybrid Conferences: Bridging the Gap", desc: "How modern technology is changing the way we connect across borders, making global impact more accessible than ever.", img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80", color: "#7B2FBE" },
  { id: 2, date: "Apr 28, 2026", cat: "Technology", title: "AI in Event Management: Beyond the Hype", desc: "Discover how artificial intelligence is streamlining logistics and personalized delegate experiences in 2026.", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80", color: "#2D73BE" },
  { id: 3, date: "Mar 15, 2026", cat: "Wellness", title: "Mental Health Advocacy: A Global Priority", desc: "Reflections from our recent summit on why mental wellness is the foundation of professional excellence.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80", color: "#F47B20" },
];

export default function Blog() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page-fade">
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="section-tag" style={{ color: "#7B2FBE" }}>Insights & Stories</span>
        <h1 className="page-hero-title">
          ProSummits <em>Blog</em>
        </h1>
        <p className="page-hero-desc">
          Stay updated with the latest trends in global leadership, hybrid event technology, 
          and breakthroughs across our six conference themes.
        </p>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">Read Stories</span>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {POSTS.map(p => (
            <div key={p.id} className="glass" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '.7rem', color: p.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.1em' }}>{p.cat}</span>
                  <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)' }}>{p.date}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', marginBottom: '12px', lineHeight: '1.3' }}>{p.title}</h3>
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.9rem', lineHeight: '1.6', marginBottom: '20px' }}>{p.desc}</p>
                <div style={{ marginTop: 'auto' }}>
                  <button className="btn-sm" style={{ borderColor: p.color }}>Read More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
