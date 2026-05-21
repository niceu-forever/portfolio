/* =========================================
   PORTFOLIO — MAIN JS
   ========================================= */

// ---- PAGE ROUTING ----
const pages    = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${id}`);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0 }); }
  navLinks.forEach(l => l.classList.toggle('nav-active', l.dataset.page === id));
  history.pushState(null, null, `#${id}`);
  if (id === 'home') setTimeout(initHScroll, 80);
}

navLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault(); showPage(l.dataset.page);
}));
window.addEventListener('popstate', () => showPage(location.hash.replace('#','') || 'home'));
showPage(location.hash.replace('#','') || 'home');


// ---- HORIZONTAL SCROLL ----
let hscrollCleanup = null;

function isMobile() { return window.innerWidth <= 768; }

function initHScroll() {
  if (hscrollCleanup) { hscrollCleanup(); hscrollCleanup = null; }

  const section = document.querySelector('.hscroll-section');
  const track   = document.querySelector('.hscroll-track');
  const counter = document.querySelector('.hscroll-counter');
  const dots    = document.querySelector('.hscroll-dots');
  const items   = track ? [...track.querySelectorAll('.hscroll-item')] : [];
  const prevBtn = document.querySelector('.hscroll-prev');
  const nextBtn = document.querySelector('.hscroll-next');

  if (!section || !track || items.length === 0) return;

  let current = 0;

  function getOffset(idx) {
    if (isMobile()) return -(idx * window.innerWidth);
    const gap = 64;
    let offset = window.innerWidth / 2 - items[idx].offsetWidth / 2;
    for (let i = 0; i < idx; i++) offset -= items[i].offsetWidth + gap;
    return offset;
  }

  if (dots) {
    dots.innerHTML = items.map((_, i) =>
      `<div class="hscroll-dot${i===0?' active':''}"></div>`).join('');
  }

  const scrollPerItem = window.innerHeight * 1.1;
  const totalScroll   = scrollPerItem * items.length + window.innerHeight;
  section.style.height = `${totalScroll}px`;

  function updateClasses(idx) {
    items.forEach((item, i) => {
      item.classList.remove('is-active','is-prev','is-next','is-far');
      const d = i - idx;
      if      (d === 0)  item.classList.add('is-active');
      else if (d === -1) item.classList.add('is-prev');
      else if (d === 1)  item.classList.add('is-next');
      else               item.classList.add('is-far');
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, items.length - 1));
    updateClasses(current);
    track.style.transform = `translateX(${getOffset(current)}px)`;
    if (counter) counter.textContent =
      `${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    if (dots) [...dots.querySelectorAll('.hscroll-dot')]
      .forEach((d,i) => d.classList.toggle('active', i === current));
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const top  = -rect.top;
    if (top < 0 || top > totalScroll - window.innerHeight) return;
    const idx = Math.min(Math.floor(top / scrollPerItem), items.length - 1);
    if (idx !== current) goTo(idx);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('scroll', onScroll, { passive: true });

  const imgPromises = items.map(item => {
    const img = item.querySelector('img');
    if (!img || img.complete) return Promise.resolve();
    return new Promise(res => { img.onload = res; img.onerror = res; });
  });
  Promise.all(imgPromises).then(() => goTo(0));

  hscrollCleanup = () => window.removeEventListener('scroll', onScroll);
}

window.addEventListener('load', () => {
  if (document.getElementById('page-home').classList.contains('active')) initHScroll();
});

window.addEventListener('resize', () => {
  if (document.getElementById('page-home').classList.contains('active'))
    setTimeout(initHScroll, 100);
});


// ---- LIGHTBOX ----
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let lbImages = [];
let lbIndex  = 0;

function updateLightbox() {
  lightboxImg.src = lbImages[lbIndex];
  if (lightboxCounter) {
    lightboxCounter.textContent = lbImages.length > 1
      ? `${lbIndex + 1} / ${lbImages.length}` : '';
  }
  if (lightboxPrev) lightboxPrev.classList.toggle('hidden', lbImages.length <= 1);
  if (lightboxNext) lightboxNext.classList.toggle('hidden', lbImages.length <= 1);
}

function openLightbox(images, startIndex = 0) {
  lbImages = Array.isArray(images) ? images : [images];
  lbIndex  = startIndex;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; lbImages = []; }, 300);
}

lightboxPrev?.addEventListener('click', e => {
  e.stopPropagation();
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  updateLightbox();
});

lightboxNext?.addEventListener('click', e => {
  e.stopPropagation();
  lbIndex = (lbIndex + 1) % lbImages.length;
  updateLightbox();
});

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; updateLightbox(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; updateLightbox(); }
});

// Wire up work cards — reads data-images if present, else single image
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const raw = card.dataset.images;
    if (raw) {
      try { openLightbox(JSON.parse(raw), 0); } catch(e) {}
    } else {
      const img = card.querySelector('.work-card-image img');
      if (img) openLightbox([img.src], 0);
    }
  });
});


// ---- NAV HIDE ON SCROLL DOWN ----
(function() {
  const nav = document.querySelector('.nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.transform = (y > lastY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
    lastY = y;
  }, { passive: true });
})();


// ---- EASTER EGG ----
document.getElementById('easter-trigger')?.addEventListener('click', () => showPage('easter'));

let seq = [];
const konami = [38,38,40,40,37,39,37,39,66,65];
document.addEventListener('keydown', e => {
  seq.push(e.keyCode); seq = seq.slice(-10);
  if (seq.join() === konami.join()) showPage('easter');
});


// ---- HERO PARALLAX ----
document.addEventListener('mousemove', e => {
  const img = document.querySelector('.hero-right img');
  if (!img) return;
  const x = (e.clientX / innerWidth  - 0.5) * 14;
  const y = (e.clientY / innerHeight - 0.5) * 9;
  img.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
});