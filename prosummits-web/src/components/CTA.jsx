import { useRef } from "react";
import { Link } from "react-router-dom";
import { useFadeUp } from "../hooks/useFadeUp";
import "../styles/CTA.css";

/**
 * CTA
 * Full-width call-to-action box with newsletter subscription input.
 */
export default function CTA() {
  const ref = useRef(null);
  useFadeUp(ref);

  return (
    <div id="register" className="cta-section" ref={ref}>
      <div className="cta-box">
        <span className="section-tag" style={{ color: "#F47B20" }}>Join the Movement</span>

        <h2 className="cta-h">
          Be Part of This<br />
          <em>Transformative Experience</em>
        </h2>

        <p className="cta-p">
          Equip yourself with the knowledge, confidence, and connections to make a difference
          in your life and the world around you. Subscribe to our newsletter for event updates
          and Early Bird access.
        </p>

        <div className="cta-btns">
          <Link to="/events" className="btn-g">Explore Events</Link>
          <Link to="/contact" className="btn-o">
            Contact Us
          </Link>
        </div>

        <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,.45)", marginBottom: "14px", letterSpacing: ".1em", textTransform: "uppercase" }}>
          Subscribe to the Newsletter
        </p>

        <div className="nl-form">
          <div className="nl-wrap">
            <input type="email" placeholder="Enter your email address" />
          </div>
          <button className="btn-g" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}