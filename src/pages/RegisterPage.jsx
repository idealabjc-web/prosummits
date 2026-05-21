import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Footer from "../components/Footer";
import { client } from "../lib/sanity";
import "../styles/Register.css";

const PHYSICAL_PACKAGES = [
  {
    id: "speaker",
    name: "Speaker Registration",
    originalPrice: 799,
    price: 799,
    popular: false,
    icon: "🎙️",
    features: [
      "Dedicated presentation slot at the conference",
      "Access to all physical sessions and networking",
      "Certificate of presentation and conference kit",
      "Lunch and refreshments during the event"
    ]
  },
  {
    id: "speaker-2night",
    name: "Speaker Registration plus 2 Nights Stay Addon",
    originalPrice: 1099,
    price: 1099,
    popular: true,
    icon: "🏨",
    features: [
      "Everything in Speaker Registration",
      "4-Star / 5-Star Hotel Accommodation (2 Nights)",
      "Complimentary breakfast & transfers suggestions",
      "Access to exclusive Speaker VIP networking dinner"
    ]
  },
  {
    id: "speaker-3night",
    name: "Speaker Registration plus 3 Nights Stay Addon",
    originalPrice: 1299,
    price: 1299,
    popular: false,
    icon: "🏢",
    features: [
      "Everything in Speaker Registration",
      "4-Star / 5-Star Hotel Accommodation (3 Nights)",
      "Complimentary breakfast & transfers suggestions",
      "Access to exclusive Speaker VIP networking dinner"
    ]
  },
  {
    id: "exhibitor",
    name: "Exhibitor Registration",
    originalPrice: 1999,
    price: 1999,
    popular: false,
    icon: "🎪",
    features: [
      "Standard presentation slot + Exhibitor Booth space",
      "Logo and company profile featured on conference media",
      "2 representative passes included",
      "Access to sponsor VIP networking sessions"
    ]
  },
  {
    id: "delegate",
    name: "Delegate Registration",
    originalPrice: 399,
    price: 399,
    popular: false,
    icon: "🎫",
    features: [
      "Attendee pass for all physical keynotes and panels",
      "Full networking access and conference handbook",
      "Lunch and refreshments included"
    ]
  }
];

const VIRTUAL_PACKAGES = [
  {
    id: "virtual",
    name: "Virtual Speaker Registration",
    originalPrice: 399,
    price: 399,
    popular: true,
    icon: "💻",
    features: [
      "15-minute presentation slot via Zoom / Airmeet",
      "Live Q&A session with global delegates",
      "Electronic certificate of presentation & abstract publication",
      "Full virtual access to all conference sessions"
    ]
  },
  {
    id: "av",
    name: "Audio - Video Presentation",
    originalPrice: 199,
    price: 199,
    popular: false,
    icon: "🎥",
    features: [
      "Pre-recorded presentation broadcasted at the venue",
      "Presentation file hosted on official conference portal",
      "Electronic certificate of presentation & abstract publication"
    ]
  }
];

const VALID_COUPONS = {
  "NAVA20": { type: "percent", value: 20, description: "20% Discount" },
  "REDDY100": { type: "amount", value: 100, description: "100% Discount" },
  "KUMAR50": { type: "amount", value: 50, description: "$50 Discount" },
};

export default function RegisterPage() {
  const [params] = useSearchParams();
  const preEvent = params.get("event") || "";

  const [step, setStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [eventYears, setEventYears] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState("");

  // Step 1: Personal & Conference State
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    country: "",
    organization: "",
    jobTitle: "",
    yearId: "",
    eventId: preEvent,
    package: "",
    specialRequirements: "",
  });

  // Step 2: Package selection states
  const [participationType, setParticipationType] = useState(""); // "" or "physical" or "virtual"
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    emailjs.init("8Ka9LvGqor29zIVHa");

    Promise.all([
      client.fetch(`*[_type == "event"]{..., eventYear->} | order(date asc)`),
      client.fetch(`*[_type == "eventYear"]{..., events[]->} | order(year asc)`),
    ]).then(([evData, yrData]) => {
      setEvents(evData);
      setEventYears(yrData);

      // Auto-set the year if pre-selected event is found
      if (preEvent) {
        let matchedYearId = "";
        let actualEventId = preEvent;
        const ev = evData.find((e) => e._id === preEvent || e.slug?.current === preEvent);
        if (ev) {
          actualEventId = ev._id;
          if (ev.eventYear?._id) {
            matchedYearId = ev.eventYear._id;
          }
        }
        
        if (!matchedYearId) {
          // Look in manual events arrays
          const yr = yrData.find((y) => y.events?.some((e) => {
            if (e._id === preEvent || e.slug?.current === preEvent) {
              actualEventId = e._id;
              return true;
            }
            return false;
          }));
          if (yr) {
            matchedYearId = yr._id;
          }
        }
        if (matchedYearId) {
          setForm((f) => ({ ...f, yearId: matchedYearId, eventId: actualEventId }));
        }
      }
    }).catch(console.error);
  }, [preEvent]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleParticipationChange = (type) => {
    setParticipationType(type);
    setForm((prev) => ({
      ...prev,
      package: ""
    }));
  };

  // Get merged events list (both referencing + manual events array)
  const getFilteredEvents = () => {
    if (!form.yearId) return [];
    const selectedYearDoc = eventYears.find((y) => y._id === form.yearId);
    const linkedEvents = events.filter((ev) => ev.eventYear?._id === form.yearId);
    const manualEvents = selectedYearDoc?.events || [];

    const merged = [...linkedEvents];
    manualEvents.forEach((me) => {
      if (!merged.find((e) => e._id === me._id)) {
        merged.push(me);
      }
    });

    return merged;
  };

  const filteredEventsForYear = getFilteredEvents();
  const selectedEvent = filteredEventsForYear.find((e) => e._id === form.eventId);

  const packagesList = participationType === "physical" ? PHYSICAL_PACKAGES : VIRTUAL_PACKAGES;
  const selectedPkg = packagesList.find((p) => p.id === form.package);

  // Financial Calculations
  const subtotal = selectedPkg ? selectedPkg.price : 0;
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === "percent") {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "amount") {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }
  const finalPrice = Math.max(0, subtotal - discountAmount);

  // Coupon Handlers
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) return;

    if (VALID_COUPONS[trimmed]) {
      setAppliedCoupon({
        code: trimmed,
        ...VALID_COUPONS[trimmed]
      });
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code.");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  // Step Transitions & Validations
  const handleNextStep1 = () => {
    if (!form.firstName.trim()) return alert("First Name is required.");
    if (!form.lastName.trim()) return alert("Last Name is required.");
    if (!form.email.trim()) return alert("Email Address is required.");
    if (!form.phone.trim()) return alert("Phone Number is required.");
    if (!form.country.trim()) return alert("Country is required.");
    if (!form.yearId) return alert("Please select a Conference Year.");
    if (!form.eventId) return alert("Please select an Event.");

    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleNextStep2 = () => {
    if (!participationType) return alert("Please select a Participation Type.");
    if (!form.package) return alert("Please choose a registration package.");
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  // Final Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      participation_type: participationType === "physical" ? "Physical Event" : "Virtual Event",
      price: subtotal.toString(),
      discount: discountAmount.toFixed(2),
      coupon_code: appliedCoupon ? appliedCoupon.code : "None",
      final_price: finalPrice.toFixed(2),
      phone: `${form.countryCode} ${form.phone}`,
      country: form.country,
      organization: form.organization || "Not Specified",
      job_title: form.jobTitle || "Not Specified",
      requirements: form.specialRequirements || "None",
      reg_id: newRegId
    };

    try {
      // 1. Send Email via EmailJS
      await emailjs.send(
        'service_on0qng6',
        'template_mxjq749',
        templateParams,
        { publicKey: '8Ka9LvGqor29zIVHa' }
      );

      // 2. Save to Google Sheets
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || "";
      if (GOOGLE_SCRIPT_URL) {
        const formData = new FormData();
        formData.append("timestamp", new Date().toISOString());
        Object.keys(templateParams).forEach(key => {
          formData.append(key, templateParams[key]);
        });

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          body: formData,
          mode: "no-cors"
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Full Registration Error:", err.text || err);
      alert("There was an error sending your registration. Please check your browser console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <strong>{selectedPkg?.name}</strong> ({participationType === "physical" ? "Physical" : "Virtual"}) for{" "}
              <strong>{selectedEvent?.title}</strong> has been received.
              We'll send a confirmation email to <strong>{form.email}</strong> shortly.
            </p>
            {finalPrice > 0 && (
              <p style={{ marginTop: -20, opacity: 0.9, fontSize: '1.1rem' }}>
                Total Registration Fee: <strong style={{ color: '#F9C515' }}>${finalPrice.toFixed(2)}</strong>
              </p>
            )}
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
            Join world-class experts. Select your event, choose a package, and fill in your details.
          </p>
        </div>

        {/* Wizard Steps Progress Indicator */}
        <div className="reg-steps-wizard">
          <div className={`wizard-step ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
            <div className="wizard-circle">{step > 1 ? "✓" : "1"}</div>
            <span className="wizard-label">Personal &amp; Conference</span>
          </div>
          <div className={`wizard-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`wizard-step ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
            <div className="wizard-circle">{step > 2 ? "✓" : "2"}</div>
            <span className="wizard-label">Package Selection</span>
          </div>
          <div className={`wizard-line ${step >= 3 ? 'active' : ''}`} />
          <div className={`wizard-step ${step === 3 ? 'active' : ''}`}>
            <div className="wizard-circle">3</div>
            <span className="wizard-label">Confirm &amp; Pay</span>
          </div>
        </div>

        {/* Multi-step Form Container */}
        <div className="reg-card">
          {/* STEP 1: Personal & Conference */}
          {step === 1 && (
            <div className="step-content page-fade-in">
              <div className="reg-divider" style={{ marginTop: 0 }}>
                <span>Personal Information</span>
              </div>

              <div className="reg-row">
                <div className="reg-field">
                  <label>First Name *</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>
                <div className="reg-field">
                  <label>Last Name *</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="reg-row">
                <div className="reg-field">
                  <label>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="reg-field phone-group">
                  <label>Phone Number *</label>
                  <div className="reg-phone-wrap">
                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      className="reg-code-select"
                    >
                      <option value="+1">+1 US</option>
                      <option value="+44">+44 UK</option>
                      <option value="+91">+91 IN</option>
                      <option value="+971">+971 UAE</option>
                      <option value="+49">+49 DE</option>
                      <option value="+33">+33 FR</option>
                      <option value="+61">+61 AU</option>
                      <option value="+81">+81 JP</option>
                      <option value="+65">+65 SG</option>
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="reg-row">
                <div className="reg-field">
                  <label>Country *</label>
                  <input
                    name="country"
                    type="text"
                    required
                    value={form.country}
                    onChange={handleChange}
                    placeholder="United States"
                  />
                </div>
                <div className="reg-field">
                  <label>Organization / Institution</label>
                  <input
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Company / University"
                  />
                </div>
              </div>

              <div className="reg-row single">
                <div className="reg-field">
                  <label>Job Title / Professional Role</label>
                  <input
                    name="jobTitle"
                    type="text"
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="Professor, CEO, Researcher..."
                  />
                </div>
              </div>

              <div className="reg-divider">
                <span>Conference Selection</span>
              </div>

              <div className="reg-row">
                <div className="reg-field">
                  <label>Conference Year *</label>
                  <select
                    name="yearId"
                    required
                    value={form.yearId}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, yearId: e.target.value, eventId: "" }));
                    }}
                  >
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
                  <select
                    name="eventId"
                    required
                    value={form.eventId}
                    onChange={handleChange}
                    disabled={!form.yearId}
                  >
                    <option value="">
                      {form.yearId
                        ? `— Choose from all ${filteredEventsForYear.length} events —`
                        : "— Select year first —"}
                    </option>
                    {filteredEventsForYear.map((ev) => (
                      <option key={ev._id} value={ev._id}>
                        {ev.title} {ev.date ? `(${ev.date})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 40 }}>
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="reg-continue-btn"
                >
                  Choose Package →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Package & Participation */}
          {step === 2 && (
            <div className="step-content page-fade-in">
              {/* Participation Type */}
              <div className="sec-step-title">
                <span className="step-num-badge">01</span>
                <h3>Participation Type</h3>
              </div>
              <p className="step-sub-desc">
                Choose whether you'll join and present in-person or connect virtually.
              </p>

              <div className="participation-grid">
                <div
                  className={`participation-card ${participationType === "physical" ? "active" : ""}`}
                  onClick={() => handleParticipationChange("physical")}
                >
                  {participationType === "physical" && <div className="card-checked-icon">✓</div>}
                  <span className="part-icon">🎙️</span>
                  <div className="part-meta">
                    <h4>Physical Speaker</h4>
                    <p>Attend and present in-person at the global venue</p>
                  </div>
                </div>

                <div
                  className={`participation-card ${participationType === "virtual" ? "active" : ""}`}
                  onClick={() => handleParticipationChange("virtual")}
                >
                  {participationType === "virtual" && <div className="card-checked-icon">✓</div>}
                  <span className="part-icon">💻</span>
                  <div className="part-meta">
                    <h4>Virtual Speaker</h4>
                    <p>Present online via secure high-speed Zoom / Airmeet platform</p>
                  </div>
                </div>
              </div>

              {/* Choose Package */}
              <div className="sec-step-title" style={{ marginTop: 48 }}>
                <span className="step-num-badge">02</span>
                <h3>Choose Your Package</h3>
              </div>
              <p className="step-sub-desc">
                Select your preferred registration level. All physical options include lunch and refreshments.
              </p>

              <div className="packages-grid">
                {packagesList.length > 0 ? (
                  packagesList.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`package-card ${form.package === pkg.id ? "active" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, package: pkg.id }))}
                    >
                      {pkg.popular && <span className="pop-badge">POPULAR</span>}
                      <div className="pkg-radio-circle">
                        <div className="pkg-radio-dot" />
                      </div>

                      <div className="pkg-header">
                        <span className="pkg-icon">{pkg.icon}</span>
                        <h4>{pkg.name}</h4>
                        <div className="pkg-price-row">
                          {pkg.originalPrice > pkg.price && (
                            <span className="pkg-price-original">${pkg.originalPrice}</span>
                          )}
                          <span className="pkg-price-curr">${pkg.price}</span>
                        </div>
                      </div>

                      <ul className="pkg-feat-list">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <span className="feat-bullet">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.3)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "16px" }}>
                    Please select your <strong>Participation Type</strong> above to see available packages.
                  </div>
                )}
              </div>

              {/* Coupons */}
              <div className="sec-step-title" style={{ marginTop: 48 }}>
                <span className="step-num-badge">03</span>
                <h3>Discount Coupons</h3>
              </div>
              <p className="step-sub-desc">
                Have a coupon code? Apply it below to receive a discount on your registration.
              </p>

              <div className="reg-row single" style={{ maxWidth: '520px', marginBottom: '30px' }}>
                <div className="reg-field">
                  <label>Coupon Code</label>
                  <div className="coupon-input-wrap">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      disabled={!!appliedCoupon}
                      className="coupon-input"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="coupon-btn remove"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="coupon-btn apply"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  {appliedCoupon && (
                    <div className="coupon-feedback success" style={{ marginTop: 12 }}>
                      ✓ Applied <strong>{appliedCoupon.code}</strong> — {appliedCoupon.description} ({appliedCoupon.value}
                      {appliedCoupon.type === "percent" ? "%" : "$"} off)
                    </div>
                  )}
                  {couponError && (
                    <div className="coupon-feedback error" style={{ marginTop: 12 }}>
                      ✕ {couponError}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Pricing Summary */}
              {selectedPkg && (
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="price-row discount">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Total Registration Fee</span>
                    <span>${finalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="step-nav-buttons">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="step-back-btn"
                >
                  ← Personal Details
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="step-next-btn"
                >
                  Confirm Registration →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm & Pay */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="step-content page-fade-in">
              <div className="reg-divider" style={{ marginTop: 0 }}>
                <span>Registration Summary</span>
              </div>

              <div className="summary-card">
                <div className="summary-section">
                  <h4>Participant Information</h4>
                  <div className="summary-grid">
                    <div>
                      <span className="sum-label">Full Name:</span>
                      <span className="sum-val">{form.firstName} {form.lastName}</span>
                    </div>
                    <div>
                      <span className="sum-label">Email:</span>
                      <span className="sum-val">{form.email}</span>
                    </div>
                    <div>
                      <span className="sum-label">Phone:</span>
                      <span className="sum-val">{form.countryCode} {form.phone}</span>
                    </div>
                    <div>
                      <span className="sum-label">Country:</span>
                      <span className="sum-val">{form.country}</span>
                    </div>
                    {form.organization && (
                      <div>
                        <span className="sum-label">Organization:</span>
                        <span className="sum-val">{form.organization}</span>
                      </div>
                    )}
                    {form.jobTitle && (
                      <div>
                        <span className="sum-label">Job Title:</span>
                        <span className="sum-val">{form.jobTitle}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Conference Details</h4>
                  <div className="summary-grid">
                    <div>
                      <span className="sum-label">Conference:</span>
                      <span className="sum-val" style={{ color: '#00A79D', fontWeight: 600 }}>{selectedEvent?.title}</span>
                    </div>
                    <div>
                      <span className="sum-label">Dates:</span>
                      <span className="sum-val">{selectedEvent?.date}</span>
                    </div>
                    <div>
                      <span className="sum-label">Location:</span>
                      <span className="sum-val">{selectedEvent?.loc || selectedEvent?.location || "Global HQ (Dubai, UAE)"}</span>
                    </div>
                    <div>
                      <span className="sum-label">Format:</span>
                      <span className="sum-val">{participationType === "physical" ? "Physical (In-Person Presentation)" : "Virtual (Online Zoom Presentation)"}</span>
                    </div>
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Package &amp; Fee Details</h4>
                  <div className="summary-grid">
                    <div>
                      <span className="sum-label">Package:</span>
                      <span className="sum-val">{selectedPkg?.name}</span>
                    </div>
                    <div>
                      <span className="sum-label">Subtotal:</span>
                      <span className="sum-val">${subtotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div>
                        <span className="sum-label">Coupon Code:</span>
                        <span className="sum-val" style={{ color: '#6DBE45' }}>{appliedCoupon.code} (-${discountAmount.toLocaleString()})</span>
                      </div>
                    )}
                    <div className="total-highlight">
                      <span className="sum-label">Total Fee:</span>
                      <span className="sum-val">${finalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="reg-field" style={{ marginTop: 28 }}>
                <label>Special Requirements or Abstract Paper Title</label>
                <textarea
                  name="specialRequirements"
                  rows="3"
                  value={form.specialRequirements}
                  onChange={handleChange}
                  placeholder="Enter any additional requirements, special arrangements, or the title of your presenting abstract here..."
                />
              </div>

              {/* Consent Box */}
              <div className="consent-checkbox-wrap">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="consent-checkbox"
                />
                <label htmlFor="consent">
                  I confirm that the above registration details are accurate, and I agree to the ProSummits Terms &amp; Conditions and Refund Policy.
                </label>
              </div>

              {/* Nav Buttons */}
              <div className="step-nav-buttons">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="step-back-btn"
                >
                  ← Select Package
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="reg-continue-btn"
                  style={{ flex: 1, width: 'auto' }}
                >
                  {isSubmitting ? "Processing..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
