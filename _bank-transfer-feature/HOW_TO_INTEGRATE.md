# 🏦 Bank Transfer Feature — Integration Guide

This folder contains all files needed to add a **Bank Transfer payment option** to the
ProSummits registration flow, alongside the existing Stripe card payment.

---

## 📁 Folder Structure

```
_bank-transfer-feature/
│
├── api/
│   ├── request-bank-transfer.js   → Copy to /api/
│   └── submit-bank-receipt.js     → Copy to /api/
│
├── src/
│   ├── pages/
│   │   └── BankTransferPage.jsx   → Copy to /src/pages/
│   └── styles/
│       └── BankTransfer.css       → Copy to /src/styles/
│
└── HOW_TO_INTEGRATE.md            ← You are here
```

---

## ✅ Step 1 — Copy the New Files

Copy the following files to their destinations in the main project:

| From (this folder)                   | Copy To                            |
|--------------------------------------|------------------------------------|
| `api/request-bank-transfer.js`       | `api/request-bank-transfer.js`     |
| `api/submit-bank-receipt.js`         | `api/submit-bank-receipt.js`       |
| `src/pages/BankTransferPage.jsx`     | `src/pages/BankTransferPage.jsx`   |
| `src/styles/BankTransfer.css`        | `src/styles/BankTransfer.css`      |

---

## ✅ Step 2 — Update `src/App.jsx`

Add this import near the other page imports (around line 15):

```jsx
import BankTransferPage from "./pages/BankTransferPage";
```

Add this route inside your `<Routes>` block (after the payment-cancel route):

```jsx
<Route path="/bank-transfer" element={<BankTransferPage />} />
```

---

## ✅ Step 3 — Update `src/pages/RegisterPage.jsx`

### 3a. Add state (line ~18, after `isSubmitting` state):

```jsx
const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "bank"
```

### 3b. Replace the entire `handleSubmit` function with this version
that branches between bank transfer and Stripe:

```jsx
// Final Submit — branches on payment method
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const registrationId = `PS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const participantName = `${form.firstName} ${form.lastName}`;

  // ── BANK TRANSFER path ──────────────────────────────────────────────
  if (paymentMethod === "bank") {
    try {
      const response = await fetch("/api/request-bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          participant: {
            name: participantName,
            email: form.email,
            phone: `${form.countryCode} ${form.phone}`,
            country: form.country,
            organization: form.organization || "Not Specified",
            jobTitle: form.jobTitle || "Not Specified",
          },
          event: {
            id: selectedEvent?._id || form.eventId,
            title: selectedEvent?.title || "Conference",
            date: selectedEvent?.date || "",
            location: selectedEvent?.loc || selectedEvent?.location || "",
          },
          package: { id: selectedPkg?.id },
          packageName: selectedPkg?.name || "",
          participationType,
          finalPrice: finalPrice.toFixed(2),
          coupon: appliedCoupon
            ? { code: appliedCoupon.code, description: appliedCoupon.description }
            : null,
          specialRequirements: form.specialRequirements || "",
        }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        console.warn("Bank transfer API returned non-JSON response — proceeding anyway.");
      }

      if (!response.ok && data.error) throw new Error(data.error);

      // Redirect to bank transfer page — details shown immediately
      const params = new URLSearchParams({
        ref: registrationId,
        email: form.email,
        name: participantName,
      });
      navigate(`/bank-transfer?${params.toString()}`);
    } catch (err) {
      console.error("Bank transfer request error:", err);
      if (err.message && !err.message.includes("JSON") && !err.message.includes("fetch")) {
        alert(err.message);
      }
      // Still redirect so customer can always see bank details
      const params = new URLSearchParams({
        ref: registrationId,
        email: form.email,
        name: participantName,
      });
      navigate(`/bank-transfer?${params.toString()}`);
    } finally {
      setIsSubmitting(false);
    }
    return;
  }

  // ── STRIPE CARD path ─────────────────────────────────────────────────
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        participant: {
          name: participantName,
          email: form.email,
          phone: `${form.countryCode} ${form.phone}`,
          country: form.country,
          organization: form.organization || "Not Specified",
          jobTitle: form.jobTitle || "Not Specified",
        },
        event: {
          id: selectedEvent?._id || form.eventId,
          title: selectedEvent?.title || "Conference",
          date: selectedEvent?.date || "",
          location: selectedEvent?.loc || selectedEvent?.location || "",
        },
        package: { id: selectedPkg?.id },
        participationType,
        coupon: appliedCoupon
          ? { code: appliedCoupon.code, description: appliedCoupon.description }
          : null,
        specialRequirements: form.specialRequirements || "",
      }),
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error(
        response.status === 404
          ? "The payment service was not found. Please refresh the page and try again."
          : "The payment service returned an invalid response. Please try again."
      );
    }

    if (!response.ok || !data.url) throw new Error(data.error || "Unable to start payment.");

    sessionStorage.setItem("prosummitsCheckoutPending", "true");
    window.location.assign(data.url);
  } catch (err) {
    console.error("Payment checkout error:", err);
    alert(err.message || "There was an error starting payment. Please try again or contact support.");
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3c. Add the Payment Method Selector UI in Step 3

Find the "Special Requirements" textarea block in the Step 3 JSX. Add the following
**directly after** it and **before** the Consent checkbox:

```jsx
{/* Payment Method Selector */}
<div className="pay-method-section">
  <div className="reg-divider" style={{ margin: '32px 0 20px' }}>
    <span>Choose Payment Method</span>
  </div>
  <div className="pay-method-grid">
    <div
      className={`pay-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
      onClick={() => setPaymentMethod('card')}
    >
      {paymentMethod === 'card' && <div className="pay-method-check">✓</div>}
      <span className="pay-method-icon">💳</span>
      <div className="pay-method-meta">
        <h4>Pay by Card</h4>
        <p>Secure online payment via Stripe. Instant confirmation.</p>
      </div>
      <div className="pay-method-badges">
        <span className="pay-badge visa">VISA</span>
        <span className="pay-badge mc">MC</span>
        <span className="pay-badge amex">AMEX</span>
      </div>
    </div>

    <div
      className={`pay-method-card ${paymentMethod === 'bank' ? 'active bank' : ''}`}
      onClick={() => setPaymentMethod('bank')}
    >
      {paymentMethod === 'bank' && <div className="pay-method-check bank">✓</div>}
      <span className="pay-method-icon">🏦</span>
      <div className="pay-method-meta">
        <h4>Bank Transfer (Wire)</h4>
        <p>Transfer directly to our US bank account. No extra fees. Details shown immediately — available 24/7.</p>
      </div>
      <div className="pay-method-badges">
        <span className="pay-badge wire">WIRE</span>
        <span className="pay-badge ach">ACH</span>
      </div>
    </div>
  </div>

  {paymentMethod === 'bank' && (
    <div className="pay-bank-info-strip">
      <span className="pay-bank-strip-icon">✅</span>
      <div>
        <strong>Bank details revealed instantly</strong> — no waiting for admin approval.
        Transfer at any time (day or night) and upload your receipt to complete registration.
      </div>
    </div>
  )}
</div>
```

### 3d. Update the Submit Button

Change the existing submit button to be context-aware:

```jsx
<button
  type="submit"
  disabled={isSubmitting}
  className={`reg-continue-btn ${paymentMethod === 'bank' ? 'bank-transfer-btn' : ''}`}
  style={{ flex: 1, width: 'auto' }}
>
  {isSubmitting
    ? (paymentMethod === 'bank' ? 'Processing...' : 'Redirecting to Payment...')
    : (paymentMethod === 'bank' ? '🏦 Get Bank Details & Pay by Transfer' : '💳 Pay & Complete Registration')
  }
</button>
```

---

## ✅ Step 4 — Add CSS to `src/styles/Register.css`

Paste these styles just before the `/* ══════════ Responsive ══════════ */` comment:

```css
/* ── Payment Method Selector ── */
.pay-method-section { margin-top: 8px; }

.pay-method-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.pay-method-card {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 20px 22px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pay-method-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
}

.pay-method-card.active {
  background: rgba(244, 123, 32, 0.05);
  border-color: #F47B20;
  box-shadow: 0 0 20px rgba(244, 123, 32, 0.1);
}

.pay-method-card.active.bank {
  background: rgba(0, 167, 157, 0.05);
  border-color: #00A79D;
  box-shadow: 0 0 20px rgba(0, 167, 157, 0.12);
}

.pay-method-check {
  position: absolute;
  top: 12px; right: 12px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #F47B20;
  color: #04101C;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(244, 123, 32, 0.35);
}

.pay-method-check.bank {
  background: #00A79D;
  box-shadow: 0 2px 8px rgba(0, 167, 157, 0.35);
}

.pay-method-icon { font-size: 1.8rem; line-height: 1; }

.pay-method-meta h4 { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 4px; }
.pay-method-meta p  { font-size: 0.78rem; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.4; }

.pay-method-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }

.pay-badge { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 4px; }
.pay-badge.visa  { background: rgba(25,72,194,0.2);   color: #6b9fff; border: 1px solid rgba(107,159,255,0.2); }
.pay-badge.mc    { background: rgba(235,0,27,0.15);   color: #ff7b7b; border: 1px solid rgba(255,123,123,0.2); }
.pay-badge.amex  { background: rgba(0,114,206,0.15);  color: #5eb8ff; border: 1px solid rgba(94,184,255,0.2); }
.pay-badge.wire  { background: rgba(0,167,157,0.15);  color: #00A79D; border: 1px solid rgba(0,167,157,0.25); }
.pay-badge.ach   { background: rgba(109,190,69,0.12); color: #6DBE45; border: 1px solid rgba(109,190,69,0.2); }

.pay-bank-info-strip {
  display: flex; align-items: flex-start; gap: 12px;
  background: rgba(0,167,157,0.06); border: 1px solid rgba(0,167,157,0.2);
  border-radius: 12px; padding: 14px 18px;
  font-size: 0.83rem; color: rgba(255,255,255,0.65); line-height: 1.5;
}
.pay-bank-strip-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
.pay-bank-info-strip strong { color: #00A79D; }

.reg-continue-btn.bank-transfer-btn {
  background: linear-gradient(135deg, #00A79D, #007a72);
  box-shadow: 0 10px 40px rgba(0, 167, 157, 0.22);
}
.reg-continue-btn.bank-transfer-btn:hover:not(:disabled) {
  box-shadow: 0 15px 50px rgba(0, 167, 157, 0.38);
}
```

Also update the `@media (max-width: 850px)` block to include `.pay-method-grid`:

```css
@media (max-width: 850px) {
  .participation-grid,
  .packages-grid,
  .pay-method-grid {
    grid-template-columns: 1fr;
  }
  ...
}
```

---

## ✅ Step 5 — Add to `.env`

```env
# Cloudinary (for receipt file uploads — image/PDF/DOCX)
# 1. Create free account at https://cloudinary.com
# 2. Settings → Upload → Upload Presets → Add (set to "Unsigned")
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name_here
```

Also add the same two vars to your **Vercel project settings** under Environment Variables.

---

## ✅ Step 6 — Update Bank Account Details

In `src/pages/BankTransferPage.jsx`, update the `BANK_DETAILS` constant at the top of the
file with your real US bank account information.

---

## ✅ Step 7 — Add Vite Dev Proxy (optional, for local testing only)

In `vite.config.js`, add a `server.proxy` block so `/api/*` routes work with `npm run dev`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

> On Vercel production, this is not needed. Remove it if you don't want it in dev either.

---

## 🔄 How the Feature Works

1. **Step 3 of registration** shows two payment method cards: Card (Stripe) and Bank Transfer
2. Selecting **Bank Transfer** changes the button to teal
3. On submit → `/api/request-bank-transfer` fires → admin gets email → customer redirects to `/bank-transfer`
4. `/bank-transfer` shows US bank account details **immediately (24/7, no admin needed)**
5. Customer uploads their receipt (JPG/PNG/PDF/DOCX, up to 10 MB, drag & drop)
6. File uploads to **Cloudinary** (free), URL sent to `/api/submit-bank-receipt`
7. Admin gets a second email with the receipt URL for verification
