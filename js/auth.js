/*
 * Login and registration forms, plus small form helpers reused on the account page.
 */
(function () {
  const { Auth } = window.CVM;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, message) {
    const field = input.closest('.field');
    field.classList.toggle('has-error', Boolean(message));
    let error = field.querySelector('.field-error');
    if (message) {
      if (!error) {
        error = document.createElement('span');
        error.className = 'field-error';
        field.appendChild(error);
      }
      error.textContent = message;
    } else if (error) {
      error.remove();
    }
  }

  function setFormError(form, message) {
    const el = form.querySelector('[data-form-error]');
    if (!el) return;
    el.textContent = message || '';
    el.hidden = !message;
  }

  /* Runs the given rules and shows the first error per field. Returns true when valid. */
  function validate(rules) {
    let firstInvalid = null;
    rules.forEach(([input, check]) => {
      const message = check(input.value.trim());
      setFieldError(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  const rules = {
    name: (v) => (v ? '' : 'Enter your name.'),
    email: (v) => (!v ? 'Enter your email.' : EMAIL_RE.test(v) ? '' : 'Enter a valid email address.'),
    password: (v) => (v ? '' : 'Enter your password.'),
    newPassword: (v) => (v.length >= 8 ? '' : 'Use at least 8 characters.'),
  };

  // Clear a field's error as soon as the user edits it
  document.addEventListener('input', (event) => {
    if (event.target.closest('.field.has-error')) setFieldError(event.target, '');
  });

  // Show / hide password
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-toggle-password]');
    if (!toggle) return;
    const input = toggle.parentElement.querySelector('input');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show';
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setFormError(loginForm, '');
      const { email, password } = loginForm.elements;
      if (!validate([[email, rules.email], [password, rules.password]])) return;

      const button = loginForm.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        await Auth.login(email.value, password.value);
        location.href = 'dashboard.html';
      } catch (error) {
        setFormError(loginForm, error.message);
        button.disabled = false;
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      setFormError(registerForm, '');
      const { name, email, password } = registerForm.elements;
      if (!validate([[name, rules.name], [email, rules.email], [password, rules.newPassword]])) return;

      const button = registerForm.querySelector('[type="submit"]');
      button.disabled = true;
      try {
        await Auth.register({ name: name.value, email: email.value, password: password.value });
        location.href = 'dashboard.html';
      } catch (error) {
        setFormError(registerForm, error.message);
        button.disabled = false;
      }
    });
  }

  window.Forms = { validate, rules, setFieldError, setFormError };
})();
