/*
 * Shared behaviour for signed-in pages: header, logout, and dialogs.
 */
(function () {
  const { Auth, Resumes, utils } = window.CVM;
  const esc = utils.escapeHtml;

  function initShell() {
    const user = Auth.requireUser();
    if (!user) return null;

    const page = document.body.dataset.page;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.classList.toggle('is-active', link.dataset.nav === page);
    });

    showUser(user);
    initUserMenu();

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="logout"]')) {
        Auth.logout();
        location.href = 'index.html';
      }
    });

    return user;
  }

  /* Fills the user's initials, name and email in the header (also called after a profile change). */
  function showUser(user) {
    document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = utils.initials(user.name); });
    document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = user.name; });
    document.querySelectorAll('[data-user-email]').forEach((el) => { el.textContent = user.email; });
  }

  /* User dropdown at the top right: Account and Log out. */
  function initUserMenu() {
    const button = document.getElementById('userMenuButton');
    const list = document.getElementById('userMenuList');
    if (!button || !list) return;
    const items = () => Array.from(list.querySelectorAll('[role="menuitem"]'));

    function setOpen(open, focusFirst = false) {
      list.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      if (open && focusFirst) items()[0].focus();
    }

    button.addEventListener('click', () => setOpen(list.hidden));

    button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(true, true);
      }
    });

    list.addEventListener('keydown', (event) => {
      const all = items();
      const index = all.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        all[(index + step + all.length) % all.length].focus();
      } else if (event.key === 'Tab') {
        setOpen(false);
      }
    });

    document.addEventListener('click', (event) => {
      if (!list.hidden && !event.target.closest('#userMenu')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !list.hidden) {
        setOpen(false);
        button.focus();
      }
    });
  }

  function createDialog(html, className = '') {
    const dialog = document.createElement('dialog');
    dialog.className = className;
    dialog.innerHTML = html;
    document.body.appendChild(dialog);
    dialog.addEventListener('close', () => dialog.remove());
    // Close when clicking the backdrop
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.showModal();
    return dialog;
  }

  /* Asks for confirmation. Resolves to true when confirmed. */
  function confirmAction({ title, message, confirmLabel = 'Confirm', danger = false }) {
    return new Promise((resolve) => {
      const dialog = createDialog(`
        <div class="dialog-body">
          <h2>${esc(title)}</h2>
          <p>${esc(message)}</p>
        </div>
        <div class="dialog-actions">
          <button class="btn btn-secondary" value="cancel" data-close>Cancel</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-confirm>${esc(confirmLabel)}</button>
        </div>`, 'dialog-sm');

      let confirmed = false;
      dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
      dialog.querySelector('[data-confirm]').addEventListener('click', () => { confirmed = true; dialog.close(); });
      dialog.addEventListener('close', () => resolve(confirmed));
      dialog.querySelector('[data-confirm]').focus();
    });
  }

  /* Creates a resume with an automatic name (hresume_001, …) and opens it in the editor. */
  function createResume(user, { template, color, sample = false }) {
    const { SAMPLE, defaultColor } = window.CVRender;
    let data = window.CVM.emptyData();
    if (sample) {
      data = JSON.parse(JSON.stringify(SAMPLE));
      data.personal.photo = ''; // the sample photo is for previews only
    } else {
      data.personal.fullName = user.name;
      data.personal.email = user.email;
    }
    const resume = Resumes.create(user.id, {
      title: Resumes.nextTitle(user.id),
      template,
      color: color || defaultColor(template),
      data,
    });
    location.href = `editor.html?id=${resume.id}&new=1`;
  }

  /*
   * A visitor who picks a template on the public Templates page is sent to sign up first;
   * the choice is kept for this browser tab and used once they reach the dashboard.
   */
  const PENDING_KEY = 'cvm_pending_template';

  function rememberTemplate(template, color) {
    try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ template, color })); } catch { /* storage unavailable */ }
  }

  /* Returns true when a remembered template was used (the page is then navigating away). */
  function usePendingTemplate(user) {
    let pending = null;
    try {
      pending = JSON.parse(sessionStorage.getItem(PENDING_KEY));
      sessionStorage.removeItem(PENDING_KEY);
    } catch { /* storage unavailable */ }
    if (!pending || !window.CVRender.TEMPLATES.some((t) => t.id === pending.template)) return false;
    createResume(user, { template: pending.template, color: pending.color });
    return true;
  }

  /* Large dialog for picking a template. The resume gets an automatic name (hresume_001, …). */
  function openCreateDialog(user) {
    const { TEMPLATES, SAMPLE, mountThumb } = window.CVRender;
    const dialog = createDialog(`
      <form method="dialog" class="dialog-form" id="createForm">
        <div class="dialog-head">
          <h2>Choose a template</h2>
          <p>You can switch templates and colors at any time in the editor.</p>
        </div>
        <div class="dialog-scroll">
          <div class="template-gallery">
            ${TEMPLATES.map((t, i) => `
              <label class="template-choice">
                <input type="radio" name="template" value="${t.id}" ${i === 0 ? 'checked' : ''}>
                <div class="thumb" data-thumb="${t.id}"></div>
                <strong>${t.name}</strong>
                <span>${t.description}</span>
              </label>`).join('')}
          </div>
        </div>
        <div class="dialog-actions">
          <label class="checkbox dialog-actions-start">
            <input type="checkbox" name="sample"> Start with example content
          </label>
          <button type="button" class="btn btn-secondary" data-close>Cancel</button>
          <button type="submit" class="btn btn-primary">Create resume</button>
        </div>
      </form>`, 'dialog-xl');

    dialog.querySelectorAll('[data-thumb]').forEach((el) => mountThumb(el, SAMPLE, el.dataset.thumb));
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('input[name="template"]:checked').focus();

    const form = dialog.querySelector('#createForm');

    function create() {
      const values = new FormData(form);
      createResume(user, { template: values.get('template'), sample: Boolean(values.get('sample')) });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      create();
    });

    // Double-clicking a template creates the resume right away
    form.addEventListener('dblclick', (event) => {
      if (event.target.closest('.template-choice')) create();
    });
  }

  /* Card markup shared by the dashboard and resumes page. */
  function resumeCard(resume) {
    const template = window.CVRender.TEMPLATES.find((t) => t.id === resume.template);
    return `
      <article class="card resume-card" data-id="${resume.id}">
        <a class="thumb-wrap" href="editor.html?id=${resume.id}" aria-label="Open ${esc(resume.title)}">
          <div data-card-thumb></div>
        </a>
        <div class="resume-card-body">
          <h3 class="resume-card-title">${esc(resume.title)}</h3>
          <p class="resume-card-meta">Edited ${utils.timeAgo(resume.updatedAt)} · ${template ? template.name : ''}</p>
        </div>
        <div class="resume-card-actions">
          <a class="btn btn-secondary btn-sm" href="editor.html?id=${resume.id}">Edit</a>
          <button class="btn btn-ghost btn-sm" data-action="duplicate">Duplicate</button>
          <button class="btn btn-danger-ghost btn-sm" data-action="delete">Delete</button>
        </div>
      </article>`;
  }

  /* Renders cards into a container and wires up their actions. */
  function renderResumeCards(container, resumes, { user, onChange, prepend = '' }) {
    container.innerHTML = prepend + resumes.map(resumeCard).join('');
    resumes.forEach((resume) => {
      const el = container.querySelector(`[data-id="${resume.id}"] [data-card-thumb]`);
      window.CVRender.mountThumb(el, resume.data, resume.template, resume.color);
    });

    if (container._wired) return;
    container._wired = true;
    container.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-action]');
      const card = event.target.closest('.resume-card');
      if (!button || !card) return;
      const id = card.dataset.id;

      if (button.dataset.action === 'duplicate') {
        Resumes.duplicate(id, user.id);
        onChange();
      }

      if (button.dataset.action === 'delete') {
        const resume = Resumes.get(id, user.id);
        const ok = await confirmAction({
          title: 'Delete resume?',
          message: `"${resume.title}" will be permanently deleted.`,
          confirmLabel: 'Delete',
          danger: true,
        });
        if (ok) {
          Resumes.remove(id, user.id);
          onChange();
        }
      }
    });
  }

  window.App = {
    initShell,
    showUser,
    createDialog,
    confirmAction,
    createResume,
    rememberTemplate,
    usePendingTemplate,
    openCreateDialog,
    renderResumeCards,
  };
})();
