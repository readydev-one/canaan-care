/* ============================================================
   EmailJS Script — "Send a Message" Contact Form
   ------------------------------------------------------------
   SETUP REQUIRED:
   1. Sign up at https://www.emailjs.com/
   2. Create TWO Email Templates — Admin notification + Customer
      confirmation — and use the SAME two template IDs in both
      this file and form-emailjs.js (the multi-step form's script),
      so both forms send through one shared pair of templates.
   3. Create an Email Service -> copy the SERVICE_ID
   4. Get your Public Key from Account > General
   5. Replace the placeholders below (must match form-emailjs.js)
   6. Add the EmailJS SDK script tag to your HTML (see bottom)
   ============================================================ */

(function () {
  "use strict";

  // ---- 1. CONFIG ----
  const EMAILJS_PUBLIC_KEY        = "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID        = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID_ADMIN = "YOUR_ADMIN_TEMPLATE_ID";   // notifies you/your team
  const EMAILJS_TEMPLATE_ID_USER  = "YOUR_CONFIRMATION_TEMPLATE_ID"; // sent to the customer

  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } else {
    console.error("EmailJS SDK not found. Make sure the CDN script tag is included before this file.");
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  const responseEl = form.querySelector(".ajax-response");
  const submitBtn = form.querySelector("button[type='submit']");
  const btnTextEl = submitBtn ? submitBtn.querySelector(".btn-text") : null;

  // ---- 2. Helpers ----
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(input, hasError) {
    input.style.borderColor = hasError ? "#e02424" : "";
  }

  function showResponse(message, isError) {
    if (!responseEl) return;
    responseEl.textContent = message;
    responseEl.style.color = isError ? "#e02424" : "#1a8a3d";
  }

  // ---- 3. Validation ----
  function validate(data, nameInput, emailInput, messageInput) {
    let valid = true;

    if (!data.name) {
      setFieldError(nameInput, true);
      valid = false;
    } else {
      setFieldError(nameInput, false);
    }

    if (!data.email || !isValidEmail(data.email)) {
      setFieldError(emailInput, true);
      valid = false;
    } else {
      setFieldError(emailInput, false);
    }

    if (!data.message) {
      setFieldError(messageInput, true);
      valid = false;
    } else {
      setFieldError(messageInput, false);
    }

    return valid;
  }

  // ---- 4. Submit handler ----
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = form.querySelector("input[name='name']");
    const emailInput = form.querySelector("input[name='email']");
    const phoneInput = form.querySelector("input[name='phone']");
    const messageInput = form.querySelector("textarea[name='message']");

    const data = {
      who: "",         // not collected on this form — kept blank for shared template compatibility
      care_type: "",   // not collected on this form — kept blank for shared template compatibility
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      message: messageInput.value.trim(),
    };

    if (!validate(data, nameInput, emailInput, messageInput)) {
      showResponse("Please fill out all required fields correctly.", true);
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (btnTextEl) btnTextEl.textContent = "Sending…";
    showResponse("", false);

    Promise.all([
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMIN, data), // to admin
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_USER, data),  // to customer
    ])
      .then(function () {
        showResponse("Thanks! Your message has been sent — we'll be in touch soon.", false);
        form.reset();
      })
      .catch(function (err) {
        console.error("EmailJS send failed:", err);
        showResponse("Sorry, something went wrong. Please try again or contact us directly.", true);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (btnTextEl) btnTextEl.textContent = "Send Message";
      });
  });
})();

/* ============================================================
   REQUIRED HTML ADDITIONS
   ------------------------------------------------------------
   1. Add the EmailJS SDK before this script (only once per page,
      even if you use it for both forms):

   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   <script src="form-contact-emailjs.js"></script>

   2. In your shared EmailJS templates, use variables matching the
      data object's keys: {{who}}, {{care_type}}, {{name}}, {{email}},
      {{phone}}, {{message}}. {{who}} and {{care_type}} will always
      be blank from this form — keep your template tolerant of that.

   3. The form's `action="assets/mail-contact-us.php"` and
      `method="POST"` attributes are now unused (since e.preventDefault()
      stops the native submit), but harmless to leave in place as a
      fallback if JS is disabled — or remove them if you don't need it.
   ============================================================ */