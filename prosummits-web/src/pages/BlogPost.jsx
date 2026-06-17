import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { client, urlFor } from "../lib/sanity";
import "../styles/BlogPost.css";

// Animated SVG Cell Division Simulator
function CellDivisionSimulator() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bp-cell-animation-container">
      <div className="bp-animation-box">
        <svg width="220" height="220" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="cellGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00FFEB" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#00A79D" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#020c15" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cellGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF00A0" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#7B2FBE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#020c15" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid representation */}
          <path d="M 0,100 L 200,100 M 100,0 L 100,200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5,5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(0,167,157,0.05)" strokeWidth="1" />

          <AnimatePresence mode="wait">
            {cycle === 0 && (
              // Phase 1: Pulsing Mother Cell
              <motion.circle
                key="phase0"
                cx="100"
                cy="100"
                r="45"
                fill="url(#cellGrad1)"
                filter="url(#glow)"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.9, 1.05, 0.9],
                  opacity: 1
                }}
                exit={{ scale: 1.1, opacity: 0.5 }}
                transition={{
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  opacity: { duration: 0.5 }
                }}
              />
            )}

            {cycle === 1 && (
              // Phase 2: Mitosis Elongation
              <motion.g key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Connecting membrane bridge */}
                <motion.path
                  d="M 70,100 Q 100,90 130,100 Q 100,110 70,100"
                  fill="url(#cellGrad1)"
                  filter="url(#glow)"
                  animate={{
                    d: [
                      "M 75,100 Q 100,85 125,100 Q 100,115 75,100",
                      "M 80,100 Q 100,98 120,100 Q 100,102 80,100",
                      "M 75,100 Q 100,85 125,100 Q 100,115 75,100"
                    ]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                {/* Left Nucleus */}
                <motion.circle
                  cx="75"
                  cy="100"
                  r="35"
                  fill="url(#cellGrad1)"
                  filter="url(#glow)"
                  animate={{ x: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
                {/* Right Nucleus */}
                <motion.circle
                  cx="125"
                  cy="100"
                  r="35"
                  fill="url(#cellGrad2)"
                  filter="url(#glow)"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />
              </motion.g>
            )}

            {cycle === 2 && (
              // Phase 3: Splitting / Separation
              <motion.g key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Left Daughter Cell floating away */}
                <motion.circle
                  cx="60"
                  cy="95"
                  r="32"
                  fill="url(#cellGrad1)"
                  filter="url(#glow)"
                  animate={{
                    x: [0, -15],
                    y: [0, -8],
                    scale: [0.9, 1]
                  }}
                  transition={{ duration: 3.5 }}
                />
                {/* Right Daughter Cell floating away */}
                <motion.circle
                  cx="140"
                  cy="105"
                  r="32"
                  fill="url(#cellGrad2)"
                  filter="url(#glow)"
                  animate={{
                    x: [0, 15],
                    y: [0, 8],
                    scale: [0.9, 1]
                  }}
                  transition={{ duration: 3.5 }}
                />
              </motion.g>
            )}

            {cycle === 3 && (
              // Phase 4: Two independent cells replicating further (fading out to reset)
              <motion.g key="phase3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <circle cx="45" cy="87" r="32" fill="url(#cellGrad1)" filter="url(#glow)" style={{ opacity: 0.85 }} />
                <circle cx="155" cy="113" r="32" fill="url(#cellGrad2)" filter="url(#glow)" style={{ opacity: 0.85 }} />

                {/* Minor replication bud circles starting */}
                <motion.circle
                  cx="45"
                  cy="87"
                  r="10"
                  fill="none"
                  stroke="#00FFEB"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle
                  cx="155"
                  cy="113"
                  r="10"
                  fill="none"
                  stroke="#FF00A0"
                  strokeWidth="1.5"
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div className="bp-cell-details">
        <div className="bp-cell-stat">
          <div className="bp-cell-stat-num">∞</div>
          <div className="bp-cell-stat-text">
            <strong>Immortal Division</strong>
            <br />
            Unlike somatic human cells, HeLa cells bypass cellular senescence entirely.
          </div>
        </div>
        <div className="bp-cell-stat">
          <div className="bp-cell-stat-num">24h</div>
          <div className="bp-cell-stat-text">
            <strong>Rapid Replication</strong>
            <br />
            Cells multiply at an unprecedented speed, creating ideal laboratory models.
          </div>
        </div>
        <div className="bp-cell-stat">
          <div className="bp-cell-stat-num">80+</div>
          <div className="bp-cell-stat-text">
            <strong>Chromosomes</strong>
            <br />
            Deep mutations give the cell line structural stability for ongoing experimentation.
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive Radioactive Decay & Half-Life Simulator for Marie Curie Post
function RadioactiveDecaySimulator() {
  const [element, setElement] = useState("radium"); // "radium" or "polonium"
  const [atoms, setAtoms] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [alphaParticles, setAlphaParticles] = useState([]);
  const [alphaCount, setAlphaCount] = useState(0);

  const halfLifeSeconds = element === "radium" ? 8 : 3;

  const initAtoms = () => {
    const arr = [];
    const count = 50;
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        x: 25 + Math.random() * 150,
        y: 40 + Math.random() * 120,
        isDecayed: false,
        flash: false,
      });
    }
    setAtoms(arr);
    setElapsedTime(0);
    setAlphaCount(0);
    setAlphaParticles([]);
    setIsRunning(false);
  };

  useEffect(() => {
    initAtoms();
  }, [element]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);

        const dt = 0.1;
        const hl = halfLifeSeconds;
        const decayProb = 1 - Math.pow(2, -dt / hl);

        setAtoms((prevAtoms) => {
          let updated = false;
          const newAlphaParticles = [];

          const nextAtoms = prevAtoms.map((atom) => {
            if (!atom.isDecayed && Math.random() < decayProb) {
              updated = true;
              const angle1 = Math.random() * Math.PI * 2;
              const angle2 = angle1 + Math.PI;

              newAlphaParticles.push({
                id: Math.random(),
                startX: atom.x,
                startY: atom.y,
                vx: Math.cos(angle1) * 3,
                vy: Math.sin(angle1) * 3,
                progress: 0,
              });

              newAlphaParticles.push({
                id: Math.random(),
                startX: atom.x,
                startY: atom.y,
                vx: Math.cos(angle2) * 3,
                vy: Math.sin(angle2) * 3,
                progress: 0,
              });

              return { ...atom, isDecayed: true, flash: true };
            }
            return atom;
          });

          if (updated) {
            setAlphaParticles((prev) => [...prev, ...newAlphaParticles]);
            setAlphaCount((prev) => prev + newAlphaParticles.length);
          }

          return nextAtoms;
        });

        setTimeout(() => {
          setAtoms((prevAtoms) =>
            prevAtoms.map((atom) => (atom.flash ? { ...atom, flash: false } : atom))
          );
        }, 300);

      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning, halfLifeSeconds]);

  useEffect(() => {
    let animationTimer;
    if (alphaParticles.length > 0) {
      animationTimer = setInterval(() => {
        setAlphaParticles((prev) =>
          prev
            .map((p) => ({ ...p, progress: p.progress + 0.1 }))
            .filter((p) => p.progress < 1)
        );
      }, 30);
    }
    return () => clearInterval(animationTimer);
  }, [alphaParticles]);

  const activeCount = atoms.filter((a) => !a.isDecayed).length;
  const decayedCount = atoms.length - activeCount;
  const percentRemaining = (activeCount / atoms.length) * 100;

  return (
    <div className="bp-cell-animation-container" style={{ margin: "48px 0" }}>
      <div className="bp-animation-box bp-decay-box" style={{ borderColor: element === "radium" ? "rgba(201,168,76,0.3)" : "rgba(107,255,179,0.3)" }}>
        <svg width="220" height="220" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="radiumGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#e8c97a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="poloniumGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#6bffb3" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00A79D" stopOpacity="0" />
            </radialGradient>
            <filter id="decayGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path d="M 0,100 L 200,100 M 100,0 L 100,200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5,5" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

          {atoms.map((atom) => {
            let fillColor = "rgba(255,255,255,0.15)";
            let glow = "none";

            if (!atom.isDecayed) {
              fillColor = element === "radium" ? "url(#radiumGrad)" : "url(#poloniumGrad)";
              glow = element === "radium" ? "drop-shadow(0 0 4px rgba(201,168,76,0.6))" : "drop-shadow(0 0 4px rgba(107,255,179,0.6))";
            } else if (atom.flash) {
              fillColor = "#fff";
              glow = "drop-shadow(0 0 8px #fff)";
            }

            return (
              <circle
                key={atom.id}
                cx={atom.x}
                cy={atom.y}
                r={atom.flash ? 5.5 : (atom.isDecayed ? 2.5 : 4)}
                fill={fillColor}
                style={{
                  transition: "r 0.2s, fill 0.3s",
                  filter: glow,
                }}
              />
            );
          })}

          {alphaParticles.map((p) => {
            const curX = p.startX + p.vx * p.progress * 10;
            const curY = p.startY + p.vy * p.progress * 10;
            const particleColor = element === "radium" ? "#c9a84c" : "#6bffb3";

            return (
              <g key={p.id}>
                <line
                  x1={p.startX}
                  y1={p.startY}
                  x2={curX}
                  y2={curY}
                  stroke={particleColor}
                  strokeWidth="1.5"
                  opacity={1 - p.progress}
                  strokeDasharray="2,2"
                />
                <circle
                  cx={curX}
                  cy={curY}
                  r="2"
                  fill="#fff"
                  style={{
                    filter: "drop-shadow(0 0 4px " + particleColor + ")",
                    opacity: 1 - p.progress,
                  }}
                />
              </g>
            );
          })}
        </svg>

        <div style={{
          position: "absolute",
          top: "12px",
          left: "16px",
          fontSize: "0.6rem",
          fontWeight: "700",
          letterSpacing: "0.15em",
          color: element === "radium" ? "#c9a84c" : "#6bffb3",
          opacity: 0.8
        }}>
          {element === "radium" ? "RADIUM-226 DECAY SIMULATOR" : "POLONIUM-210 DECAY SIMULATOR"}
        </div>
      </div>

      <div className="bp-cell-details">
        <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
          <button
            onClick={() => setElement("radium")}
            style={{
              flex: 1,
              background: element === "radium" ? "rgba(201, 168, 76, 0.15)" : "transparent",
              border: "1px solid " + (element === "radium" ? "#c9a84c" : "rgba(255,255,255,0.1)"),
              color: element === "radium" ? "#c9a84c" : "rgba(255,255,255,0.45)",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Radium-226 (T½ = 1600y)
          </button>
          <button
            onClick={() => setElement("polonium")}
            style={{
              flex: 1,
              background: element === "polonium" ? "rgba(107, 255, 179, 0.12)" : "transparent",
              border: "1px solid " + (element === "polonium" ? "#6bffb3" : "rgba(255,255,255,0.1)"),
              color: element === "polonium" ? "#6bffb3" : "rgba(255,255,255,0.45)",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Polonium-210 (T½ = 138d)
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              flex: 2,
              background: isRunning ? "rgba(239, 68, 68, 0.12)" : "rgba(255,255,255,0.03)",
              border: "1px solid " + (isRunning ? "#ef4444" : "rgba(255,255,255,0.15)"),
              color: isRunning ? "#ef4444" : "#fff",
              padding: "12px 18px",
              borderRadius: "10px",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {isRunning ? "Pause Simulation" : "Start Radioactive Decay"}
          </button>
          <button
            onClick={initAtoms}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              padding: "12px 18px",
              borderRadius: "10px",
              fontSize: "0.75rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Reset
          </button>
        </div>

        <div className="bp-cell-stat" style={{ padding: "16px 20px" }}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Active Radionuclides</span>
              <span style={{ fontSize: "0.75rem", color: element === "radium" ? "#c9a84c" : "#6bffb3", fontWeight: "700" }}>
                {activeCount} / {atoms.length} ({Math.round(percentRemaining)}%)
              </span>
            </div>

            <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${percentRemaining}%`,
                  background: element === "radium" ? "#c9a84c" : "#6bffb3",
                  boxShadow: `0 0 10px ` + (element === "radium" ? "#c9a84c" : "#6bffb3"),
                  transition: "width 0.15s ease",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}>
              <div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emissions Recorded</div>
                <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: "600", marginTop: "2px" }}>
                  {alphaCount} α-particles
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Stable Lead Created</div>
                <div style={{ fontSize: "0.85rem", color: "#fff", fontWeight: "600", marginTop: "2px" }}>
                  {decayedCount} Lead atoms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog Post Component
export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    client
      .fetch(`*[_type == "post" && (slug.current == $id || _id == $id)][0]`, { id })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="bp-page">
        <div className="bp-bg-orb bp-bg-orb-1" />
        <div style={{ textAlign: "center", padding: "120px 5vw", minHeight: "65vh" }}>
          <div className="bp-animation-box" style={{ width: "60px", height: "60px", margin: "0 auto 20px auto", border: "2px solid #c9a84c", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <p style={{ color: "rgba(255,255,255,.5)" }}>Loading story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bp-page">
        <div className="bp-bg-orb bp-bg-orb-1" />
        <div style={{ textAlign: "center", padding: "120px 5vw", minHeight: "60vh" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "2rem", marginBottom: "20px" }}>Article Not Found</h2>
          <p style={{ color: "rgba(255,255,255,.5)", marginBottom: "30px" }}>The requested blog post could not be retrieved.</p>
          <Link to="/blog" className="btn-bp-back">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const coverImg = post.image ? urlFor(post.image).url() : post.legacyImageUrl;

  return (
    <div className="bp-page page-fade">
      {/* Decorative Orbs for premium visual layout */}
      <div className="bp-bg-orb bp-bg-orb-1" />
      <div className="bp-bg-orb bp-bg-orb-2" />
      <div className="bp-bg-orb bp-bg-orb-3" />

      {/* Hero Cover Header */}
      <header className="bp-hero">
        <img src={coverImg} alt={post.title} className="bp-hero-img" />
        <div className="bp-hero-overlay" />

        <div className="bp-hero-container">
          <Link to="/blog" className="bp-hero-back">← Back to Insights</Link>
          <div className="bp-badge" style={{ color: post.color || "#00A79D" }}>
            {post.category}
          </div>
          <h1 className="bp-title">{post.title}</h1>
          <div className="bp-meta">
            <span className="bp-meta-item">📅 {post.date}</span>
            <span className="bp-meta-item">🕒 5 Min Read</span>
            <span className="bp-meta-item">✍️ Vishnu Vamsi Varma (VVV)</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="bp-content-wrapper">
        <article className="bp-article">

          {/* Top level introduction paragraphs */}
          {post.introParagraphs?.map((para, idx) => (
            <p
              key={idx}
              style={idx === 0 ? { fontSize: '1.2rem', lineHeight: '1.8', color: '#fff', marginBottom: '36px', opacity: 0.95 } : {}}
            >
              {para}
            </p>
          ))}

          {/* Golden Divider */}
          {post.showGoldDivider && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '4rem 0', position: 'relative', zIndex: 1 }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#c9a84c', boxShadow: '0 0 12px rgba(201, 168, 76, 0.7)' }}></div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }}></div>
            </div>
          )}

          {/* Modular Narrative Sections */}
          {post.sections?.map((section, secIdx) => {
            const cardImg = section.floatingCard?.image
              ? urlFor(section.floatingCard.image).url()
              : section.floatingCard?.legacyImageUrl;

            return (
              <div key={section._key || secIdx} style={{ marginBottom: '40px' }}>
                {section.heading && <h2>{section.heading}</h2>}

                {/* Floating Side Card if present */}
                {cardImg && (
                  <div className="bp-article-float-card">
                    <img
                      src={cardImg}
                      alt={section.floatingCard?.caption || "Portrait"}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '350px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                      }}
                    />
                    {section.floatingCard?.caption && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        maxWidth: '320px',
                        lineHeight: '1.4'
                      }}>
                        {section.floatingCard.caption}
                      </div>
                    )}
                  </div>
                )}

                {/* Story Prose Paragraphs */}
                {section.paragraphs?.map((para, paraIdx) => (
                  <p key={paraIdx}>{para}</p>
                ))}

                {/* Mitosis Cell Division Widget */}
                {section.showMitosisSimulator && <CellDivisionSimulator />}

                {/* Radioactive Decay half life Widget */}
                {section.showDecaySimulator && <RadioactiveDecaySimulator />}

                {/* Comparison Matrix Table if present */}
                {section.compareTable && (
                  <div className="bp-table-container">
                    <table className="bp-compare-table">
                      {section.compareTable.headers && (
                        <thead>
                          <tr>
                            {section.compareTable.headers.map((h, hIdx) => (
                              <th key={hIdx}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      {section.compareTable.rows && (
                        <tbody>
                          {section.compareTable.rows.map((row, rIdx) => (
                            <tr key={row._key || rIdx}>
                              <td>{row.label}</td>
                              <td>{row.col1}</td>
                              <td>{row.col2}</td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                )}

                {/* Milestone Timeline widget if present */}
                {section.timeline && (
                  <div className="bp-timeline-container">
                    {section.timeline.title && (
                      <h3 style={{ margin: "0 0 24px 0", color: post.color || "#00A79D" }}>
                        {section.timeline.title}
                      </h3>
                    )}
                    <div className="bp-timeline-flow">
                      {section.timeline.milestones?.map((m, mIdx) => {
                        const dotColor = m.colorTheme === 'green' ? '#6bffb3' : '#c9a84c';
                        const dotGlow = m.colorTheme === 'green' ? 'rgba(107, 255, 179, 0.5)' : 'rgba(201, 168, 76, 0.5)';
                        return (
                          <div key={m._key || mIdx} className="bp-timeline-milestone">
                            <div
                              className="bp-timeline-dot"
                              style={{ borderColor: dotColor, boxShadow: `0 0 10px ${dotGlow}` }}
                            />
                            <div className="bp-timeline-content">
                              <div className="bp-timeline-year" style={{ color: dotColor }}>
                                {m.year}
                              </div>
                              <div className="bp-timeline-title">{m.title}</div>
                              <div className="bp-timeline-desc">{m.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dynamic Inner Highlight Card if present */}
                {section.infoBox && (
                  <div className="bp-glass-card" style={{
                    borderColor: section.infoBox.colorTheme === 'green' ? 'rgba(107, 255, 179, 0.2)' : 'rgba(201, 168, 76, 0.2)',
                    borderTop: `2px solid ${section.infoBox.colorTheme === 'green' ? '#6bffb3' : '#c9a84c'}`
                  }}>
                    {section.infoBox.badge && (
                      <span style={{
                        fontFamily: 'var(--fb)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: section.infoBox.colorTheme === 'green' ? '#6bffb3' : '#c9a84c',
                        display: 'block',
                        marginBottom: '10px'
                      }}>
                        {section.infoBox.badge}
                      </span>
                    )}
                    {section.infoBox.title && <h3 style={{ marginTop: 0 }}>{section.infoBox.title}</h3>}
                    {section.infoBox.text && (
                      <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                        {section.infoBox.text}
                      </p>
                    )}
                  </div>
                )}

                {/* Stylized Pull Quote if present */}
                {section.pullQuote && (
                  <div className="bp-glass-card" style={{
                    padding: '24px 32px',
                    borderLeft: `3px solid ${post.color || '#c9a84c'}`,
                    background: `linear-gradient(to right, ${post.color || '#c9a84c'}14, transparent)`
                  }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.25rem', color: '#fff', marginBottom: '8px', lineHeight: '1.6' }}>
                      "{section.pullQuote.text}"
                    </p>
                    {section.pullQuote.citation && (
                      <cite style={{
                        fontFamily: 'var(--fb)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: post.color || '#c9a84c',
                        fontStyle: 'normal'
                      }}>
                        {section.pullQuote.citation}
                      </cite>
                    )}
                  </div>
                )}

                {/* Stylized Bioethics Card if present */}
                {section.bioethicsCard && (
                  <div className="bp-bioethics-card" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                    <div className="bp-bioethics-title" style={{ color: post.color || '#c9a84c' }}>
                      <span>⚖️</span> {section.bioethicsCard.title}
                    </div>
                    <div className="bp-bioethics-quote" style={{ borderLeft: `3px solid ${post.color || '#c9a84c'}` }}>
                      "{section.bioethicsCard.quote}"
                    </div>
                    {section.bioethicsCard.meta && (
                      <div className="bp-bioethics-meta" style={{ color: post.color || '#c9a84c' }}>
                        {section.bioethicsCard.meta}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        </article>

        {/* Navigation Action */}
        <div className="bp-actions">
          <Link to="/blog" className="btn-bp-back">
            ← Back to All Articles
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
