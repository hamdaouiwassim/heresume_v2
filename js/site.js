/*
 * Shared header and footer for public pages (landing, blog, contact, legal).
 * Include right after <body> so the header renders before the page content.
 * Pages set <body data-page="..."> to mark the active link.
 */
(function () {
  const page = document.body.dataset.page || '';
  const onHome = page === 'home';
  const user = window.CVM ? window.CVM.Auth.current() : null;
  const home = (hash) => (onHome ? hash : `index.html${hash}`);

  const NAV = [
    { href: home('#how'), label: 'How it works' },
    { href: 'templates.html', label: 'Templates', pages: ['templates'] },
    { href: home('#testimonials'), label: 'Testimonials' },
    { href: 'blog.html', label: 'Blog', pages: ['blog', 'post'] },
    { href: 'contact.html', label: 'Contact', pages: ['contact'] },
  ];

  const actions = user
    ? '<a href="dashboard.html" class="btn btn-brand">Go to dashboard</a>'
    : `<a href="login.html" class="btn btn-ghost site-login">Log in</a>
       <a href="register.html" class="btn btn-brand">Get started</a>`;

  const navLinks = NAV.map((item) => `<a href="${item.href}"${item.pages && item.pages.includes(page) ? ' class="is-active" aria-current="page"' : ''}>${item.label}</a>`).join('');

  // Below 960px the nav moves into a drop-down panel opened by the menu button
  const menuActions = user
    ? '<a href="dashboard.html" class="btn btn-brand btn-lg btn-block">Go to dashboard</a>'
    : `<a href="register.html" class="btn btn-brand btn-lg btn-block">Get started — it’s free</a>
       <a href="login.html" class="btn btn-secondary btn-lg btn-block">Log in</a>`;

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="site-header" id="siteHeader">
      <div class="container site-header-inner">
        <a href="index.html" class="logo"><span class="logo-mark"><img src="images/logos/logo.webp" alt=""></span>H<span>Resume</span></a>
        <nav class="site-nav" aria-label="Main">${navLinks}</nav>
        <div class="site-actions">${actions}</div>
        <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="siteMenu" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="site-menu" id="siteMenu">
        <div class="container">
          <nav class="site-menu-nav" aria-label="Main">${navLinks}</nav>
          <div class="site-menu-actions">${menuActions}</div>
        </div>
      </div>
      <div class="site-menu-backdrop" data-menu-close></div>
    </header>`);

  const startHref = user ? 'dashboard.html' : 'register.html';

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="index.html" class="logo"><span class="logo-mark"><img src="images/logos/logo.webp" alt=""></span>H<span>Resume</span></a>
              <p>Create a professional resume in minutes and download it as a PDF.</p>
            </div>
            <div class="footer-col">
              <h3>Product</h3>
              <ul>
                <li><a href="${home('#how')}">How it works</a></li>
                <li><a href="templates.html">Templates</a></li>
                <li><a href="${startHref}">Create a resume</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Resources</h3>
              <ul>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="${home('#faq')}">FAQ</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Legal</h3>
              <ul>
                <li><a href="privacy.html">Privacy policy</a></li>
                <li><a href="terms.html">Terms of service</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">© ${new Date().getFullYear()} HResume</div>
        </div>
      </footer>`);
  });

  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */

  const toggle = header.querySelector('.nav-toggle');
  const menu = document.getElementById('siteMenu');
  // Keeps the collapsed panel out of the tab order and away from screen readers
  if ('inert' in menu) menu.inert = true;

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('menu-lock', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if ('inert' in menu) menu.inert = !open;
  }

  toggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));

  // Close after choosing a link (including same-page anchors) or tapping outside
  header.addEventListener('click', (event) => {
    if (event.target.closest('.site-menu a, [data-menu-close]')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
})();
