/*
 * Resume rendering: turns resume data into HTML for one of the templates.
 * Used by the editor preview, resume thumbnails and the landing page.
 */
(function () {
  const PAGE_WIDTH = 794; // A4 at 96dpi

  const TEMPLATES = [
    { id: 'classic', name: 'Classic', description: 'Centered header and a single, traditional column.' },
    { id: 'modern', name: 'Modern', description: 'Bold header with a sidebar for contact and skills.' },
    { id: 'minimal', name: 'Minimal', description: 'Quiet typography with labels in the margin.' },
    { id: 'professional', name: 'Professional', description: 'Full-height sidebar with photo, contact details and skills.' },
  ];

  const COLORS = ['#1f2937', '#2f54eb', '#0f766e', '#9f1239', '#b45309', '#6d28d9'];

  const SAMPLE = {
    personal: {
      fullName: 'Sarah Bennett',
      jobTitle: 'Product Designer',
      email: 'sarah.bennett@email.com',
      phone: '+1 555 012 3456',
      location: 'Austin, TX',
      website: 'sarahbennett.design',
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

  function entries(items, titleKey, subKey) {
    return items.filter(hasContent).map((item) => {
      const sub = [item[subKey], item.location].filter(Boolean).map(esc).join(' · ');
      const when = dateRange(item.start, item.end);
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

  function section(title, body) {
    if (!body) return '';
    return `<section class="cv-section"><h3 class="cv-h">${title}</h3><div class="cv-body">${body}</div></section>`;
  }

  function render(data, template, color) {
    const d = normalize(data);
    const p = d.personal;
    template = TEMPLATES.some((t) => t.id === template) ? template : 'classic';

    const name = p.fullName ? esc(p.fullName) : '<span class="cv-placeholder">Your Name</span>';
    const title = p.jobTitle ? `<p class="cv-title">${esc(p.jobTitle)}</p>` : '';
    const contacts = [p.email, p.phone, p.location, p.website].filter(Boolean).map(esc);

    const summary = textBlock(d.summary);
    const experience = entries(d.experience, 'role', 'company');
    const education = entries(d.education, 'degree', 'school');
    const skills = tags(d.skills);
    const languages = tags(d.languages);

    const contactList = contacts.length
      ? `<ul class="cv-list">${contacts.map((c) => `<li>${c}</li>`).join('')}</ul>`
      : '';

    let body;
    if (template === 'professional') {
      // Only accept images produced by the editor's photo upload
      const photo = /^data:image\/(png|jpeg|webp);base64,/.test(p.photo || '')
        ? `<div class="cv-photo"><img src="${p.photo}" alt=""></div>`
        : '';
      body = `
        <div class="cv-cols">
          <aside class="cv-aside">
            ${photo}
            <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
            ${section('Contact details', contactList)}
            ${section('Skills', skills)}
            ${section('Languages', languages)}
          </aside>
          <div class="cv-main">
            ${section('Personal statement', summary)}
            ${section('Work history', experience)}
            ${section('Education', education)}
          </div>
        </div>`;
    } else if (template === 'modern') {
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}</header>
        <div class="cv-cols">
          <aside class="cv-aside">
            ${section('Contact', contactList)}
            ${section('Skills', skills)}
            ${section('Languages', languages)}
          </aside>
          <div class="cv-main">
            ${section('Profile', summary)}
            ${section('Experience', experience)}
            ${section('Education', education)}
          </div>
        </div>`;
    } else {
      const contactRow = contacts.length
        ? `<p class="cv-contact">${contacts.map((c) => `<span>${c}</span>`).join('')}</p>`
        : '';
      body = `
        <header class="cv-header"><h1 class="cv-name">${name}</h1>${title}${contactRow}</header>
        ${section('Profile', summary)}
        ${section('Experience', experience)}
        ${section('Education', education)}
        ${section('Skills', skills)}
        ${section('Languages', languages)}`;
    }

    return `<div class="cv cv--${template}" style="--cv-accent:${esc(color || COLORS[0])}">${body}</div>`;
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

  window.CVRender = { render, mountThumb, TEMPLATES, COLORS, SAMPLE, PAGE_WIDTH };
})();
