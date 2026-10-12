/*
 * Public templates page: browse, filter, preview and start a resume.
 * Templates are shown in their default color; colors are changed in the editor.
 */
(function () {
  const { TEMPLATES, SAMPLE, mountThumb } = window.CVRender;
  const user = window.CVM.Auth.current();
  const list = document.getElementById('templateList');

  const FILTERS = {
    all: () => true,
    one: (t) => t.layout === 'one',
    two: (t) => t.layout === 'two',
    photo: (t) => t.photo,
  };

  const byId = (id) => TEMPLATES.find((t) => t.id === id);

  function tagsFor(t) {
    return [t.layout === 'one' ? 'One column' : 'Two columns', t.photo ? 'Photo' : ''].filter(Boolean).join(' · ');
  }

  /* Signed-in users go straight to the editor; visitors sign up first and the choice is kept. */
  function useTemplate(id) {
    if (user) {
      window.App.createResume(user, { template: id });
    } else {
      window.App.rememberTemplate(id);
      location.href = 'register.html';
    }
  }

  /* ---------- Grid ---------- */

  function render(filter = 'all') {
    const visible = TEMPLATES.filter(FILTERS[filter]);
    list.innerHTML = visible.map((t) => `
      <article class="template-tile" data-template="${t.id}">
        <button type="button" class="template-tile-preview" data-action="preview" aria-label="Preview ${t.name}">
          <div data-thumb></div>
          <span class="template-tile-hover">Preview</span>
        </button>
        <div class="template-tile-body">
          <div class="template-tile-head">
            <h2>${t.name}</h2>
            <span>${tagsFor(t)}</span>
          </div>
          <p>${t.description}</p>
          <button type="button" class="btn btn-primary btn-block" data-action="use">Use this template</button>
        </div>
      </article>`).join('');

    visible.forEach((t) => {
      mountThumb(list.querySelector(`[data-template="${t.id}"] [data-thumb]`), SAMPLE, t.id);
    });
  }

  list.addEventListener('click', (event) => {
    const tile = event.target.closest('.template-tile');
    if (!tile) return;
    const id = tile.dataset.template;

    if (event.target.closest('[data-action="preview"]')) openPreview(id);
    else if (event.target.closest('[data-action="use"]')) useTemplate(id);
  });

  document.getElementById('filters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    document.querySelectorAll('#filters [data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    render(button.dataset.filter);
  });

  /* ---------- Large preview ---------- */

  function openPreview(id) {
    const dialog = window.App.createDialog('<div class="preview-dialog"></div>', 'dialog-xl dialog-preview');
    const root = dialog.querySelector('.preview-dialog');

    function show(templateId) {
      id = templateId;
      const t = byId(id);
      const index = TEMPLATES.indexOf(t);
      root.innerHTML = `
        <div class="preview-dialog-page"><div data-thumb></div></div>
        <aside class="preview-dialog-side">
          <div>
            <p class="preview-dialog-tags">${tagsFor(t)}</p>
            <h2>${t.name}</h2>
            <p>${t.description}</p>
          </div>
          <div class="preview-dialog-actions">
            <button type="button" class="btn btn-primary btn-block btn-lg" data-action="use">Use this template</button>
            <button type="button" class="btn btn-secondary btn-block" data-action="close">Close</button>
          </div>
          <div class="preview-dialog-nav">
            <button type="button" class="btn btn-ghost btn-sm" data-step="-1" ${index === 0 ? 'disabled' : ''}>Previous</button>
            <span>${index + 1} of ${TEMPLATES.length}</span>
            <button type="button" class="btn btn-ghost btn-sm" data-step="1" ${index === TEMPLATES.length - 1 ? 'disabled' : ''}>Next</button>
          </div>
        </aside>`;
      mountThumb(root.querySelector('[data-thumb]'), SAMPLE, id);
    }

    root.addEventListener('click', (event) => {
      const step = event.target.closest('[data-step]');
      if (step) {
        show(TEMPLATES[TEMPLATES.indexOf(byId(id)) + Number(step.dataset.step)].id);
      } else if (event.target.closest('[data-action="use"]')) {
        useTemplate(id);
      } else if (event.target.closest('[data-action="close"]')) {
        dialog.close();
      }
    });

    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const next = TEMPLATES.indexOf(byId(id)) + (event.key === 'ArrowRight' ? 1 : -1);
        if (TEMPLATES[next]) show(TEMPLATES[next].id);
      }
    });

    show(id);
    root.querySelector('[data-action="use"]').focus();
  }

  render();
})();
