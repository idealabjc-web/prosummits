import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { client, urlFor } from "../lib/sanity";
import { SP_COLORS, ORG_COLORS } from "../data/constants";
import { BrandLogosCloud, PixelCanvas } from "../components/PixelCanvas";
import "../styles/pages.css";
import "../styles/Sponsors.css";
import "../styles/Organizers.css";

/**
 * SponsorsPage
 * Dedicated page showcasing sponsors, partners, and organizers.
 */
export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const [spData, orgData] = await Promise.all([
          client.fetch(`*[_type == "sponsor"]`),
          client.fetch(`*[_type == "organizer"]`)
        ]);
        setSponsors(spData);
        setOrganizers(orgData);
      } catch (err) {
        console.error("Error fetching sponsors/organizers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tiers = [
    { label: "Platinum Partners", color: "#7B2FBE", items: sponsors.slice(0, 4) },
    { label: "Gold Partners", color: "#F9C515", items: sponsors.slice(4, 8) },
  ];

  const benefits = [
    { icon: "🎯", title: "Brand Visibility", desc: "Premium logo placement across event materials, the website, live streams, and all marketing collateral.", color: "#7B2FBE" },
    { icon: "🎤", title: "Speaking Slots", desc: "Exclusive keynote and panel speaking opportunities at our global hybrid conferences.", color: "#E01F5C" },
    { icon: "🤝", title: "Delegate Access", desc: "Direct networking access to a global community of professionals, researchers, and decision-makers.", color: "#F47B20" },
    { icon: "📊", title: "Impact Reports", desc: "Detailed post-event reports with engagement metrics, media reach, and delegate feedback data.", color: "#6DBE45" },
  ];

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="page-hero">
        <Link to="/" className="page-hero-back">← Back to Home</Link>
        <span className="page-hero-tag" style={{ color: "#F9C515" }}>Our Partners & Sponsors</span>
        <h1>
          Backed by World-Class<br />
          <em>Institutions</em>
        </h1>
        <p className="page-hero-desc">
          ProSummits is proud to partner with leading global organisations and institutions
          who share our commitment to knowledge, impact, and inclusion.
        </p>
      </section>

      <div className="page-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,.4)' }}>
            Loading partners...
          </div>
        ) : (
          <>
            {/* Featured Brand Logos Premium Cloud */}
            <div className="sec-head ctr" style={{ marginBottom: 32 }}>
              <span className="section-tag" style={{ color: "#E01F5C" }}>Featured Global Partners</span>
              <h2 className="section-title">
                Supported by Industry <em style={{ color: "#E01F5C" }}>Leaders</em>
              </h2>
            </div>
            <BrandLogosCloud />

            {/* Sponsor Tiers */}
            {tiers.map((tier, ti) => (
              <div key={ti} style={{ marginBottom: 56 }}>
                <div className="sec-head ctr" style={{ marginBottom: 24 }}>
                  <span className="section-tag" style={{ color: tier.color }}>{tier.label}</span>
                </div>
                <div className="sponsors-row">
                  {tier.items.map((s, i) => {
                    const colorIdx = (ti * 4 + i) % SP_COLORS.length;
                    const color = SP_COLORS[colorIdx];
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
            ))}

            {/* Sponsorship Benefits */}
            <div className="sec-head ctr" style={{ marginBottom: 40, marginTop: 32 }}>
              <span className="section-tag" style={{ color: "#F47B20" }}>Why Partner With Us</span>
              <h2 className="section-title">
                Sponsorship <em style={{ color: "#F47B20" }}>Benefits</em>
              </h2>
              <p className="section-desc" style={{ margin: "0 auto" }}>
                Partnering with ProSummits gives your brand access to a global audience
                of professionals, researchers, and decision-makers across 6+ conference themes.
              </p>
            </div>

            <div className="values-grid" style={{ marginBottom: 64 }}>
              {benefits.map((b, i) => (
                <div key={i} className="value-card"
                  style={{ borderColor: b.color + "33" }}
                  onMouseEnter={ev => ev.currentTarget.style.borderColor = b.color + "77"}
                  onMouseLeave={ev => ev.currentTarget.style.borderColor = b.color + "33"}
                >
                  <div className="value-icon"
                    style={{ background: b.color + "18", border: `1px solid ${b.color}44` }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Organizers */}
            <div className="sec-head ctr" style={{ marginBottom: 40 }}>
              <span className="section-tag" style={{ color: "#C4187A" }}>Organizers & Featured Partners</span>
              <h2 className="section-title">
                The Team & <em style={{ color: "#C4187A" }}>Partners Behind ProSummits</em>
              </h2>
              <p className="section-desc" style={{ margin: "0 auto" }}>
                Our events are co-organised and supported by a network of specialist institutions,
                research bodies, and advocacy organisations across the globe.
              </p>
            </div>

            <div className="org-grid" style={{ marginBottom: 48 }}>
              {organizers.map((o, i) => (
                <div
                  key={o._id || i}
                  className="org-card"
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
          </>
        )}

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/about" className="btn-g" style={{ marginRight: 14 }}>
            Become a Sponsor
          </Link>
          <Link to="/events" className="btn-o">
            View Events
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
