/* global Buffer, process */
import Stripe from "stripe";

const readRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const appendToSheets = async (metadata, session) => {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!webhookUrl) return;

  const body = new URLSearchParams();
  body.set("timestamp", new Date().toISOString());
  body.set("form_type", "Paid Registration");
  body.set("payment_status", session.payment_status || "");
  body.set("stripe_session_id", session.id);
  body.set("stripe_payment_intent", session.payment_intent || "");

  Object.entries(metadata || {}).forEach(([key, value]) => {
    body.set(key, value ?? "");
  });

  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
  });
};

const sendRegistrationEmail = async (metadata, session) => {
  const userEmail =
    session.customer_details?.email ||
    session.customer_email ||
    metadata?.participantEmail;

  if (!userEmail) {
    throw new Error("Registration email is missing from the paid Stripe session.");
  }

  const templateParams = {
    to_name: "ProSummits Team",
    to_email: "contact@prosummits.org",
    reply_to: userEmail,
    from_name: metadata?.participantName || "ProSummits Attendee",
    user_email: userEmail,
    event_title: metadata?.eventTitle || "Conference",
    package_name: metadata?.packageName || "N/A",
    participation_type: metadata?.participationType || "N/A",
    price: metadata?.subtotal || "0",
    discount: metadata?.discount || "0.00",
    coupon_code: metadata?.couponCode || "None",
    final_price: metadata?.finalPrice || ((session.amount_total || 0) / 100).toFixed(2),
    phone: metadata?.participantPhone || "Not Specified",
    country: metadata?.country || "Not Specified",
    organization: metadata?.organization || "Not Specified",
    job_title: metadata?.jobTitle || "Not Specified",
    requirements: metadata?.specialRequirements || "None",
    reg_id: metadata?.registrationId || session.id,
  };

  // Reuse the existing EmailJS service and branded registration template that
  // ProSummits used before Stripe checkout was introduced.
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID || "service_2ac0shf",
      template_id: process.env.EMAILJS_TEMPLATE_ID || "template_mxjq749",
      user_id: process.env.EMAILJS_PUBLIC_KEY || "8Ka9LvGqor29zIVHa",
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`EmailJS registration email failed (${response.status}): ${details}`);
  }
};

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
  let event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
        await Promise.all([
          appendToSheets(session.metadata, session),
          sendRegistrationEmail(session.metadata, session),
        ]);
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
