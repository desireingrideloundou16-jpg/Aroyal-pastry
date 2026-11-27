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
  addEventListener('load', () => setTimeout(go, reduced ? 0 : 600));
  setTimeout(go, 2000);

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
  if (film) initFilm();

  function initFilm() {
    const S = s => $(s, film);
    const v = S('.film__video');
    const bar = S('.film__bar span'), time = S('.film__time');
    // Format adapté à l'écran : 16:9 sur grand écran, 4:5 sur mobile
    const wide = matchMedia('(min-width: 900px)');
    const pick = () => {
      const base = wide.matches ? v.dataset.wide : v.dataset.tall;
      if (v.dataset.cur === base) return;
      const t = v.currentTime, playing = !v.paused;
      v.dataset.cur = base; v.poster = base + '.jpg'; v.src = base + '.mp4';
      if (t) { v.currentTime = t; if (playing) v.play().catch(() => {}); }
    };
    pick(); wide.addEventListener('change', pick);

    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const sync = () => film.classList.toggle('muted', v.muted);
    v.addEventListener('timeupdate', () => { bar.style.transform = `scaleX(${v.duration ? v.currentTime / v.duration : 0})`; time.textContent = fmt(v.currentTime); });
    v.addEventListener('play', () => film.classList.add('started', 'playing'));
    v.addEventListener('pause', () => film.classList.remove('playing'));
    v.addEventListener('ended', () => { film.classList.remove('playing'); v.currentTime = 0; });
    v.addEventListener('volumechange', sync);

    const play = (sound) => { if (sound) v.muted = false; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); sync(); };
    S('.film__poster').addEventListener('click', () => { delete film.dataset.auto; play(true); });
    S('.film__play').addEventListener('click', () => { delete film.dataset.autopaused; v.paused ? play(false) : v.pause(); });
    S('.film__mute').addEventListener('click', () => { v.muted = !v.muted; });
    S('.film__unmute').addEventListener('click', () => { v.muted = false; if (v.paused) play(true); });
    v.addEventListener('click', () => { v.paused ? play(false) : v.pause(); });
    S('.film__bar').addEventListener('click', e => {
      const r = e.currentTarget.getBoundingClientRect();
      if (v.duration) v.currentTime = v.duration * (e.clientX - r.left) / r.width;
    });
    // Lecture auto (sans son, comme l'exigent les navigateurs) quand le film est visible
    if (!reduced) new IntersectionObserver(([en]) => {
      if (en.isIntersecting && en.intersectionRatio > .55) {
        if (!film.classList.contains('started')) { v.muted = true; play(false); }
        else if (film.dataset.autopaused) { delete film.dataset.autopaused; play(false); }
      } else if (!v.paused) { film.dataset.autopaused = '1'; v.pause(); }
    }, { threshold: [0, .55] }).observe(film);
  }
})();
