(function () {
  const user = window.App.initShell();
  if (!user) return;

  const { Resumes, completeness, utils } = window.CVM;
  const RECENT_LIMIT = 3;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${greeting}, ${user.name.split(' ')[0]}`;

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-action="create"]')) window.App.openCreateDialog(user);
  });

  function render() {
    const resumes = Resumes.all(user.id);
    const latest = resumes[0];

    document.getElementById('statTotal').textContent = resumes.length;
    document.getElementById('statLast').textContent = latest ? utils.timeAgo(latest.updatedAt) : '—';

    const score = latest ? completeness(latest.data) : 0;
    document.getElementById('statComplete').textContent = latest ? `${score}%` : '—';
    document.getElementById('statCompleteBar').style.width = `${score}%`;

    const grid = document.getElementById('recentGrid');
    document.getElementById('emptyState').hidden = resumes.length > 0;
    document.getElementById('viewAll').hidden = resumes.length <= RECENT_LIMIT;
    grid.hidden = resumes.length === 0;

    window.App.renderResumeCards(grid, resumes.slice(0, RECENT_LIMIT), {
      user,
      onChange: render,
      prepend: `<button class="new-card" data-action="create"><strong>New resume</strong>Start from a template</button>`,
    });
  }

  render();
})();
