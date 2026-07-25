import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { client, urlFor } from "../lib/sanity";
import "../styles/Gallery.css";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // { src, alt }

  useEffect(() => {
    const fetchHomeGallery = async () => {
      try {
        const data = await client.fetch(`*[_type == "gallery"] | order(_createdAt desc) { images }`);

        let allImages = [];
        if (data?.length) {
          allImages = data.flatMap((doc) => doc.images || []);
        }

        if (allImages.length > 0) {
          const shuffled = [...allImages]
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);
          setImages(shuffled);
        } else {
          setImages([
            { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200" },
            { url: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=1200" },
            { url: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=1200" },
            { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200" },
            { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1200" },
            { url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200" },
          ]);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setImages([
          { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200" },
          { url: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=1200" },
          { url: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=1200" },
          { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200" },
          { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1200" },
          { url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeGallery();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  // Escape key + scroll lock
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e) => { if (e.key === "Escape") closeLightbox(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  const openLightbox = (src, alt) => setLightbox({ src, alt });

  return (
    <>
      <section className="gallery-sec" id="gallery">
        {/* Ambient glow orbs */}
        <div className="hg-orb hg-orb--left" aria-hidden="true" />
        <div className="hg-orb hg-orb--right" aria-hidden="true" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Section Header */}
          <div className="hg-header">
            <div className="hg-tag-wrap">
              <span className="hg-tag-dot" />
              <span className="hg-tag-text">Visual Journey</span>
              <span className="hg-tag-dot" />
            </div>
            <h2 className="hg-title">
              Conference <em className="hg-title-em">Moments</em>
            </h2>
            <p className="hg-desc">
              Capturing the energy, innovation, and connections that make our global summits unforgettable.
            </p>
          </div>

          {/* Image Grid */}
          {loading ? (
            <div className="gallery-loading">
              <div className="gallery-loader" />
            </div>
          ) : (
            <div className="home-gallery-grid">
              {images.map((img, index) => {
                const src = img.image?.asset?._ref
                  ? urlFor(img.image).width(1200).url()
                  : img.url;
                const alt = img.caption || `ProSummits Event ${index + 1}`;
                return (
                  <div
                    key={index}
                    className="home-gallery-cell"
                    onClick={() => openLightbox(src, alt)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openLightbox(src, alt)}
                    aria-label={`View ${alt}`}
                  >
                    <img src={src} alt={alt} loading="lazy" />
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="hg-cta-wrap">
            <Link to="/gallery" className="hg-cta-btn">
              <span>Explore Full Gallery</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox — rendered via portal directly on body to avoid overflow clipping */}
      {lightbox && createPortal(
        <div
          className="hg-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            className="hg-lightbox-close"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="Close preview"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {/* stopPropagation so clicking the image itself doesn't close */}
          <div className="hg-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
