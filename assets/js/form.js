const EMAILJS_PUBLIC_KEY        = "63jyhOgggx-EvPEAR";
const EMAILJS_SERVICE_ID        = "service_mc2q2lb";
const EMAILJS_TEMPLATE_ID_ADMIN = "template_193n305"; // shared across both forms
const EMAILJS_TEMPLATE_ID_USER  = "template_6e7o9li"; // shared across both forms


function scrollToForm(e) {
  e.preventDefault();
  var target = document.getElementById('consultation');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
    // Remove the hash from the URL so the browser stops re-anchoring
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

let currentStep = 1;

function announce(msg) {
  var sr = document.getElementById('sr-announce');
  sr.textContent = '';
  setTimeout(function() { sr.textContent = msg; }, 50);
}

function setStep(n) {
  [1, 2, 3].forEach(function(i) {
    var panel = document.getElementById('panel' + i);
    var dot   = document.getElementById('dot' + i);
    var lbl   = document.getElementById('lbl' + i);

    panel.classList.toggle('visible', i === n);
    dot.classList.remove('active', 'done');
    lbl.classList.remove('active');

    if (i < n) {
      dot.classList.add('done');
      dot.innerHTML = '<i class="ti ti-check" style="font-size:14px" aria-hidden="true"></i>';
    } else if (i === n) {
      dot.classList.add('active');
      dot.textContent = i;
      lbl.classList.add('active');
    } else {
      dot.textContent = i;
    }
  });

  [1, 2].forEach(function(i) {
    document.getElementById('line' + i).classList.toggle('done', i < n);
  });

  document.getElementById('progress-bar').setAttribute('aria-valuenow', n);

  currentStep = n;

  // Move focus to the new panel heading so screen readers announce the step
  var heading = document.querySelector('#panel' + n + ' h1, #panel' + n + ' h4, #panel' + n + ' h2');
  if (heading) {
    heading.setAttribute('tabindex', '-1');

    // Preserve scroll position across browsers that ignore preventScroll
    var scrollX = window.scrollX;
    var scrollY = window.scrollY;
    heading.focus({ preventScroll: true });
    window.scrollTo(scrollX, scrollY);
  }
}

function goStep(n) {
  if (n > currentStep) {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
  }
  if (n === 3) {
    fillSummary();
    setStep(3);
    sendEnquiry();
    return;
  }
  setStep(n);
}


function validateStep1() {
  var ok = true;

  var who    = document.querySelector('input[name="who"]:checked');
  var errWho = document.getElementById('err-who');
  if (!who) {
    errWho.style.display = 'block';
    ok = false;
  } else {
    errWho.style.display = 'none';
  }

  var care      = document.getElementById('care-type').value;
  var fieldCare = document.getElementById('field-care');
  if (!care) {
    fieldCare.classList.add('error');
    ok = false;
  } else {
    fieldCare.classList.remove('error');
  }

  if (!ok) announce('Please fix the errors on this step before continuing.');
  return ok;
}

function validateStep2() {
  var ok = true;
  var checks = [
    {
      fieldId: 'field-name',
      inputId: 'inp-name',
      test: function(v) { return v.trim().length > 1; }
    },
    {
      fieldId: 'field-email',
      inputId: 'inp-email',
      test: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
    },
    {
      fieldId: 'field-phone',
      inputId: 'inp-phone',
      test: function(v) { return v.trim().length > 6; }
    }
  ];

  checks.forEach(function(c) {
    var val   = document.getElementById(c.inputId).value;
    var field = document.getElementById(c.fieldId);
    if (!c.test(val)) {
      field.classList.add('error');
      ok = false;
    } else {
      field.classList.remove('error');
    }
  });

  if (!ok) announce('Please fix the errors on this step before continuing.');
  return ok;
}

function sendEnquiry() {
  var who   = document.querySelector('input[name="who"]:checked');
  var care  = document.getElementById('care-type').value;
  var name  = document.getElementById('inp-name').value.trim();
  var email = document.getElementById('inp-email').value.trim();
  var phone = document.getElementById('inp-phone').value.trim();
  var msg   = document.getElementById('inp-msg').value.trim();

  var submissionDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  var templateParams = {
    client_name:     name,
    phone:           phone,
    email:           email,
    Who:             who ? who.value : '—',
    service:         care || '—',
    submission_date: submissionDate,
    message:         msg || '—'
  };

  emailjs.init(EMAILJS_PUBLIC_KEY);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_ADMIN, templateParams)
    .then(function() {
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID_USER, templateParams);
    })
    .catch(function(err) {
      console.error('EmailJS error:', err);
      announce('Something went wrong sending your enquiry. Please contact us directly.');
    });
}

function fillSummary() {
  var who = document.querySelector('input[name="who"]:checked');
  document.getElementById('sum-who').textContent   = who ? who.value : '—';
  document.getElementById('sum-care').textContent  = document.getElementById('care-type').value || '—';
  document.getElementById('sum-name').textContent  = document.getElementById('inp-name').value.trim() || '—';
  document.getElementById('sum-email').textContent = document.getElementById('inp-email').value.trim() || '—';
  document.getElementById('sum-phone').textContent = document.getElementById('inp-phone').value.trim() || '—';
}

