/* =========================================
   PORTFOLIO — MAIN JS
   ========================================= */

// ---- PAGE ROUTING ----
const pages    = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${id}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0 });
  }
  navLinks.forEach(l => {
    l.classList.toggle('nav-active', l.dataset.page === id);
  });
  history.pushState(null, null, `#${id}`);
  if (id === 'home') setTimeout(initHScroll, 80);
}

navLinks.forEach(l => l.addEventListener('click', e => {
  e.preventDefault();
  showPage(l.dataset.page);
}));

window.addEventListener('popstate', () => {
  showPage(location.hash.replace('#', '') || 'home');
});

showPage(location.hash.replace('#', '') || 'home');


// ---- HORIZONTAL SCROLL ----
/*
  ┌─────────────────────────────────────────┐
  │  HOW TO ADD IMAGES TO THE SCROLLER      │
  │                                         │
  │  Find the div id="hscroll-track"        │
  │  in index.html. Copy one .hscroll-item  │
  │  block, paste it inside, swap the img   │
  │  src and caption text. Done.            │
  │                                         │
  │  The JS adapts automatically.           │
  └─────────────────────────────────────────┘
*/
let hscrollCleanup = null;

function initHScroll() {
  if (hscrollCleanup) hscrollCleanup();

  const section      = document.querySelector('.hscroll-section');
  const track        = document.querySelector('.hscroll-track');
  const progressFill = document.querySelector('.hscroll-progress-fill');
  const counter      = document.querySelector('.hscroll-counter');

  if (!section || !track) return;

  const itemCount   = track.querySelectorAll('.hscroll-item').length;
  const scrollH     = window.innerHeight * (itemCount * 0.55 + 1.2);
  section.style.height = `${scrollH}px`;

  function update() {
    const rect       = section.getBoundingClientRect();
    const sectionTop = -rect.top;
    const scrollable = scrollH - window.innerHeight;

    if (sectionTop < 0 || sectionTop > scrollable) return;

    const progress   = Math.min(Math.max(sectionTop / scrollable, 0), 1);
    const trackW     = track.scrollWidth;
    const vpW        = window.innerWidth;
    const maxTx      = -(trackW - vpW + 64);

    track.style.transform = `translateX(${progress * maxTx}px)`;
    if (progressFill) progressFill.style.width = `${progress * 100}%`;
    if (counter) {
      const idx = Math.ceil(progress * itemCount);
      counter.textContent = `${String(idx).padStart(2,'0')} / ${String(itemCount).padStart(2,'0')}`;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
  hscrollCleanup = () => window.removeEventListener('scroll', update);
}

window.addEventListener('load', () => {
  if (document.getElementById('page-home').classList.contains('active')) {
    initHScroll();
  }
});


// ---- TICKER DUPLICATION ----
window.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.ticker-track');
  if (track) track.appendChild(track.cloneNode(true));
});


// ---- EASTER EGG ----
document.getElementById('easter-trigger')?.addEventListener('click', () => {
  showPage('easter');
});

// Konami: ↑↑↓↓←→←→BA
let seq = [];
const konami = [38,38,40,40,37,39,37,39,66,65];
document.addEventListener('keydown', e => {
  seq.push(e.keyCode);
  seq = seq.slice(-10);
  if (seq.join() === konami.join()) showPage('easter');
});


// ---- SUBTLE MOUSE PARALLAX ON HERO IMAGE ----
document.addEventListener('mousemove', e => {
  const img = document.querySelector('.hero-right img');
  if (!img) return;
  const x = (e.clientX / innerWidth  - 0.5) * 12;
  const y = (e.clientY / innerHeight - 0.5) * 8;
  img.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
});