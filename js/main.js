/* Milano Psicomotricità — interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- team (rendered from data) ---- */
  const team = [
    ['Francesca Pia Balta', 'Logopedista'],
    ['Mandela Marotta', 'Logopedista'],
    ['Sara Morelli', 'Logopedista'],
    ['Angelo Surano', 'Psicologo'],
    ['Valeria Plico', 'Psicomotricista'],
    ['Martina Puppulin', "Terapista della neuropsicomotricità dell'età evolutiva"],
    ['Helena Bertelli', "Terapista della neuropsicomotricità dell'età evolutiva"],
    ['Alessandra Taddeo', 'Pedagogista'],
    ['Luisa Iami', 'Educatrice'],
    ['Matteo del Vacchio', "Istruttore, allenatore, educatore d'infanzia"],
  ];
  const tones = ['var(--sun)', 'var(--sage)', 'var(--lilac)', '#f3b29d'];
  const grid = $('#teamGrid');
  if (grid) {
    grid.innerHTML = team.map(([name, role], i) => {
      const initials = name.split(' ').filter(w => w[0] === w[0].toUpperCase()).map(w => w[0]).slice(0, 2).join('');
      return `<li class="member reveal" style="--d:${(i % 5) * 0.06}s">
        <div class="member__avatar" style="--c:${tones[i % tones.length]}" aria-hidden="true">${initials}</div>
        <h3>${name}</h3><p>${role}</p></li>`;
    }).join('');
  }

  /* ---- loaded state (hero animation) ---- */
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('is-loaded'), 60));

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  $$('.services__grid .service').forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', `${(i % 3) * 0.08}s`); io.observe(el); });

  /* ---- counters ---- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      reduce ? (el.textContent = end) : requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---- nav: hide on scroll down, mobile menu ---- */
  const nav = $('#nav'), toggle = $('#navToggle');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !nav.classList.contains('is-open'));
    lastY = y;
  }, { passive: true });
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', false);
  }));

  /* ---- service filters ---- */
  $$('.filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter').forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', b === btn); });
    const f = btn.dataset.filter;
    $$('#servicesGrid .service').forEach(s => {
      s.classList.toggle('is-hidden', f !== 'all' && !s.dataset.cat.split(' ').includes(f));
    });
  }));

  /* ---- custom cursor + magnetic buttons + tilt (pointer devices only) ---- */
  if (matchMedia('(hover: hover)').matches && !reduce) {
    const cur = $('.cursor');
    let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cur.classList.add('is-on'); });
    document.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    (function loop() {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    $$('a, button, summary, .service, .lab').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-big'));
    });

    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    $$('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    /* hero parallax */
    const blobs = $$('.blob');
    addEventListener('mousemove', e => {
      const mx = e.clientX / innerWidth - 0.5, my = e.clientY / innerHeight - 0.5;
      blobs.forEach((b, i) => { b.style.translate = `${mx * (i + 1) * 30}px ${my * (i + 1) * 30}px`; });
    }, { passive: true });
  }

  /* ---- drag-to-scroll rail ---- */
  const rail = $('#labsRail');
  if (rail) {
    let down = false, sx = 0, sl = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('is-drag'); });
    addEventListener('pointerup', () => { down = false; rail.classList.remove('is-drag'); });
    rail.addEventListener('pointermove', e => { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
  }

  /* ---- gallery autoplay ---- */
  $$('[data-gallery]').forEach(g => {
    let i = 0;
    setInterval(() => {
      const imgs = $$('img', g);
      if (imgs.length < 2 || reduce) return;
      i = (i + 1) % imgs.length;
      g.scrollTo({ left: g.clientWidth * i, behavior: 'smooth' });
    }, 4200);
  });

  /* ---- contact form → WhatsApp ---- */
  const form = $('#contactForm'), note = $('#formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['f-name', 'f-msg'].forEach(id => {
      const el = $('#' + id), bad = !el.value.trim();
      el.parentElement.classList.toggle('is-error', bad);
      if (bad) ok = false;
    });
    if (!$('#f-privacy').checked) { note.textContent = 'Per procedere serve il consenso al trattamento dei dati.'; return; }
    if (!ok) { note.textContent = 'Compila nome e messaggio, per favore.'; return; }
    const d = new FormData(form);
    const text = `Salve, sono ${d.get('name')}.\nArgomento: ${d.get('topic')}\n${d.get('phone') ? 'Telefono: ' + d.get('phone') + '\n' : ''}\n${d.get('message')}`;
    note.textContent = 'Ti stiamo portando su WhatsApp…';
    window.open(`https://api.whatsapp.com/send?phone=393939120932&text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  $('#year').textContent = new Date().getFullYear();
})();
