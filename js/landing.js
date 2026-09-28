(function () {
  const { TEMPLATES, SAMPLE, mountThumb } = window.CVRender;
  const user = window.CVM.Auth.current();

  // Signed-in visitors go straight to their dashboard (the header is handled by site.js)
  if (user) {
    document.querySelectorAll('[data-cta]').forEach((a) => { a.href = 'dashboard.html'; });
  }

  document.getElementById('templateGrid').innerHTML = TEMPLATES.map((t) => `
    <a class="template-card" href="${user ? 'dashboard.html' : 'register.html'}">
      <div data-thumb="${t.id}"></div>
      <h3>${t.name}</h3>
      <p class="muted">${t.description}</p>
    </a>`).join('');

  document.querySelectorAll('[data-thumb]').forEach((el) => {
    mountThumb(el, SAMPLE, el.dataset.thumb, el.dataset.color);
  });
})();
