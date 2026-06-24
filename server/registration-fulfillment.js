/* global process */

const ADMIN_EMAIL = "contact@prosummits.org";

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
        // EmailJS templates sometimes use different field names for the
        // destination. Force every recipient-like field to this one address
        // so attendee and admin messages can never cross-deliver.
        to_email: recipient,
        user_email: recipient,
        email: recipient,
        recipient_email: recipient,
        participant_email: recipient,
        admin_email: recipient,
        contact_email: recipient,
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`EmailJS send failed (${response.status}): ${details}`);
  }
};

const getRegistrationValues = (metadata, session, userEmail) => ({
  participantName: metadata?.participantName || "ProSummits Attendee",
  participantEmail: userEmail,
  phone: metadata?.participantPhone || "Not Specified",
  country: metadata?.country || "Not Specified",
  organization: metadata?.organization || "Not Specified",
  jobTitle: metadata?.jobTitle || "Not Specified",
  eventTitle: metadata?.eventTitle || "Conference",
  eventDate: metadata?.eventDate || "Not Specified",
  eventLocation: metadata?.eventLocation || "Not Specified",
  packageName: metadata?.packageName || "N/A",
  participationType: metadata?.participationType || "N/A",
  finalPrice:
    metadata?.finalPrice || ((session.amount_total || 0) / 100).toFixed(2),
  requirements: metadata?.specialRequirements || "None",
  registrationId: metadata?.registrationId || session.id,
  stripeSessionId: session.id,
});

const buildUserTemplateParams = (values) => {
  const registrationDetails = [
    `Registration ID: ${values.registrationId}`,
    `Conference: ${values.eventTitle}`,
    `Event Date: ${values.eventDate}`,
    `Event Location: ${values.eventLocation}`,
    `Participation: ${values.participationType}`,
    `Package: ${values.packageName}`,
    `Total Paid: $${values.finalPrice}`,
    "Payment Status: Paid",
  ].join("\n");

  return {
    to_name: values.participantName,
    reply_to: ADMIN_EMAIL,
    from_name: values.participantName,
    event_title: values.eventTitle,
    event_date: values.eventDate,
    event_location: values.eventLocation,
    package_name: values.packageName,
    participation_type: values.participationType,
    final_price: values.finalPrice,
    reg_id: values.registrationId,
    payment_status: "paid",
    registration_details: registrationDetails,
    message: registrationDetails,
  };
};

const buildAdminTemplateParams = (values) => {
  const registrationDetails = [
    `Registration ID: ${values.registrationId}`,
    `Participant: ${values.participantName}`,
    `Email: ${values.participantEmail}`,
    `Phone: ${values.phone}`,
    `Country: ${values.country}`,
    `Organization: ${values.organization}`,
    `Job Title: ${values.jobTitle}`,
    `Conference: ${values.eventTitle}`,
    `Event Date: ${values.eventDate}`,
    `Event Location: ${values.eventLocation}`,
    `Participation: ${values.participationType}`,
    `Package: ${values.packageName}`,
    `Total Paid: $${values.finalPrice}`,
    `Special Requirements / Abstract: ${values.requirements}`,
    "Payment Status: Paid",
    `Stripe Payment Reference: ${values.stripeSessionId}`,
  ].join("\n");

  return {
    to_name: "ProSummits Team",
    reply_to: values.participantEmail,
    from_name: values.participantName,
    participant_name: values.participantName,
    registered_participant_email: values.participantEmail,
    phone: values.phone,
    country: values.country,
    organization: values.organization,
    job_title: values.jobTitle,
    event_title: values.eventTitle,
    event_date: values.eventDate,
    event_location: values.eventLocation,
    package_name: values.packageName,
    participation_type: values.participationType,
    final_price: values.finalPrice,
    requirements: values.requirements,
    reg_id: values.registrationId,
    payment_status: "paid",
    stripe_session_id: values.stripeSessionId,
    registration_details: registrationDetails,
    message: registrationDetails,
  };
};

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

  const values = getRegistrationValues(metadata, session, userEmail);

  // Persist the registration first so an email-provider failure never loses data.
  if (metadata.savedToSheets !== "true") {
    await appendToSheets(metadata, session);
    await stripe.checkout.sessions.update(session.id, {
      metadata: { savedToSheets: "true" },
    });
  }

  if (metadata.userConfirmationSent !== "true") {
    await sendEmailJsMessage(userEmail, buildUserTemplateParams(values));
    await stripe.checkout.sessions.update(session.id, {
      metadata: { userConfirmationSent: "true" },
    });
  }

  if (metadata.adminConfirmationSent !== "true") {
    await sendEmailJsMessage(ADMIN_EMAIL, buildAdminTemplateParams(values));
    await stripe.checkout.sessions.update(session.id, {
      metadata: { adminConfirmationSent: "true" },
    });
  }

  return session;
}
