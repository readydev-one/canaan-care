/* ============================================================
   EmailJS Form Submission Script
   ------------------------------------------------------------
   SETUP REQUIRED (see notes at bottom of this file):
   1. Sign up at https://www.emailjs.com/
   2. Create an Email Service  -> copy the SERVICE_ID
   3. Create an Email Template -> copy the TEMPLATE_ID
   4. Get your Public Key from Account > General
   5. Replace the three placeholders below
   6. Add the EmailJS SDK <script> tag to your HTML (see bottom)
   ============================================================ */

// (function () {
//   "use strict";

//   // ---- 1. CONFIG: replace with your own EmailJS values ----
//   const EMAILJS_PUBLIC_KEY        = "YOUR_PUBLIC_KEY";
//   const EMAILJS_SERVICE_ID        = "YOUR_SERVICE_ID";
//   const EMAILJS_TEMPLATE_ID_ADMIN = "YOUR_ADMIN_TEMPLATE_ID";        // shared across both forms
//   const EMAILJS_TEMPLATE_ID_USER  = "YOUR_CONFIRMATION_TEMPLATE_ID"; // shared across both forms

//   // Initialize EmailJS once the SDK script has loaded
//   if (window.emailjs) {
//     emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
//   } else {
//     console.error("EmailJS SDK not found. Make sure the CDN script tag is included before this file.");
//   }

//   // ---- 2. Helpers ----
//   function getSelectedRadio(name) {
//     const el = document.querySelector(`input[name="${name}"]:checked`);
//     return el ? el.value : "";
//   }

//   function showError(fieldId, show) {
//     const field = document.getElementById(fieldId);
//     if (field) field.classList.toggle("has-error", !!show);
//   }

//   function isValidEmail(value) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//   }

//   function isValidPhone(value) {
//     return /^[0-9+()\-.\s]{7,}$/.test(value);
//   }

//   // ---- 3. Step 1 validation (who + care type) ----
//   function validateStep1() {
//     let valid = true;

//     const who = getSelectedRadio("who");
//     const errWho = document.getElementById("err-who");
//     if (!who) {
//       if (errWho) errWho.style.display = "block";
//       valid = false;
//     } else if (errWho) {
//       errWho.style.display = "none";
//     }

//     const careType = document.getElementById("care-type").value;
//     const errCare = document.getElementById("err-care");
//     if (!careType) {
//       showError("field-care", true);
//       if (errCare) errCare.style.display = "block";
//       valid = false;
//     } else {
//       showError("field-care", false);
//       if (errCare) errCare.style.display = "none";
//     }

//     return valid;
//   }

//   // ---- 4. Step 2 validation (contact details) ----
//   function validateStep2() {
//     let valid = true;

//     const name = document.getElementById("inp-name").value.trim();
//     if (!name) {
//       showError("field-name", true);
//       valid = false;
//     } else {
//       showError("field-name", false);
//     }

//     const email = document.getElementById("inp-email").value.trim();
//     if (!email || !isValidEmail(email)) {
//       showError("field-email", true);
//       valid = false;
//     } else {
//       showError("field-email", false);
//     }

//     const phone = document.getElementById("inp-phone").value.trim();
//     if (!phone || !isValidPhone(phone)) {
//       showError("field-phone", true);
//       valid = false;
//     } else {
//       showError("field-phone", false);
//     }

//     return valid;
//   }

//   // ---- 5. Step navigation (extends your existing goStep flow) ----
//   // NOTE: if you already have a goStep() function elsewhere, remove
//   // this block and instead call validateStep1()/validateStep2()/
//   // submitForm() from inside your existing function at the right points.
//   window.goStep = function (step) {
//     const current = document.querySelector(".panel.visible");
//     const currentStepNum = current ? parseInt(current.id.replace("panel", ""), 10) : 1;

//     // Validate before moving forward
//     if (step > currentStepNum) {
//       if (currentStepNum === 1 && !validateStep1()) return;
//       if (currentStepNum === 2 && !validateStep2()) return;
//     }

//     // If moving into step 3, submit the form first
//     if (step === 3 && currentStepNum === 2) {
//       submitForm();
//       return; // submitForm() handles the panel switch after success
//     }

//     showPanel(step);
//   };

//   function showPanel(step) {
//     document.querySelectorAll(".panel").forEach((p) => p.classList.remove("visible"));
//     document.getElementById("panel" + step).classList.add("visible");

//     // Update progress dots
//     for (let i = 1; i <= 3; i++) {
//       const dot = document.getElementById("dot" + i);
//       const lbl = document.getElementById("lbl" + i);
//       if (i <= step) {
//         dot.classList.add("active");
//         lbl.classList.add("active");
//       } else {
//         dot.classList.remove("active");
//         lbl.classList.remove("active");
//       }
//     }

//     const bar = document.getElementById("progress-bar");
//     if (bar) bar.setAttribute("aria-valuenow", step);
//   }

//   // ---- 6. Build summary (step 3) ----
//   function populateSummary(data) {
//     document.getElementById("sum-who").textContent = data.who || "—";
//     document.getElementById("sum-care").textContent = data.care_type || "—";
//     document.getElementById("sum-name").textContent = data.name || "—";
//     document.getElementById("sum-email").textContent = data.email || "—";
//     document.getElementById("sum-phone").textContent = data.phone || "—";
//   }

//   // ---- 7. Submit via EmailJS ----
//   function submitForm() {
//     const submitBtn = document.querySelector("#panel2 .btn-next");
//     const originalLabel = submitBtn ? submitBtn.textContent : "";

//     const data = {
//       who: getSelectedRadio("who"),
//       care_type: document.getElementById("care-type").value,
//       name: document.getElementById("inp-name").value.trim(),
//       email: document.getElementById("inp-email").value.trim(),
//       phone: document.getElementById("inp-phone").value.trim(),
//       message: document.getElementById("inp-msg").value.trim(),
//     };

//     if (submitBtn) {
//       submitBtn.disabled = true;
//       submitBtn.textContent = "Sending…";
//     }

//     Promise.all([
//       emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMIN, data), // to admin
//       emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_USER, data),  // to customer
//     ])
//       .then(function () {
//         populateSummary(data);
//         showPanel(3);
//       })
//       .catch(function (err) {
//         console.error("EmailJS send failed:", err);
//         alert("Sorry, something went wrong sending your request. Please try again or contact us directly.");
//       })
//       .finally(function () {
//         if (submitBtn) {
//           submitBtn.disabled = false;
//           submitBtn.textContent = originalLabel;
//         }
//       });
//   }
// })();

/* ============================================================
   REQUIRED HTML ADDITIONS
   ------------------------------------------------------------
   1. Add the EmailJS SDK before this script:

   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   <script src="form-emailjs.js"></script>

   2. In your EmailJS templates, use variables matching the `data`
      object's keys, e.g.:
        {{who}}, {{care_type}}, {{name}}, {{email}}, {{phone}}, {{message}}

      Note: {{who}} and {{care_type}} will be blank when the OTHER
      form (form-contact-emailjs.js) submits, since that form doesn't
      collect those fields. Keep your templates tolerant of blanks,
      or wrap those lines conditionally if your template engine
      supports it.

   3. CSS note: this script toggles a `.has-error` class on the
      `.field` wrapper divs to show/hide field-error messages, and
      toggles `display:block/none` on #err-who directly (since it's
      not wrapped the same way). Adjust selectors if your CSS differs.
   ============================================================ */