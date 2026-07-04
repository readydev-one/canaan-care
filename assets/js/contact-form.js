
const EMAILJS_PUBLIC_KEY        = "63jyhOgggx-EvPEAR";
const EMAILJS_SERVICE_ID        = "service_mc2q2lb";
const EMAILJS_TEMPLATE_ID_ADMIN = "template_193n305";
const EMAILJS_TEMPLATE_ID_USER  = "template_6e7o9li";

emailjs.init(EMAILJS_PUBLIC_KEY);




(function() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    sendContactForm();
  });
})();

function sendContactForm() {
  var form = document.getElementById('contact-form');
  var responseEl = form.querySelector('.ajax-response');
  var submitBtn = form.querySelector('button[type="submit"]');

  var name  = form.querySelector('[name="name"]').value.trim();
  var email = form.querySelector('[name="email"]').value.trim();
  var phone = form.querySelector('[name="phone"]').value.trim();
  var msg   = form.querySelector('[name="message"]').value.trim();

  // Basic validation
  if (!name || !email || !msg) {
    responseEl.textContent = 'Please fill in your name, email, and message.';
    responseEl.style.color = 'crimson';
    return;
  }

  var submissionDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  var templateParams = {
    client_name:     name,
    phone:           phone || '—',
    email:           email,
    Who:             '—',
    service:         'General Enquiry',
    submission_date: submissionDate,
    message:         msg
  };

  submitBtn.disabled = true;
  responseEl.textContent = 'Sending…';
  responseEl.style.color = '';

  emailjs.init(EMAILJS_PUBLIC_KEY);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMIN, templateParams)
    .then(function() {
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_USER, templateParams);
    })
    .then(function() {
      responseEl.textContent = 'Thank you! Your message has been sent.';
      responseEl.style.color = 'green';
      form.reset();
    })
    .catch(function(err) {
      console.error('EmailJS error:', err);
      responseEl.textContent = 'Sorry, something went wrong. Please try again or contact us directly.';
      responseEl.style.color = 'crimson';
    })
    .finally(function() {
      submitBtn.disabled = false;
    });
}