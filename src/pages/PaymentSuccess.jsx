import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    sessionStorage.removeItem("prosummitsCheckoutPending");
  }, []);

  return (
    <div className="page-fade">
      <div className="reg-page">
        <div className="reg-success">
          <div className="reg-success-icon">OK</div>
          <h2>Payment Successful</h2>
          <p>
            Thank you for completing your ProSummits registration payment. Your
            completed registration form and payment confirmation will be sent
            to the email address used during registration. Please also check
            your spam folder.
          </p>
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
