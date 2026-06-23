/* global process */

const ADMIN_EMAIL = process.env.REGISTRATION_ADMIN_EMAIL || "contact@prosummits.org";

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

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google Sheets registration save failed (${response.status}).`);
  }
};

const sendEmailJsMessage = async (recipient, templateParams) => {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: process.env.SITE_URL || "https://prosummits.org",
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID || "service_2ac0shf",
      template_id: process.env.EMAILJS_TEMPLATE_ID || "template_mxjq749",
      user_id: process.env.EMAILJS_PUBLIC_KEY || "8Ka9LvGqor29zIVHa",
      accessToken: process.env.EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        ...templateParams,
        to_email: recipient,
        user_email: recipient,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`EmailJS send failed (${response.status}): ${details}`);
  }
};

const buildTemplateParams = (metadata, session, userEmail) => ({
  to_name: metadata?.participantName || "ProSummits Attendee",
  reply_to: userEmail,
  from_name: metadata?.participantName || "ProSummits Attendee",
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
});

export async function fulfillPaidRegistration(stripe, sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new Error("Stripe session is not paid.");
  }

  const metadata = session.metadata || {};
  const userEmail =
    session.customer_details?.email || session.customer_email || metadata.participantEmail;

  if (!userEmail) {
    throw new Error("Registration email is missing from the paid Stripe session.");
  }

  const templateParams = buildTemplateParams(metadata, session, userEmail);

  if (metadata.userConfirmationSent !== "true") {
    await sendEmailJsMessage(userEmail, templateParams);
    await stripe.checkout.sessions.update(session.id, {
      metadata: { userConfirmationSent: "true" },
    });
  }

  if (metadata.adminConfirmationSent !== "true") {
    await sendEmailJsMessage(ADMIN_EMAIL, {
      ...templateParams,
      to_name: "ProSummits Team",
    });
    await stripe.checkout.sessions.update(session.id, {
      metadata: { adminConfirmationSent: "true" },
    });
  }

  if (metadata.savedToSheets !== "true") {
    await appendToSheets(metadata, session);
    await stripe.checkout.sessions.update(session.id, {
      metadata: { savedToSheets: "true" },
    });
  }

  return session;
}
