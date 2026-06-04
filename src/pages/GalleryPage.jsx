import React, { useEffect, useState, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import { useOutsideClick } from "../hooks/use-outside-click";
import { LOCAL_GALLERY } from "../data/galleryLocal";
import "../styles/pages.css";
import "../styles/Gallery.css";
import GalleryIntro from "../components/GalleryIntro";

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
};

const getPosition = (index) => {
  if (index === 0) return { rotation: -15, x: -90, y: 10, zIndex: 10 };
  if (index === 1) return { rotation: -3, x: -10, y: -15, zIndex: 20 };
  if (index === 2) return { rotation: 12, x: 75, y: 5, zIndex: 30 };
  return { rotation: 0, x: 0, y: 0, zIndex: 0 };
};

function ArrowLeftIcon({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      color="currentColor"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      color="currentColor"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandableGallerySection({ title, subtitle, images, accentColor, onImageClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const layoutGroupId = useId();
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  return (
    <section className={`expandable-gallery-sec${isExpanded ? " is-expanded" : ""}`} style={{ "--tab-accent": accentColor }}>
      <LayoutGroup id={layoutGroupId}>
        <div ref={containerRef} className="expandable-gallery-wrap">
          
          <div className="expandable-gallery-header">
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsExpanded(false)}
                  className="expandable-gallery-back-btn"
                >
                  <div className="icon-bg">
                    <ArrowLeftIcon />
                  </div>
                  <span>Go back</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            layout
            className={isExpanded ? "expandable-gallery-grid" : "expandable-gallery-collapsed-container"}
            transition={transition}
          >
            <div className={isExpanded ? "contents" : "expandable-gallery-stack-wrapper"}>
              {images.map((photo, index) => {
                const isPrimary = index < 3;
                if (!isPrimary && !isExpanded) return null;

                const pos = getPosition(index);
                const src = photo.url || (photo.image?.asset?._ref ? urlFor(photo.image).url() : null);
                if (!src) return null;

                return (
                  <motion.div
                    key={`card-${photo.id || index}`}
                    layoutId={`card-container-${photo.id || index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? pos.rotation : 0,
                      x: !isExpanded ? pos.x : 0,
                      y: !isExpanded ? pos.y : 0,
                      zIndex: !isExpanded ? pos.zIndex : 10,
                    }}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: pos.y - 15,
                            rotate: pos.rotation * 0.8,
                            zIndex: 50,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }
                        : { scale: 1.02 }
                    }
                    className={isExpanded ? "expandable-gallery-card-expanded" : "expandable-gallery-card-collapsed"}
                    onClick={() => {
                      if (!isExpanded) {
                        setIsExpanded(true);
                      } else {
                        onImageClick(src);
                      }
                    }}
                  >
                    <motion.div
                      layoutId={`image-inner-${photo.id || index}`}
                      layout="position"
                      className="expandable-gallery-image-inner"
                      transition={transition}
                    >
                      <img
                        src={src}
                        alt={photo.alt || title}
                        loading={isPrimary ? "eager" : "lazy"}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  key="stack-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="expandable-gallery-stack-content"
                >
                  <h2 className="expandable-gallery-title">
                    {subtitle}
                  </h2>

                  <div>
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="expandable-gallery-explore-btn"
                    >
                      Explore {title}
                      <ArrowRightIcon />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </section>
  );
}

// Normalize raw category values from Sanity to the 4 bucket keys
function normalizeCategory(raw) {
  if (!raw) return null;
  const lower = raw.toLowerCase().trim();
  if (lower.includes("highlight") || lower === "conference highlights") return "Highlights";
  if (lower.includes("speaker")) return "Speakers";
  if (lower.includes("panel")) return "Panels";
  if (lower.includes("location") || lower.includes("venue")) return "Locations";
  return null;
}

// Content-based categorization with heuristics for legacy data
function categorizeImage(item) {
  const normalized = normalizeCategory(item.category);
  if (normalized) return normalized;

  const name = item.filename || item.url || "";
  const assetRef = item.asset?._ref || "";

  if (name.includes("WL-WH") || assetRef.includes("image-")) return "Highlights";
  if (name.includes("Paris") || name.includes("September")) return "Locations";
  if (name.includes("Panel")) return "Panels";
  if (name.includes("Speaker") || name.includes("IMG")) return "Speakers";

  return "Highlights";
}

function getSrc(item) {
  if (item.url) return item.url;
  if (item.image?.asset?._ref) return urlFor(item.image).url();
  return null;
}

export default function GalleryPage() {
  const [categories, setCategories] = useState({
    "Highlights": [],
    "Speakers": [],
    "Recent": []
  });
  const [loading, setLoading] = useState(true);
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

        let allImages = cmsImages;
        if (allImages.length === 0) {
          allImages = LOCAL_GALLERY;
        }

        const grouped = {
          "Highlights": [],
          "Speakers": [],
          "Panels": [],
          "Locations": []
        };

        allImages.forEach((item) => {
          const cat = categorizeImage(item);
          if (grouped[cat]) {
            grouped[cat].push(item);
          } else {
            grouped["Highlights"].push(item);
          }
        });

        // Split Highlights into General and Recent
        const rawHighlights = grouped["Highlights"] || [];
        let recent = rawHighlights.filter(item => {
          const name = item.filename || item.url || "";
          return name.includes("WL-WH-September-2025") || name.includes("Paris") || name.includes("PROSUMMITS GALLERY");
        });

        let general = [];
        if (recent.length === 0) {
          recent = rawHighlights.slice(0, 6);
          general = rawHighlights.slice(6);
        } else {
          general = rawHighlights.filter(item => !recent.includes(item));
        }

        // Move 6th and 7th images (index 5 and 6) from general to recent
        if (general.length >= 7) {
          const item6 = general[5];
          const item7 = general[6];
          general = general.filter((_, idx) => idx !== 5 && idx !== 6);
          recent.push(item6, item7);
        }

        // Ensure all 16 local PROSUMMITS GALLERY images are in recent category
        const localRecents = LOCAL_GALLERY.filter(item => {
          const name = item.filename || item.url || "";
          return name.includes("PROSUMMITS GALLERY");
        });
        const recentUrls = new Set(recent.map(getSrc).filter(Boolean));
        localRecents.forEach(item => {
          const src = getSrc(item);
          if (src && !recentUrls.has(src)) {
            recent.push(item);
            recentUrls.add(src);
          }
        });

        // Remove the first 8 images from the recent highlights section
        if (recent.length >= 8) {
          recent = recent.slice(8);
        }

        setCategories({
          "Highlights": general,
          "Speakers": grouped["Speakers"] || [],
          "Recent": recent
        });

      } catch (err) {
        console.error("Failed to fetch gallery:", err);

        // Fallback to local gallery
        const grouped = {
          "Highlights": [],
          "Speakers": [],
          "Panels": [],
          "Locations": []
        };

        LOCAL_GALLERY.forEach((item) => {
          const cat = categorizeImage(item);
          if (grouped[cat]) {
            grouped[cat].push(item);
          } else {
            grouped["Highlights"].push(item);
          }
        });

        const rawHighlights = grouped["Highlights"] || [];
        let recent = rawHighlights.filter(item => {
          const name = item.filename || item.url || "";
          return name.includes("WL-WH-September-2025") || name.includes("Paris") || name.includes("PROSUMMITS GALLERY");
        });

        let general = [];
        if (recent.length === 0) {
          recent = rawHighlights.slice(0, 6);
          general = rawHighlights.slice(6);
        } else {
          general = rawHighlights.filter(item => !recent.includes(item));
        }

        // Move 6th and 7th images (index 5 and 6) from general to recent
        if (general.length >= 7) {
          const item6 = general[5];
          const item7 = general[6];
          general = general.filter((_, idx) => idx !== 5 && idx !== 6);
          recent.push(item6, item7);
        }

        // Ensure all 16 local PROSUMMITS GALLERY images are in recent category
        const localRecents = LOCAL_GALLERY.filter(item => {
          const name = item.filename || item.url || "";
          return name.includes("PROSUMMITS GALLERY");
        });
        const recentUrls = new Set(recent.map(getSrc).filter(Boolean));
        localRecents.forEach(item => {
          const src = getSrc(item);
          if (src && !recentUrls.has(src)) {
            recent.push(item);
            recentUrls.add(src);
          }
        });

        // Remove the first 8 images from the recent highlights section
        if (recent.length >= 8) {
          recent = recent.slice(8);
        }

        setCategories({
          "Highlights": general,
          "Speakers": grouped["Speakers"] || [],
          "Recent": recent
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const introImages = [
    ...categories["Recent"],
    ...categories["Highlights"],
    ...categories["Speakers"]
  ].map(getSrc).filter(Boolean);

  return (
    <>
      <div className="page-fade">
        <GalleryIntro images={introImages.length > 0 ? introImages : undefined} />

        <div className="page-content" style={{ padding: 0 }}>
          {loading ? (
            <div className="gallery-loading">
              <div className="gallery-loader" />
              <p>Gathering moments...</p>
            </div>
          ) : (
            <div className="gallery-sections-layout">
              {categories["Highlights"]?.length > 0 && (
                <ExpandableGallerySection
                  title="Gallery"
                  subtitle="People don’t fall in love with components. They fall in love with how something feels."
                  images={categories["Highlights"]}
                  accentColor="#E01F5C"
                  onImageClick={setSelectedImg}
                />
              )}

              {categories["Speakers"]?.length > 0 && (
                <ExpandableGallerySection
                  title="Speakers"
                  subtitle="Capturing thought leaders and industry pioneers sharing insights on stage."
                  images={categories["Speakers"]}
                  accentColor="#6DBE45"
                  onImageClick={setSelectedImg}
                />
              )}

              {categories["Recent"]?.length > 0 && (
                <ExpandableGallerySection
                  title="Recent Highlights"
                  subtitle="The latest moments and updates from our most recent summits."
                  images={categories["Recent"]}
                  accentColor="#7B2FBE"
                  onImageClick={setSelectedImg}
                />
              )}
            </div>
          )}

          <div style={{ textAlign: "center", padding: "60px 0", background: "var(--d)" }}>
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
