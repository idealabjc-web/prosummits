import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Footer from "../components/Footer";
import { client } from "../lib/sanity";
import "../styles/Register.css";

const PACKAGES = [
  { id: "speaker",        name: "Speaker Registration",                   price: 799  },
  { id: "speaker-2night", name: "Speaker Registration + 2 Nights Stay",   price: 1099 },
  { id: "speaker-3night", name: "Speaker Registration + 3 Nights Stay",   price: 1299 },
  { id: "exhibitor",      name: "Exhibitor Registration",                 price: 1999 },
  { id: "virtual",        name: "Virtual Speaker Registration",           price: 399  },
  { id: "delegate",       name: "Delegate Registration",                  price: 399  },
  { id: "av",             name: "Audio - Video Presentation",             price: 199  },
];

export default function RegisterPage() {
  const [params] = useSearchParams();
  const preEvent = params.get("event") || "";

  const [events, setEvents] = useState([]);
  const [eventYears, setEventYears] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", countryCode: "+1",
    country: "", organization: "", jobTitle: "",
    yearId: "", eventId: preEvent, package: "", specialRequirements: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    emailjs.init("8Ka9LvGqor29zIVHa");

    Promise.all([
      client.fetch(`*[_type == "event"]{..., eventYear->} | order(date asc)`),
      client.fetch(`*[_type == "eventYear"] | order(year asc)`),
    ]).then(([evData, yrData]) => {
      setEvents(evData);
      setEventYears(yrData);
      // If pre-selected event, auto-set the year
      if (preEvent) {
        const ev = evData.find((e) => e._id === preEvent);
        if (ev?.eventYear?._id) {
          setForm((f) => ({ ...f, yearId: ev.eventYear._id }));
        }
      }
    }).catch(console.error);
  }, [preEvent]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const [regId, setRegId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.yearId || !form.eventId || !form.package) {
      alert("Please ensure you have selected a Conference Year, Event, and Package.");
      return;
    }

    setIsSubmitting(true);

    const newRegId = `PS-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setRegId(newRegId);

    const templateParams = {
      to_name: "ProSummits Team",
      to_email: "prosummitsvirtual@gmail.com",
      reply_to: form.email,
      from_name: `${form.firstName} ${form.lastName}`,
      user_email: form.email,
      event_title: selectedEvent?.title || "Conference",
      package_name: selectedPkg?.name || "N/A",
      price: selectedPkg?.price || "0",
      phone: `${form.countryCode} ${form.phone}`,
      country: form.country,
      organization: form.organization || "Not Specified",
      job_title: form.jobTitle || "Not Specified",
      requirements: form.specialRequirements || "None",
      reg_id: newRegId
    };

    try {
      await emailjs.send(
        'service_on0qng6', 
        'template_mxjq749', 
        templateParams, 
        { publicKey: '8Ka9LvGqor29zIVHa' }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Full EmailJS Error:", err.text || err);
      alert("There was an error sending your registration. Please check your browser console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPkg = PACKAGES.find((p) => p.id === form.package);
  const selectedEvent = events.find((e) => e._id === form.eventId);

  if (submitted) {
    return (
      <div className="page-fade">
        <div className="reg-page">
          <div className="reg-success">
            <div className="reg-success-icon">✓</div>
            <h2>Registration Submitted!</h2>
            <p className="reg-success-id">Confirmation ID: <strong>{regId}</strong></p>
            <p>
              Thank you, <strong>{form.firstName}</strong>. Your{" "}
              <strong>{selectedPkg?.name}</strong> for{" "}
              <strong>{selectedEvent?.title}</strong> has been received.
              We'll send a confirmation to <strong>{form.email}</strong> shortly.
            </p>
            <Link to="/events" className="reg-back-link">← Back to Events</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-fade">
      <div className="reg-page">

        {/* Hero */}
        <div className="reg-hero">
          <span className="reg-hero-tag">Registration</span>
          <h1 className="reg-hero-title">Register for a Conference</h1>
          <p className="reg-hero-sub">
            Choose your event, select a package, and fill in your details.
          </p>
        </div>

        {/* Form */}
        <form className="reg-card" onSubmit={handleSubmit}>

          {/* ─── Personal Information ─── */}
          <div className="reg-divider"><span>Personal Information</span></div>

          <div className="reg-row">
            <div className="reg-field">
              <label>First Name *</label>
              <input name="firstName" type="text" required
                value={form.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div className="reg-field">
              <label>Last Name *</label>
              <input name="lastName" type="text" required
                value={form.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>

          <div className="reg-row">
            <div className="reg-field">
              <label>Email *</label>
              <input name="email" type="email" required
                value={form.email} onChange={handleChange} placeholder="jane@example.com" />
            </div>
            <div className="reg-field phone-group">
              <label>Phone *</label>
              <div className="reg-phone-wrap">
                <select name="countryCode" value={form.countryCode} onChange={handleChange} className="reg-code-select">
                  <option value="+1">+1 US</option>
                  <option value="+44">+44 UK</option>
                  <option value="+91">+91 IN</option>
                  <option value="+49">+49 DE</option>
                  <option value="+33">+33 FR</option>
                  <option value="+61">+61 AU</option>
                  <option value="+81">+81 JP</option>
                  <option value="+86">+86 CN</option>
                  <option value="+971">+971 UAE</option>
                  <option value="+65">+65 SG</option>
                </select>
                <input name="phone" type="tel" required
                  value={form.phone} onChange={handleChange} placeholder="Phone number" />
              </div>
            </div>
          </div>

          <div className="reg-row">
            <div className="reg-field">
              <label>Country *</label>
              <input name="country" type="text" required
                value={form.country} onChange={handleChange} placeholder="United States" />
            </div>
            <div className="reg-field">
              <label>Organization</label>
              <input name="organization" type="text"
                value={form.organization} onChange={handleChange} placeholder="Company / University" />
            </div>
          </div>

          <div className="reg-row single">
            <div className="reg-field">
              <label>Job Title / Role</label>
              <input name="jobTitle" type="text"
                value={form.jobTitle} onChange={handleChange} placeholder="Professor, CEO, Researcher..." />
            </div>
          </div>

          {/* ─── Conference Selection ─── */}
          <div className="reg-divider"><span>Conference Selection</span></div>

          <div className="reg-row">
            <div className="reg-field">
              <label>Conference Year *</label>
              <select name="yearId" required value={form.yearId}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, yearId: e.target.value, eventId: "" }));
                }}>
                <option value="">— Select conference year —</option>
                {eventYears.map((yr) => (
                  <option key={yr._id} value={yr._id}>
                    {yr.year} Conference Series
                  </option>
                ))}
              </select>
            </div>
            <div className="reg-field">
              <label>Select Event *</label>
              <select name="eventId" required value={form.eventId} onChange={handleChange}
                disabled={!form.yearId}>
                <option value="">{form.yearId ? "— Choose an event —" : "— Select year first —"}</option>
                {events
                  .filter((ev) => ev.eventYear?._id === form.yearId)
                  .map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} {ev.date ? `(${ev.date})` : ""}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="reg-row">
            <div className="reg-field">
              <label>Registration Package *</label>
              <select name="package" required value={form.package} onChange={handleChange}>
                <option value="">— Select a package —</option>
                {PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} — ${pkg.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="reg-row single">
            <div className="reg-field full">
              <label>Special Requirements / Paper Title</label>
              <textarea name="specialRequirements" rows="3"
                value={form.specialRequirements} onChange={handleChange}
                placeholder="Any additional details, paper title, accessibility needs..." />
            </div>
          </div>

          {/* ─── Summary ─── */}
          {(selectedPkg || selectedEvent) && (
            <div className="reg-summary">
              <div className="reg-summary-details">
                {selectedEvent && <span className="reg-summary-event">{selectedEvent.title}</span>}
                {selectedPkg && <span className="reg-summary-pkg">{selectedPkg.name}</span>}
              </div>
              {selectedPkg && (
                <span className="reg-summary-price">${selectedPkg.price.toLocaleString()}</span>
              )}
            </div>
          )}

          <button type="submit" className="reg-continue-btn" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Register Now →"}
          </button>

          <p className="reg-disclaimer">
            By registering you agree to our terms &amp; conditions. A confirmation email will be sent to your address.
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
}
