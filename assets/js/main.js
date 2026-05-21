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


// ---- HORIZONTAL SCROLL — SNAP, ONE ITEM AT A TIME ----
/*
  HOW TO ADD IMAGES TO THE SCROLLER:
  In index.html find id="hscroll-track".
  Copy one .hscroll-item div, paste inside, update img src + caption.
  Done — JS adapts automatically.
*/
let hscrollCleanup = null;

function initHScroll() {
  if (hscrollCleanup) { hscrollCleanup(); hscrollCleanup = null; }

  const section      = document.querySelector('.hscroll-section');
  const track        = document.querySelector('.hscroll-track');
  const progressFill = document.querySelector('.hscroll-progress-fill');
  const counter      = document.querySelector('.hscroll-counter');
  const dots         = document.querySelector('.hscroll-dots');
  const items        = track ? [...track.querySelectorAll('.hscroll-item')] : [];
  const prevBtn      = document.querySelector('.hscroll-prev');
  const nextBtn      = document.querySelector('.hscroll-next');

  if (!section || !track || items.length === 0) return;

  let current = 0;

  // Build dots
  if (dots) {
    dots.innerHTML = items.map((_, i) => `<div class="hscroll-dot${i===0?' active':''}"></div>`).join('');
  }

  // How tall the scroll section is — controls how much page scroll = one item advance
  const scrollPerItem = window.innerHeight * 1.1;
  const totalScroll   = scrollPerItem * items.length + window.innerHeight;
  section.style.height = `${totalScroll}px`;

  function updateClasses(idx) {
    items.forEach((item, i) => {
      item.classList.remove('is-active','is-prev','is-next','is-far');
      const diff = i - idx;
      if      (diff === 0)   item.classList.add('is-active');
      else if (diff === -1)  item.classList.add('is-prev');
      else if (diff === 1)   item.classList.add('is-next');
      else                   item.classList.add('is-far');
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, items.length - 1));
    updateClasses(current);

    // Center the active item
    const itemW   = items[0].offsetWidth;
    const gap     = 64; // 4rem gap
    const vpW     = window.innerWidth;
    const offset  = (vpW / 2) - (itemW / 2) - (current * (itemW + gap));
    track.style.transform = `translateX(${offset}px)`;

    if (counter) counter.textContent =
      `${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;

    if (dots) {
      [...dots.querySelectorAll('.hscroll-dot')].forEach((d,i) =>
        d.classList.toggle('active', i === current));
    }
  }

  // Scroll-driven
  function onScroll() {
    const rect      = section.getBoundingClientRect();
    const sectionTop = -rect.top;
    if (sectionTop < 0 || sectionTop > totalScroll - window.innerHeight) return;
    const idx = Math.min(
      Math.floor(sectionTop / scrollPerItem),
      items.length - 1
    );
    if (idx !== current) goTo(idx);
  }

  // Button nav
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('scroll', onScroll, { passive: true });
  goTo(0);

  hscrollCleanup = () => window.removeEventListener('scroll', onScroll);
}

window.addEventListener('load', () => {
  if (document.getElementById('page-home').classList.contains('active')) initHScroll();
});


// ---- TICKER ----
window.addEventListener('DOMContentLoaded', () => {
  const t = document.querySelector('.ticker-track');
  if (t) t.appendChild(t.cloneNode(true));
});


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