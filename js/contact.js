/*
 * Contact form.
 * Set CONTACT_ENDPOINT to a form service URL (e.g. https://formspree.io/f/xxxx) to send messages directly.
 * While it is empty, the form opens the visitor's email app with the message filled in.
 */
(function () {
  const CONTACT_ENDPOINT = '';
  const CONTACT_EMAIL = 'hello@cvmaker.app';

  const { validate, rules, setFormError } = window.Forms;
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  const successText = document.getElementById('contactSuccessText');

  // Prefill for signed-in users
  const user = window.CVM.Auth.current();
  if (user) {
    form.elements.name.value = user.name;
    form.elements.email.value = user.email;
  }

  function showSuccess(message) {
    successText.textContent = message;
    form.hidden = true;
    success.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormError(form, '');
    const { name, email, topic, message } = form.elements;
    const ok = validate([
      [name, rules.name],
      [email, rules.email],
      [message, (v) => (v.length >= 10 ? '' : 'Please write a message of at least 10 characters.')],
    ]);
    if (!ok) return;

    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      topic: topic.value,
      message: message.value.trim(),
    };

    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`${payload.topic} — ${payload.name}`);
      const body = encodeURIComponent(`${payload.message}\n\n${payload.name}\n${payload.email}`);
      location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      showSuccess('Your email app should open with your message ready to send.');
      return;
    }

    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      form.reset();
      showSuccess('Your message has been sent. We’ll reply to the email address you provided.');
    } catch {
      setFormError(form, `Your message could not be sent. Please try again, or email us at ${CONTACT_EMAIL}.`);
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById('contactAgain').addEventListener('click', () => {
    form.elements.message.value = '';
    success.hidden = true;
    form.hidden = false;
    form.elements.message.focus();
  });
})();
