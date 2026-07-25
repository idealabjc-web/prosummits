import { RateLimiterMemory } from "rate-limiter-flexible";

// ── Rate limiter: max 5 requests per IP per 10 minutes ──────────────────────
const rateLimiter = new RateLimiterMemory({ points: 5, duration: 600 });

// ── Helpers ──────────────────────────────────────────────────────────────────
const sendJson = (res, status, body) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

const cleanText = (val, maxLen = 200) =>
  String(val ?? "").trim().slice(0, maxLen);

// ── Admin notification email (via EmailJS REST API) ──────────────────────────
const sendBankTransferAdminEmail = async (data) => {
  const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "template_admin_notify";
  const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;
  const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
  const ADMIN_EMAIL         = process.env.ADMIN_EMAIL || "contact@prosummits.org";

  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("[request-bank-transfer] EmailJS not configured — skipping admin email.");
    return;
  }

  const messageBody = [
    `=== BANK TRANSFER PAYMENT INITIATED ===`,
    ``,
    `Registration ID : ${data.registrationId}`,
    `Participant     : ${data.participant.name}`,
    `Email           : ${data.participant.email}`,
    `Phone           : ${data.participant.phone}`,
    `Country         : ${data.participant.country}`,
    `Organization    : ${data.participant.organization}`,
    `Job Title       : ${data.participant.jobTitle}`,
    ``,
    `Event           : ${data.event.title}`,
    `Event Date      : ${data.event.date}`,
    `Event Location  : ${data.event.location}`,
    ``,
    `Package         : ${data.packageName}`,
    `Participation   : ${data.participationType}`,
    `Amount Due      : $${data.finalPrice} USD`,
    `Coupon Applied  : ${data.coupon ? `${data.coupon.code} — ${data.coupon.description}` : "None"}`,
    ``,
    `Special Notes   : ${data.specialRequirements || "None"}`,
    ``,
    `Initiated At    : ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ``,
    `--- ACTION REQUIRED ---`,
    `This participant has chosen to pay by bank wire transfer.`,
    `Bank details were shown to them automatically.`,
    `Please watch for the incoming transfer and verify the receipt they will upload.`,
  ].join("\n");

  await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: ADMIN_EMAIL,
        subject: `[ProSummits] Bank Transfer Initiated — ${data.registrationId}`,
        message: messageBody,
        from_name: "ProSummits Registration System",
        reply_to: data.participant.email,
      },
    }),
  });
};

// ── Google Sheets logging ─────────────────────────────────────────────────────
const logToGoogleSheets = async (data) => {
  const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!WEBHOOK_URL) return;

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "bank_transfer_initiated",
      registrationId: data.registrationId,
      participantName: data.participant.name,
      participantEmail: data.participant.email,
      participantPhone: data.participant.phone,
      participantCountry: data.participant.country,
      participantOrganization: data.participant.organization,
      participantJobTitle: data.participant.jobTitle,
      eventId: data.event.id,
      eventTitle: data.event.title,
      eventDate: data.event.date,
      eventLocation: data.event.location,
      packageId: data.package.id,
      packageName: data.packageName,
      participationType: data.participationType,
      finalPrice: data.finalPrice,
      couponCode: data.coupon?.code || "",
      couponDescription: data.coupon?.description || "",
      specialRequirements: data.specialRequirements,
      paymentMethod: "bank_transfer",
      status: "pending_transfer",
      timestamp: new Date().toISOString(),
    }),
  });
};

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  // Rate limiting
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
    await rateLimiter.consume(ip);
  } catch {
    return sendJson(res, 429, { error: "Too many requests. Please try again in a few minutes." });
  }

  const {
    registrationId,
    participant,
    event,
    package: pkg,
    packageName,
    participationType,
    finalPrice,
    coupon,
    specialRequirements,
  } = req.body || {};

  // Basic validation
  if (!registrationId || !participant?.email || !participant?.name) {
    return sendJson(res, 400, { error: "Missing required fields." });
  }

  const data = {
    registrationId: cleanText(registrationId, 30),
    participant: {
      name:         cleanText(participant.name),
      email:        cleanText(participant.email, 254),
      phone:        cleanText(participant.phone || ""),
      country:      cleanText(participant.country || ""),
      organization: cleanText(participant.organization || ""),
      jobTitle:     cleanText(participant.jobTitle || ""),
    },
    event: {
      id:       cleanText(event?.id || ""),
      title:    cleanText(event?.title || ""),
      date:     cleanText(event?.date || ""),
      location: cleanText(event?.location || ""),
    },
    package:          { id: cleanText(pkg?.id || "") },
    packageName:      cleanText(packageName || ""),
    participationType: cleanText(participationType || ""),
    finalPrice:       cleanText(String(finalPrice || "0"), 20),
    coupon:           coupon ? { code: cleanText(coupon.code || ""), description: cleanText(coupon.description || "") } : null,
    specialRequirements: cleanText(specialRequirements || "", 500),
  };

  // Fire both async operations in parallel — don't block the response
  Promise.allSettled([
    sendBankTransferAdminEmail(data).catch((e) => console.error("[bank-transfer] email error:", e)),
    logToGoogleSheets(data).catch((e) => console.error("[bank-transfer] sheets error:", e)),
  ]);

  return sendJson(res, 200, { success: true, registrationId: data.registrationId });
}
