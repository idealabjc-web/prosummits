import React, { useEffect, useState, useRef } from "react";
import { urlFor } from "../lib/sanity";
import "../styles/AnimatedSpeakers.css";

export default function AnimatedSpeakersGallery({ speakers = [] }) {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // We want to track scroll progress when the top of the container hits the top of the viewport
      let progress = 0;
      if (rect.top <= 0) {
        progress = -rect.top;
      }
      setScrollY(progress);
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll(); // Initial check
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Limit progress and calculate expansion
  // 500px scroll corresponds to full expansion
  const animationProgress = Math.min(scrollY / 500, 1);
  // Calculate max radius responsively based on viewport (40vmin up to 400px)
  const maxRadius = Math.min(windowSize.width * 0.4, windowSize.height * 0.4, 400);
  const expandRadius = animationProgress * maxRadius;

  // Use up to 8 speakers
  const circleSpeakers = speakers.slice(0, 8);

  return (
    <div ref={containerRef} className="animated-speaker-wrapper">
      <div className="animated-speaker-sticky">
        <div style={{ position: "relative" }}>
          <div className={`circle-1 ${scrollY > 300 ? "active" : ""}`}>
            <div className={`circle-2 ${scrollY > 100 ? "active" : ""}`}>
              <div className="circle-3">
                <div className="circle-4">

                  {/* Decorative Orbital Rings */}
                  <div className="orbital-ring" style={{ inset: "10%", border: "1px dashed rgba(255,255,255,0.08)" }} />
                  <div className="orbital-ring" style={{ inset: "25%", border: "1px dashed rgba(255,255,255,0.12)" }} />
                  <div className="orbital-ring" style={{ inset: "40%", border: "1px dashed rgba(255,255,255,0.16)" }} />

                  {/* Initial Scroll Prompt */}
                  <div
                    style={{
                      position: "absolute",
                      top: "65%",
                      opacity: scrollY < 150 ? 1 - scrollY / 150 : 0,
                      transition: "opacity 0.3s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      pointerEvents: "none"
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", letterSpacing: "3px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Scroll to Expand</span>
                    <div style={{ width: "1px", height: "30px", background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)", marginTop: "10px" }} />
                  </div>

                  {/* Orbiting images */}
                  {circleSpeakers.map((speaker, index) => {
                    // Spread evenly across the circle
                    const angle = (index * 2 * Math.PI) / circleSpeakers.length;
                    const imgUrl = speaker.image
                      ? urlFor(speaker.image).width(200).url()
                      : speaker.img || speaker.legacyImageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80";

                    return (
                      <div
                        key={speaker._id || index}
                        className="orbit-image"
                        style={{
                          transform: `translate(${expandRadius * Math.cos(angle)}px, ${expandRadius * Math.sin(angle)}px)`,
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={speaker.name || `Profile ${index}`}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    );
                  })}

                  {/* Center Text */}
                  <div
                    className="center-text"
                    style={{ opacity: scrollY > 250 ? 1 : 0 }}
                  >
                    <h1>Empowering</h1>
                    <h1 style={{ color: "#F47B20" }}>Every User</h1>
                    <p>
                      Meet the visionary experts, industry leaders, and researchers who shape the conversations at ProSummits conferences worldwide.                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
