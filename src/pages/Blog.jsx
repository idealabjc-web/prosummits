import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import "../styles/pages.css";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    client
      .fetch(`*[_type == "post"] | order(_createdAt asc)`)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div className="bp-animation-box" style={{ width: "60px", height: "60px", margin: "0 auto 20px auto", border: "2px solid #7B2FBE", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: "1rem" }}>Loading insights...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {posts.map(p => {
              const coverImg = p.image ? urlFor(p.image).url() : p.legacyImageUrl;
              const linkUrl = `/blog/${p.slug?.current || p._id}`;
              return (
                <div key={p._id} className="glass blog-card" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,.05)', transition: 'transform .3s ease, border-color .3s ease' }}>
                  <Link to={linkUrl} style={{ height: '220px', overflow: 'hidden', display: 'block' }}>
                    <img src={coverImg} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }} className="blog-card-img" />
                  </Link>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '.7rem', color: p.color || "#7B2FBE", fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.1em' }}>{p.category}</span>
                      <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)' }}>{p.date}</span>
                    </div>
                    <Link to={linkUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="blog-card-title" style={{ fontFamily: 'var(--fd)', fontSize: '1.4rem', marginBottom: '12px', lineHeight: '1.3', transition: 'color .2s ease' }}>{p.title}</h3>
                    </Link>
                    <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.9rem', lineHeight: '1.6', marginBottom: '20px' }}>{p.description}</p>
                    <div style={{ marginTop: 'auto' }}>
                      <Link to={linkUrl}>
                        <button className="btn-sm" style={{ borderColor: p.color || "#7B2FBE", cursor: 'pointer', transition: 'all .3s ease' }}>Read More</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
