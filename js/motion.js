/*
 * Scroll-reveal and count-up animations for the public pages.
 * Load in <head> (not deferred) so content is hidden before first paint and doesn't flash.
 *
 * - Elements with [data-reveal] fade up when they scroll into view, staggered when several appear at once.
 * - Elements matching AUTO below are tagged automatically, including ones rendered later by JS.
 * - [data-reveal-trigger] only receives .is-visible (for effects styled in CSS).
 * - [data-count="n"] inside a revealed element counts up from 0 to n.
 */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supported = 'IntersectionObserver' in window && 'MutationObserver' in window;
  if (reduceMotion || !supported) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    });
    return;
  }

  document.documentElement.classList.add('js-reveal');

  // Content on the guest pages that should animate in
  const AUTO = [
    '.page-hero .container > *',
    '.post-card',
    '.article > *',
    '.more-posts > *',
    '.contact-info > div',
    '.contact-card',
    '.filter-tabs',
    '.template-tile',
    '.legal-toc',
    '.legal .prose > *',
    '.auth > *',
  ].join(',');

  const seen = new WeakSet();

  function countUp(el) {
    const target = Number(el.dataset.count);
    if (!target) { el.textContent = target; return; }
    const start = performance.now();
    (function frame(now) {
      const t = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  function reveal(el) {
    el.classList.add('is-visible');
    el.querySelectorAll('[data-count]').forEach(countUp);
    if (!el.hasAttribute('data-reveal')) return;
    // Once in place, drop the reveal styles so the element's own hover transitions apply again
    el.addEventListener('transitionend', function done(event) {
      if (event.target !== el || event.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', done);
      el.removeAttribute('data-reveal');
      el.style.removeProperty('--delay');
    });
  }

  const observer = new IntersectionObserver((entries) => {
    // Elements that come into view together cascade in one after another
    entries.filter((entry) => entry.isIntersecting).forEach((entry, i) => {
      observer.unobserve(entry.target);
      entry.target.style.setProperty('--delay', `${Math.min(i, 6) * 0.08}s`);
      reveal(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function scan(root) {
    root.querySelectorAll(AUTO).forEach((el) => {
      if (!seen.has(el)) el.setAttribute('data-reveal', '');
    });
    root.querySelectorAll('[data-reveal], [data-reveal-trigger]').forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    scan(document);
    new MutationObserver((mutations) => {
      // Ignore text-only changes (count-ups, typing effects)
      if (mutations.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1))) scan(document);
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
