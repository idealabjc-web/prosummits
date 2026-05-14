import { useRef, useEffect, useState } from "react";
import { useFadeUp } from "../hooks/useFadeUp";
import { client } from "../lib/sanity";
import { TEST_COLORS } from "../data/constants";
import "../styles/Testimonials.css";

/**
 * Testimonials
 * Displays attendee testimonials in a 3-column grid.
 */
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const ref = useRef(null);
  useFadeUp(ref);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await client.fetch(`*[_type == "testimonial"]`);
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="test-section" ref={ref}>
      <div className="wrap">
        <div className="sec-head ctr">
          <span className="section-tag" style={{ color: "#00A79D" }}>What Attendees Say</span>
          <h2 className="section-title">
            Achieved Cost Control &amp;<br />
            <em style={{ color: "#00A79D" }}>Real Results</em>
          </h2>
          <p className="section-desc">
            Delegates from around the world share how ProSummits helped them save
            resources, build connections, and create lasting impact.
          </p>
        </div>

        <div className="test-grid">
          {testimonials.map((t, i) => {
            const colors = TEST_COLORS[i % TEST_COLORS.length];
            return (
              <div
                key={t._id || i}
                className="t-card fu"
                style={{ background: colors.card, borderColor: colors.border }}
              >
                <div className="t-stars" style={{ color: colors.star }}>★★★★★</div>
                <p className="t-txt">"{t.quote}"</p>
                <div className="t-auth">
                  <div
                    className="t-av"
                    style={{
                      background:  `linear-gradient(135deg,${colors.border},rgba(4,16,28,.8))`,
                      borderColor:  colors.border,
                      color:        colors.star,
                    }}
                  >
                    {t.author?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="t-name">{t.author}</div>
                    <div className="t-role">{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
