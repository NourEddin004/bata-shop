# Bata Shop — storefront mockup

A static e-commerce mockup for **Bata Shop (بطة شوب)**, the Jordanian modest-wear brand
behind [@bata_shop1](https://www.instagram.com/bata_shop1/). Plain HTML, CSS and JavaScript:
no build step and no backend, so it opens straight from a static server and deploys to GitHub Pages as is.

Design inspired by the JUDE storefront: a floating glass navigation pill, a hero of looks standing
on a soft shadow, and a palette taken from the logo and used 60 / 30 / 10: white and warm cream
surfaces (60), logo black for type and buttons (30), and the logo's yellow duckling as the accent (10).

## Run locally

```
python3 -m http.server 5190
```

Then open http://127.0.0.1:5190.

## Pages

| File | What it shows |
| --- | --- |
| `index.html` | Typographic hero with photos of three looks set between the words, trust strip, our story (About), how to order, reviews, Instagram strip |
| `shop.html` | Category tiles, new this week, then the catalog with category tabs, colour filters and search (`?cat=sets&shade=plum&q=coat`) |
| `product.html?id=…` | Gallery, required size choice, size guide, quantity, details and related pieces |
| `cart.html` | Full bag with free-delivery progress |
| `checkout.html` | Jordan city → area address, +962 phone, delivery by city, cash on delivery / CliQ / branch pickup, confirmation |
| `contact.html` | Branches (Zarqa, Amman), FAQ |

The bag drawer, search panel, menu and toasts are on every page. The bag and last order
live in `localStorage`. Nothing is sent anywhere.

## Editing

- **Products, prices, cities, reviews, copy:** `assets/js/catalog.js`
- **Colours, fonts, spacing:** `assets/css/tokens.css` (the only file with raw values). Page bands use `b-tone--white/cream/sand/ink` for the 60/30/10 split
- **Hero:** all in `index.html`; each photo pill (`b-pill`) links to a product, and `--y` sets how its photo is cropped
- **Components:** `assets/css/styles.css` (`b-*` classes, `is-*` states)
- **Logo:** redrawn as SVG in `assets/js/app.js` (`monogram()` and `duck()`), because Instagram
  only serves the original at 150 px. The original is kept at `assets/img/logo-instagram.jpg`
  (also the favicon).

## Still placeholder

- Product photos are 361 px frames from the brand's Instagram reels. Replace them with studio shots
  (3:4, at least 1200 px tall) in `assets/img/products/`.
- Prices, sizes, delivery fees, the WhatsApp number and opening hours are placeholders.
- The product gallery shows three crops of one photo until there are real angles per piece.

## Deploy to GitHub Pages

Push the folder to a repository, then go to **Settings → Pages → Deploy from branch → `main` / root**.
`.nojekyll` is included, and every link is relative, so the site works under a `/repo-name/` path.
