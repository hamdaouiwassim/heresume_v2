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

    document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = utils.initials(user.name); });
    document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = user.name; });

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="logout"]')) {
        Auth.logout();
        location.href = 'index.html';
      }
    });

    return user;
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

  /* Dialog for creating a new resume. Redirects to the editor on submit. */
  function openCreateDialog(user) {
    const { TEMPLATES, SAMPLE, mountThumb } = window.CVRender;
    const dialog = createDialog(`
      <form method="dialog" id="createForm">
        <div class="dialog-body">
          <h2>New resume</h2>
          <p>Give it a name and choose a starting template. You can change both later.</p>
          <div class="form">
            <div class="field">
              <label for="newTitle">Resume name</label>
              <input id="newTitle" name="title" placeholder="e.g. Product Designer — 2026" autocomplete="off">
            </div>
            <div class="field">
              <span class="label">Template</span>
              <div class="template-picker">
                ${TEMPLATES.map((t, i) => `
                  <label class="template-option">
                    <input type="radio" name="template" value="${t.id}" ${i === 0 ? 'checked' : ''}>
                    <div class="thumb" data-thumb="${t.id}"></div>
                    <span>${t.name}</span>
                  </label>`).join('')}
              </div>
            </div>
            <label class="checkbox">
              <input type="checkbox" name="sample"> Start with example content
            </label>
          </div>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn btn-secondary" data-close>Cancel</button>
          <button type="submit" class="btn btn-primary">Create resume</button>
        </div>
      </form>`);

    dialog.querySelectorAll('[data-thumb]').forEach((el) => mountThumb(el, SAMPLE, el.dataset.thumb));
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('#newTitle').focus();

    dialog.querySelector('#createForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.target);
      let data = window.CVM.emptyData();
      if (form.get('sample')) {
        data = JSON.parse(JSON.stringify(SAMPLE));
      } else {
        data.personal.fullName = user.name;
        data.personal.email = user.email;
      }
      const resume = Resumes.create(user.id, {
        title: form.get('title') || 'Untitled resume',
        template: form.get('template'),
        data,
      });
      location.href = `editor.html?id=${resume.id}`;
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

  window.App = { initShell, confirmAction, openCreateDialog, renderResumeCards };
})();
