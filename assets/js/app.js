/*
  Bata Shop — storefront script.
  Shared chrome (header, footer, bag drawer, search, toasts), a localStorage bag,
  and one render function per page, picked by <body data-page="…">.
*/
(function () {
  "use strict";

  const D = window.BATA;
  const S = D.store;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const page = document.body.dataset.page;

  /* ---------- Helpers ---------- */
  const money = (n) => "JD " + (Number.isInteger(n) ? n : n.toFixed(2));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = (id) => D.products.find((p) => p.id === id);
  const params = new URLSearchParams(location.search);
  const catLabel = (id) => (D.categories.find((c) => c.id === id) || {}).label || "";
  const shadeLabel = (id) => (D.shades.find((s) => s.id === id) || {}).label || "";
  const productUrl = (p) => "product.html?id=" + encodeURIComponent(p.id);
  const newIn = () => [...D.products].sort((a, b) => b.added - a.added).slice(0, D.newInCount);
  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = src;
      el.onload = resolve;
      el.onerror = reject;
      document.head.append(el);
    });

  const storage = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* private mode: keep working in memory for this page */
      }
    }
  };

  /* ---------- Icons ---------- */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    bag: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
    cash: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
    store: '<path d="M4 10l1.5-5h13L20 10M4 10h16M4 10v9h16v-9M9.5 19v-5h5v5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r="0.6"/>',
    whatsapp: '<path d="M5 19l1.1-3.6A7.5 7.5 0 1 1 9 18.3z"/><path d="M9.5 9.5c.3 1.8 1.6 3.4 3.6 4.3l1.2-1.1 1.6.8"/>',
    phone: '<path d="M6.5 4h3l1.5 4-2 1.2a10 10 0 0 0 5.8 5.8L16 13l4 1.5v3A2.5 2.5 0 0 1 17.5 20 13.5 13.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4z"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.8 20.2c.9-3.8 3.7-5.9 7.2-5.9s6.3 2.1 7.2 5.9"/>'
  };
  const icon = (name, cls = "") => `<svg class="b-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  /* The duckling from the logo, redrawn as a vector. */
  const duck = (cls = "") => `
    <svg class="${cls}" viewBox="0 0 40 46" aria-hidden="true">
      <path d="M17 6.5c-.6-2.6 1.4-4.3 3.2-3.6-1.2.6-1.3 1.8-.6 3" fill="#e9b116"/>
      <ellipse cx="20.5" cy="32" rx="13.5" ry="11.5" fill="#f7c52b"/>
      <circle cx="20" cy="15.5" r="10" fill="#f7c52b"/>
      <path d="M11 30c3.5-.4 7.2 1.6 8.2 5.2-3.7 1.4-7.5-.6-8.2-5.2z" fill="#e9b116"/>
      <path d="M27.5 15.5l6.5 1.6-6.4 2.2z" fill="#f08a1c"/>
      <circle cx="23.6" cy="13.4" r="1.7" fill="#1b1915"/>
      <circle cx="24.1" cy="12.9" r=".5" fill="#fff"/>
      <ellipse cx="16" cy="18.5" rx="2.2" ry="1.3" fill="#f6a48f" opacity=".55"/>
      <path d="M15 43.2l2.4-1.6 1.2 1.9M23 43.2l2.4-1.6 1.2 1.9" fill="none" stroke="#f08a1c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  /* The circle monogram from the logo: B, olive sprig, dress on a hanger. */
  const monogram = (cls = "") => `
    <svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="54" r="34" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
        <path d="M11.4 48.6A39 39 0 0 1 48.6 15"/>
        <path d="M84 29c-2.4-3.1-1-6.6 1.8-6.6s3.6 3.4 1 5.2L74 37"/>
      </g>
      <g fill="currentColor">
        <ellipse cx="11" cy="39.8" rx="4.4" ry="1.6" transform="rotate(-30 11 39.8)"/>
        <ellipse cx="15.7" cy="41.5" rx="4.4" ry="1.6" transform="rotate(-110 15.7 41.5)"/>
        <ellipse cx="18.2" cy="27.3" rx="4.4" ry="1.6" transform="rotate(-10 18.2 27.3)"/>
        <ellipse cx="22" cy="30.5" rx="4.4" ry="1.6" transform="rotate(-90 22 30.5)"/>
        <ellipse cx="29.3" cy="18.1" rx="4.4" ry="1.6" transform="rotate(10 29.3 18.1)"/>
        <ellipse cx="31.8" cy="22.4" rx="4.4" ry="1.6" transform="rotate(-70 31.8 22.4)"/>
        <ellipse cx="42.8" cy="13.1" rx="3.6" ry="1.6" transform="rotate(30 42.8 13.1)"/>
        <ellipse cx="43.7" cy="18.1" rx="3.6" ry="1.6" transform="rotate(-50 43.7 18.1)"/>
      </g>
      <path d="M74 37c-1.8 2.2-2 5.4-.6 7.6l-5.6 22.4c4.3 2.4 12.6 3.3 19.5 1.6L80.7 44.6c1.4-2.2 1.2-5.4-.6-7.6" fill="#fff" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M73.6 44.6h7.2M71 55l11.6-.4" stroke="currentColor" stroke-width="1" fill="none"/>
      <text x="48.5" y="70" text-anchor="middle" font-family="Bodoni Moda, Didot, Georgia, serif" font-size="46" font-weight="500" fill="currentColor">B</text>
    </svg>`;



  const fullLogo = () => `
    <span class="b-logo-full" role="img" aria-label="Bata Shop — بطة شوب">
      ${monogram("b-logo-full__mark")}
      <span class="b-logo-full__name">BA${duck("b-brand__duck")}A</span>
    </span>`;

  /* ---------- Bag ----------
     A line can be added from a product card before a size is chosen (size: null).
     The size is picked in the cart, and checkout stays locked until every line has one. */
  let onBagChange = null;
  const bag = {
    lines: storage.get("bata.bag", []),
    save() {
      storage.set("bata.bag", this.lines);
      renderBagCount();
      renderDrawer();
      if (page === "cart") renderCartPage();
      if (onBagChange) onBagChange();
    },
    find(id, size) {
      return this.lines.find((l) => l.id === id && (l.size || null) === (size || null));
    },
    add(id, size, qty) {
      const line = this.find(id, size);
      if (line) line.qty = Math.min(S.maxQty, line.qty + qty);
      else this.lines.push({ id, size: size || null, qty: Math.min(S.maxQty, qty) });
      this.save();
    },
    // Product page: put exactly this size and quantity in the bag, reusing a line added without a size
    set(id, size, qty) {
      const line = this.find(id, size) || this.find(id, null);
      if (line) {
        line.size = size;
        line.qty = Math.min(S.maxQty, qty);
      } else this.lines.push({ id, size, qty: Math.min(S.maxQty, qty) });
      this.save();
    },
    setSize(index, size) {
      const line = this.lines[index];
      const twin = size && this.lines.find((l, i) => i !== index && l.id === line.id && l.size === size);
      if (twin) {
        twin.qty = Math.min(S.maxQty, twin.qty + line.qty);
        this.lines.splice(index, 1);
      } else line.size = size || null;
      this.save();
    },
    setQty(index, qty) {
      if (qty < 1) this.lines.splice(index, 1);
      else this.lines[index].qty = Math.min(S.maxQty, qty);
      this.save();
    },
    remove(index) {
      this.lines.splice(index, 1);
      this.save();
    },
    clear() {
      this.lines = [];
      this.save();
    },
    items() {
      return this.lines.map((l, index) => ({ ...l, index, product: byId(l.id) })).filter((l) => l.product);
    },
    count() {
      return this.items().reduce((n, l) => n + l.qty, 0);
    },
    subtotal() {
      return this.items().reduce((n, l) => n + l.qty * l.product.price, 0);
    },
    missingSizes() {
      return this.items().filter((l) => !l.size).length;
    }
  };

  /* ---------- Shared chrome ---------- */
  const NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "shop.html", label: "Shop", page: "shop" }
  ];

  const isCurrent = (item) => item.page === page;

  function renderChrome() {
    const header = document.createElement("div");
    header.innerHTML = `
      <a class="b-skip" href="#main">Skip to content</a>
      <header class="b-header">
        <div class="b-header__bar">
          <button class="b-icon-btn b-header__menu" type="button" data-open="menu" aria-label="Open menu">${icon("menu")}</button>
          <nav class="b-header__nav" aria-label="Main">
            ${NAV.map((n) => `<a class="b-header__link" href="${n.href}"${isCurrent(n) ? ' aria-current="page"' : ""}>${n.label}</a>`).join("")}
          </nav>
          <a class="b-header__logo" href="index.html" aria-label="Bata Shop home">${fullLogo()}</a>
          <div class="b-header__tools">
            <button class="b-icon-btn" type="button" data-open="search" aria-label="Search">${icon("search")}</button>
            <button class="b-icon-btn b-header__account" type="button" data-account aria-label="Account">${icon("user")}</button>
            <button class="b-icon-btn" type="button" data-open="bag" aria-label="Shopping bag">${icon("bag")}<span class="b-count" data-bag-count></span></button>
          </div>
        </div>
      </header>`;
    document.body.prepend(...header.childNodes);

    const footer = document.createElement("footer");
    footer.className = "b-footer";
    footer.innerHTML = `
      <div class="b-footer__grid">
        <div class="b-footer__brand">
          ${fullLogo()}
          <p class="b-footer__note">${esc(S.tagline)} ${esc(S.founder)}.</p>
        </div>
        <div class="b-footer__col">
          <p class="b-footer__heading">Shop</p>
          ${D.categories.map((c) => `<a href="shop.html${c.id === "all" ? "" : "?cat=" + c.id}">${c.label}</a>`).join("")}
        </div>
        <div class="b-footer__col">
          <p class="b-footer__heading">Help</p>
          <a href="contact.html#faq">Delivery & exchange</a>
          <a href="contact.html#faq">Size guide</a>
          <a href="contact.html">Branches</a>
          <a href="cart.html">Your bag</a>
        </div>
        <div class="b-footer__col">
          <p class="b-footer__heading">Talk to us</p>
          <a href="${S.instagram}" target="_blank" rel="noopener">Instagram · @bata_shop1</a>
          <a href="${S.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
          ${S.branches.map((b) => `<span>${b.name} — ${b.detail}</span>`).join("")}
        </div>
      </div>
      <div class="b-footer__base">
        <span>© ${new Date().getFullYear()} Bata Shop · ${S.nameAr}</span>
        <span>Design mockup — prices and stock are placeholders</span>
      </div>`;
    document.body.append(footer);

    const overlays = document.createElement("div");
    overlays.innerHTML = `
      <div class="b-scrim" data-scrim></div>
      <aside class="b-drawer" id="bag-drawer" aria-label="Shopping bag" aria-hidden="true">
        <div class="b-drawer__head">
          <h2 class="b-drawer__title">Your bag</h2>
          <button class="b-icon-btn" type="button" data-close aria-label="Close bag">${icon("close")}</button>
        </div>
        <div class="b-drawer__body" data-drawer-body></div>
        <div class="b-drawer__foot" data-drawer-foot></div>
      </aside>
      <aside class="b-drawer b-drawer--left" id="menu-drawer" aria-label="Menu" aria-hidden="true">
        <div class="b-drawer__head">
          <span class="b-menu-logo">${fullLogo()}</span>
          <button class="b-icon-btn" type="button" data-close aria-label="Close menu">${icon("close")}</button>
        </div>
        <div class="b-drawer__body">
          <nav class="b-menu-links" aria-label="Mobile">
            ${NAV.map((n) => `<a href="${n.href}"${isCurrent(n) ? ' aria-current="page"' : ""}>${n.label}</a>`).join("")}
          </nav>
        </div>
        <div class="b-drawer__foot">
          <a class="b-btn b-btn--ghost" href="${S.instagram}" target="_blank" rel="noopener">${icon("instagram")} @bata_shop1</a>
        </div>
      </aside>
      <div class="b-search" id="search-panel" role="dialog" aria-label="Search" aria-hidden="true">
        <form class="b-search__inner" action="shop.html" role="search">
          <div class="b-search__row">
            ${icon("search")}
            <label class="b-sr" for="search-input">Search the shop</label>
            <input class="b-search__input" id="search-input" name="q" type="search" placeholder="Search coats, sets, denim…" autocomplete="off">
            <button class="b-icon-btn" type="button" data-close aria-label="Close search">${icon("close")}</button>
          </div>
          <div class="b-search__hint"><span>Try:</span>
            ${["Trench", "Denim", "Tatreez", "Corduroy", "Abaya"].map((t) => `<a class="b-chip" href="shop.html?q=${encodeURIComponent(t)}">${t}</a>`).join("")}
          </div>
          <div class="b-search__results" data-search-results></div>
        </form>
      </div>
      <div class="b-modal" id="size-guide" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" aria-hidden="true">
        <div class="b-modal__panel">
          <button class="b-icon-btn b-modal__close" type="button" data-close aria-label="Close size guide">${icon("close")}</button>
          <h2 class="b-title" id="size-guide-title">Find your size</h2>
          <p class="b-page-head__lead" style="margin-block: 0.75rem 1.25rem">Our cuts are loose. If you're between two sizes, take the smaller one. Measurements in cm.</p>
          <table class="b-table">
            <thead><tr><th>Size</th><th>Bust</th><th>Hip</th><th>Length</th></tr></thead>
            <tbody>
              <tr><td>S</td><td>96</td><td>104</td><td>138</td></tr>
              <tr><td>M</td><td>102</td><td>110</td><td>140</td></tr>
              <tr><td>L</td><td>108</td><td>116</td><td>142</td></tr>
              <tr><td>XL</td><td>116</td><td>124</td><td>144</td></tr>
              <tr><td>XXL</td><td>124</td><td>132</td><td>146</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="b-toast" role="status" aria-live="polite" data-toast><span class="b-toast__dot"></span><span data-toast-text></span></div>`;
    document.body.append(...overlays.childNodes);

    renderBagCount();
    renderDrawer();
    wireHeader();
    wireOverlays();
  }

  function renderBagCount() {
    $$("[data-bag-count]").forEach((el) => {
      el.textContent = bag.count();
      el.dataset.count = bag.count();
    });
  }

  /* ---------- Overlays: drawers, search, modal ---------- */
  let openPanel = null;
  let lastFocus = null;

  function open(id) {
    close();
    const panel = $("#" + id);
    if (!panel) return;
    lastFocus = document.activeElement;
    openPanel = panel;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    if (!panel.classList.contains("b-modal")) $("[data-scrim]").classList.add("is-open");
    document.body.classList.add("is-locked");
    const focusTarget = panel.querySelector("input, button, a");
    if (focusTarget) setTimeout(() => focusTarget.focus(), 60);
  }

  function close() {
    if (!openPanel) return;
    openPanel.classList.remove("is-open");
    openPanel.setAttribute("aria-hidden", "true");
    $("[data-scrim]").classList.remove("is-open");
    document.body.classList.remove("is-locked");
    openPanel = null;
    if (lastFocus) lastFocus.focus();
  }

  function wireHeader() {
    $("[data-account]").addEventListener("click", () => toast("Accounts are coming soon — checkout works without one."));
  }

  function wireOverlays() {
    const targets = { bag: "bag-drawer", menu: "menu-drawer", search: "search-panel", "size-guide": "size-guide" };
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-open]");
      if (opener) {
        e.preventDefault();
        open(targets[opener.dataset.open]);
        return;
      }
      if (e.target.closest("[data-close]") || e.target.matches("[data-scrim]") || e.target.matches(".b-modal")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    const input = $("#search-input");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const hits = q ? search(q).slice(0, 5) : [];
      $("[data-search-results]").innerHTML = hits
        .map((p) => `<a class="b-search__hit" href="${productUrl(p)}"><img src="${p.image}" alt=""><span><strong>${esc(p.name)}</strong><br><small>${catLabel(p.category)} · ${money(p.price)}</small></span></a>`)
        .join("") || (q ? `<p class="b-search__hint">Nothing for “${esc(q)}” yet — press Enter to see everything.</p>` : "");
    });
  }

  function search(q) {
    return D.products.filter((p) =>
      [p.name, p.nameAr, catLabel(p.category), shadeLabel(p.shade), p.description, ...p.details].join(" ").toLowerCase().includes(q)
    );
  }

  let toastTimer;
  function toast(html) {
    const el = $("[data-toast]");
    $("[data-toast-text]").innerHTML = html;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
  }

  /* ---------- Bag drawer ---------- */
  function sizeSelect(l, cls = "") {
    const p = l.product;
    return `
      <label class="b-sr" for="line-size-${l.index}">Size for ${esc(p.name)}</label>
      <select class="b-select b-line__size${l.size ? "" : " is-missing"} ${cls}" id="line-size-${l.index}" data-line-size="${l.index}">
        <option value="">Choose size</option>
        ${p.sizes.map((sz) => `<option${sz === l.size ? " selected" : ""}>${sz}</option>`).join("")}
      </select>`;
  }

  function lineHtml(l, size = "") {
    const p = l.product;
    const i = l.index;
    return `
      <div class="b-line">
        <a class="b-line__media" href="${productUrl(p)}"><img src="${p.image}" alt="${esc(p.name)}"></a>
        <div class="b-line__info">
          <a class="b-line__name" href="${productUrl(p)}">${esc(p.name)}</a>
          <span class="b-line__meta">${shadeLabel(p.shade)}</span>
          ${sizeSelect(l)}
          <div class="b-line__actions">
            <div class="b-stepper b-stepper--${size || "sm"}">
              <button type="button" data-qty="${i}" data-step="-1" aria-label="Fewer">−</button>
              <output aria-label="Quantity">${l.qty}</output>
              <button type="button" data-qty="${i}" data-step="1" aria-label="More"${l.qty >= S.maxQty ? " disabled" : ""}>+</button>
            </div>
          </div>
        </div>
        <div class="b-line__end">
          <span class="b-line__price">${money(p.price * l.qty)}</span>
          <button class="b-line__remove" type="button" data-remove="${i}">Remove</button>
        </div>
      </div>`;
  }

  function progressHtml() {
    const left = S.freeDeliveryFrom - bag.subtotal();
    const pct = Math.min(100, (bag.subtotal() / S.freeDeliveryFrom) * 100);
    return `
      <div class="b-progress">
        <span>${left > 0 ? `You're <strong>${money(left)}</strong> away from free delivery` : "<strong>Free delivery</strong> unlocked 🐥"}</span>
        <div class="b-progress__bar"><div class="b-progress__fill" style="transform:scaleX(${pct / 100})"></div></div>
      </div>`;
  }

  function emptyHtml(title, text, cta = "Start shopping") {
    return `
      <div class="b-empty">
        ${duck("b-empty__duck")}
        <p class="b-empty__title">${title}</p>
        <p class="b-empty__text">${text}</p>
        <a class="b-btn b-btn--primary" href="shop.html">${cta}</a>
      </div>`;
  }

  // Checkout opens once every piece in the bag has a size
  function checkoutButton() {
    const missing = bag.missingSizes();
    return missing
      ? `<p class="b-summary__alert" role="status">Choose a size for ${missing === 1 ? "1 piece" : missing + " pieces"} to check out.</p>
         <button class="b-btn b-btn--duck b-btn--block" type="button" disabled>Checkout</button>`
      : `<p class="b-summary__note">Delivery is worked out at checkout. Pay cash when it arrives.</p>
         <a class="b-btn b-btn--duck b-btn--block" href="checkout.html">Checkout</a>`;
  }

  function renderDrawer() {
    const body = $("[data-drawer-body]");
    const foot = $("[data-drawer-foot]");
    if (!body) return;
    const items = bag.items();
    if (!items.length) {
      body.innerHTML = emptyHtml("Your bag is empty", "The duck is waiting. Add a look you love and it'll show up here.");
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = progressHtml() + items.map((l) => lineHtml(l)).join("");
    foot.innerHTML = `
      <div class="b-summary__row b-summary__row--total"><span>Subtotal</span><span>${money(bag.subtotal())}</span></div>
      ${checkoutButton()}
      <button class="b-btn b-btn--primary b-btn--block" type="button" data-close>Continue shopping</button>`;
  }

  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-qty]");
    if (q) {
      const i = Number(q.dataset.qty);
      bag.setQty(i, bag.lines[i].qty + Number(q.dataset.step));
      return;
    }
    const r = e.target.closest("[data-remove]");
    if (r) {
      bag.remove(Number(r.dataset.remove));
      return;
    }
  });

  // Product card: add now, choose the size later in the cart
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (!add) return;
    bag.add(add.dataset.add, null, 1);
    open("bag-drawer");
  });

  document.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-line-size]");
    if (sel) bag.setSize(Number(sel.dataset.lineSize), sel.value);
  });

  /* ---------- Product card ---------- */
  function cardHtml(p) {
    return `
      <article class="b-card">
        <a class="b-card__media" href="${productUrl(p)}">
          <img src="${p.image}" alt="${esc(p.name)}" loading="lazy">
          ${p.badge ? `<span class="b-badge b-card__badge${p.badge === "New" ? " b-badge--duck" : ""}">${p.badge}</span>` : ""}
        </a>
        <div class="b-card__foot">
          <span class="b-card__price">${money(p.price)}</span>
          <button class="b-btn b-btn--primary b-card__add" type="button" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">Add to cart</button>
        </div>
      </article>`;
  }

  /* ---------- Pages ---------- */
  function renderHome() {
    $("[data-reviews]").innerHTML = D.reviews
      .map((r) => `
        <figure class="b-review">
          <span class="b-review__stars" aria-label="5 out of 5">★★★★★</span>
          <blockquote class="b-review__text">“${esc(r.text)}”</blockquote>
          <figcaption class="b-review__who"><strong>${esc(r.name)}</strong> · ${esc(r.city)}</figcaption>
        </figure>`)
      .join("");

    const gram = ["look-12", "look-03", "look-07", "look-09", "look-05", "look-11"];
    $("[data-gram]").innerHTML = gram
      .map((g) => `<a href="${S.instagram}" target="_blank" rel="noopener" aria-label="See this look on Instagram"><img src="assets/img/products/${g}.jpg" alt="" loading="lazy"></a>`)
      .join("");

  }

  function renderShop() {
    const state = {
      cat: D.categories.some((c) => c.id === params.get("cat")) ? params.get("cat") : "all",
      shade: params.get("shade") || "",
      size: D.sizes.includes(params.get("size")) ? params.get("size") : "",
      q: params.get("q") || "",
      sort: params.get("sort") || "featured"
    };

    const tabs = $("[data-tabs]");
    const shades = $("[data-shades]");
    const sizes = $("[data-size-filter]");
    const qInput = $("[data-q]");
    qInput.value = state.q;

    function sync() {
      const u = new URLSearchParams();
      if (state.cat !== "all") u.set("cat", state.cat);
      if (state.shade) u.set("shade", state.shade);
      if (state.size) u.set("size", state.size);
      if (state.q) u.set("q", state.q);
      if (state.sort !== "featured") u.set("sort", state.sort);
      history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
      draw();
    }

    function draw() {
      const cat = D.categories.find((c) => c.id === state.cat);
      $("[data-shop-title]").textContent = state.cat === "all" ? "The collection" : cat.label;
      document.title = (state.cat === "all" ? "Shop" : cat.label) + " — Bata Shop";

      tabs.innerHTML = D.categories
        .map((c) => `<button class="b-tab${c.id === state.cat ? " is-active" : ""}" type="button" data-cat="${c.id}" aria-pressed="${c.id === state.cat}">${c.label}</button>`)
        .join("");
      shades.innerHTML =
        `<span class="b-toolbar__label">Colour</span>` +
        D.shades
          .map((s) => `<button class="b-shade-btn${s.id === state.shade ? " is-active" : ""}" type="button" data-shade="${s.id}" aria-pressed="${s.id === state.shade}"><span class="b-swatch" data-shade="${s.id}"></span>${s.label}</button>`)
          .join("");
      sizes.innerHTML =
        `<span class="b-toolbar__label">Size</span>` +
        D.sizes.map((sz) => `<button class="b-size-chip${sz === state.size ? " is-active" : ""}" type="button" data-size="${sz}" aria-pressed="${sz === state.size}">${sz}</button>`).join("");
      $("[data-clear]").hidden = !(state.shade || state.size || state.q);

      let list = state.q ? search(state.q.toLowerCase()) : [...D.products];
      if (state.cat === "new") {
        const fresh = newIn();
        list = list.filter((p) => fresh.includes(p)).sort((a, b) => b.added - a.added);
      } else if (state.cat !== "all") list = list.filter((p) => p.category === state.cat);
      if (state.shade) list = list.filter((p) => p.shade === state.shade);
      if (state.size) list = list.filter((p) => p.sizes.includes(state.size));
      if (state.sort === "new") list.sort((a, b) => b.added - a.added);
      if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
      if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);

      $("[data-results-count]").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}${state.q ? ` for “${state.q}”` : ""}`;
      $("[data-grid]").innerHTML = list.length
        ? list.map(cardHtml).join("")
        : `<div style="grid-column:1/-1">${emptyHtml("Nothing matches yet", "Try another colour or size, or clear the filters. New pieces land every week.", "See everything")}</div>`;
    }

    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (b) {
        state.cat = b.dataset.cat;
        sync();
      }
    });
    shades.addEventListener("click", (e) => {
      const b = e.target.closest("[data-shade]");
      if (b) {
        state.shade = state.shade === b.dataset.shade ? "" : b.dataset.shade;
        sync();
      }
    });
    sizes.addEventListener("click", (e) => {
      const b = e.target.closest("[data-size]");
      if (b) {
        state.size = state.size === b.dataset.size ? "" : b.dataset.size;
        sync();
      }
    });
    $("[data-clear]").addEventListener("click", () => {
      state.shade = state.size = state.q = "";
      qInput.value = "";
      sync();
    });
    let t;
    qInput.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.q = qInput.value.trim();
        sync();
      }, 200);
    });
    $("[data-q-form]").addEventListener("submit", (e) => e.preventDefault());
    draw();
  }

  function renderProduct() {
    const p = byId(params.get("id")) || D.products[0];
    document.title = p.name + " — Bata Shop";
    const views = [
      { label: "Full look", pos: "center 30%" },
      { label: "Top detail", pos: "center 8%" },
      { label: "Hem & shoes", pos: "center 92%" }
    ];

    $("[data-pdp]").innerHTML = `
      <div class="b-gallery">
        <div class="b-gallery__main"><img src="${p.image}" alt="${esc(p.name)}" data-main style="object-position:${views[0].pos}"></div>
        <div class="b-gallery__thumbs">
          ${views.map((v, i) => `<button class="b-gallery__thumb${i ? "" : " is-active"}" type="button" data-view="${v.pos}" aria-label="${v.label}"><img src="${p.image}" alt="" style="object-position:${v.pos}"></button>`).join("")}
        </div>
      </div>
      <form class="b-pdp__info" data-buy>
        <nav class="b-crumbs" aria-label="Breadcrumb"><a href="shop.html">Shop</a><span>/</span><a href="shop.html?cat=${p.category}">${catLabel(p.category)}</a></nav>
        <div>
          ${p.badge ? `<span class="b-badge b-badge--duck">${p.badge}</span>` : ""}
          <h1 class="b-pdp__name">${esc(p.name)}</h1>
        </div>
        <p class="b-pdp__price">${money(p.price)}</p>
        <p class="b-pdp__desc">${esc(p.description)}</p>
        <div>
          <p class="b-pdp__label"><span>Colour · ${shadeLabel(p.shade)}</span></p>
          <span class="b-swatch b-card__swatch" data-shade="${p.shade}" style="width:1.75rem;height:1.75rem"></span>
        </div>
        <fieldset class="b-fieldset" id="size">
          <p class="b-pdp__label"><span>Size</span><button type="button" data-open="size-guide">Size guide</button></p>
          <div class="b-sizes" data-sizes>
            ${D.sizes.map((s) => {
              const out = !p.sizes.includes(s);
              return `<label class="b-size${out ? " is-out" : ""}"><input type="radio" name="size" value="${s}"${out ? " disabled" : ""}><span>${s}</span>${out ? '<span class="b-sr">sold out</span>' : ""}</label>`;
            }).join("")}
          </div>
          <p class="b-field__error" data-size-error hidden>Choose a size first.</p>
        </fieldset>
        <div class="b-pdp__buy">
          <div class="b-stepper">
            <button type="button" data-pdp-step="-1" aria-label="Fewer">−</button>
            <output data-pdp-qty aria-label="Quantity">1</output>
            <button type="button" data-pdp-step="1" aria-label="More">+</button>
          </div>
          <button class="b-btn b-btn--duck" type="submit">Proceed to checkout</button>
        </div>
        <ul class="b-pdp__perks">
          <li>${icon("truck")} Delivered in 1–2 days in Amman & Zarqa, 2–4 days elsewhere</li>
          <li>${icon("cash")} Pay cash on delivery</li>
          <li>${icon("swap")} Exchange within 3 days, or try it on at a branch</li>
        </ul>
        <div>
          <details class="b-disclosure" open><summary>Details</summary><div class="b-disclosure__body"><ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div></details>
          <details class="b-disclosure"><summary>Care</summary><div class="b-disclosure__body">Cold wash inside out, hang to dry, warm iron on the reverse. Dark shades: wash alone the first time.</div></details>
          <details class="b-disclosure"><summary>Delivery & exchange</summary><div class="b-disclosure__body">Delivery is ${money(2)} in Amman and Zarqa and ${money(3)}–${money(4)} in other cities, free over ${money(S.freeDeliveryFrom)}. Unworn pieces with tags can be exchanged within 3 days.</div></details>
        </div>
      </form>`;

    $$("[data-view]").forEach((b) =>
      b.addEventListener("click", () => {
        $("[data-main]").style.objectPosition = b.dataset.view;
        $$("[data-view]").forEach((x) => x.classList.toggle("is-active", x === b));
      })
    );

    let qty = 1;
    $$("[data-pdp-step]").forEach((b) =>
      b.addEventListener("click", () => {
        qty = Math.max(1, Math.min(S.maxQty, qty + Number(b.dataset.pdpStep)));
        $("[data-pdp-qty]").textContent = qty;
      })
    );

    const form = $("[data-buy]");
    form.addEventListener("change", () => {
      $("[data-sizes]").classList.remove("is-invalid");
      $("[data-size-error]").hidden = true;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const size = form.elements.size.value;
      if (!size) {
        $("[data-sizes]").classList.add("is-invalid");
        $("[data-size-error]").hidden = false;
        $("#size").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      bag.set(p.id, size, qty);
      location.href = "checkout.html";
    });

    const related = D.products.filter((x) => x.id !== p.id && x.category === p.category);
    const fill = D.products.filter((x) => x.id !== p.id && x.category !== p.category);
    $("[data-related]").innerHTML = [...related, ...fill].slice(0, 4).map(cardHtml).join("");
  }

  function renderCartPage() {
    const root = $("[data-cart]");
    const items = bag.items();
    if (!items.length) {
      root.innerHTML = emptyHtml("Your bag is empty", "Nothing here yet. Our newest coats and sets are a good place to start.");
      return;
    }
    root.innerHTML = `
      <div class="b-cart-page">
        <div>${progressHtml()}${items.map((l) => lineHtml(l, "md")).join("")}</div>
        ${summaryHtml(null, `${checkoutButton()}<a class="b-btn b-btn--primary b-btn--block" href="shop.html">Continue shopping</a>`)}
      </div>`;
  }

  function deliveryFee(cityId) {
    if (bag.subtotal() >= S.freeDeliveryFrom) return 0;
    const city = D.cities.find((c) => c.id === cityId);
    return city ? city.fee : null;
  }

  function summaryHtml(cityId, actions = "", withItems = false) {
    const fee = cityId === undefined ? null : deliveryFee(cityId);
    const sub = bag.subtotal();
    const freeNow = sub >= S.freeDeliveryFrom;
    return `
      <aside class="b-summary" data-summary>
        <h2 class="b-summary__title">Order summary</h2>
        ${withItems ? bag.items().map((l) => `
          <div class="b-mini">
            <span class="b-mini__media"><img src="${l.product.image}" alt=""><span class="b-mini__qty">${l.qty}</span></span>
            <span>${esc(l.product.name)}${l.size ? `<small>Size ${esc(l.size)}</small>` : sizeSelect(l, "b-mini__size")}</span>
            <span>${money(l.product.price * l.qty)}</span>
          </div>`).join("") : ""}
        <div class="b-summary__row"><span>Subtotal</span><span>${money(sub)}</span></div>
        <div class="b-summary__row"><span>Delivery</span><span>${cityId === "pickup" ? "Pick up · free" : freeNow ? "Free" : cityId == null ? "At checkout" : fee == null ? "Choose a city" : money(fee)}</span></div>
        <div class="b-summary__row b-summary__row--total"><span>Total</span><span>${money(sub + (fee || 0))}</span></div>
        <p class="b-summary__note">Prices in Jordanian dinars.</p>
        ${actions}
      </aside>`;
  }

  /* Checkout: three short steps — who, where, how to pay — with errors shown right under each field */
  function renderCheckout() {
    const root = $("[data-checkout]");
    if (params.get("done")) return renderConfirmation(root);
    if (!bag.items().length) {
      root.innerHTML = emptyHtml("Nothing to check out", "Your bag is empty. Add a piece first, then come back here.");
      return;
    }
    const err = (name, text) => `<p class="b-field__error" data-err="${name}" hidden>${text}</p>`;

    root.innerHTML = `
      <div class="b-checkout">
        <form class="b-co" id="order-form" data-order novalidate>
          <section class="b-co__step">
            <h2 class="b-co__title"><span class="b-co__num">1</span>Your details</h2>
            <div class="b-field">
              <label class="b-field__label" for="f-name">Full name</label>
              <input class="b-input" id="f-name" name="name" autocomplete="name" placeholder="e.g. Sara Ahmad" required>
              ${err("name", "Please enter your name.")}
            </div>
            <div class="b-field">
              <label class="b-field__label" for="f-phone">Mobile number</label>
              <div class="b-field__group">
                <span class="b-field__prefix"><img src="assets/img/pay/jordan-flag.svg" alt="Jordan" width="20" height="10"> +962</span>
                <input class="b-input" id="f-phone" name="phone" type="tel" inputmode="numeric" placeholder="79 123 4567" autocomplete="tel-national" maxlength="12" required>
              </div>
              ${err("phone", "Enter a Jordanian mobile number, like 79 123 4567.")}
            </div>
          </section>

          <section class="b-co__step">
            <h2 class="b-co__title"><span class="b-co__num">2</span>Delivery</h2>
            <div class="b-choice" role="radiogroup" aria-label="Delivery method">
              <label class="b-choice__opt">
                <input type="radio" name="method" value="home" checked>
                <span class="b-choice__body">${icon("truck", "b-choice__icon")}<strong>Home delivery</strong><small>1–4 days · from ${money(2)}</small></span>
              </label>
              <label class="b-choice__opt">
                <input type="radio" name="method" value="pickup">
                <span class="b-choice__body">${icon("store", "b-choice__icon")}<strong>Pick up</strong><small>Zarqa or Amman · free</small></span>
              </label>
            </div>
            <div class="b-co__fields" data-home>
              <div class="b-fieldset__row">
                <div class="b-field">
                  <label class="b-field__label" for="f-city">City</label>
                  <select class="b-select" id="f-city" name="city" autocomplete="address-level1"><option value="">Choose city</option>${D.cities.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}</select>
                  ${err("city", "Choose your city.")}
                </div>
                <div class="b-field">
                  <label class="b-field__label" for="f-area">Area</label>
                  <select class="b-select" id="f-area" name="area" disabled><option value="">Choose city first</option></select>
                  ${err("area", "Choose your area.")}
                </div>
              </div>
              <div class="b-field">
                <label class="b-field__label" for="f-street">Street and building</label>
                <input class="b-input" id="f-street" name="street" autocomplete="street-address" placeholder="Street name, building number, floor">
                ${err("street", "Tell us the street and building.")}
              </div>
              <details class="b-co__note">
                <summary>Add a note for the driver</summary>
                <textarea class="b-textarea" name="notes" aria-label="Note for the driver" placeholder="e.g. Call me when you arrive"></textarea>
              </details>
            </div>
            <div class="b-co__fields" data-pickup hidden>
              <div class="b-choice" role="radiogroup" aria-label="Branch">
                ${S.branches.map((br, i) => `
                  <label class="b-choice__opt">
                    <input type="radio" name="branch" value="${br.name}"${i ? "" : " checked"}>
                    <span class="b-choice__body">${icon("pin", "b-choice__icon")}<strong>${br.name}</strong><small>${br.detail.replace(/^Branch \d · /, "")}</small></span>
                  </label>`).join("")}
              </div>
            </div>
          </section>

          <section class="b-co__step">
            <h2 class="b-co__title"><span class="b-co__num">3</span>Payment</h2>
            <div class="b-choice" role="radiogroup" aria-label="Payment">
              <label class="b-choice__opt">
                <input type="radio" name="pay" value="cash" checked>
                <span class="b-choice__body">${icon("cash", "b-choice__icon")}<strong data-cash-title>Cash on delivery</strong><small data-cash-note>Pay the driver when it arrives</small></span>
              </label>
              <label class="b-choice__opt">
                <input type="radio" name="pay" value="cliq">
                <span class="b-choice__body"><img class="b-choice__logo" src="assets/img/pay/cliq.svg" alt="CliQ"><strong>Bank transfer</strong><small>Instant, from your bank app</small></span>
              </label>
            </div>
          </section>

          <button class="b-btn b-btn--duck b-btn--block b-co__place" type="submit">Place order</button>
          <ul class="b-co__trust">
            <li>${icon("lock")} No account needed</li>
            <li>${icon("phone")} We call to confirm</li>
            <li>${icon("swap")} Exchange within 3 days</li>
          </ul>
        </form>
        <div data-summary-slot></div>
      </div>
      <div class="b-co__bar">
        <span>Total <strong data-bar-total></strong></span>
        <button class="b-btn b-btn--duck" type="submit" form="order-form">Place order</button>
      </div>`;

    const form = $("[data-order]");
    const city = $("#f-city");
    const area = $("#f-area");
    const value = (name) => form.elements[name].value;
    const pickup = () => value("method") === "pickup";
    const fee = () => (pickup() ? 0 : deliveryFee(city.value));

    const refresh = () => {
      $("[data-summary-slot]").innerHTML = summaryHtml(pickup() ? "pickup" : city.value, "", true);
      $("[data-bar-total]").textContent = money(bag.subtotal() + (fee() || 0));
      $("[data-home]").hidden = pickup();
      $("[data-pickup]").hidden = !pickup();
      $("[data-cash-title]").textContent = pickup() ? "Pay at the branch" : "Cash on delivery";
      $("[data-cash-note]").textContent = pickup() ? "Cash or card when you collect it" : "Pay the driver when it arrives";
    };
    onBagChange = () => (bag.items().length ? refresh() : renderCheckout());

    city.addEventListener("change", () => {
      const c = D.cities.find((x) => x.id === city.value);
      area.disabled = !c;
      area.innerHTML = c ? `<option value="">Choose area</option>` + c.areas.map((a) => `<option>${esc(a)}</option>`).join("") : `<option value="">Choose city first</option>`;
    });
    form.addEventListener("change", (e) => {
      refresh();
      showError(e.target.name, false);
    });
    form.addEventListener("input", (e) => showError(e.target.name, false));

    function showError(name, on) {
      const box = $(`[data-err="${name}"]`, form);
      if (!box) return;
      box.hidden = !on;
      form.elements[name].classList.toggle("is-invalid", on);
      form.elements[name].setAttribute("aria-invalid", on);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = value("phone").replace(/\D/g, "").replace(/^0/, "");
      const checks = {
        name: value("name").trim().length > 1,
        phone: /^7[789]\d{7}$/.test(phone),
        ...(pickup() ? {} : { city: !!value("city"), area: !!value("area"), street: value("street").trim().length > 2 })
      };
      let first = null;
      Object.entries(checks).forEach(([name, ok]) => {
        showError(name, !ok);
        if (!ok && !first) first = form.elements[name];
      });
      if (first) {
        first.focus();
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (bag.missingSizes()) {
        toast("Choose a size for every piece in your order");
        $("[data-summary-slot]").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const cityLabel = pickup() ? "" : D.cities.find((c) => c.id === value("city")).label;
      const order = {
        number: "BATA-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        name: value("name").trim(),
        phone: "+962 " + phone,
        method: value("method"),
        branch: pickup() ? value("branch") : "",
        address: pickup() ? "" : [value("street").trim(), value("area"), cityLabel].join(", "),
        city: pickup() ? `Pick up · ${value("branch")} branch` : cityLabel,
        items: bag.items().map((l) => ({ name: l.product.name, size: l.size, qty: l.qty, price: l.product.price, image: l.product.image })),
        subtotal: bag.subtotal(),
        fee: fee() || 0,
        pay: value("pay")
      };
      storage.set("bata.lastOrder", order);
      onBagChange = null;
      bag.clear();
      location.href = "checkout.html?done=1";
    });

    refresh();
  }

  function renderConfirmation(root) {
    const o = storage.get("bata.lastOrder", null);
    $("[data-checkout-head]").hidden = true;
    if (!o) {
      root.innerHTML = emptyHtml("No recent order", "We couldn't find an order on this device.");
      return;
    }
    const payText = o.pay === "cliq" ? "We'll send you our CliQ alias to complete the transfer." : o.method === "pickup" ? `We'll let you know when it's ready at the ${esc(o.branch)} branch.` : "Pay cash when it arrives.";
    root.innerHTML = `
      <div class="b-confirm">
        <span class="b-confirm__mark">${duck()}</span>
        <h1 class="b-title">Thank you, ${esc(o.name.split(" ")[0])}!</h1>
        <p class="b-page-head__lead">We'll call you within a few hours to confirm. ${payText}</p>
        <span class="b-confirm__number">${o.number}</span>
        <aside class="b-summary">
          ${o.items.map((l) => `
            <div class="b-mini">
              <span class="b-mini__media"><img src="${l.image}" alt=""><span class="b-mini__qty">${l.qty}</span></span>
              <span>${esc(l.name)}<small>Size ${esc(l.size)}</small></span>
              <span>${money(l.price * l.qty)}</span>
            </div>`).join("")}
          <div class="b-summary__row"><span>Delivery · ${esc(o.city)}</span><span>${o.fee ? money(o.fee) : "Free"}</span></div>
          <div class="b-summary__row b-summary__row--total"><span>Total</span><span>${money(o.subtotal + (o.fee || 0))}</span></div>
        </aside>
        <div class="b-confirm__actions">
          <button class="b-btn b-btn--duck" type="button" data-receipt>${icon("download")} Download receipt</button>
          <a class="b-btn b-btn--primary" href="shop.html">Continue shopping</a>
        </div>
      </div>`;
    $("[data-receipt]").addEventListener("click", () => downloadReceipt(o));
  }

  const payLabel = (o) => (o.pay === "cliq" ? "CliQ transfer" : o.method === "pickup" ? "Pay at the branch" : "Cash on delivery");

  /* A one-page PDF receipt named after the order number. Falls back to a text file if the PDF library can't load. */
  async function downloadReceipt(o) {
    const date = new Date(o.date || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const total = o.subtotal + (o.fee || 0);
    try {
      if (!window.jspdf) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const doc = new window.jspdf.jsPDF({ unit: "mm", format: "a5" });
      const W = doc.internal.pageSize.getWidth();
      const M = 12;
      let y = 16;
      doc.setFont("times", "bold").setFontSize(20).text("BATA SHOP", M, y);
      doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(110).text("Receipt", W - M, y, { align: "right" });
      y += 9;
      doc.setDrawColor(247, 197, 43).setLineWidth(0.8).line(M, y, W - M, y);
      y += 8;
      doc.setTextColor(27).setFontSize(10);
      [["Order number", o.number], ["Date", date], ["Customer", o.name], ["Phone", o.phone || ""], ["Delivery", o.address || o.city], ["Payment", payLabel(o)]].forEach(([k, v]) => {
        doc.setTextColor(110).text(k, M, y);
        doc.setTextColor(27).text(String(v), M + 32, y, { maxWidth: W - M * 2 - 32 });
        y += 6.5;
      });
      y += 3;
      doc.setDrawColor(220).setLineWidth(0.2).line(M, y, W - M, y);
      y += 6;
      doc.setFontSize(8.5).setTextColor(110).text("ITEM", M, y).text("QTY", W - M - 30, y, { align: "right" }).text("PRICE", W - M, y, { align: "right" });
      y += 6;
      doc.setFontSize(10).setTextColor(27);
      o.items.forEach((l) => {
        doc.text(`${l.name} · Size ${l.size}`, M, y, { maxWidth: W - M * 2 - 40 });
        doc.text(String(l.qty), W - M - 30, y, { align: "right" });
        doc.text(money(l.price * l.qty), W - M, y, { align: "right" });
        y += 7;
      });
      y += 1;
      doc.setDrawColor(220).line(M, y, W - M, y);
      y += 7;
      [["Subtotal", money(o.subtotal)], ["Delivery", o.fee ? money(o.fee) : "Free"]].forEach(([k, v]) => {
        doc.setTextColor(110).text(k, W - M - 40, y);
        doc.setTextColor(27).text(v, W - M, y, { align: "right" });
        y += 6;
      });
      doc.setFont("helvetica", "bold").setFontSize(12).text("Total", W - M - 40, y + 1).text(money(total), W - M, y + 1, { align: "right" });
      doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(110);
      doc.text("Keep this receipt and your order number for any question about your order.", M, 190, { maxWidth: W - M * 2 });
      doc.text(`${S.name} · Zarqa & Amman · @bata_shop1`, M, 198);
      doc.save(`receipt-${o.number}.pdf`);
    } catch (err) {
      console.warn("PDF receipt failed, saving a text receipt instead", err);
      const lines = [`BATA SHOP — Receipt`, `Order: ${o.number}`, `Date: ${date}`, `Customer: ${o.name} ${o.phone || ""}`, `Delivery: ${o.address || o.city}`, `Payment: ${payLabel(o)}`, "", ...o.items.map((l) => `${l.qty} × ${l.name} (Size ${l.size}) — ${money(l.price * l.qty)}`), "", `Subtotal: ${money(o.subtotal)}`, `Delivery: ${o.fee ? money(o.fee) : "Free"}`, `Total: ${money(total)}`];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
      a.download = `receipt-${o.number}.txt`;
      a.click();
    }
  }


  function renderContact() {
    $("[data-full-logo]").innerHTML = fullLogo();
  }

  /* ---------- Boot ---------- */
  renderChrome();
  ({ home: renderHome, shop: renderShop, product: renderProduct, cart: renderCartPage, checkout: renderCheckout, contact: renderContact }[page] || (() => {}))();
})();
