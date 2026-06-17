import { HERO_STATS } from "../data/constants";

/**
 * Stats
 * Renders the four headline numbers shown at the bottom of the Hero section.
 */
export default function Stats() {
  return (
    <div className="hero-counts">
      {HERO_STATS.map(({ n, l, c }) => (
        <div key={l} style={{ textAlign: "center" }}>
          <div className="hc-num" style={{ color: c }}>{n}</div>
          <div className="hc-lbl">{l}</div>
        </div>
      ))}
    </div>
  );
}
