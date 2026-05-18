import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { client, urlFor } from "../lib/sanity";
import "../styles/Gallery.css";

// ── 3D Tilt Component ──────────────────────────────────────────────
function TiltCard({ src, label, i }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Staggered bento logic: first item is big, some are portrait
  const isLarge = i === 0 || i === 3;

  return (
    <motion.div
      className={`g-cell ${isLarge ? "g-large" : ""}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.8 }}
    >
      <div className="g-cell-inner" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        <img src={src} alt={label} className="g-cell-fg" />
      </div>

      {/* Background Glow */}
      <div className="g-cell-glow" />
    </motion.div>
  );
}

// ── Main Gallery Section ────────────────────────────────────────────
export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeGallery = async () => {
      try {
        // Fetch all gallery documents and combine their images
        const data = await client.fetch(`*[_type == "gallery"] | order(_createdAt desc) { images }`);

        let allImages = [];
        if (data?.length) {
          allImages = data.flatMap((doc) => doc.images || []);
        }

        if (allImages.length > 0) {
          // Shuffle and take 7 for the bento
          const shuffled = [...allImages]
            .sort(() => 0.5 - Math.random())
            .slice(0, 7);
          setImages(shuffled);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeGallery();
  }, []);

  return (
    <section className="gallery-sec" id="gallery">
      <div className="wrap">
        <div className="sec-head ctr">
          <span className="section-tag">Visual Journey</span>
          <h2 className="section-title">Conference <em>Moments</em></h2>
          <p className="section-desc">
            Capturing the energy, innovation, and connections that make our global summits unforgettable.
          </p>
        </div>

        {loading ? (
          <div className="gallery-loading">
            <div className="gallery-loader" />
          </div>
        ) : (
          <div className="g-bento-grid">
            {images.map((img, i) => (
              <TiltCard
                key={i}
                i={i}
                src={img.image?.asset?._ref ? urlFor(img.image).width(800).url() : img.url}
                label={img.caption || "ProSummits Event"}
              />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Link to="/gallery" className="btn-o">View Full Gallery</Link>
        </div>
      </div>
    </section>
  );
}
