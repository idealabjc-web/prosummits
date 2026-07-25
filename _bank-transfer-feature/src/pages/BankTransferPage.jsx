import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/BankTransfer.css";

// ─── Bank Account Details ───────────────────────────────────────────────────
// ⚠️  UPDATE THESE with your actual US bank account details before going live!
const BANK_DETAILS = {
  bankName: "YOUR BANK NAME",
  accountHolderName: "ProSummits LLC",
  accountNumber: "XXXX-XXXX-XXXX",
  routingNumber: "XXXXXXXXX",
  swiftBic: "XXXXXXXXX",
  bankAddress: "123 Bank Street, New York, NY 10001, USA",
  accountType: "Checking",
  currency: "USD",
};
// ────────────────────────────────────────────────────────────────────────────

// ─── Cloudinary Config ───────────────────────────────────────────────────────
// Set these in your .env file:
//   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//   VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
const CLOUDINARY_CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME    || "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
// ────────────────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
  "application/pdf": true,
  "application/msword": true,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
};
const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 10;

function getFileIcon(file) {
  if (!file) return "📎";
  if (file.type === "application/pdf") return "📕";
  if (file.type.startsWith("image/")) return "🖼️";
  if (file.type.includes("word") || file.name.endsWith(".doc") || file.name.endsWith(".docx")) return "📝";
  return "📎";
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BankTransferPage() {
  const [params] = useSearchParams();
  const registrationId    = params.get("ref")   || "";
  const participantEmail  = params.get("email") || "";
  const participantName   = params.get("name")  || "";

  // Upload state
  const [selectedFile,    setSelectedFile]    = useState(null);
  const [uploadProgress,  setUploadProgress]  = useState(0);
  const [uploadedUrl,     setUploadedUrl]     = useState("");
  const [isUploading,     setIsUploading]     = useState(false);
  const [uploadError,     setUploadError]     = useState("");
  const [isDragging,      setIsDragging]      = useState(false);

  // Form state
  const [receiptNote,   setReceiptNote]   = useState("");
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitError,   setSubmitError]   = useState("");
  const [isSubmitted,   setIsSubmitted]   = useState(false);
  const [copied,        setCopied]        = useState("");

  const fileInputRef = useRef(null);
  const dropZoneRef  = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Copy to clipboard
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  // ── File validation
  const validateFile = (file) => {
    if (!file) return "No file selected.";
    if (!ACCEPTED_TYPES[file.type] && !file.name.match(/\.(doc|docx|pdf|jpg|jpeg|png|webp|gif)$/i)) {
      return "Only images (JPG, PNG, WEBP, GIF), PDF, and Word documents (DOC, DOCX) are accepted.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null;
  };

  // ── Upload to Cloudinary
  const uploadToCloudinary = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) { setUploadError(validationError); return; }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      // Fallback: store reference without uploading
      setSelectedFile(file);
      setUploadedUrl("__local__");
      setUploadError("");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadedUrl("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "prosummits/receipts");
    formData.append("resource_type", "auto");
    formData.append("public_id", `receipt_${registrationId}_${Date.now()}`);

    const resourceType =
      file.type === "application/pdf" ||
      file.type.includes("word") ||
      file.name.match(/\.(doc|docx)$/i)
        ? "raw"
        : "image";

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      });

      const result = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err?.error?.message || "Upload failed."));
            } catch {
              reject(new Error("Upload failed. Please try again."));
            }
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(formData);
      });

      setUploadedUrl(result.secure_url);
      setUploadProgress(100);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, [registrationId]);

  // ── Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setUploadedUrl("");
    setUploadProgress(0);
    setUploadError("");
    setSubmitError("");
    uploadToCloudinary(file);
  };

  // ── Drag & drop handlers
  const handleDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); if (!dropZoneRef.current?.contains(e.relatedTarget)) setIsDragging(false); };
  const handleDrop      = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };
  const handleInputChange = (e) => { const f = e.target.files[0]; if (f) handleFileSelect(f); e.target.value = ""; };
  const handleRemoveFile  = () => { setSelectedFile(null); setUploadedUrl(""); setUploadProgress(0); setUploadError(""); setSubmitError(""); };

  // ── Submit receipt
  const handleSubmitReceipt = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!selectedFile && !uploadedUrl)  { setSubmitError("Please upload your payment receipt before submitting."); return; }
    if (isUploading)                    { setSubmitError("Please wait for the file to finish uploading."); return; }
    if (uploadError)                    { setSubmitError("Please fix the upload error before submitting."); return; }

    const receiptLink = uploadedUrl === "__local__"
      ? `[Local file: ${selectedFile?.name}]`
      : uploadedUrl;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submit-bank-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          participantName,
          participantEmail,
          receiptLink,
          receiptFileName: selectedFile?.name || "",
          receiptNote: receiptNote.trim(),
        }),
      });

      const responseText = await response.text();
      let data = {};
      try { data = responseText ? JSON.parse(responseText) : {}; }
      catch { if (!response.ok) throw new Error("Server error. Please try again."); }
      if (!response.ok) throw new Error(data.error || "Unable to submit receipt.");

      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(err.message || "Unable to submit your receipt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── No registration ID
  if (!registrationId) {
    return (
      <div className="page-fade">
        <div className="bt-page">
          <div className="bt-no-ref">
            <div className="bt-no-ref-icon">⚠️</div>
            <h2>Invalid Link</h2>
            <p>This page requires a valid registration reference. Please go back to the registration form and select Bank Transfer again.</p>
            <Link to="/register" className="bt-back-link">← Back to Registration</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Success screen
  if (isSubmitted) {
    return (
      <div className="page-fade">
        <div className="bt-page">
          <div className="bt-success page-fade-in">
            <div className="bt-success-icon">✓</div>
            <h2>Receipt Submitted!</h2>
            <p className="bt-success-ref">Ref: {registrationId}</p>
            <p>
              Thank you! Our team will verify your bank transfer within{" "}
              <strong>1–2 business days</strong>. Once confirmed, you will receive a
              registration confirmation email at <strong>{participantEmail || "your email"}</strong>.
            </p>
            <p className="bt-success-note">
              Questions? Email us at{" "}
              <a href="mailto:contact@prosummits.org">contact@prosummits.org</a> with
              reference number <strong>{registrationId}</strong>.
            </p>
            <Link to="/" className="bt-back-link">← Return to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-fade">
      <div className="bt-page">
        {/* Hero */}
        <div className="bt-hero">
          <span className="bt-hero-tag">Bank Transfer</span>
          <h1 className="bt-hero-title">Complete Your Payment</h1>
          <p className="bt-hero-sub">
            Follow the instructions below to transfer your registration fee.
            Bank details are available 24/7 — transfer at any time.
          </p>
        </div>

        {/* Reference Banner */}
        <div className="bt-ref-banner page-fade-in">
          <div className="bt-ref-inner">
            <span className="bt-ref-label">Your Registration Reference</span>
            <span className="bt-ref-id">{registrationId}</span>
          </div>
          <p className="bt-ref-note">
            ⚠️ Include this reference number in the wire transfer description / remarks field.
          </p>
        </div>

        <div className="bt-layout">
          {/* LEFT: Bank Details */}
          <div className="bt-card page-fade-in">
            <div className="bt-card-header">
              <span className="bt-card-icon">🏦</span>
              <div>
                <h2>Bank Account Details</h2>
                <p>Use the details below to initiate your wire transfer</p>
              </div>
            </div>

            <div className="bt-details-grid">
              {[
                { label: "Bank Name",                value: BANK_DETAILS.bankName,          field: "bankName"  },
                { label: "Account Holder",           value: BANK_DETAILS.accountHolderName, field: "holder"    },
                { label: "Account Number",           value: BANK_DETAILS.accountNumber,     field: "accNum"    },
                { label: "Routing Number (ACH/Wire)",value: BANK_DETAILS.routingNumber,     field: "routing"   },
                { label: "SWIFT / BIC Code",         value: BANK_DETAILS.swiftBic,          field: "swift"     },
                { label: "Account Type",             value: BANK_DETAILS.accountType,       field: "accType"   },
                { label: "Currency",                 value: BANK_DETAILS.currency,          field: "currency"  },
                { label: "Bank Address",             value: BANK_DETAILS.bankAddress,       field: "address"   },
              ].map(({ label, value, field }) => (
                <div key={field} className="bt-detail-row">
                  <span className="bt-detail-label">{label}</span>
                  <div className="bt-detail-value-wrap">
                    <span className="bt-detail-value">{value}</span>
                    <button
                      type="button"
                      className={`bt-copy-btn ${copied === field ? "copied" : ""}`}
                      onClick={() => copyToClipboard(value, field)}
                      title="Copy to clipboard"
                    >
                      {copied === field ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bt-info-box">
              <h4>📋 Important Instructions</h4>
              <ul>
                <li>Include reference <strong>{registrationId}</strong> in the transfer remarks</li>
                <li>Transfer the <strong>exact amount</strong> from your registration summary</li>
                <li>International transfers may take <strong>3–7 business days</strong></li>
                <li>Domestic US (ACH) transfers clear within <strong>1–2 business days</strong></li>
                <li>Upload your receipt below after transferring</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Receipt Upload */}
          <div className="bt-card bt-receipt-card page-fade-in">
            <div className="bt-card-header">
              <span className="bt-card-icon">📤</span>
              <div>
                <h2>Upload Payment Receipt</h2>
                <p>Upload your receipt to speed up verification</p>
              </div>
            </div>

            <form onSubmit={handleSubmitReceipt} className="bt-receipt-form">
              <div className="bt-form-field">
                <label>Registration Reference</label>
                <div className="bt-readonly-field">{registrationId}</div>
              </div>
              {participantEmail && (
                <div className="bt-form-field">
                  <label>Email Address</label>
                  <div className="bt-readonly-field">{participantEmail}</div>
                </div>
              )}

              {/* Drop Zone */}
              <div className="bt-form-field">
                <label>Payment Receipt *</label>
                {!selectedFile ? (
                  <div
                    ref={dropZoneRef}
                    className={`bt-dropzone ${isDragging ? "dragging" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    aria-label="Upload receipt file"
                  >
                    <div className="bt-dropzone-icon">{isDragging ? "📂" : "📁"}</div>
                    <p className="bt-dropzone-title">{isDragging ? "Drop your file here" : "Drag & drop your receipt here"}</p>
                    <p className="bt-dropzone-sub">or click to browse</p>
                    <div className="bt-dropzone-types">
                      <span>JPG</span><span>PNG</span><span>PDF</span><span>DOC</span><span>DOCX</span>
                    </div>
                    <p className="bt-dropzone-limit">Max file size: {MAX_FILE_SIZE_MB} MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_EXTENSIONS}
                      onChange={handleInputChange}
                      style={{ display: "none" }}
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <div className="bt-file-preview">
                    <div className="bt-file-info">
                      <span className="bt-file-icon">{getFileIcon(selectedFile)}</span>
                      <div className="bt-file-meta">
                        <span className="bt-file-name">{selectedFile.name}</span>
                        <span className="bt-file-size">{formatBytes(selectedFile.size)}</span>
                      </div>
                      {!isUploading && (
                        <button type="button" className="bt-file-remove" onClick={handleRemoveFile} title="Remove file">✕</button>
                      )}
                    </div>
                    {isUploading && (
                      <div className="bt-upload-progress">
                        <div className="bt-progress-bar">
                          <div className="bt-progress-fill" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="bt-progress-text">Uploading… {uploadProgress}%</span>
                      </div>
                    )}
                    {uploadedUrl && !isUploading && (
                      <div className="bt-upload-success">
                        <span>✓</span>
                        <span>{uploadedUrl === "__local__" ? "File ready (Cloudinary not configured)" : "Uploaded successfully"}</span>
                      </div>
                    )}
                    {uploadError && !isUploading && (
                      <div className="bt-upload-error">
                        <span>⚠</span>
                        <span>{uploadError}</span>
                        <button type="button" onClick={() => uploadToCloudinary(selectedFile)}>Retry</button>
                      </div>
                    )}
                  </div>
                )}
                {uploadError && !selectedFile && (
                  <div className="bt-error-msg" style={{ marginTop: 8 }}>⚠ {uploadError}</div>
                )}
              </div>

              <div className="bt-form-field">
                <label>Additional Note (optional)</label>
                <textarea
                  placeholder="e.g. Transferred on July 8 from Bank of India. Transaction ID: XXXX"
                  value={receiptNote}
                  onChange={(e) => setReceiptNote(e.target.value)}
                  className="bt-textarea"
                  rows={3}
                />
              </div>

              {submitError && <div className="bt-error-msg">⚠ {submitError}</div>}

              <button
                type="submit"
                className="bt-submit-btn"
                disabled={isSubmitting || isUploading || !selectedFile}
              >
                {isSubmitting ? "Submitting Receipt…" : isUploading ? "Uploading File…" : "Submit Receipt →"}
              </button>

              <p className="bt-skip-note">
                Having trouble?{" "}
                <a href={`mailto:contact@prosummits.org?subject=Bank Transfer Receipt - ${registrationId}`}>
                  Email your receipt directly
                </a>{" "}
                with reference number <strong>{registrationId}</strong>.
              </p>
            </form>
          </div>
        </div>

        {/* Help box */}
        <div className="bt-help-box page-fade-in">
          <span className="bt-help-icon">💬</span>
          <div>
            <strong>Need Help?</strong>
            <p>
              Our support team is available 24/7 via email.{" "}
              <a href="mailto:contact@prosummits.org">contact@prosummits.org</a>
              {" — "}Quote your reference number <strong>{registrationId}</strong>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
