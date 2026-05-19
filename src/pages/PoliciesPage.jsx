import { useEffect } from "react";
import Footer from "../components/Footer";
import "../styles/pages.css";

/**
 * PoliciesPage
 * Premium, beautifully formatted Refund & Cancellation Policies page.
 * Seamlessly integrates into ProSummits dark editorial theme.
 */
export default function PoliciesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policies-page" style={{ background: "#04101c", minHeight: "100vh", color: "#ffffff" }}>
      {/* Page Hero Section */}
      <div className="page-hero" style={{ padding: "160px 5vw 80px", textAlign: "center", position: "relative" }}>
        <span className="page-hero-tag" style={{ color: "#E01F5C", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.85rem" }}>
          Terms & Agreements
        </span>
        <h1 style={{
          fontFamily: "var(--fd)",
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: 700,
          margin: "20px 0",
          lineHeight: 1.15
        }}>
          Refund &amp; <em style={{
            fontStyle: "italic",
            background: "linear-gradient(90deg, #7B2FBE, #E01F5C, #F47B20)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Policies</em>
        </h1>
        <p className="page-hero-desc" style={{
          color: "rgba(255, 255, 255, 0.65)",
          fontSize: "1.1rem",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          Official rules, cancellation windows, and payment guidelines for the ProSummits 2026 conference series.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="page-content" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 5vw 100px" }}>

        {/* Core Policy Highlight Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(224, 31, 92, 0.08) 0%, rgba(123, 47, 190, 0.08) 100%)",
          border: "1px solid rgba(224, 31, 92, 0.2)",
          borderRadius: "24px",
          padding: "36px",
          marginBottom: "48px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          position: "relative"
        }}>
          <h3 style={{
            color: "#E01F5C",
            fontFamily: "var(--fd)",
            fontSize: "1.3rem",
            fontWeight: 600,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            ⚠️ Natural Calamities Clause
          </h3>
          <p style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            margin: 0
          }}>
            We kindly inform you that in the unfortunate event of cancellation due to natural calamities, refunds will not be possible. However, the fee will be credited toward your registration for subsequent events. We appreciate your understanding and support.
          </p>
        </div>

        {/* Cancellation Procedure */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "36px",
          marginBottom: "48px"
        }}>
          <h3 style={{
            color: "#ffffff",
            fontFamily: "var(--fd)",
            fontSize: "1.4rem",
            fontWeight: 600,
            marginBottom: "20px"
          }}>
            How to Request Cancellation
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
            In the event that the registrant no longer wants to attend the Conference, he/she may cancel the registration by notifying the Prosummits group. By doing so, your fee will be transferred to subsequent events.
          </p>
          <div style={{
            background: "rgba(255, 255, 255, 0.04)",
            borderRadius: "12px",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderLeft: "4px solid #7B2FBE"
          }}>
            <span style={{ fontSize: "1.5rem" }}>✉️</span>
            <div>
              <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                Submit Requests to
              </span>
              <a href="mailto:contact@prosummits.org" style={{ color: "#7B2FBE", fontWeight: 600, fontSize: "1.1rem", textDecoration: "none" }}>
                contact@prosummits.org
              </a>
            </div>
          </div>
        </div>

        {/* Eligibility Windows */}
        <h3 style={{
          fontFamily: "var(--fd)",
          fontSize: "1.6rem",
          fontWeight: 600,
          color: "#ffffff",
          marginBottom: "24px"
        }}>
          Refund Eligibility &amp; Windows
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "48px"
        }}>
          {/* Card 1 */}
          <div style={{
            background: "linear-gradient(135deg, rgba(109, 190, 69, 0.08) 0%, rgba(0, 167, 157, 0.08) 100%)",
            border: "1px solid rgba(109, 190, 69, 0.2)",
            borderRadius: "16px",
            padding: "28px",
            position: "relative"
          }}>
            <div style={{
              background: "rgba(109, 190, 69, 0.15)",
              color: "#6DBE45",
              padding: "6px 12px",
              borderRadius: "100px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "16px"
            }}>
              60 - 45 Days Prior
            </div>
            <h4 style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 600, marginBottom: "10px" }}>
              50% Refund Eligible
            </h4>
            <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Cancellations made within this window qualify for a 50% refund of the original paid registration fee.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: "linear-gradient(135deg, rgba(224, 31, 92, 0.08) 0%, rgba(244, 123, 32, 0.08) 100%)",
            border: "1px solid rgba(224, 31, 92, 0.2)",
            borderRadius: "16px",
            padding: "28px",
            position: "relative"
          }}>
            <div style={{
              background: "rgba(224, 31, 92, 0.15)",
              color: "#E01F5C",
              padding: "6px 12px",
              borderRadius: "100px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "16px"
            }}>
              Under 45 Days Prior
            </div>
            <h4 style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 600, marginBottom: "10px" }}>
              Not Eligible
            </h4>
            <p style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Cancellations made within 45 days of the conference start date are not eligible for a monetary refund.
            </p>
          </div>
        </div>

        {/* Processing Details */}
        <div style={{
          background: "rgba(255, 255, 255, 0.01)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
        }}>
          <h3 style={{
            color: "#F47B20",
            fontFamily: "var(--fd)",
            fontSize: "1.4rem",
            fontWeight: 600,
            marginBottom: "20px"
          }}>
            Processing Rules &amp; Timeline
          </h3>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li style={{
              marginBottom: "18px",
              paddingLeft: "28px",
              position: "relative",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.65,
              fontSize: "0.95rem"
            }}>
              <span style={{ position: "absolute", left: 0, color: "#F47B20" }}>→</span>
              <strong>Post-Conference Schedule:</strong> All refunds will be processed only after a week of the conference completion date that the registrant has paid for.
            </li>
            <li style={{
              marginBottom: "18px",
              paddingLeft: "28px",
              position: "relative",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.65,
              fontSize: "0.95rem"
            }}>
              <span style={{ position: "absolute", left: 0, color: "#F47B20" }}>→</span>
              <strong>Source Account Only:</strong> Once the payment is made, refunds can only be processed back to the original source account.
            </li>
            <li style={{
              paddingLeft: "28px",
              position: "relative",
              color: "rgba(255, 255, 255, 0.75)",
              lineHeight: 1.65,
              fontSize: "0.95rem"
            }}>
              <span style={{ position: "absolute", left: 0, color: "#F47B20" }}>→</span>
              <strong>Turnaround Time:</strong> Once initiated, refunds will typically take <strong>7 to 10 working days</strong> to reflect in your account.
            </li>
          </ul>
        </div>

      </div>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
