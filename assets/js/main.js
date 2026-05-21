/* =========================================
   PORTFOLIO SITE JS
   ========================================= */

// ---- NAVIGATION / PAGE ROUTING ----
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');

function showPage(pageId) {
  pages.forEach(p => {
    p.classList.remove('active');
  });

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.toggle('nav-active', link.dataset.page === pageId);
  });

  // Update URL hash
  history.pushState(null, null, `#${pageId}`);

  // Re-init hscroll if going home
  if (pageId === 'home') {
    setTimeout(initHScroll, 100);
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// Handle back/forward
window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  showPage(hash);
});

// Init from URL
const initPage = window.location.hash.replace('#', '') || 'home';
showPage(initPage);

// ---- HORIZONTAL SCROLL ----
/*
  HOW TO ADD NEW IMAGES TO THE SCROLLER:
  In index.html, find the div with id="hscroll-track".
  Copy one of the existing .hscroll-item divs and swap the image src and caption.
  That's it.
*/
function initHScroll() {
  const section = document.querySelector('.hscroll-section');
  const track = document.querySelector('.hscroll-track');
  const progressFill = document.querySelector('.hscroll-progress-fill');

  if (!section || !track) return;

  const items = track.querySelectorAll('.hscroll-item');
  const itemCount = items.length;

  if (itemCount === 0) return;

  // How tall is the scroll section (controls scroll speed/distance)
  // Each item adds some scroll distance
  const scrollHeight = window.innerHeight * (itemCount * 0.5 + 1);
  section.style.height = `${scrollHeight}px`;

  function updateTrack() {
    const rect = section.getBoundingClientRect();
    const sectionTop = -rect.top;
    const sectionScrollable = scrollHeight - window.innerHeight;

    // Only animate when section is in view
    if (sectionTop < 0 || sectionTop > sectionScrollable) return;

    const progress = sectionTop / sectionScrollable; // 0 to 1

    // Total track width - viewport width
    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxTranslate = -(trackWidth - viewportWidth + 96); // 96 = padding

    const translateX = progress * maxTranslate;
    track.style.transform = `translateX(${translateX}px)`;

    // Progress bar
    if (progressFill) {
      progressFill.style.width = `${progress * 100}%`;
    }
  }

  window.addEventListener('scroll', updateTrack, { passive: true });
  updateTrack();
}

// Init on load
window.addEventListener('load', () => {
  if (document.getElementById('page-home').classList.contains('active')) {
    initHScroll();
  }
});

// ---- TICKER TAPE DUPLICATION ----
function initTicker() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;
  // Duplicate for seamless loop
  const clone = inner.cloneNode(true);
  inner.parentElement.appendChild(clone);
}

// ---- EASTER EGG ----
const easterBtn = document.getElementById('easter-trigger');
if (easterBtn) {
  easterBtn.addEventListener('click', () => {
    showPage('easter');
  });
}

// Konami code easter egg as well
let konamiSequence = [];
const konamiCode = [38,38,40,40,37,39,37,39,66,65]; // up up down down left right left right B A

document.addEventListener('keydown', (e) => {
  konamiSequence.push(e.keyCode);
  konamiSequence = konamiSequence.slice(-10);
  if (konamiSequence.join(',') === konamiCode.join(',')) {
    showPage('easter');
  }
});

// ---- TICKER INIT ----
document.addEventListener('DOMContentLoaded', initTicker);

// ---- SUBTLE HOVER PARALLAX ON HERO ----
document.addEventListener('mousemove', (e) => {
  const heroFrame = document.querySelector('.hero-image-frame img');
  if (!heroFrame) return;

  const { clientX, clientY } = e;
  const xRatio = (clientX / window.innerWidth - 0.5) * 8;
  const yRatio = (clientY / window.innerHeight - 0.5) * 5;

  heroFrame.style.transform = `scale(1.04) translate(${xRatio}px, ${yRatio}px)`;
});
