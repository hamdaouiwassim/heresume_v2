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

  /* ---------- Google sign-in (Google Identity Services, token flow) ---------- */

  const googleButton = document.querySelector('[data-google-signin]');
  if (googleButton) {
    const clientId = (window.HRESUME_CONFIG || {}).googleClientId;
    const errorEl = document.querySelector('[data-google-error]');
    let tokenClient = null;

    const showError = (message) => {
      errorEl.textContent = message || '';
      errorEl.hidden = !message;
      googleButton.disabled = false;
    };

    function loadGsi() {
      if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Could not reach Google. Check your connection and try again.'));
        document.head.appendChild(script);
      });
    }

    async function onToken(response) {
      if (response.error) {
        showError(response.error === 'access_denied' ? '' : 'Google sign-in failed. Please try again.');
        return;
      }
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        });
        if (!res.ok) throw new Error();
        const profile = await res.json();
        if (!profile.email || !profile.email_verified) {
          showError('Your Google account needs a verified email address.');
          return;
        }
        Auth.loginWithGoogle(profile);
        location.href = 'dashboard.html';
      } catch {
        showError('Google sign-in failed. Please try again.');
      }
    }

    googleButton.addEventListener('click', async () => {
      showError('');
      if (!clientId) {
        showError('Google sign-in isn’t set up yet. Add a client ID in js/config.js.');
        return;
      }
      googleButton.disabled = true;
      try {
        await loadGsi();
        tokenClient = tokenClient || google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: onToken,
          error_callback: () => showError(''), // popup closed or blocked
        });
        tokenClient.requestAccessToken();
      } catch (error) {
        showError(error.message);
      }
    });
  }

  window.Forms = { validate, rules, setFieldError, setFormError };
})();
