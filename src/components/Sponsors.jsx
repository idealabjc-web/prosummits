import { useRef, useEffect, useState } from "react";
import { useFadeUp } from "../hooks/useFadeUp";
import { client, urlFor } from "../lib/sanity";
import { SP_COLORS } from "../data/constants";
import { PixelCanvas } from "./PixelCanvas";
import "../styles/Sponsors.css";

/**
 * Sponsors
 * Displays sponsor logos in a flex row with colored hover effects.
 */
export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const ref = useRef(null);
  useFadeUp(ref);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const data = await client.fetch(`*[_type == "sponsor"]`);
        setSponsors(data);
      } catch (err) {
        console.error("Error fetching sponsors:", err);
      }
    };
    fetchSponsors();
  }, []);

  return (
    <section id="sponsors" ref={ref}>
      <div className="wrap" style={{ paddingTop: "20px" }}>
        <div className="sec-head ctr">
          <span className="section-tag" style={{ color: "#F9C515" }}>Our Associated Sponsors</span>
          <h2 className="section-title">
            Backed by World-Class<br />
            <em style={{ color: "#F9C515" }}>Institutions</em>
          </h2>
          <p className="section-desc">
            ProSummits is proud to partner with leading global organisations and institutions
            who share our commitment to knowledge, impact, and inclusion.
          </p>
        </div>

        <div className="sponsors-row">
          {sponsors.map((s, i) => {
            const color = SP_COLORS[i % SP_COLORS.length];
            return (
              <div
                key={s._id || i}
                className="sp-logo"
                style={{ "--brand-border": color }}
                onMouseEnter={ev => {
                  ev.currentTarget.style.borderColor = color;
                  ev.currentTarget.style.color = color;
                }}
                onMouseLeave={ev => {
                  ev.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                  ev.currentTarget.style.color = "rgba(255,255,255,.5)";
                }}
              >
                <PixelCanvas colors={[color, "#ffffff"]} gap={6} speed={30} />
                {s.image ? (
                  <img src={urlFor(s.image).height(80).url()} alt={s.name} className="sp-img" />
                ) : (
                  s.legacyImageUrl ? <img src={s.legacyImageUrl} alt={s.name} className="sp-img" /> : s.name
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
