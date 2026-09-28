/*
 * Resume rendering: turns resume data into HTML for one of the templates.
 * Used by the editor preview, resume thumbnails and the landing page.
 */
(function () {
  const PAGE_WIDTH = 794; // A4 at 96dpi

  const TEMPLATES = [
    // layout: 'one' or 'two' columns; photo: shows the uploaded photo
    { id: 'classic', name: 'Classic', layout: 'one', photo: false, description: 'Centered header and a single, traditional column.' },
    { id: 'modern', name: 'Modern', layout: 'two', photo: false, description: 'Bold header with a sidebar for contact and skills.' },
    { id: 'minimal', name: 'Minimal', layout: 'one', photo: false, description: 'Quiet typography with labels in the margin.' },
    { id: 'professional', name: 'Professional', layout: 'two', photo: true, description: 'Full-height sidebar with photo, contact details and skills.' },
    { id: 'executive', name: 'Executive', layout: 'two', photo: false, description: 'Two-tone layout with a bold name and gold accents.', color: '#0f3a5c' },
    { id: 'creative', name: 'Creative', layout: 'one', photo: true, description: 'Photo banner with bold headings and a column layout.', color: '#111827' },
    { id: 'fresh', name: 'Fresh', layout: 'two', photo: true, description: 'Soft color header with photo and highlighted skill boxes.', color: '#4a78ab' },
    { id: 'elegant', name: 'Elegant', layout: 'one', photo: false, description: 'Framed serif name with centered section headings.', color: '#b39b77' },
    { id: 'signature', name: 'Signature', layout: 'two', photo: true, description: 'Charcoal sidebar with gold accents and spaced headings.', color: '#454545' },
    { id: 'blush', name: 'Blush', layout: 'two', photo: false, description: 'Warm tinted page with a bold name and a slim side column.', color: '#7a5663' },
    { id: 'vivid', name: 'Vivid', layout: 'two', photo: true, description: 'Bright accent color, photo header and skill tags.', color: '#f05a28' },
    { id: 'spark', name: 'Spark', layout: 'two', photo: true, description: 'Color block behind the photo, light sidebar and skill ratings.', color: '#f5c518' },
    { id: 'studio', name: 'Studio', layout: 'two', photo: true, description: 'Tall photo, dark intro band and a three-column grid.', color: '#f28c28' },
  ];

  const COLORS = ['#1f2937', '#0f3a5c', '#2f54eb', '#0f766e', '#9f1239', '#b45309', '#6d28d9'];

  /* Color a template starts with when none is chosen. */
  function defaultColor(template) {
    const t = TEMPLATES.find((item) => item.id === template);
    return (t && t.color) || COLORS[0];
  }

  function rgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function distance(a, b) {
    const [r1, g1, b1] = rgb(a);
    const [r2, g2, b2] = rgb(b);
    return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
  }

  /*
   * The 7 colors offered for a template, its own default first. A color that isn't in the
   * shared palette (a template default, or `current` kept from another template) takes the
   * place of the most similar palette color, so every template always offers 7.
   */
  function colorsFor(template, current) {
    const colors = [...COLORS];
    [current, defaultColor(template)].forEach((color) => {
      if (!color || colors.includes(color)) return;
      const nearest = colors
        .filter((c) => c !== defaultColor(template) && c !== current)
        .reduce((best, c) => (distance(c, color) < distance(best, color) ? c : best));
      colors[colors.indexOf(nearest)] = color;
    });
    const first = defaultColor(template);
    return [first, ...colors.filter((c) => c !== first)];
  }

  const SAMPLE = {
    personal: {
      fullName: 'Alex Bennett',
      jobTitle: 'Product Designer',
      email: 'alex.bennett@email.com',
      phone: '+1 555 012 3456',
      location: 'Austin, TX',
      website: 'alexbennett.design',
      photo: 'images/user-avatar.webp', // preview only; not copied into new resumes
    },
    summary: 'Product designer with 6 years of experience shaping web and mobile products. I focus on clear interfaces, measurable outcomes and close collaboration with engineering teams.',
    experience: [
      {
        role: 'Senior Product Designer', company: 'Northwind', location: 'Austin, TX', start: 'Mar 2022', end: '',
        description: 'Led the redesign of the onboarding flow, lifting activation by 18%\nBuilt a shared design system used by four product teams\nMentored two junior designers',
      },
      {
        role: 'Product Designer', company: 'Brightline Studio', location: 'Remote', start: 'Jun 2019', end: 'Feb 2022',
        description: 'Designed end-to-end features for a B2B analytics platform\nRan usability studies with more than 60 customers',
      },
    ],
    education: [
      { degree: 'B.A. Interaction Design', school: 'University of Texas', location: 'Austin, TX', start: '2015', end: '2019', description: '' },
    ],
    skills: ['Product design', 'Figma', 'Prototyping', 'User research', 'Design systems', 'HTML & CSS'],
    languages: ['English — Native', 'Spanish — Professional'],
    socials: [{ label: 'LinkedIn', url: 'linkedin.com/in/alexbennett' }],
    projects: [
      {
        name: 'Open-source icon library', link: 'github.com/alexb/icons', start: '2023', end: '2024',
        description: 'Designed and published 400+ icons used by more than 2,000 developers',
      },
    ],
    certificates: [
      { name: 'Google UX Design Certificate', issuer: 'Google', date: '2021', link: '' },
    ],
    hobbies: ['Photography', 'Trail running', 'Pottery'],
  };

  const esc = (value) => window.CVM.utils.escapeHtml(value);

  function normalize(data) {
    const base = window.CVM.emptyData();
    data = data || {};
    return {
      ...base,
      ...data,
      personal: { ...base.personal, ...(data.personal || {}) },
    };
  }

  function lines(text) {
    return String(text || '')
      .split('\n')
      .map((l) => l.replace(/^\s*[-•*]\s*/, '').trim())
      .filter(Boolean);
  }

  function textBlock(text) {
    const items = lines(text);
    if (!items.length) return '';
    if (items.length === 1) return `<p>${esc(items[0])}</p>`;
    return `<ul class="cv-bullets">${items.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`;
  }

  function dateRange(start, end) {
    if (start && end) return `${start} – ${end}`;
    if (start) return `${start} – Present`;
    return end || '';
  }

  function hasContent(item) {
    return Object.values(item).some((v) => String(v || '').trim());
  }

  /* Clickable link (kept in the PDF). Accepts "site.com" or "https://site.com". */
  function link(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    if (!/^https?:\/\/[^\s"'<>]+$/i.test(href)) return esc(raw);
    const label = raw.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
    return `<a href="${esc(href)}">${esc(label)}</a>`;
  }

  function entries(items, titleKey, subKey) {
    return items.filter(hasContent).map((item) => {
      const sub = [
        ...[item[subKey], item.location].filter(Boolean).map(esc),
        link(item.link),
      ].filter(Boolean).join(' · ');
      const when = dateRange(item.start, item.end || item.date);
      return `
        <div class="cv-entry">
          <div class="cv-entry-head">
            <div>
              <h4 class="cv-entry-title">${esc(item[titleKey])}</h4>
              ${sub ? `<p class="cv-entry-sub">${sub}</p>` : ''}
            </div>
            ${when ? `<span class="cv-entry-date">${esc(when)}</span>` : ''}
          </div>
          ${textBlock(item.description)}
        </div>`;
    }).join('');
  }

  function tags(items) {
    const clean = items.filter((s) => String(s).trim());
    return clean.length ? `<ul class="cv-tags">${clean.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : '';
  }

  /*
   * Items with an optional score, e.g. "French 8/10" or "Figma 4/5", shown as a row of dots.
   * Falls back to plain tags when no item has a score.
   */
  function ratedList(items) {
    const clean = items.filter((s) => String(s).trim());
    if (!clean.length) return '';
    const rated = clean.map((text) => {
      const match = /^(.*?)[\s—–-]*(\d{1,2})\s*\/\s*(5|10)\s*$/.exec(text);
      if (!match) return { name: text, score: null };
      const max = Number(match[3]);
      return { name: match[1].trim(), score: Math.min(max, Number(match[2])), max };
    });
    if (rated.every((r) => r.score === null)) return tags(clean);
    return `<ul class="cv-ratings">${rated.map((r) => `
      <li>
        <div class="cv-rating-head"><span>${esc(r.name)}</span>${r.score !== null ? `<span class="cv-rating-score">${r.score}/${r.max}</span>` : ''}</div>
        ${r.score !== null ? `<span class="cv-dots">${Array.from({ length: r.max }, (_, i) => `<i${i < r.score ? ' class="on"' : ''}></i>`).join('')}</span>` : ''}
      </li>`).join('')}</ul>`;
  }

  function section(key, title, body) {
    if (!body) return '';
    return `<section class="cv-section" data-section="${key}"><h3 class="cv-h">${title}</h3><div class="cv-body">${body}</div></section>`;
  }

  function render(data, template, color) {
    const d = normalize(data);
    const p = d.personal;
    template = TEMPLATES.some((t) => t.id === template) ? template : 'classic';

    const name = p.fullName ? esc(p.fullName) : '<span class="cv-placeholder">Your Name</span>';
    const title = p.jobTitle ? `<p class="cv-title">${esc(p.jobTitle)}</p>` : '';
    const socials = d.socials
      .filter((s) => String(s.url || '').trim())
      .map((s) => `${s.label ? `<span class="cv-link-label">${esc(s.label)}</span> ` : ''}${link(s.url)}`);
    const contacts = [
      ...[p.email, p.phone, p.location].filter(Boolean).map(esc),
      link(p.website),
      ...socials,
    ].filter(Boolean);

    const summary = textBlock(d.summary);
    const experience = entries(d.experience, 'role', 'company');
    const education = entries(d.education, 'degree', 'school');
    const projects = entries(d.projects, 'name', 'role');
    const certificates = entries(d.certificates, 'name', 'issuer');
    const skills = tags(d.skills);
    const languages = tags(d.languages);
    const hobbies = tags(d.hobbies);

    const contactList = contacts.length
      ? `<ul class="cv-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>`
      : '';

    // Only accept images produced by the editor's photo upload
    // Photos uploaded in the editor (data URLs) or images shipped with the app (e.g. the preview photo)
    const photoSrc = /^data:image\/(png|jpeg|webp);base64,/.test(p.photo || '')
      || /^images\/[\w/-]+\.(webp|png|jpe?g)$/.test(p.photo || '')
      ? p.photo
      : '';
    const grid = (html, cols, extra = '') => (html ? `<div class="cv-grid cv-grid--${cols} ${extra}">${html}</div>` : '');

    let body;
    if (template === 'studio') {
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = !words.length
        ? name
        : `${words.length > 1 ? `<span class="cv-name-first">${esc(words.slice(0, -1).join(' '))}</span> ` : ''}<span class="cv-name-last">${esc(words[words.length - 1])}</span>`;

      // Contact as a labelled table
      const rows = [
        ['Phone', esc(p.phone)],
        ['Email', esc(p.email)],
        ['Location', esc(p.location)],
        ['Website', link(p.website)],
        ...d.socials.filter((s) => String(s.url || '').trim()).map((s) => [esc(s.label || 'Link'), link(s.url)]),
      ].filter(([, value]) => value);
      const contactTable = rows.length
        ? `<dl class="cv-table">${rows.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('')}</dl>`
        : '';

      const row = (...cells) => {
        const filled = cells.filter(Boolean);
        return filled.length ? `<div class="cv-row cv-row--${filled.length}">${filled.map((c) => `<div class="cv-cell">${c}</div>`).join('')}</div>` : '';
      };

      body = `
        <div class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          ${photoSrc ? `<div class="cv-photo-col"><div class="cv-photo"><img src="${photoSrc}" alt=""></div></div>` : ''}
          <div class="cv-top-main">
            <header class="cv-header"><h1 class="cv-name">${splitName}</h1>${title}</header>
            ${summary ? `<div class="cv-about">${section('profile', 'About me', summary)}</div>` : ''}
            ${row(section('contact', 'Contact', contactTable), section('languages', 'Languages', languages))}
          </div>
        </div>
        ${row(section('skills', 'Skills', ratedList(d.skills)), section('education', 'Education', education), section('certificates', 'Certificates', certificates))}
        ${experience ? `<div class="cv-band-section">${section('experience', 'Experience', grid(experience, 3, 'cv-grid--entries'))}</div>` : ''}
        ${projects ? `<div class="cv-band-section">${section('projects', 'Projects', grid(projects, 3, 'cv-grid--entries'))}</div>` : ''}
        ${hobbies ? `<div class="cv-band-section">${section('hobbies', 'Hobbies', hobbies)}</div>` : ''}`;
    } else if (template === 'spark') {
      // First name(s) light, last name bold, on separate lines
      const words = (p.fullName || '').trim().split(/\s+/).filter(Boolean);
      const splitName = !words.length
        ? name
        : words.length === 1
          ? `<span class="cv-name-last">${esc(words[0])}</span>`
          : `<span class="cv-name-first">${esc(words.slice(0, -1).join(' '))}</span> <span class="cv-name-last">${esc(words[words.length - 1])}</span>`;
      body = `
        <div class="cv-cols">
          <aside class="cv-aside${photoSrc ? ' cv-aside--photo' : ''}">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            ${section('contact', 'Contact', contactList)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('languages', 'Languages', ratedList(d.languages))}
          </aside>
          <div class="cv-main">
            <header class="cv-header"><h1 class="cv-name">${splitName}</h1>${title}</header>
            ${section('profile', 'Profile', summary)}
            ${section('experience', 'Job experience', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('skills', 'Skills', ratedList(d.skills))}
            ${section('hobbies', 'Interests', hobbies)}
          </div>
        </div>`;
    } else if (template === 'vivid') {
      const intro = lines(d.summary).join(' ');
      body = `
        <header class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
          <div class="cv-identity">
            <h1 class="cv-name">${name}</h1>
            ${title}
            ${intro ? `<p class="cv-intro">${esc(intro)}</p>` : ''}
          </div>
        </header>
        ${contacts.length ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>` : ''}
        <div class="cv-cols">
          <div>
            ${section('skills', 'Skills', skills)}
            ${section('experience', 'Work experience', experience)}
            ${section('languages', 'Languages', languages)}
          </div>
          <div>
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('projects', 'Projects', projects)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </div>
        </div>`;
    } else if (template === 'blush') {
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
        <div class="cv-cols">
          <div class="cv-main">
            ${section('profile', 'Profile', summary)}
            ${section('education', 'Education', education)}
            ${section('experience', 'Professional experience', experience)}
            ${section('projects', 'Projects', projects)}
          </div>
          <aside class="cv-aside">
            ${section('contact', 'Contact info', contactList)}
            ${section('skills', 'Skills &amp; abilities', skills)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
        </div>`;
    } else if (template === 'signature') {
      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
            <header class="cv-header">
              <h1 class="cv-name">${name}</h1>
              ${title ? `<span class="cv-rule"></span>${title}` : ''}
              <span class="cv-rule"></span>
            </header>
            ${contacts.length ? `<ul class="cv-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Professional summary', summary)}
            ${section('experience', 'Work experience', experience)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </div>
        </div>`;
    } else if (template === 'elegant') {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      body = `
        <div class="cv-band">
          <header class="cv-frame"><h1 class="cv-name">${name}</h1>${title}</header>
        </div>
        <div class="cv-inner">
          ${contactRow}
          ${summary ? `<div class="cv-summary">${summary}</div>` : ''}
          ${section('skills', 'Core proficiencies', skills)}
          ${section('experience', 'Professional work experience', experience)}
          ${section('projects', 'Projects', projects)}
          ${section('education', 'Education &amp; credentials', education)}
          ${section('certificates', 'Certificates', certificates)}
          ${section('languages', 'Languages', languages)}
          ${section('hobbies', 'Hobbies', hobbies)}
        </div>`;
    } else if (template === 'fresh') {
      body = `
        <header class="cv-top${photoSrc ? ' cv-top--photo' : ''}">
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
          <div class="cv-identity"><h1 class="cv-name">${name}</h1>${title}</div>
          ${contactList}
        </header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('profile', 'Career overview', summary ? `<div class="cv-quote">${summary}</div>` : '')}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', ratedList(d.languages))}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
          <div class="cv-main">
            ${section('experience', 'Work experience', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certifications', certificates)}
          </div>
        </div>`;
    } else if (template === 'creative') {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      const left = section('skills', 'Expertise', skills) + section('languages', 'Languages', languages) + section('hobbies', 'Hobbies', hobbies);
      const right = section('profile', 'Profile', summary) + section('projects', 'Projects', projects) + section('certificates', 'Certificates', certificates);
      body = `
        <div class="cv-hero${photoSrc ? ' cv-hero--photo' : ''}">
          <div class="cv-band"></div>
          ${photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : ''}
        </div>
        <div class="cv-inner">
          <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
          ${contactRow}
          ${section('education', 'Education', grid(education, 3))}
          ${section('experience', 'Experience', grid(experience, 2, 'cv-grid--experience'))}
          ${left || right ? `
            <div class="cv-split">
              <div>${left}</div>
              <div>${right}</div>
            </div>` : ''}
        </div>`;
    } else if (template === 'executive') {
      const contactList = contacts.length
        ? `<ul class="cv-contact-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>`
        : '';
      body = `
        <div class="cv-cols">
          <div class="cv-main">
            <header class="cv-header">
              <h1 class="cv-name">${name}</h1>
              ${title}
              <span class="cv-rule"></span>
            </header>
            ${summary ? `<div class="cv-summary">${summary}</div>` : ''}
            ${section('experience', 'Relevant work experience', experience)}
            ${section('projects', 'Projects', projects)}
          </div>
          <aside class="cv-aside">
            ${contactList}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
        </div>`;
    } else if (template === 'professional') {
      const photo = photoSrc ? `<div class="cv-photo"><img src="${photoSrc}" alt=""></div>` : '';
      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            ${photo}
            <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
            ${section('contact', 'Contact details', contactList)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Personal statement', summary)}
            ${section('experience', 'Work history', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
          </div>
        </div>`;
    } else if (template === 'modern') {
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('contact', 'Contact', contactList)}
            ${section('skills', 'Skills', skills)}
            ${section('languages', 'Languages', languages)}
            ${section('hobbies', 'Hobbies', hobbies)}
          </aside>
          <div class="cv-main">
            ${section('profile', 'Profile', summary)}
            ${section('experience', 'Experience', experience)}
            ${section('projects', 'Projects', projects)}
            ${section('education', 'Education', education)}
            ${section('certificates', 'Certificates', certificates)}
          </div>
        </div>`;
    } else {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}${contactRow}</header>
        ${section('profile', 'Profile', summary)}
        ${section('experience', 'Experience', experience)}
        ${section('projects', 'Projects', projects)}
        ${section('education', 'Education', education)}
        ${section('certificates', 'Certificates', certificates)}
        ${section('skills', 'Skills', skills)}
        ${section('languages', 'Languages', languages)}
        ${section('hobbies', 'Hobbies', hobbies)}`;
    }

    return `<div class="cv cv--${template}" style="--cv-accent:${esc(color || defaultColor(template))}">${body}</div>`;
  }

  /* ---------- Pagination ---------- */

  const PAGE_HEIGHT = 1123; // A4 at 96dpi
  const PAGE_TOP = 48; // top margin on continued pages
  const PAGE_BOTTOM = 40; // content never goes closer than this to the bottom of a page
  const KEEP_WITH_HEADING = 60; // minimum content that must fit under a section heading

  /*
   * Splits a rendered page (.cv) into A4 pages: entries and headings that would be cut
   * by a page edge are pushed to the next page, and sections listed in `pageBreaks`
   * start on a new page. Pushes are empty spacer blocks (not margins, which browsers
   * drop at the top of a printed page), so the PDF matches the preview.
   * Returns the number of pages.
   */
  function paginate(page, pageBreaks = []) {
    if (!page || !page.offsetHeight) return 1;
    const forced = new Set(pageBreaks);
    const scale = page.getBoundingClientRect().height / page.offsetHeight || 1;
    const topOf = (el) => (el.getBoundingClientRect().top - page.getBoundingClientRect().top) / scale;
    const maxUnit = PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM;

    /* Moves el's content down so it starts at `to`. Returns false if el cannot be re-checked. */
    function moveTo(el, from, to) {
      const spacer = document.createElement('div');
      spacer.className = 'cv-page-gap';
      // In grid/flex rows a sibling spacer would become an extra cell, so pad inside instead
      if (/grid|flex/.test(getComputedStyle(el.parentElement).display)) {
        spacer.style.height = `${to - from}px`;
        el.prepend(spacer);
        return false;
      }
      el.before(spacer);
      // Inserting the spacer can change el's own margin (e.g. `.cv-entry + .cv-entry`), so measure again
      spacer.style.height = `${Math.max(0, to - topOf(el))}px`;
      return true;
    }

    // .cv-split (Creative's two-column footer) moves as one block so its divider line isn't cut
    const units = page.querySelectorAll('.cv-split, .cv-section, .cv-entry, .cv-summary, .cv-body > p, .cv-body > ul');
    units.forEach((el) => {
      // Second pass double-checks the result after the move
      for (let pass = 0; pass < 2; pass++) {
        const y = topOf(el);
        const index = Math.floor(y / PAGE_HEIGHT);
        const pageStart = index * PAGE_HEIGHT;
        const limit = pageStart + PAGE_HEIGHT - PAGE_BOTTOM;
        const nextPage = pageStart + PAGE_HEIGHT + PAGE_TOP;
        const atTop = index > 0 && y <= pageStart + PAGE_TOP + 1;
        let target = null;

        if (index > 0 && y < pageStart + PAGE_TOP) {
          target = pageStart + PAGE_TOP; // leave a top margin on continued pages
        } else if (el.classList.contains('cv-section') || el.classList.contains('cv-split')) {
          const heading = el.querySelector('.cv-h');
          const headingEnd = heading ? topOf(heading) + heading.offsetHeight : y;
          if (forced.has(el.dataset.section) && !atTop) target = nextPage;
          else if (headingEnd + KEEP_WITH_HEADING > limit) target = nextPage;
        } else if (y + el.offsetHeight > limit && el.offsetHeight <= maxUnit) {
          target = nextPage;
        }

        if (target === null || Math.abs(target - y) < 1) break;
        if (!moveTo(el, y, target)) break;
      }
    });

    const pages = Math.max(1, Math.ceil((page.offsetHeight - 1) / PAGE_HEIGHT));
    // Let backgrounds (sidebars) fill the last page; -2px avoids a blank extra printed page
    if (pages > 1) page.style.minHeight = `${pages * PAGE_HEIGHT - 2}px`;
    return pages;
  }

  /* Renders a scaled-down page inside `el` and keeps it fitted to the element's width. */
  function mountThumb(el, data, template, color) {
    el.classList.add('thumb');
    el.innerHTML = render(data, template, color);
    const page = el.firstElementChild;
    const fit = () => { page.style.transform = `scale(${el.clientWidth / PAGE_WIDTH})`; };
    fit();
    if (!el._observer && 'ResizeObserver' in window) {
      el._observer = new ResizeObserver(() => {
        const current = el.firstElementChild;
        if (current) current.style.transform = `scale(${el.clientWidth / PAGE_WIDTH})`;
      });
      el._observer.observe(el);
    }
  }

  window.CVRender = { render, paginate, mountThumb, defaultColor, colorsFor, TEMPLATES, COLORS, SAMPLE, PAGE_WIDTH, PAGE_HEIGHT };
})();
