import { RateLimiterMemory } from "rate-limiter-flexible";

// ── Rate limiter: max 10 requests per IP per 10 minutes ─────────────────────
const rateLimiter = new RateLimiterMemory({ points: 10, duration: 600 });

// ── Helpers ──────────────────────────────────────────────────────────────────
const sendJson = (res, status, body) => {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(body);
};

const cleanText = (val, maxLen = 200) =>
  String(val ?? "").trim().slice(0, maxLen);

// ── Admin notification email ──────────────────────────────────────────────────
const sendReceiptAdminEmail = async (data) => {
  const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "template_admin_notify";
  const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;
  const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
  const ADMIN_EMAIL         = process.env.ADMIN_EMAIL || "contact@prosummits.org";

  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("[submit-bank-receipt] EmailJS not configured — skipping admin email.");
    return;
  }

  const receiptDetails = [
    `=== BANK TRANSFER RECEIPT RECEIVED ===`,
    ``,
    `Registration ID : ${data.registrationId}`,
    `Participant     : ${data.participantName}`,
    `Email           : ${data.participantEmail}`,
    ``,
    `Receipt File    : ${data.receiptFileName || "Not specified"}`,
    `Receipt Link / URL:`,
    `${data.receiptLink || "No link provided"}`,
    ``,
    `Customer Note   : ${data.receiptNote || "None"}`,
    ``,
    `Submitted At    : ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ``,
    `--- Action Required ---`,
    `Please verify the bank transfer has been received for the above Registration ID.`,
    `Once confirmed, mark the registration as PAID in your records.`,
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
        subject: `[ProSummits] Bank Transfer Receipt Submitted — ${data.registrationId}`,
        message: receiptDetails,
        from_name: "ProSummits Registration System",
        reply_to: data.participantEmail,
      },
    }),
  });
};

// ── Google Sheets update ──────────────────────────────────────────────────────
const updateGoogleSheets = async (data) => {
  const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!WEBHOOK_URL) return;

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "bank_transfer_receipt_submitted",
      registrationId: data.registrationId,
      participantName: data.participantName,
      participantEmail: data.participantEmail,
      receiptFileName: data.receiptFileName,
      receiptLink: data.receiptLink,
      receiptNote: data.receiptNote,
      status: "receipt_submitted",
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
    participantName,
    participantEmail,
    receiptLink,
    receiptFileName,
    receiptNote,
  } = req.body || {};

  if (!registrationId || !participantEmail) {
    return sendJson(res, 400, { error: "Missing registration ID or email." });
  }

  if (!receiptLink || !receiptLink.trim()) {
    return sendJson(res, 400, { error: "Please upload your payment receipt before submitting." });
  }

  const data = {
    registrationId:  cleanText(registrationId),
    participantName: cleanText(participantName || ""),
    participantEmail: cleanText(participantEmail, 254),
    receiptLink:     cleanText(receiptLink, 1000),
    receiptFileName: cleanText(receiptFileName || "", 200),
    receiptNote:     cleanText(receiptNote || "", 500),
  };

  // Fire both async operations in parallel
  Promise.allSettled([
    sendReceiptAdminEmail(data).catch((e) => console.error("[bank-receipt] email error:", e)),
    updateGoogleSheets(data).catch((e) => console.error("[bank-receipt] sheets error:", e)),
  ]);

  return sendJson(res, 200, { success: true });
}
