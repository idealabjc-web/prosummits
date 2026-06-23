/* global process */
import Stripe from "stripe";
import {
  calculateRegistrationPrice,
  getRegistrationSettings,
} from "../server/registration-pricing.js";

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const toDollars = (cents) => (cents / 100).toFixed(2);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return sendJson(res, 500, { error: "Stripe secret key is not configured." });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const {
      registrationId,
      participant,
      event,
      package: selectedPackage,
      participationType,
      coupon,
      specialRequirements,
    } = req.body || {};

    if (!participant?.email || !participant?.name || !event?.title || !selectedPackage?.id) {
      return sendJson(res, 400, { error: "Missing required checkout details." });
    }

    const couponCode = String(coupon?.code || "").trim().toUpperCase();
    const settings = await getRegistrationSettings();
    let pricing;
    try {
      pricing = calculateRegistrationPrice(settings, selectedPackage.id, couponCode);
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }

    const { packageDetails, currency, subtotal, discount, amount } = pricing;
    if (packageDetails.participationType !== participationType) {
      return sendJson(res, 400, { error: "Invalid participation type." });
    }

    const participationLabel =
      packageDetails.participationType === "physical" ? "Physical Event" : "Virtual Event";

    const origin =
      process.env.SITE_URL ||
      process.env.VITE_SITE_URL ||
      req.headers.origin ||
      `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: participant.email,
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: packageDetails.name,
              description: `${event.title} - ${participationLabel}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId,
        participantName: participant.name,
        participantEmail: participant.email,
        participantPhone: participant.phone || "",
        country: participant.country || "",
        organization: participant.organization || "",
        jobTitle: participant.jobTitle || "",
        eventId: event.id || "",
        eventTitle: event.title,
        eventDate: event.date || "",
        eventLocation: event.location || "",
        packageId: selectedPackage.id,
        packageName: packageDetails.name,
        participationType: participationLabel,
        subtotal: toDollars(subtotal),
        discount: toDollars(discount),
        finalPrice: toDollars(amount),
        couponCode: couponCode || "None",
        specialRequirements: String(specialRequirements || "").slice(0, 450),
      },
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancel`,
    });

    return sendJson(res, 200, { url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return sendJson(res, 500, { error: "Unable to create checkout session." });
  }
}
