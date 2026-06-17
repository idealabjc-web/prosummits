import { useRef, useEffect, useState } from "react";
import { useFadeUp } from "../hooks/useFadeUp";
import { client } from "../lib/sanity";
import { ORG_COLORS } from "../data/constants";
import "../styles/Organizers.css";

/**
 * Organizers
 * Displays organizer / partner cards in a 3-column grid.
 */
export default function Organizers() {
  const [organizers, setOrganizers] = useState([]);
  const ref = useRef(null);
  useFadeUp(ref);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const data = await client.fetch(`*[_type == "organizer"]`);
        setOrganizers(data);
      } catch (err) {
        console.error("Error fetching organizers:", err);
      }
    };
    fetchOrganizers();
  }, []);

  return (
    <section ref={ref}>
      <div className="wrap" style={{ paddingTop: "24px" }}>
        <div className="sec-head ctr">
          <span className="section-tag" style={{ color: "#C4187A" }}>Organizers and Featured Partners</span>
          <h2 className="section-title">
            The Team &amp;<br />
            <em style={{ color: "#C4187A" }}>Partners Behind ProSummits</em>
          </h2>
          <p className="section-desc">
            Our events are co-organised and supported by a network of specialist institutions,
            research bodies, and advocacy organisations across the globe.
          </p>
        </div>

        <div className="org-grid">
          {organizers.map((o, i) => (
            <div
              key={o._id || i}
              className="org-card fu"
              style={{ borderColor: ORG_COLORS[i % ORG_COLORS.length] + "33" }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = ORG_COLORS[i % ORG_COLORS.length] + "77"}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = ORG_COLORS[i % ORG_COLORS.length] + "33"}
            >
              <div
                className="org-ico"
                style={{ background: ORG_COLORS[i % ORG_COLORS.length] + "18", border: `1px solid ${ORG_COLORS[i % ORG_COLORS.length]}44` }}
              >
                {o.icon}
              </div>
              <div>
                <div className="org-name">{o.name}</div>
                <div className="org-desc">{o.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
