import { Navigate } from "react-router-dom";

export default function PaymentCancel() {
  return <Navigate to="/register?payment=cancelled" replace />;
}
