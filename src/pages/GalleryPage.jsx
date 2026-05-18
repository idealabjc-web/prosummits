import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import "../styles/pages.css";
import "../styles/Gallery.css";

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
        <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="page-hero-tag" style={{ color: "#6DBE45" }}>Event Gallery</span>
        <h1>
          Moments That<br />
          <em>Define ProSummits</em>
        </h1>
        <p className="page-hero-desc">
          A visual journey through our global conferences, showcasing world-class
          speakers, interactive sessions, and impactful moments.
        </p>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-text">View Gallery</span>
        </div>
      </section>

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
                  >
                    <img src={src} alt="Gallery" className="cms-g-fg" />
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
