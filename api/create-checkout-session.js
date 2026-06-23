/* global process */
import Stripe from "stripe";

const PACKAGES = {
  speaker: {
    name: "Speaker Registration",
    unitAmount: 79900,
    participationType: "Physical Event",
  },
  "speaker-2night": {
    name: "Speaker Registration plus 2 Nights Stay Addon",
    unitAmount: 109900,
    participationType: "Physical Event",
  },
  "speaker-3night": {
    name: "Speaker Registration plus 3 Nights Stay Addon",
    unitAmount: 129900,
    participationType: "Physical Event",
  },
  exhibitor: {
    name: "Exhibitor Registration",
    unitAmount: 199900,
    participationType: "Physical Event",
  },
  delegate: {
    name: "Delegate Registration",
    unitAmount: 39900,
    participationType: "Physical Event",
  },
  virtual: {
    name: "Virtual Speaker Registration",
    unitAmount: 39900,
    participationType: "Virtual Event",
  },
  av: {
    name: "Audio - Video Presentation",
    unitAmount: 19900,
    participationType: "Virtual Event",
  },
};

const COUPONS = {
  NAVA20: { type: "percent", value: 20 },
  REDDY100: { type: "amount", value: 10000 },
  KUMAR50: { type: "amount", value: 5000 },
};

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

    const packageDetails = PACKAGES[selectedPackage.id];
    if (!packageDetails || packageDetails.participationType !== participationType) {
      return sendJson(res, 400, { error: "Invalid registration package." });
    }

    const couponCode = String(coupon?.code || "").trim().toUpperCase();
    const couponDetails = couponCode ? COUPONS[couponCode] : null;
    if (couponCode && !couponDetails) {
      return sendJson(res, 400, { error: "Invalid coupon code." });
    }

    const subtotal = packageDetails.unitAmount;
    let discount = 0;
    if (couponDetails?.type === "percent") {
      discount = Math.round((subtotal * couponDetails.value) / 100);
    } else if (couponDetails?.type === "amount") {
      discount = Math.min(couponDetails.value, subtotal);
    }

    const amount = subtotal - discount;
    if (amount < 50) {
      return sendJson(res, 400, { error: "Invalid payment amount." });
    }

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
            currency: "usd",
            product_data: {
              name: packageDetails.name,
              description: `${event.title} - ${participationType || "Registration"}`,
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
        participationType: packageDetails.participationType,
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
