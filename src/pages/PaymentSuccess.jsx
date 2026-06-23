import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [confirmationStatus, setConfirmationStatus] = useState(
    sessionId ? "sending" : "error"
  );

  useEffect(() => {
    sessionStorage.removeItem("prosummitsCheckoutPending");
    if (!sessionId) return;

    let active = true;
    const confirmPayment = async () => {
      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!response.ok) throw new Error("Confirmation delivery failed.");
        if (active) setConfirmationStatus("sent");
      } catch (error) {
        console.error(error);
        if (active) setConfirmationStatus("error");
      }
    };

    confirmPayment();
    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <div className="page-fade">
      <div className="reg-page">
        <div className="reg-success">
          <div className="reg-success-icon">OK</div>
          <h2>Payment Successful</h2>
          {confirmationStatus === "sending" && (
            <p>Payment received. We are sending the registration confirmations now...</p>
          )}
          {confirmationStatus === "sent" && (
            <p>
              Your completed registration form was sent to your registration email,
              and a copy was sent to the ProSummits team. Please check the spam folder too.
            </p>
          )}
          {confirmationStatus === "error" && (
            <p>
              Your payment was successful, but we could not deliver the confirmation email.
              Please contact <strong>contact@prosummits.org</strong> with the session ID below.
            </p>
          )}
          {sessionId && (
            <p className="reg-success-id">
              Stripe Session ID: <strong>{sessionId}</strong>
            </p>
          )}
          <Link to="/events" className="reg-back-link">
            Back to Events
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
