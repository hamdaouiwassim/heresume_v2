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
      window.App.showUser(user);
      showNote(profileForm, 'Saved');
    } catch (error) {
      showNote(profileForm, error.message, true);
    }
  });

  // Password
  const passwordForm = document.getElementById('passwordForm');
  const currentField = passwordForm.elements.current.closest('.field');
  // Accounts created with Google have no password yet; they can set one without the current field
  const syncPasswordForm = () => { currentField.hidden = !user.password; };
  syncPasswordForm();

  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { current, next } = passwordForm.elements;
    const checks = user.password ? [[current, rules.password], [next, rules.newPassword]] : [[next, rules.newPassword]];
    if (!validate(checks)) return;
    try {
      await Auth.changePassword(user.id, current.value, next.value);
      user = Auth.current();
      syncPasswordForm();
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
