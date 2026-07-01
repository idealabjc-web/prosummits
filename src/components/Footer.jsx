import { Link, useLocation } from "react-router-dom";
import { SPONSORS } from "../data/constants";
import "../styles/Footer.css";
import "../styles/Sponsors.css";
import logo from "../assets/PROSUMMITS Logo..png";


/**
 * Footer
 * Site-wide footer with brand description, quick links, support links,
 * contact info, and social icons.
 */
export default function Footer() {
  const { pathname } = useLocation();
  const showSponsors = pathname === "/" || pathname === "/sponsors";

  const socials = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/pro-summits-hybrid-events/",
      color: "#0077B5",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: "Twitter",
      url: "https://x.com/prosummits",
      color: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/prosummits",
      color: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/prosummits/",
      color: "#E4405F",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    }
  ];

  return (
    <footer>
      {/* {showSponsors && (
        <div className="ft-sponsors">
          <div className="ft-sponsors-inner">
            {SPONSORS.slice(0, 8).map((s, i) => (
              <div key={s.name} className="ft-sp-item">
                <img src={s.src} alt={s.name} className="sp-img" style={{ height: '28px', opacity: 0.6 }} />
              </div>
            ))}
          </div>
        </div>
      )} */}
      <div className="ft-top">
        {/* Brand column */}
        <div>
          <Link to="/" className="logo">
            <div className="logo-wrapper">
              <img src={logo} alt="ProSummits logo" />
            </div>
            {/* <span className="logo-text">ProSummits</span> */}
          </Link>
          <p className="ft-brand-desc">
            Speaker rules meets modern, elegant online conference platforms. Celebrating
            milestones in Women's Rights, Mental Health, Cancer Research, AI,
            Entrepreneurship, and Autism &amp; Behavioural Sciences — worldwide.
          </p>
        </div>

        {/* Company links */}
        <div>
          <div className="ft-h" style={{ color: "#F47B20" }}>Company</div>
          <ul className="ft-list">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/sponsors">Sponsors</Link></li>
            <li><Link to="/speakers">Speakers</Link></li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <div className="ft-h" style={{ color: "#6DBE45" }}>Support</div>
          <ul className="ft-list">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/policies">Refund &amp; Policy</Link></li>
            <li><Link to="/events">Upcoming Events</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <div className="ft-h" style={{ color: "#7B2FBE" }}>Contact</div>
          <ul className="ft-list">
            <li><a href="#">BLVD Heights, Dubai Opera District, Dubai, UAE</a></li>
            {/* <li><a href="#">Dubai, UAE</a></li> */}
            <li><a href="mailto:contact@prosummits.org">contact@prosummits.org</a></li>
            <li><a href="tel:+17162171471">+1 (716) 217-1471</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom">
        <div className="ft-copy">© 2026 Prosummits. All rights reserved.</div>
        <div className="ft-soc">
          {socials.map((soc) => (
            <a
              key={soc.name}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="soc-a"
              aria-label={soc.name}
              onMouseEnter={ev => {
                ev.currentTarget.style.borderColor = soc.color;
                ev.currentTarget.style.color = soc.color;
                ev.currentTarget.style.background = `${soc.color}10`;
              }}
              onMouseLeave={ev => {
                ev.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                ev.currentTarget.style.color = "rgba(255,255,255,.45)";
                ev.currentTarget.style.background = "transparent";
              }}
            >
              {soc.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}