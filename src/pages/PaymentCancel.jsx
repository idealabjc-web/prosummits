import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function PaymentCancel() {
  useEffect(() => {
    sessionStorage.removeItem("prosummitsCheckoutPending");
  }, []);

  return (
    <div className="page-fade">
      <div className="reg-page">
        <div className="reg-success">
          <div className="reg-success-icon">!</div>
          <h2>Payment Cancelled</h2>
          <p>
            Your payment was not completed. You can return to registration and
            try again whenever you are ready.
          </p>
          <Link to="/register" className="reg-back-link">
            Return to Registration
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
