import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: "gmr7l147",
  dataset: "production",
  apiVersion: "2024-03-11",
  useCdn: false,
});

const SETTINGS_QUERY = `*[
  _type == "registrationSettings" && _id == "registrationSettings"
][0]{
  currency,
  packages[]{id, name, participationType, price, active},
  coupons[]{code, discountType, value, description, active}
}`;

export async function getRegistrationSettings() {
  const settings = await sanity.fetch(SETTINGS_QUERY);

  if (!settings || !Array.isArray(settings.packages)) {
    throw new Error("Registration pricing is not configured in Sanity.");
  }

  return settings;
}

export function calculateRegistrationPrice(settings, packageId, couponCode = "") {
  const selectedPackage = settings.packages.find(
    (item) => item.id === packageId && item.active !== false
  );

  if (!selectedPackage || !Number.isFinite(selectedPackage.price)) {
    throw new Error("Invalid registration package.");
  }

  const normalizedCouponCode = String(couponCode || "").trim().toUpperCase();
  const coupon = normalizedCouponCode
    ? settings.coupons?.find(
        (item) =>
          String(item.code || "").trim().toUpperCase() === normalizedCouponCode &&
          item.active !== false
      )
    : null;

  if (normalizedCouponCode && !coupon) {
    throw new Error("Invalid coupon code.");
  }

  const subtotal = Math.round(selectedPackage.price * 100);
  let discount = 0;

  if (coupon?.discountType === "percent") {
    if (!Number.isFinite(coupon.value) || coupon.value <= 0 || coupon.value > 100) {
      throw new Error("Invalid coupon configuration.");
    }
    discount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon?.discountType === "amount") {
    if (!Number.isFinite(coupon.value) || coupon.value <= 0) {
      throw new Error("Invalid coupon configuration.");
    }
    discount = Math.min(Math.round(coupon.value * 100), subtotal);
  }

  const amount = subtotal - discount;
  if (amount < 50) {
    throw new Error("Payment amount must be at least 0.50.");
  }

  return {
    packageDetails: selectedPackage,
    coupon,
    couponCode: normalizedCouponCode,
    currency: String(settings.currency || "usd").toLowerCase(),
    subtotal,
    discount,
    amount,
  };
}

