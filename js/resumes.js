(function () {
  const user = window.App.initShell();
  if (!user) return;

  const { Resumes } = window.CVM;
  const search = document.getElementById('search');
  const sort = document.getElementById('sort');
  const grid = document.getElementById('resumeGrid');

  const sorters = {
    updated: (a, b) => b.updatedAt - a.updatedAt,
    created: (a, b) => b.createdAt - a.createdAt,
    title: (a, b) => a.title.localeCompare(b.title),
  };

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-action="create"]')) window.App.openCreateDialog(user);
  });

  function render() {
    const all = Resumes.all(user.id);
    const query = search.value.trim().toLowerCase();
    const list = all
      .filter((r) => !query || r.title.toLowerCase().includes(query) || (r.data.personal.jobTitle || '').toLowerCase().includes(query))
      .sort(sorters[sort.value]);

    document.getElementById('countLabel').textContent =
      all.length === 1 ? '1 resume' : `${all.length} resumes`;
    document.getElementById('toolbar').hidden = all.length === 0;
    document.getElementById('emptyState').hidden = all.length > 0;
    document.getElementById('noResults').hidden = all.length === 0 || list.length > 0;
    grid.hidden = list.length === 0;

    window.App.renderResumeCards(grid, list, { user, onChange: render });
  }

  search.addEventListener('input', render);
  sort.addEventListener('change', render);
  render();
})();
