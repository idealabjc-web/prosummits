import { useRef } from "react";
import { useFadeUp } from "../hooks/useFadeUp";
import { GALLERY_IMGS } from "../data/constants";
import "../styles/Gallery.css";

/**
 * Gallery
 * Displays a responsive image grid with hover overlays.
 */
export default function Gallery() {
  const ref = useRef(null);
  useFadeUp(ref);

  return (
    <section id="gallery" ref={ref}>
      <div className="wrap">
        <div className="sec-head ctr">
          <span className="section-tag" style={{ color: "#6DBE45" }}>Conference Gallery</span>
          <h2 className="section-title">
            Moments That<br />
            <em style={{ color: "#6DBE45" }}>Define Our Events</em>
          </h2>
          <p className="section-desc">
            A glimpse into the world-class in-person and hybrid experiences we create
            across our global conference venues.
          </p>
        </div>

        <div className="gallery-grid">
          {GALLERY_IMGS.map((g, i) => (
            <div key={i} className="g-cell fu">
              <img src={g.src} alt={g.lbl} />
              <div className="g-ov" style={{ background: g.gradient }}>
                <span className="g-ov-txt">{g.lbl}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
