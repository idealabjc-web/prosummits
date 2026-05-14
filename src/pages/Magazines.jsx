import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/pages.css";

const ISSUES = [
  { id: 1, vol: "Vol. 14", date: "Spring 2026", title: "Global Impact & Sustainability", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80", color: "#6DBE45" },
  { id: 2, vol: "Vol. 13", date: "Winter 2025", title: "Women in STEM: The AI Revolution", img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80", color: "#E01F5C" },
  { id: 3, vol: "Vol. 12", date: "Fall 2025", title: "Mental Wellness in the Digital Age", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80", color: "#7B2FBE" },
];

export default function Magazines() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page-fade">
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="section-tag" style={{ color: "#E01F5C" }}>Publications</span>
        <h1 className="page-hero-title">
          ProSummits <em>Magazines</em>
        </h1>
        <p className="page-hero-desc">
          Explore our seasonal publications featuring in-depth interviews with industry leaders, 
          scientific breakthroughs, and post-summit white papers.
        </p>
      </section>

      <section className="wrap" style={{ paddingTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
          {ISSUES.map(issue => (
            <div key={issue.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                background: `linear-gradient(135deg, ${issue.color}22, rgba(4,16,28,1))`,
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,.5)',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,.05)',
                cursor: 'pointer',
                transition: 'transform .3s ease',
                position: 'relative'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px) rotate(2deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <img src={issue.img} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px', background: issue.color, color: '#fff', fontSize: '.7rem', fontWeight: '800', padding: '4px 10px', borderRadius: '4px' }}>
                  {issue.vol}
                </div>
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', marginBottom: '8px' }}>{issue.title}</h3>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '16px' }}>{issue.date}</p>
              <button className="btn-o" style={{ padding: '8px 24px', fontSize: '.8rem' }}>View Issue</button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
