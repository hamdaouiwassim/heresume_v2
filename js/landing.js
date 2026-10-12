(function () {
  const { TEMPLATES, COLORS, SAMPLE, mountThumb } = window.CVRender;
  const user = window.CVM.Auth.current();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Signed-in visitors go straight to their dashboard (the header is handled by site.js)
  if (user) {
    document.querySelectorAll('[data-cta]').forEach((a) => { a.href = 'dashboard.html'; });
  }

  document.getElementById('templateGrid').innerHTML = TEMPLATES.map((t) => `
    <a class="template-card" href="templates.html" data-reveal>
      <div data-thumb="${t.id}"></div>
      <h3>${t.name}</h3>
      <p class="muted">${t.description}</p>
    </a>`).join('');

  document.querySelectorAll('[data-thumb]').forEach((el) => {
    mountThumb(el, SAMPLE, el.dataset.thumb, el.dataset.color);
  });

  /* ---------- Hero: accent color picker that cycles on its own ---------- */

  const heroThumb = document.getElementById('heroThumb');
  const swatches = document.getElementById('heroSwatches');
  const heroColors = COLORS.slice(1, 6); // a varied handful fits the chip
  let colorIndex = heroColors.indexOf(heroThumb.dataset.color);
  let cycleTimer = null;

  swatches.innerHTML = heroColors.map((c, i) => `
    <button type="button" class="swatch" style="background:${c}" aria-label="Accent color ${i + 1}" aria-pressed="${i === colorIndex}"></button>`).join('');

  function setColor(i) {
    colorIndex = i;
    swatches.querySelectorAll('.swatch').forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    heroThumb.classList.add('is-swapping');
    setTimeout(() => {
      mountThumb(heroThumb, SAMPLE, heroThumb.dataset.thumb, heroColors[i]);
      heroThumb.classList.remove('is-swapping');
    }, reduceMotion ? 0 : 250);
  }

  function startCycle() {
    if (reduceMotion) return;
    clearInterval(cycleTimer);
    cycleTimer = setInterval(() => setColor((colorIndex + 1) % heroColors.length), 3200);
  }

  swatches.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    setColor([...swatches.children].indexOf(btn));
    clearInterval(cycleTimer); // a visitor's pick stays put
  });

  startCycle();

  /* ---------- Hero: typing chip ---------- */

  const typing = document.getElementById('heroTyping');
  const phrases = ['Senior Product Designer', 'Led a team of 6', 'Increased sales by 32%', 'Fluent in Spanish'];

  if (reduceMotion) {
    typing.textContent = phrases[0];
  } else {
    let p = 0;
    let n = 0;
    let deleting = false;
    (function tick() {
      const text = phrases[p];
      n += deleting ? -1 : 1;
      typing.textContent = text.slice(0, n);
      let delay = deleting ? 35 : 70;
      if (!deleting && n === text.length) { deleting = true; delay = 1600; }
      else if (deleting && n === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- Feature cards: cursor spotlight ---------- */

  document.querySelectorAll('.feature').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
})();
