import { useRef, useEffect, useState } from "react";
import { useFadeUp } from "../hooks/useFadeUp";
import { client, urlFor } from "../lib/sanity";
import { AMB_COLORS } from "../data/constants";
import "../styles/Ambassadors.css";

/**
 * Speakers (Guest Speakers & Faculty)
 * Displays the speaker grid on the home page.
 */
export default function Speakers() {
  const [speakers, setSpeakers] = useState([]);
  const ref = useRef(null);
  useFadeUp(ref);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const data = await client.fetch(`*[_type == "speaker"]`);
        setSpeakers(data);
      } catch (err) {
        console.error("Error fetching speakers:", err);
      }
    };
    fetchSpeakers();
  }, []);

  return (
    <section id="speakers" ref={ref}>
      <div className="wrap" style={{ paddingTop: "20px" }}>
        <div className="sec-head ctr">
          <span className="section-tag" style={{ color: "#7B2FBE" }}>
            Global Thought Leaders
          </span>
          <h2 className="section-title">
            Meet Our<br />
            <em style={{ color: "#7B2FBE" }}>World-Class Speakers</em>
          </h2>
          <p className="section-desc">
            Our speakers are world-renowned experts, researchers, and changemakers who represent
            the ProSummits mission across the globe — sharing insights and driving innovation.
          </p>
        </div>

        <div className="amb-grid">
          {speakers.map((a, i) => (
            <div
              key={a._id || i}
              className="amb-card fu"
              style={{ borderColor: AMB_COLORS[i % AMB_COLORS.length] + "33" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = AMB_COLORS[i % AMB_COLORS.length] + "88"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = AMB_COLORS[i % AMB_COLORS.length] + "33"}
            >
              {/* Avatar */}
              <div
                className="amb-av"
                style={{
                  borderColor: AMB_COLORS[i % AMB_COLORS.length],
                  background:  `linear-gradient(135deg,${AMB_COLORS[i % AMB_COLORS.length]}22,${AMB_COLORS[(i + 1) % AMB_COLORS.length] || AMB_COLORS[0]}22)`,
                }}
              >
                <img
                  src={a.image ? urlFor(a.image).width(200).height(200).url() : (a.legacyImageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80")}
                  alt={a.name}
                  onError={e => { e.target.style.display = "none"; }}
                />
                {a.initials}
              </div>

              <div className="amb-name">{a.name}</div>
              <div className="amb-role" style={{ color: AMB_COLORS[i % AMB_COLORS.length] }}>{(a.role || "").replace('Brand Ambassador', 'Guest Speaker')}</div>
              <div className="amb-loc">📍 {a.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}