import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/PROSUMMITS Logo..png";
import "../styles/Navbar.css";

/**
 * Navbar
 * Fixed top navigation with a "Resources" dropdown grouping Blog, Magazines, and Sponsors.
 */
export default function Navbar() {
  const [mob, setMob] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMob(false);
  }, [location.pathname]);

  const mainLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Magazines", href: "https://www.winspire.live/", external: true },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "Speakers", href: "/speakers" },
    { label: "Blog", href: "/blog" },
    { label: "Sponsors", href: "/sponsors" },
  ];

  return (
    <>
      <nav className="nav">
        <Link to="/" className="logo">
          <div className="logo-wrapper">
            <img src={logo} alt="ProSummits logo" />
          </div>
          {/* <span className="logo-text">ProSummits</span> */}
        </Link>

        <ul className="nav-links">
          {mainLinks.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link to={link.href}>{link.label}</Link>
              )}
            </li>
          ))}

          {/* Dropdown Menu */}
          <li className="nav-item-dropdown">
            <span>MORE<small style={{ fontSize: '0.6rem', marginLeft: 4 }}>▼</small></span>
            <div className="dropdown-menu">
              {resourceLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.href}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </li>

          <li>
            <Link to="/register" className="nav-btn-gold">REGISTER NOW</Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="burger"
          onClick={() => setMob(!mob)}
          aria-label="Toggle menu"
        >
          <span style={mob ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
          <span style={mob ? { opacity: 0 } : {}} />
          <span style={mob ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
        </button>
      </nav>

      {/* Mobile nav */}
      <div className={`mob-nav${mob ? " open" : ""}`}>
        {mainLinks.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.label} to={link.href}>
              {link.label}
            </Link>
          )
        )}

        <div style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--grey)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Resources</span>
          <div className="mob-dropdown">
            {resourceLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        <Link
          to="/register"
          className="nav-btn-gold"
          style={{ marginTop: 20, textAlign: 'center' }}
        >
          REGISTER NOW
        </Link>
      </div>
    </>
  );
}