import { useEffect, useState } from "react";
import Stats from "./Stats";
import { Link } from "react-router-dom";
import { client } from "../lib/sanity";
import "../styles/Hero.css";

/**
 * Hero
 * Full-viewport hero section with headline, CTA buttons,
 * stat counters, and an infinite scrolling marquee.
 */
export default function Hero() {
  const [marquee, setMarquee] = useState([
    { text: "Women's Rights", color: "#E01F5C" },
    { text: "Mental Health", color: "#7B2FBE" },
    { text: "Cancer Research", color: "#F47B20" },
    { text: "Artificial Intelligence", color: "#2D73BE" },
    { text: "Entrepreneurship", color: "#F9C515" },
    { text: "Autism Sciences", color: "#6DBE45" }
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(`*[_type == "siteSettings"][0]{marqueeItems}`);
        if (data?.marqueeItems && data.marqueeItems.length > 0) {
          setMarquee(data.marqueeItems);
        }
      } catch (err) {
        console.error("Error fetching site settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-pill">
          <div className="pill-dot" />
          17 Upcoming Events — Early Bird Access Open
        </div>

        <h1>
          Speaker Rules Meets<br />
          <em>Elegant Hybrid Conferences</em>
        </h1>

        <p className="hero-sub">
          Modern, world-class hybrid conference platforms at ProSummits Hybrid Meetups.
          Celebrating milestones in Women's Rights, Mental Health, Cancer Research,
          Artificial Intelligence, Entrepreneurship, and Autism &amp; Behavioural Sciences.
        </p>

        <div className="hero-btns">
          <Link to="/events" className="btn-g">Upcoming Events</Link>
          <Link to="/about" className="btn-o">
            To Know More
          </Link>
        </div>

        <Stats />
      </section>

      {/* Marquee */}
      <div className="mq-wrap">
        <div className="mq-track">
          {[...Array(3)].flatMap((_, dupIdx) =>
            marquee.map((item, idx) => (
              <div key={`${idx}-${dupIdx}`} className="mq-item">
                <div
                  style={{
                    width: 4, height: 4, borderRadius: "50%",
                    background: item.color + "B3", flexShrink: 0,
                  }}
                />
                <span style={{ 
                  color: item.color + "B3", 
                  fontWeight: 500, 
                  fontSize: '0.9rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px' 
                }}>
                  {item.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}