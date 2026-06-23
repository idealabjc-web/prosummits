import {
  calculateRegistrationPrice,
  getRegistrationSettings,
} from "../server/registration-pricing.js";

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

  try {
    const { packageId, couponCode } = req.body || {};
    if (!packageId || !couponCode) {
      return sendJson(res, 400, { error: "Package and coupon code are required." });
    }

    const settings = await getRegistrationSettings();
    const pricing = calculateRegistrationPrice(settings, packageId, couponCode);

    return sendJson(res, 200, {
      coupon: {
        code: pricing.couponCode,
        type: pricing.coupon.discountType,
        value: pricing.coupon.value,
        description: pricing.coupon.description || "Discount applied",
      },
      discount: pricing.discount / 100,
      finalPrice: pricing.amount / 100,
    });
  } catch (error) {
    const message = error.message || "Unable to validate coupon.";
    const isConfigurationError = message.includes("not configured");
    return sendJson(res, isConfigurationError ? 503 : 400, { error: message });
  }
}

