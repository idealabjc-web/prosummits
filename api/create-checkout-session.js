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

const cleanText = (value, maxLength = 500) => {
  if (value === null || value === undefined) return "";

  const text =
    typeof value === "object" ? JSON.stringify(value) : String(value);

  return text.trim().slice(0, maxLength);
};

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

    const origin = String(
      process.env.SITE_URL ||
        process.env.VITE_SITE_URL ||
        req.headers.origin ||
        `https://${req.headers.host}`
    ).replace(/\/+$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: cleanText(participant.email, 254),
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: cleanText(packageDetails.name, 250),
              description: cleanText(`${event.title} - ${participationLabel}`, 500),
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        website: "prosummits",
        registrationId: cleanText(registrationId),
        participantName: cleanText(participant.name),
        participantEmail: cleanText(participant.email),
        participantPhone: cleanText(participant.phone),
        country: cleanText(participant.country),
        organization: cleanText(participant.organization),
        jobTitle: cleanText(participant.jobTitle),
        eventId: cleanText(event.id),
        eventTitle: cleanText(event.title),
        eventDate: cleanText(event.date),
        eventLocation: cleanText(event.location),
        packageId: cleanText(selectedPackage.id),
        packageName: cleanText(packageDetails.name),
        participationType: participationLabel,
        subtotal: toDollars(subtotal),
        discount: toDollars(discount),
        finalPrice: toDollars(amount),
        couponCode: cleanText(couponCode || "None"),
        specialRequirements: cleanText(specialRequirements, 450),
      },
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
    });

    return sendJson(res, 200, { url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    const paymentConfigurationError = [
      "StripeAuthenticationError",
      "StripePermissionError",
    ].includes(error?.type);

    return sendJson(res, 500, {
      error: paymentConfigurationError
        ? "The payment service is temporarily unavailable. Please contact ProSummits support."
        : "Unable to create checkout session. Please check the registration details and try again.",
      code: cleanText(error?.code || error?.type || "checkout_error", 100),
      requestId: cleanText(error?.requestId, 100) || undefined,
    });
  }
}
