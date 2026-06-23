/* global Buffer, process */
import Stripe from "stripe";
import { fulfillPaidRegistration } from "../server/registration-fulfillment.js";

const readRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.statusCode = 405;
    return res.end("Method not allowed");
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.statusCode = 500;
    return res.end("Stripe webhook is not configured.");
  }

  const signature = req.headers["stripe-signature"];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook signature error:", error.message);
    res.statusCode = 400;
    return res.end(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        await fulfillPaidRegistration(stripe, session.id);
      }
    }

    res.statusCode = 200;
    return res.end("ok");
  } catch (error) {
    console.error("Stripe webhook handling error:", error);
    res.statusCode = 500;
    return res.end("Webhook handler failed");
  }
}
