import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import "../styles/pages.css";
import "../styles/Gallery.css";
import GalleryIntro from "../components/GalleryIntro";

// Constants for labels and colors
const CATEGORY_META = {
  "Highlights": {
    label: "Highlights",
    icon: "✨",
    accent: "#E01F5C",
    desc: "A collection of the most memorable moments from our events.",
  },
  "Speakers": {
    label: "Speakers",
    icon: "🎤",
    accent: "#6DBE45",
    desc: "Capturing keynote speakers and thought leaders sharing insights on stage.",
  },
  "Panels": {
    label: "Panel Discussions",
    icon: "👥",
    accent: "#7B2FBE",
    desc: "Expert panel discussions tackling global challenges.",
  },
  "Locations": {
    label: "Global Venues",
    icon: "📍",
    accent: "#F47B20",
    desc: "Snapshots from our world-class venues and global locations.",
  },
};

const CATEGORY_ORDER = ["Highlights", "Speakers", "Panels", "Locations"];

// Content-based categorization with heuristics for legacy data
function categorizeImage(item) {
  if (item.category && item.category !== "Highlights") return item.category;

  const name = item.filename || item.url || "";
  const assetRef = item.asset?._ref || "";

  if (name.includes("WL-WH") || assetRef.includes("image-") || item.category === "Highlights") return "Highlights";
  if (name.includes("Paris") || name.includes("September")) return "Locations";
  if (name.includes("Panel")) return "Panels";
  if (name.includes("Speaker") || name.includes("IMG") || item.category === "Speakers") return "Speakers";

  return "Highlights";
}

function getSrc(item) {
  if (item.url) return item.url;
  if (item.image?.asset?._ref) return urlFor(item.image).url();
  return null;
}

export default function GalleryPage() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Highlights");
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchGallery = async () => {
      try {
        const data = await client.fetch(`*[_type == "gallery"] | order(_createdAt asc) { images }`);
        let cmsImages = [];
        if (data?.length) {
          cmsImages = data.flatMap((doc) => doc.images || []);
        }

        const grouped = {
          "Highlights": [],
          "Speakers": [],
          "Panels": [],
          "Locations": []
        };

        cmsImages.forEach((item) => {
          const cat = categorizeImage(item);
          if (grouped[cat]) {
            grouped[cat].push(item);
          } else {
            grouped["Highlights"].push(item);
          }
        });

        setCategories(grouped);
        if (grouped["Highlights"].length === 0) {
          const firstNotEmpty = CATEGORY_ORDER.find(c => grouped[c].length > 0);
          if (firstNotEmpty) setActiveTab(firstNotEmpty);
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const tabs = CATEGORY_ORDER.filter((c) => categories[c]?.length > 0);
  const activeImages = categories[activeTab] || [];

  return (
    <>
      <div className="page-fade">
        <GalleryIntro images={activeImages.map(getSrc).filter(Boolean)} />

        <div className="page-content">
          {loading ? (
            <div className="gallery-loading">
              <div className="gallery-loader" />
              <p>Gathering moments...</p>
            </div>
          ) : tabs.length > 0 ? (
            <>
              {/* Simple Category Tabs */}
              <div className="gallery-tabs-bar">
                {tabs.map((cat) => {
                  const meta = CATEGORY_META[cat] || {};
                  return (
                    <button
                      key={cat}
                      className={`gallery-tab${activeTab === cat ? " active" : ""}`}
                      style={{ "--tab-accent": meta.accent || "#6DBE45" }}
                      onClick={() => setActiveTab(cat)}
                    >
                      <span className="gallery-tab-icon">{meta.icon}</span>
                      <span className="gallery-tab-label">{meta.label || cat}</span>
                      <span className="gallery-tab-count">{categories[cat].length}</span>
                    </button>
                  );
                })}
              </div>

              {/* Premium Category Header */}
              {activeTab && CATEGORY_META[activeTab] && (
                <div
                  className="gallery-cat-info"
                  style={{ "--tab-accent": CATEGORY_META[activeTab].accent }}
                >
                  <h2 className="gallery-cat-title">
                    {CATEGORY_META[activeTab].label || activeTab}
                  </h2>
                  <p className="gallery-cat-desc">{CATEGORY_META[activeTab].desc}</p>
                </div>
              )}

              {/* Simple Premium Grid */}
              <div className="cms-gallery-grid">
                {activeImages.map((item, i) => {
                  const src = getSrc(item);
                  if (!src) return null;
                  return (
                    <div
                      key={`${activeTab}-${i}`}
                      className="cms-g-cell"
                      onClick={() => setSelectedImg(src)}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        border: `1px solid ${CATEGORY_META[activeTab]?.accent || '#6DBE45'}33`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                        e.currentTarget.style.borderColor = CATEGORY_META[activeTab]?.accent || '#6DBE45';
                        e.currentTarget.style.boxShadow = `0 20px 40px ${CATEGORY_META[activeTab]?.accent || '#6DBE45'}44`;
                        const img = e.currentTarget.querySelector('img');
                        if (img) img.style.transform = 'scale(1.1)';
                        const overlay = e.currentTarget.querySelector('.g-overlay');
                        if (overlay) overlay.style.opacity = '1';
                        const text = e.currentTarget.querySelector('.g-overlay-text');
                        if (text) text.style.transform = 'translateY(0)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.borderColor = `${CATEGORY_META[activeTab]?.accent || '#6DBE45'}33`;
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                        const img = e.currentTarget.querySelector('img');
                        if (img) img.style.transform = 'scale(1)';
                        const overlay = e.currentTarget.querySelector('.g-overlay');
                        if (overlay) overlay.style.opacity = '0';
                        const text = e.currentTarget.querySelector('.g-overlay-text');
                        if (text) text.style.transform = 'translateY(15px)';
                      }}
                    >
                      <img src={src} alt={`${activeTab} Gallery`} className="cms-g-fg" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
                      <div className="g-overlay" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(4,16,28,0.9) 0%, transparent 60%)`, opacity: 0, transition: 'opacity 0.4s ease', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
                        <div className="g-overlay-text" style={{ color: '#fff', transform: 'translateY(15px)', transition: 'transform 0.4s ease' }}>
                          <span style={{ display: 'inline-block', padding: '6px 12px', background: CATEGORY_META[activeTab]?.accent || '#6DBE45', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {CATEGORY_META[activeTab]?.icon} {activeTab}
                          </span>
                          <div style={{ fontSize: '1.25rem', fontFamily: 'var(--fd)', fontWeight: 600 }}>Click to Expand</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="gallery-empty">
              <p>No images found in this category.</p>
            </div>
          )}

          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Link to="/events" className="btn-g" style={{ marginRight: 14 }}>Explore Events</Link>
            <Link to="/about" className="btn-o">About Us</Link>
          </div>
        </div>

        <Footer />
      </div>

      {/* Lightbox */}
      {selectedImg && (
        <div className="gallery-lightbox" onClick={() => setSelectedImg(null)}>
          <button className="lightbox-close" onClick={() => setSelectedImg(null)}>✕</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={selectedImg} alt="Enlarged" />
          </div>
        </div>
      )}
    </>
  );
}
