/* global process */
import Stripe from "stripe";
import { fulfillPaidRegistration } from "../server/registration-fulfillment.js";

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return sendJson(res, 500, { error: "Stripe is not configured." });
  }

  const sessionId = String(req.body?.sessionId || "");
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return sendJson(res, 400, { error: "Invalid Stripe session." });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await fulfillPaidRegistration(stripe, sessionId);
    return sendJson(res, 200, { confirmed: true });
  } catch (error) {
    console.error("Payment confirmation fulfillment error:", error);
    return sendJson(res, 500, { error: "Payment was received, but confirmation delivery failed." });
  }
}

