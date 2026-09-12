/* ==========================================================================
   LeaL FC — lógica de la app (router hash simple, sin dependencias)
   ========================================================================== */

const $app = document.getElementById("app");
const currency = n => "$" + n.toLocaleString("es-AR");

/* ---------------- Cart (localStorage) ---------------- */
const Cart = {
  key: "leal_cart",
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  set(items) { try { localStorage.setItem(this.key, JSON.stringify(items)); } catch { }; updateCartBadge(); },
  add(item) {
    const items = this.get();
    const existing = items.find(i => i.id === item.id && i.color === item.color && i.size === item.size);
    if (existing) existing.qty += item.qty;
    else items.push(item);
    this.set(items);
  },
  count() { return this.get().reduce((a, i) => a + i.qty, 0); },
};

function updateCartBadge() {
  const count = Cart.count();
  const el = document.getElementById("cart-badge");
  const elMenu = document.getElementById("menu-cart-badge");
  if (el) el.textContent = count;
  if (elMenu) elMenu.textContent = count;
}

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = `<span class="ico">✓</span> ${msg}`;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- Layout: navbar + footer (estáticos, se inyectan una vez) ---------------- */
function renderChrome() {
  document.getElementById("navbar").innerHTML = `
<div class="container nav-inner" id="nav-inner">

  <!-- Hamburguesa -->
  <button class="nav-burger" id="nav-burger" aria-label="Abrir menú">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <!-- Logo -->
  <a href="#/" class="brand">
    <img class="mark" src="img/logo.png" alt="Escudo LEAL FC"/>
    <span>
      LEAL
      <span class="sub">FÚTBOL CLUB · TEMPORADA 2025</span>
    </span>
  </a>

  <!-- Carrito -->
  <a href="#/carrito" class="btn btn-primary nav-cart">
    🛒 <span id="cart-badge">0</span>
  </a>

  <!-- Fondo -->
  <div class="menu-overlay" id="menu-overlay"></div>

  <!-- Menú -->
  <aside class="nav-menu" id="nav-menu">

    <button class="nav-close" id="nav-close" aria-label="Cerrar menú">
      ×
    </button>

    <div class="nav-menu-brand">
      <img src="img/logo.png" alt="Escudo LEAL FC"/>
      <div>
        <strong>LEAL FC</strong>
        <span>FÚTBOL CLUB · TEMPORADA 2025</span>
      </div>
    </div>

    <nav class="nav-menu-links">

      <a href="#/" data-route="home">
        Inicio
      </a>

      ${LEAL_CATEGORIES.map(c => `
        <a href="#/categoria/${c.id}" data-route="cat-${c.id}">
          ${c.icon} ${c.name}
        </a>
      `).join("")}

    </nav>

    <form class="nav-menu-search" id="search-form">
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor"
        stroke-width="2">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>

      <input
        type="search"
        id="search-input"
        placeholder="Buscar productos…"
        autocomplete="off"
      />
    </form>

    <a href="#/carrito" class="nav-menu-cart">
      🛒 Ver carrito
      <span id="menu-cart-badge">0</span>
    </a>

  </aside>

</div>
  `;

  document.getElementById("footer").innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand"><img class="mark" src="img/logo.png" alt="Escudo LEAL FC"/> LEAL FC</div>
          <p style="font-size:.88rem;max-width:280px;color:#b8b8bd;">Un equipo, una familia. Indumentaria oficial y streetwear del club — La Plata, Argentina.</p>
          <div class="footer-social">
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="Facebook">📘</a>
            <a href="#" title="TikTok">🎵</a>
            <a href="#" title="WhatsApp">💬</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Categorías</h5>
          <ul>
            ${LEAL_CATEGORIES.slice(0, 6).map(c => `<li><a href="#/categoria/${c.id}">${c.name}</a></li>`).join("")}
          </ul>
        </div>
        <div class="footer-col">
          <h5>Ayuda</h5>
          <ul>
            <li><a href="#/">Guía de talles</a></li>
            <li><a href="#/">Envíos y devoluciones</a></li>
            <li><a href="#/">Medios de pago</a></li>
            <li><a href="#/">Preguntas frecuentes</a></li>
            <li><a href="#/">Contacto</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>El Club</h5>
          <ul>
            <li><a href="#/">Nuestra historia</a></li>
            <li><a href="#/">Disciplina · Amistad</a></li>
            <li><a href="#/">Trabajá con nosotros</a></li>
            <li><a href="#/">Prensa</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} LeaL FC — Más que fútbol.</span>
        <span class="flags">● ● ●</span>
        <span>Hecho en La Plata, Argentina</span>
      </div>
    </div>
  `;

  document.getElementById("search-form").addEventListener("submit", e => {
    e.preventDefault();
    const q = document.getElementById("search-input").value.trim();
    location.hash = "#/buscar/" + encodeURIComponent(q);
  });
  document.getElementById("search-input").addEventListener("input", e => {
    if (e.target.value.length > 1) location.hash = "#/buscar/" + encodeURIComponent(e.target.value);
  });
  const navInner = document.getElementById("nav-inner");
  const navBurger = document.getElementById("nav-burger");
  const navClose = document.getElementById("nav-close");
  const menuOverlay = document.getElementById("menu-overlay");

  navBurger.addEventListener("click", () => {
    navInner.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  navClose.addEventListener("click", () => {
    navInner.classList.remove("open");
    document.body.style.overflow = "";
  });

  menuOverlay.addEventListener("click", () => {
    navInner.classList.remove("open");
    document.body.style.overflow = "";
  });

  updateCartBadge();
}

/* ---------------- Product card ---------------- */
function productCard(p) {
  const catName = LEAL_CATEGORIES.find(c => c.id === p.category)?.name || p.category;
  return `
    <a class="card" href="#/producto/${p.id}">
      <div class="card-img">
        <span class="card-tag">${catName}</span>
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy"/>
      </div>
      <div class="card-body">
        <span class="card-cat">${p.colors[0]}</span>
        <span class="card-name">${p.name}</span>
        <span class="card-tagline">${p.tagline}</span>
        <div class="card-foot">
          <span class="card-price">${currency(p.price)}</span>
          <span class="card-btn">Ver más</span>
        </div>
      </div>
    </a>
  `;
}

function catChips(activeId) {
  return `
    <div class="cat-scroller">
      ${LEAL_CATEGORIES.map(c => `
        <a class="cat-chip ${c.id === activeId ? "active" : ""}" href="#/categoria/${c.id}">
          <span class="ico">${c.icon}</span>
          <span class="lbl">${c.name}</span>
        </a>
      `).join("")}
    </div>
  `;
}

/* ---------------- Views ---------------- */
function viewHome() {
  const featured = products.slice(0, 8);
  const bySection = {
    "camisetas-titular": "Camisetas",
    "conjuntos": "Conjuntos & Buzos",
    "gorras": "Gorras New Era",
    "outfit-joda": "Outfit Joda",
  };

  $app.innerHTML = `
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <div class="hero-eyebrow">Temporada 2025 · Disciplina · Amistad</div>
          <h1>Mismas raíces,<br/><span>más que fútbol.</span></h1>
          <p>La tienda oficial de <strong>LEAL FC</strong>. Camisetas, conjuntos, streetwear y accesorios diseñados con identidad de club — rosa, negro y blanco en cada prenda.</p>
          <div class="hero-actions">
            <a href="#/categoria/camisetas-titular" class="btn btn-primary">Ver camisetas</a>
            <a href="#/categoria/outfit-joda" class="btn btn-outline">Explorar streetwear</a>
          </div>
          <div class="hero-badges">
            <div><strong>${products.length}+</strong>productos</div>
            <div><strong>${LEAL_CATEGORIES.length}</strong>categorías</div>
            <div><strong>2025</strong>colección</div>
          </div>
        </div>
        <div class="hero-visual">LL</div>
      </div>
    </section>

    <div class="container">
      <section class="section" style="padding-top:34px;">
        <div class="section-head">
          <div><h2>Categorías</h2><p>Encontrá tu estilo dentro del club</p></div>
        </div>
        ${catChips(null)}
      </section>

      <section class="section" style="padding-top:0;">
        <div class="section-head">
          <div><h2>Destacados</h2><p>Lo más elegido de la temporada</p></div>
          <a href="#/categoria/camisetas-titular" class="card-btn">Ver todo →</a>
        </div>
        <div class="grid">${featured.map(productCard).join("")}</div>
      </section>

      ${Object.entries(bySection).map(([catId, label]) => {
    const items = getProductsByCategory(catId).slice(0, 4);
    if (!items.length) return "";
    return `
          <section class="section" style="padding-top:0;">
            <div class="section-head">
              <div><h2>${label}</h2></div>
              <a href="#/categoria/${catId}" class="card-btn">Ver todo →</a>
            </div>
            <div class="grid">${items.map(productCard).join("")}</div>
          </section>
        `;
  }).join("")}
    </div>
  `;
}

function viewCategory(catId) {
  const cat = LEAL_CATEGORIES.find(c => c.id === catId);
  const items = getProductsByCategory(catId);
  $app.innerHTML = `
    <div class="container" style="padding-top:28px;">
      <div class="breadcrumbs"><a href="#/">Inicio</a> / ${cat ? cat.name : "Categoría"}</div>
      <section class="section" style="padding-top:0;">
        ${catChips(catId)}
      </section>
      <section class="section" style="padding-top:0;">
        <div class="section-head">
          <div><h2>${cat ? cat.icon + " " + cat.name : "Categoría no encontrada"}</h2><p class="count">${items.length} producto${items.length !== 1 ? "s" : ""}</p></div>
        </div>
        ${items.length ? `<div class="grid">${items.map(productCard).join("")}</div>` : emptyState("No hay productos en esta categoría todavía.")}
      </section>
    </div>
  `;
}

function viewSearch(q) {
  const results = searchProducts(q);
  $app.innerHTML = `
    <div class="container" style="padding-top:28px;">
      <div class="breadcrumbs"><a href="#/">Inicio</a> / Búsqueda</div>
      <section class="section" style="padding-top:0;">
        <div class="section-head">
          <div><h2>Resultados para "${escapeHtml(q)}"</h2><p class="count">${results.length} producto${results.length !== 1 ? "s" : ""} encontrados</p></div>
        </div>
        ${results.length ? `<div class="grid">${results.map(productCard).join("")}</div>` : emptyState(`No encontramos nada para "${escapeHtml(q)}". Probá con otra palabra.`)}
      </section>
    </div>
  `;
  const input = document.getElementById("search-input");
  if (input) input.value = q;
}

function emptyState(msg) {
  return `<div class="empty-state"><div class="ico">🔍</div><p>${msg}</p><a href="#/" class="btn btn-primary" style="margin-top:10px;display:inline-flex;">Volver al inicio</a></div>`;
}

function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

let pdState = { color: 0, size: 0, qty: 1 };

function viewProduct(id) {
  const p = getProductById(id);
  if (!p) {
    $app.innerHTML = `<div class="container section">${emptyState("Producto no encontrado.")}</div>`;
    return;
  }
  pdState = { color: 0, size: 0, qty: 1 };
  const cat = LEAL_CATEGORIES.find(c => c.id === p.category);
  const related = getProductsByCategory(p.category).filter(x => x.id !== p.id).slice(0, 4);

  function render() {
    $app.querySelector(".pd-gallery-main img")?.setAttribute("src", p.images[pdState.color] || p.images[0]);
    $app.querySelectorAll(".pd-thumb").forEach((el, i) => el.classList.toggle("active", i === pdState.color));
    $app.querySelectorAll(".pd-color-chip").forEach((el, i) => el.classList.toggle("active", i === pdState.color));
    $app.querySelectorAll(".pd-size").forEach((el, i) => el.classList.toggle("active", i === pdState.size));
    const qtyEl = $app.querySelector(".qty-value");
    if (qtyEl) qtyEl.textContent = pdState.qty;
  }

  $app.innerHTML = `
    <div class="container" style="padding-top:28px;">
      <div class="breadcrumbs"><a href="#/">Inicio</a> / <a href="#/categoria/${p.category}">${cat ? cat.name : ""}</a> / ${p.name}</div>
      <div class="pd-layout">
        <div>
          <div class="pd-gallery-main"><img src="${p.images[0]}" alt="${p.name}"/></div>
          <div class="pd-thumbs">
            ${p.images.map((img, i) => `<div class="pd-thumb ${i === 0 ? "active" : ""}" data-i="${i}"><img src="${img}" alt=""/></div>`).join("")}
          </div>
        </div>
        <div>
          <div class="pd-cat">${cat ? cat.name : p.category}</div>
          <h1 class="pd-title">${p.name}</h1>
          <div class="pd-tagline">${p.tagline}</div>
          <div class="pd-price">${currency(p.price)}</div>
          <p class="pd-desc">${p.desc}</p>

          <div class="pd-block">
            <h4>Color</h4>
            <div class="pd-colors">
              ${p.colors.map((c, i) => `<div class="pd-color-chip ${i === 0 ? "active" : ""}" data-i="${i}">${c}</div>`).join("")}
            </div>
          </div>

          <div class="pd-block">
            <h4>Talle</h4>
            <div class="pd-sizes">
              ${p.sizes.map((s, i) => `<div class="pd-size ${i === 0 ? "active" : ""}" data-i="${i}">${s}</div>`).join("")}
            </div>
          </div>

          <div class="pd-qty">
            <h4 style="margin:0;font-size:.82rem;text-transform:uppercase;letter-spacing:.05em;color:var(--grey-700);">Cantidad</h4>
            <div class="qty-box">
              <button id="qty-minus">−</button>
              <span class="qty-value">1</span>
              <button id="qty-plus">+</button>
            </div>
          </div>

          <div class="pd-actions">
            <button class="btn btn-primary" id="add-cart">🛒 Agregar al carrito</button>
            <button class="btn btn-dark" id="buy-now">Comprar ahora</button>
          </div>

          <div class="pd-meta">
            <div>🚚 Envío a todo el país</div>
            <div>↩️ Cambios sin cargo</div>
            <div>🔒 Compra segura</div>
          </div>
        </div>
      </div>

      ${related.length ? `
        <section class="related">
          <div class="section-head"><div><h2>También te puede interesar</h2></div></div>
          <div class="grid">${related.map(productCard).join("")}</div>
        </section>
      ` : ""}
    </div>
  `;

  $app.querySelectorAll(".pd-thumb").forEach(el => el.addEventListener("click", () => { pdState.color = +el.dataset.i; render(); }));
  $app.querySelectorAll(".pd-color-chip").forEach(el => el.addEventListener("click", () => { pdState.color = +el.dataset.i; render(); }));
  $app.querySelectorAll(".pd-size").forEach(el => el.addEventListener("click", () => { pdState.size = +el.dataset.i; render(); }));
  $app.querySelector("#qty-minus").addEventListener("click", () => { pdState.qty = Math.max(1, pdState.qty - 1); render(); });
  $app.querySelector("#qty-plus").addEventListener("click", () => { pdState.qty = Math.min(10, pdState.qty + 1); render(); });
  $app.querySelector("#add-cart").addEventListener("click", () => {
    Cart.add({ id: p.id, name: p.name, price: p.price, color: p.colors[pdState.color], size: p.sizes[pdState.size], qty: pdState.qty, img: p.images[pdState.color] });
    showToast(`${p.name} agregado al carrito`);
  });
  $app.querySelector("#buy-now").addEventListener("click", () => {
    Cart.add({ id: p.id, name: p.name, price: p.price, color: p.colors[pdState.color], size: p.sizes[pdState.size], qty: pdState.qty, img: p.images[pdState.color] });
    location.hash = "#/carrito";
  });
}

function viewCart() {
  const items = Cart.get();
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);
  $app.innerHTML = `
    <div class="container" style="padding-top:28px;">
      <div class="breadcrumbs"><a href="#/">Inicio</a> / Carrito</div>
      <div class="section-head"><div><h2>Tu carrito</h2><p>${items.length} producto${items.length !== 1 ? "s" : ""}</p></div></div>
      ${items.length === 0 ? emptyState("Tu carrito está vacío. ¡Sumá algo de la colección!") : `
        <div style="display:flex;flex-direction:column;gap:14px;max-width:760px;">
          ${items.map((i, idx) => `
            <div style="display:flex;gap:16px;align-items:center;background:#fff;border:1px solid var(--grey-200);border-radius:var(--radius);padding:14px;">
              <img src="${i.img}" style="width:64px;height:78px;object-fit:cover;border-radius:8px;background:#ececec;"/>
              <div style="flex:1;">
                <div style="font-weight:700;">${i.name}</div>
                <div style="font-size:.8rem;color:var(--grey-700);">${i.color} · Talle ${i.size} · x${i.qty}</div>
              </div>
              <div style="font-weight:800;">${currency(i.price * i.qty)}</div>
              <button data-idx="${idx}" class="remove-item card-btn">Quitar</button>
            </div>
          `).join("")}
        </div>
        <div style="max-width:760px;display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1.5px solid var(--grey-200);">
          <span style="font-size:1.1rem;font-weight:800;">Total: ${currency(total)}</span>
          <button class="btn btn-primary" id="checkout-btn">Finalizar compra</button>
        </div>
      `}
    </div>
  `;
  $app.querySelectorAll(".remove-item").forEach(btn => btn.addEventListener("click", () => {
    const items = Cart.get();
    items.splice(+btn.dataset.idx, 1);
    Cart.set(items);
    viewCart();
  }));
  const checkout = $app.querySelector("#checkout-btn");
  if (checkout) checkout.addEventListener("click", () => {
    Cart.set([]);
    showToast("¡Gracias por tu compra! (demo)");
    location.hash = "#/";
  });
}

/* ---------------- Router ---------------- */
function router() {
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
  window.scrollTo(0, 0);

  document.querySelectorAll(".nav-links a").forEach(a => a.classList.remove("active"));

  if (parts.length === 0) {
    viewHome();
    document.querySelector('[data-route="home"]')?.classList.add("active");
  } else if (parts[0] === "categoria" && parts[1]) {
    viewCategory(parts[1]);
    document.querySelector(`[data-route="cat-${parts[1]}"]`)?.classList.add("active");
  } else if (parts[0] === "producto" && parts[1]) {
    viewProduct(parts[1]);
  } else if (parts[0] === "buscar") {
    viewSearch(decodeURIComponent(parts[1] || ""));
  } else if (parts[0] === "carrito") {
    viewCart();
  } else {
    viewHome();
  }

  document.getElementById("nav-inner")?.classList.remove("open");
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  router();
});
