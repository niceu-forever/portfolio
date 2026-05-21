# Markus Håland — Portfolio Site

A vintage 90s-inspired portfolio. Creamy background, editorial serif type,
horizontal scroll gallery, multi-page routing, easter egg included.

## File structure

```
portfolio/
  index.html          — Everything lives here (all pages)
  vercel.json         — Vercel routing config
  assets/
    css/style.css     — All styles
    js/main.js        — Scroll logic, routing, easter egg
```

## Deploying to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import repo
3. Leave all settings as default — Vercel auto-detects static HTML
4. Deploy. Done.

No build step, no npm install, no framework.

---

## How to add images to the horizontal scroller

Open `index.html`, find the div with `id="hscroll-track"`.
Copy one of these blocks and add it inside that div:

```html
<div class="hscroll-item">
  <img src="your-image.jpg" alt="Project name" loading="lazy" />
  <div class="hscroll-item-caption">Category — Year</div>
</div>
```

Swap the `src`, `alt`, and caption text. That's literally it.
The scroll JS auto-adapts to however many items you have.

---

## Things to customise

- **Hero image**: `index.html` → search for "Hero image" comment → swap the `src`
- **Your photo on About**: search for "about-photo-placeholder" → replace the div with an `<img>`
- **Work grid images**: swap the Unsplash URLs for your actual project images
- **Contact links**: update email, Instagram, LinkedIn, Behance hrefs
- **Ticker tape text**: find `.ticker-item` spans and edit text

---

## Easter Egg

Two ways to find it:
1. The tiny subtle dot in the bottom-right corner of every page
2. The Konami code: ↑ ↑ ↓ ↓ ← → ← → B A

The VHS label on the easter egg page is inspired by your Sakura Chroma reference.
