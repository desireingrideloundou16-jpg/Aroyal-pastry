/* =====================================================================
   ARoyal Pastry — interactions, animations et film motion design
   ===================================================================== */
(() => {
  'use strict';
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = 'https://wa.me/237698658885?text=';

  /* ---------- Préchargement ---------- */
  let ready = false;
  const go = () => { if (ready) return; ready = true; body.classList.add('loaded'); startHero(); };
  addEventListener('load', () => setTimeout(go, reduced ? 0 : 1300));
  setTimeout(go, 3200);

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const burger = $('.burger'), nav = $('#nav');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('open', open);
    body.classList.toggle('locked', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Hero : diaporama ---------- */
  const slides = $$('.hero__slides img'), bars = $$('.hero__dots span');
  let slide = 0, timer;
  function show(i) {
    slides[slide].classList.remove('is-on');
    bars.forEach((b, k) => { b.classList.remove('is-on'); b.classList.toggle('is-done', k < i); });
    slide = i;
    slides[i].classList.add('is-on');
    void bars[i].offsetWidth;
    bars[i].classList.add('is-on');
  }
  function startHero() {
    if (reduced || timer) return;
    bars[0].classList.add('is-on');
    timer = setInterval(() => show((slide + 1) % slides.length), 5500);
  }

  /* ---------- Scroll : en-tête, dock, zoom signature ---------- */
  const header = $('.header'), dock = $('.dock');
  const zoom = $('.signature__zoom'), sticky = $('.signature__sticky');
  let lastY = 0, ticking = false;
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    header.classList.toggle('scrolled', y > 10);
    header.classList.toggle('hidden', y > lastY && y > 600 && !nav.classList.contains('open'));
    dock.classList.toggle('show', y > vh * .6);
    lastY = y;
    if (!reduced && zoom) {
      const r = zoom.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      sticky.style.setProperty('--p', p.toFixed(3));
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Apparitions en cascade ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const sibs = $$(':scope > .reveal', el.parentElement);
    el.style.transitionDelay = `${Math.min(Math.max(0, sibs.indexOf(el)), 6) * 90}ms`;
    el.classList.add('in');
    io.unobserve(el);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Cartes produits : apparition + liens WhatsApp ---------- */
  const cards = $$('.pcard');
  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-entering');
    cio.unobserve(en.target);
  }), { threshold: .1 });
  cards.forEach(c => cio.observe(c));
  $$('.pcard__cta').forEach(a => {
    a.href = WA + encodeURIComponent(`Bonjour ARoyal Pastry ! Je souhaite commander : ${a.dataset.product}. Pouvez-vous me donner les tarifs et disponibilités ?`);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Filtres ---------- */
  const tabs = $$('.filters button');
  function filter(cat) {
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.filter === cat));
    cards.forEach((c, i) => {
      const on = cat === 'all' || c.dataset.cat === cat;
      c.classList.toggle('is-hidden', !on);
      if (on) { c.classList.remove('is-entering'); void c.offsetWidth; c.style.animationDelay = `${(i % 8) * 50}ms`; c.classList.add('is-entering'); }
    });
  }
  tabs.forEach(t => t.addEventListener('click', () => filter(t.dataset.filter)));
  $$('[data-jump]').forEach(a => a.addEventListener('click', () => filter(a.dataset.jump)));

  /* ---------- Trompe-l'œil : cartes à retourner ---------- */
  const flips = $$('.flip');
  flips.forEach(f => f.addEventListener('click', () => {
    const on = f.getAttribute('aria-pressed') !== 'true';
    f.setAttribute('aria-pressed', on);
    if (on && navigator.vibrate) navigator.vibrate(10);
  }));
  if (!reduced && flips[0]) {
    const hint = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      hint.disconnect();
      setTimeout(() => { flips[0].setAttribute('aria-pressed', 'true'); setTimeout(() => flips[0].setAttribute('aria-pressed', 'false'), 1700); }, 900);
    }, { threshold: .7 });
    hint.observe(flips[0]);
  }

  /* ---------- Compteurs ---------- */
  const co = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, to = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
    const fmt = v => v.toFixed(dec).replace('.', ',') + suf;
    co.unobserve(el);
    if (reduced) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const tick = t => { const k = Math.min((t - t0) / 2000, 1); el.textContent = fmt(to * (1 - (1 - k) ** 4)); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => co.observe(el));

  /* ---------- Galerie + visionneuse ---------- */
  const lb = $('.lightbox'), lbImg = $('img', lb), shots = $$('.m img');
  let cur = 0;
  const openLb = i => { cur = (i + shots.length) % shots.length; lbImg.src = shots[cur].src; lbImg.alt = shots[cur].alt; lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = ''; if (!lb.open) lb.showModal(); };
  $$('.m').forEach((m, i) => m.addEventListener('click', () => openLb(i)));
  $('.lightbox__close').addEventListener('click', () => lb.close());
  $('.lightbox__prev').addEventListener('click', () => openLb(cur - 1));
  $('.lightbox__next').addEventListener('click', () => openLb(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowLeft') openLb(cur - 1); if (e.key === 'ArrowRight') openLb(cur + 1); });
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) openLb(cur + (d < 0 ? 1 : -1)); });

  /* ---------- Formulaire → WhatsApp ---------- */
  const form = $('#orderForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const err = $('.form__err', form);
    if (!d.name || !d.product) { err.hidden = false; return; }
    err.hidden = true;
    const date = d.date ? new Date(d.date + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'à définir';
    const msg = `Bonjour ARoyal Pastry !\n\nNom : ${d.name}\nProduit : ${d.product}\nDate souhaitée : ${date}\nNombre de personnes : ${d.qty || 'à définir'}\n${d.msg ? `Détails : ${d.msg}\n` : ''}\nMerci !`;
    window.open(WA + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* =====================================================================
     FILM MOTION DESIGN (GSAP)
     ===================================================================== */
  const film = $('.film');
  if (film && window.gsap) buildFilm();
  else if (film) $('.film__poster').addEventListener('click', () => window.open('https://www.tiktok.com/@aroyal_pastry', '_blank'));

  function buildFilm() {
    const g = window.gsap;
    const S = s => $(s, film);
    const tl = g.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    const scene = (sel, at) => tl.set(sel, { autoAlpha: 1 }, at);
    const out = (sel, at) => tl.to(sel, { autoAlpha: 0, duration: .6, ease: 'power2.inOut' }, at);

    g.set('.sc', { autoAlpha: 0 });

    // 1. Logo (0 → 4.4s)
    scene('.sc1', 0);
    tl.from(S('.sc1__ring'), { scale: 0, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0)
      .from(S('.sc1__logo'), { scale: .2, rotate: -40, opacity: 0, duration: 1.1, ease: 'back.out(1.8)' }, .2)
      .from($$('.sc1__name span', film), { yPercent: 120, opacity: 0, stagger: .06, duration: .8 }, .9)
      .from(S('.sc1__name em'), { y: 30, opacity: 0, duration: .8 }, 1.3)
      .from(S('.sc1__tag'), { y: 20, opacity: 0, duration: .8 }, 1.7)
      .to(S('.sc1__ring'), { scale: 1.25, opacity: 0, duration: 2.4, ease: 'sine.inOut' }, 1.6);
    out('.sc1', 3.8);

    // 2. Ngaoundéré (4.2 → 8.2s)
    scene('.sc2', 4.2);
    tl.from(S('.sc2 .sc__kicker'), { y: 20, opacity: 0, duration: .6 }, 4.3)
      .fromTo(S('.sc2__city'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 4.5)
      .from(S('.sc2__bar'), { scaleX: 0, duration: .9, ease: 'expo.out' }, 5.4)
      .from(S('.sc2 .sc__small'), { y: 16, opacity: 0, duration: .7 }, 5.8);
    out('.sc2', 7.6);

    // 3. Gâteaux sur mesure (8 → 12.4s)
    scene('.sc3', 8);
    tl.fromTo(S('.sc3 .sc__bg'), { scale: 1.25 }, { scale: 1, duration: 4.4, ease: 'none' }, 8)
      .from(S('.sc3 .sc__title'), { y: 60, opacity: 0, duration: 1.1 }, 8.6);
    out('.sc3', 11.8);

    // 4. Trompe-l'œil (12.2 → 16.8s)
    scene('.sc4', 12.2);
    tl.fromTo(S('.sc4 .sc__bg'), { scale: 1.3, xPercent: -6 }, { scale: 1.05, xPercent: 4, duration: 4.6, ease: 'none' }, 12.2)
      .from(S('.sc4__a'), { y: 40, opacity: 0, duration: .9 }, 12.7)
      .from(S('.sc4__b'), { y: 40, opacity: 0, duration: .9 }, 14);
    out('.sc4', 16.2);

    // 5. Douceurs (16.6 → 21s)
    scene('.sc5', 16.6);
    tl.from($$('.sc5__grid img', film), { scale: 1.4, opacity: 0, stagger: .18, duration: 1, ease: 'expo.out' }, 16.6)
      .from(S('.sc5__txt'), { y: 30, opacity: 0, scale: .9, duration: .8, ease: 'back.out(1.6)' }, 17.6)
      .to($$('.sc5__grid img', film), { scale: 1.08, duration: 3, ease: 'none' }, 17.6);
    out('.sc5', 20.4);

    // 6. Services (20.8 → 25s)
    scene('.sc6', 20.8);
    tl.from(S('.sc6 .sc__kicker'), { y: 20, opacity: 0, duration: .6 }, 20.9)
      .from($$('.sc6__list li', film), { x: -50, opacity: 0, stagger: .25, duration: .8, ease: 'expo.out' }, 21.2)
      .from($$('.sc6__list span', film), { scale: 0, rotate: -90, stagger: .25, duration: .8, ease: 'back.out(2)' }, 21.2);
    out('.sc6', 24.4);

    // 7. Appel à l'action (24.8 → 30s)
    scene('.sc7', 24.8);
    tl.from(S('.sc7__logo'), { scale: 0, rotate: 30, duration: 1, ease: 'back.out(1.7)' }, 24.9)
      .from(S('.sc7 .sc__kicker'), { y: 20, opacity: 0, duration: .6 }, 25.4)
      .from(S('.sc7__tel'), { y: 50, opacity: 0, duration: 1, ease: 'expo.out' }, 25.7)
      .from(S('.sc7 .sc__small'), { opacity: 0, duration: .8 }, 26.4)
      .to({}, { duration: 3.2 }, 26.8);

    const bar = S('.film__bar span'), time = S('.film__time');
    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    tl.eventCallback('onUpdate', () => { bar.style.transform = `scaleX(${tl.progress()})`; time.textContent = fmt(tl.time()); });
    tl.eventCallback('onComplete', () => { film.classList.remove('playing'); setTimeout(() => { tl.restart(); film.classList.add('playing'); }, 1500); });

    const play = () => { film.classList.add('started', 'playing'); tl.play(); };
    const pause = () => { film.classList.remove('playing'); tl.pause(); };
    S('.film__poster').addEventListener('click', play);
    S('.film__play').addEventListener('click', () => { delete film.dataset.autopaused; film.classList.contains('playing') ? pause() : play(); });
    S('.film__bar').addEventListener('click', e => {
      const r = e.currentTarget.getBoundingClientRect();
      tl.progress((e.clientX - r.left) / r.width);
      if (!film.classList.contains('playing')) tl.pause();
    });
    // Lecture auto quand le film est visible, pause quand il sort de l'écran
    if (!reduced) new IntersectionObserver(([en]) => {
      if (en.isIntersecting && en.intersectionRatio > .55) { if (!film.classList.contains('started') || film.dataset.autopaused) { delete film.dataset.autopaused; play(); } }
      else if (film.classList.contains('playing')) { film.dataset.autopaused = '1'; pause(); }
    }, { threshold: [0, .55] }).observe(film);
  }
})();
