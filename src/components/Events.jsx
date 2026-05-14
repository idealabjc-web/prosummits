import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFadeUp } from "../hooks/useFadeUp";
import { client, urlFor } from "../lib/sanity";
import "../styles/Events.css";

/**
 * Events
 * Displays the upcoming events grid with cards.
 */
export default function Events() {
  const [events, setEvents] = useState([]);
  const ref = useRef(null);
  useFadeUp(ref);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await client.fetch(`*[_type == "event" && eventYear->year in ["2026", "2027"]]`);
        // Shuffle the events randomly
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setEvents(shuffled.slice(0, 6));
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section id="events" ref={ref}>
      <div className="wrap">
        <div className="sec-head">
          <span className="section-tag" style={{ color: "#F47B20" }}>
            Upcoming Popular Events
          </span>
          <h2 className="section-title">
            Our 2026–2027<br />
            <em style={{ color: "#F47B20" }}>Conference Calendar</em>
          </h2>
          <p className="section-desc">
            Explore our world-class hybrid conferences.
            All fully accessible online via our hybrid platform. Early Bird access is
            often completely free.
          </p>
        </div>

        <div className="ev-grid">
          {events.slice(0, 6).map((e, i) => (
            <div key={e._id || i} className="ev-card fu">
              <div className="ev-thumb">
                <img src={e.image ? urlFor(e.image).width(600).url() : (e.legacyImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80")} alt={e.title} />
                <div className="ev-shade" />
                <div className="ev-badge" style={{ background: e.bdColor || "#7B2FBE" }}>{e.badge}</div>
                <div className="ev-type">{e.type}</div>
              </div>
              <div className="ev-body">
                <div className="ev-title">{e.title}</div>
                <div className="ev-meta">
                  <div className="ev-date" style={{ color: e.dateColor || "#fff" }}>📅 {e.date}</div>
                  <div className="ev-loc">📍 {e.loc || e.location}</div>
                </div>
                <div className="ev-foot">
                  {/* <div className="ev-price" style={{ color: e.dateColor || "#fff" }}>
                    {e.price || "Free"}<small>Early Bird Access</small>
                  </div> */}
                  <Link
                    to={`/events/${e._id}`}
                    className="btn-sm"
                    onMouseEnter={ev => {
                      ev.currentTarget.style.background = (e.bdColor || "#7B2FBE") + "33";
                      ev.currentTarget.style.borderColor = (e.bdColor || "#7B2FBE");
                      ev.currentTarget.style.color = (e.bdColor || "#7B2FBE");
                    }}
                    onMouseLeave={ev => {
                      ev.currentTarget.style.background = "rgba(255,255,255,.08)";
                      ev.currentTarget.style.borderColor = "rgba(255,255,255,.2)";
                      ev.currentTarget.style.color = "#fff";
                    }}
                  >
                    Attend →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link to="/events" className="btn-o">View All Upcoming Events →</Link>
        </div>
      </div>
    </section>
  );
}