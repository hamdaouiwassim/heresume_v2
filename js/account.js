(function () {
  let user = window.App.initShell();
  if (!user) return;

  const { Auth, utils } = window.CVM;
  const { validate, rules } = window.Forms;

  document.getElementById('memberSince').textContent = `Member since ${utils.formatDate(user.createdAt)}`;

  function showNote(form, message, isError = false) {
    const note = form.querySelector('[data-note]');
    note.textContent = message;
    note.classList.toggle('is-error', isError);
    clearTimeout(note._timer);
    if (!isError) note._timer = setTimeout(() => { note.textContent = ''; }, 2500);
  }

  // Profile
  const profileForm = document.getElementById('profileForm');
  profileForm.elements.name.value = user.name;
  profileForm.elements.email.value = user.email;

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const { name, email } = profileForm.elements;
    if (!validate([[name, rules.name], [email, rules.email]])) return;
    try {
      user = Auth.updateProfile(user.id, { name: name.value, email: email.value });
      document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = utils.initials(user.name); });
      showNote(profileForm, 'Saved');
    } catch (error) {
      showNote(profileForm, error.message, true);
    }
  });

  // Password
  const passwordForm = document.getElementById('passwordForm');
  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { current, next } = passwordForm.elements;
    if (!validate([[current, rules.password], [next, rules.newPassword]])) return;
    try {
      await Auth.changePassword(user.id, current.value, next.value);
      passwordForm.reset();
      showNote(passwordForm, 'Password updated');
    } catch (error) {
      showNote(passwordForm, error.message, true);
    }
  });

  // Delete account
  document.getElementById('deleteAccount').addEventListener('click', async () => {
    const ok = await window.App.confirmAction({
      title: 'Delete your account?',
      message: 'Your account and all of your resumes will be permanently deleted. This cannot be undone.',
      confirmLabel: 'Delete account',
      danger: true,
    });
    if (ok) {
      Auth.deleteAccount(user.id);
      location.href = 'index.html';
    }
  });
})();
