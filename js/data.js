/* ==========================================================================
   LeaL FC — Catálogo de datos
   Genera el catálogo completo a partir de plantillas por categoría.
   Las imágenes son ilustraciones SVG generadas en el momento (placeholder
   de producto) coloreadas según la variante — no dependen de archivos externos.
   ========================================================================== */

const LEAL_CATEGORIES = [
  { id: "camisetas-titular",   name: "Camisetas Titular",     icon: "👕" },
  { id: "camisetas-suplente",  name: "Camisetas Suplente",    icon: "👕" },
  { id: "camisetas-alternativa", name: "Camisetas Alternativa", icon: "👕" },
  { id: "musculosas",          name: "Musculosas",            icon: "🎽" },
  { id: "conjuntos",           name: "Conjuntos Deportivos",  icon: "🧥" },
  { id: "buzos",               name: "Buzos & Camperas",      icon: "🧥" },
  { id: "jeans",               name: "Jeans",                 icon: "👖" },
  { id: "camisas-lino",        name: "Camisas de Lino",       icon: "👔" },
  { id: "mallas",              name: "Mallas & Shorts de Baño", icon: "🩳" },
  { id: "gorras",              name: "Gorras New Era",        icon: "🧢" },
  { id: "accesorios",          name: "Accesorios",            icon: "🎒" },
  { id: "outfit-joda",         name: "Outfit Joda",           icon: "🕶️" },
];

// paleta de marca
const BRAND = {
  pink: "#e8508a",
  pinkLight: "#f4a6c4",
  black: "#141416",
  white: "#f7f4f2",
  grey: "#8a8a8a",
};

function svgPlaceholder({ base = "#ffffff", accent = "#e8508a", trim = "#141416", label = "LL", kind = "jersey" }) {
  // kind: jersey | sleeveless | hoodie | pants | cap | jean | shirt | short | bag
  const shapes = {
    jersey: `
      <path d="M70 40 L120 20 L150 45 L135 70 L120 62 L120 230 L80 230 L80 62 L65 70 L50 45 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <path d="M70 40 L100 60 L130 40" fill="none" stroke="${accent}" stroke-width="6"/>
      <circle cx="100" cy="95" r="18" fill="none" stroke="${accent}" stroke-width="3"/>
      <text x="100" y="102" font-size="16" text-anchor="middle" fill="${accent}" font-family="Arial" font-weight="700">${label}</text>
    `,
    sleeveless: `
      <path d="M78 35 L122 35 L140 60 L128 75 L120 62 L120 230 L80 230 L80 62 L72 75 L60 60 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <path d="M78 35 Q100 55 122 35" fill="none" stroke="${accent}" stroke-width="5"/>
    `,
    hoodie: `
      <path d="M65 55 Q100 15 135 55 L150 75 L132 90 L125 78 L125 230 L75 230 L75 78 L68 90 L50 75 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <circle cx="100" cy="45" r="20" fill="none" stroke="${accent}" stroke-width="5"/>
      <rect x="82" y="150" width="36" height="30" rx="6" fill="none" stroke="${accent}" stroke-width="3"/>
    `,
    pants: `
      <path d="M75 30 L125 30 L128 230 L104 230 L100 130 L96 230 L72 230 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <path d="M75 40 L100 40 L125 40" stroke="${accent}" stroke-width="4"/>
    `,
    cap: `
      <path d="M40 120 Q100 60 160 120 L160 130 Q100 110 40 130 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <path d="M100 60 Q100 100 100 120" stroke="${accent}" stroke-width="0"/>
      <ellipse cx="100" cy="118" rx="60" ry="20" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <text x="100" y="112" font-size="20" text-anchor="middle" fill="${accent}" font-family="Arial" font-weight="800">${label}</text>
    `,
    jean: `
      <path d="M72 30 L128 30 L132 230 L106 230 L100 140 L94 230 L68 230 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <line x1="80" y1="40" x2="80" y2="220" stroke="${accent}" stroke-width="3"/>
      <line x1="120" y1="40" x2="120" y2="220" stroke="${accent}" stroke-width="3"/>
    `,
    shirt: `
      <path d="M68 45 L100 30 L132 45 L145 68 L130 82 L122 70 L122 200 L78 200 L78 70 L70 82 L55 68 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <path d="M100 30 L100 90" stroke="${accent}" stroke-width="4"/>
    `,
    short: `
      <path d="M70 50 L130 50 L134 160 L108 160 L104 110 L96 160 L70 160 Z" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <line x1="70" y1="65" x2="130" y2="65" stroke="${accent}" stroke-width="4"/>
    `,
    bag: `
      <rect x="60" y="70" width="80" height="110" rx="14" fill="${base}" stroke="${trim}" stroke-width="4"/>
      <path d="M75 70 Q75 40 100 40 Q125 40 125 70" fill="none" stroke="${trim}" stroke-width="4"/>
      <rect x="80" y="100" width="40" height="30" rx="6" fill="none" stroke="${accent}" stroke-width="3"/>
    `,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">
    <rect width="200" height="260" fill="#ececec"/>
    ${shapes[kind] || shapes.jersey}
  </svg>`;
}

function svgDataUri(opts) {
  const svg = svgPlaceholder(opts);
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// -------- Generador de catálogo --------
const products = [];
let uid = 1;

const PHOTO_BASE = "img/products/";

function addProduct({ category, name, tagline, kind, variants, price, sizes = ["S", "M", "L", "XL"], desc, photos }) {
  const id = "p" + (uid++);
  // Si se pasan fotos reales (recortadas del catálogo de la marca) se usan esas;
  // si no, se genera una ilustración de respaldo.
  const images = (photos && photos.length)
    ? photos.map(p => PHOTO_BASE + p)
    : variants.map(v => svgDataUri({ base: v.base, accent: v.accent, trim: v.trim || BRAND.black, label: "LL", kind }));
  products.push({
    id, category, name, tagline, price, sizes, desc,
    colors: variants.map(v => v.name),
    images,
    kind,
  });
}

/* Camisetas Titular — blanco base con detalles rosa (10 opciones) */
const titularNames = ["Pureza", "Franja", "Impulso", "Alas", "Vértice", "Origen", "Curvas", "Equilibrio", "Legado", "Horizonte"];
const titularSlugs = ["pureza", "franja", "impulso", "alas", "vertice", "origen", "curvas", "equilibrio", "legado", "horizonte"];
titularNames.forEach((n, i) => {
  addProduct({
    category: "camisetas-titular",
    name: `Camiseta Titular "${n}"`,
    tagline: "Temporada 2025",
    kind: "jersey",
    price: 45000 + i * 1500,
    variants: [{ name: "Blanco/Rosa", base: BRAND.white, accent: BRAND.pink }],
    photos: [`titular-${titularSlugs[i]}.jpg`],
    desc: `Camiseta oficial titular de LeaL FC, diseño "${n}". Tela liviana transpirable, escudo bordado y numeración estampada. Un equipo, una familia.`,
  });
});

/* Camisetas Suplente — rosa base, blanco (5 + 5 variantes) */
const suplenteNames = ["Flujo", "Raíces", "Horizonte", "Equilibrio", "Identidad", "Clásico", "Tradición", "Actitud", "Sueños", "Carácter"];
const suplenteSlugs = ["flujo", "raices", "horizonte", "equilibrio", "identidad"];
suplenteNames.forEach((n, i) => {
  const photo = i < 5 ? `suplente-${suplenteSlugs[i]}.jpg` : `suplente-extra-${i - 4}.jpg`;
  addProduct({
    category: "camisetas-suplente",
    name: `Camiseta Suplente "${n}"`,
    tagline: "Mismas raíces, más lejos",
    kind: "jersey",
    price: 45000 + i * 1500,
    variants: [{ name: "Rosa/Blanco", base: BRAND.pink, accent: BRAND.white }],
    photos: [photo],
    desc: `Segunda camiseta de LeaL FC, línea "${n}". Combinación rosa y blanco, tela premium de secado rápido.`,
  });
});

/* Camisetas Alternativa — multicolor (negro, beige, verde, celeste, lila) */
const altVariants = [
  { name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink },
  { name: "Beige/Rosa", base: "#e7dcc9", accent: BRAND.pink },
  { name: "Verde Militar", base: "#5b5e3d", accent: BRAND.pink },
  { name: "Celeste", base: "#8fc7e8", accent: BRAND.pink },
  { name: "Lila", base: "#c9b6e4", accent: BRAND.white },
];
const altSlugs = ["fuerza", "esencia", "otra-perspectiva", "diferente", "caracter", "sueños",
  "horizontes", "diferente2", "identidad", "movimiento", "tradicion", "otra-mirada"];
["Fuerza", "Esencia", "Otra Perspectiva", "Diferente", "Carácter", "Sueños",
 "Horizontes", "Diferente II", "Identidad", "Movimiento", "Tradición", "Otra Mirada"].forEach((n, i) => {
  addProduct({
    category: "camisetas-alternativa",
    name: `Camiseta Alternativa "${n}"`,
    tagline: "Más que fútbol",
    kind: "jersey",
    price: 47000 + i * 1500,
    variants: [altVariants[i % altVariants.length]],
    photos: [`alt-${altSlugs[i]}.jpg`],
    desc: `Edición alternativa "${n}" de LeaL FC. Diseño exclusivo temporada 2025 con shorts y medias a juego.`,
  });
});

/* Musculosas */
["Rosa/Negro", "Negro/Rosa", "Blanco/Rosa", "Rosa/Rosa", "Negro Brush",
 "Blanco/Rosa 2", "Rosa/Negro 2", "Negro Degradé", "Blanco Franja", "Rosa Franja"].forEach((n, i) => {
  addProduct({
    category: "musculosas",
    name: `Musculosa de Entrenamiento ${i + 1}`,
    tagline: "Disciplina · Amistad · Más que fútbol",
    kind: "sleeveless",
    price: 32000,
    variants: [{
      name: n,
      base: n.startsWith("Rosa") ? BRAND.pink : n.startsWith("Blanco") ? BRAND.white : BRAND.black,
      accent: n.includes("Negro") && !n.startsWith("Negro") ? BRAND.black : BRAND.pink,
    }],
    photos: [`musculosa-${i + 1}.jpg`],
    desc: "Musculosa sin mangas para entrenamiento, tela mesh transpirable con escudo bordado.",
  });
});

/* Conjuntos deportivos (campera + pantalón) */
const conjuntoVariants = [
  { name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink },
  { name: "Rosa/Negro", base: BRAND.pink, accent: BRAND.black },
  { name: "Rosa/Rosa", base: BRAND.pinkLight, accent: BRAND.pink },
  { name: "Blanco/Rosa", base: BRAND.white, accent: BRAND.pink },
];
["Clásico", "Vértice", "Franja", "Diagonal", "Bloque", "Doble Franja", "Manga Bicolor",
 "Tricolor", "Blanco Total", "Rosa Puro", "Negro Puro", "Combinado"].forEach((n, i) => {
  addProduct({
    category: "conjuntos",
    name: `Conjunto Deportivo "${n}"`,
    tagline: "Conjuntos 2025",
    kind: "hoodie",
    price: 68000,
    variants: [conjuntoVariants[i % conjuntoVariants.length]],
    photos: [`conjunto-${i + 1}.jpg`],
    desc: `Conjunto campera + pantalón "${n}". Ideal para pretemporada y entrada en calor. Bordado LeaL FC.`,
  });
});

/* Buzos con capucha / camperas */
["Recto", "Bicolor", "Ribete", "Diagonal", "Chevron", "Puffer",
 "Franja Lateral", "Cruzado", "Manga Contraste", "Blanco Puro"].forEach((n, i) => {
  addProduct({
    category: "buzos",
    name: `Buzo Canguro "${n}"`,
    tagline: "Colección 2025",
    kind: "hoodie",
    price: 58000 + i * 2000,
    variants: [conjuntoVariants[i % conjuntoVariants.length]],
    photos: [`buzo-${i + 1}.jpg`],
    desc: `Buzo con capucha modelo "${n}", frisa premium interior, bolsillo canguro y cordones a tono.`,
  });
});

/* Jeans */
[
  { name: "Negro/Rosa", base: "#222", accent: BRAND.pink },
  { name: "Gris/Rosa", base: "#9a9a9a", accent: BRAND.pink },
  { name: "Azul/Rosa", base: "#3b4a63", accent: BRAND.pink },
].forEach((v, i) => {
  const jeanSlugs = ["negro-rosa", "gris-rosa", "azul-rosa"];
  addProduct({
    category: "jeans",
    name: `Jean LeaL FC ${v.name}`,
    tagline: "Jean 2025 — Estilo de vida",
    kind: "jean",
    price: 72000,
    variants: [v],
    sizes: ["38", "40", "42", "44", "46"],
    photos: [`jean-${jeanSlugs[i]}.jpg`],
    desc: "Jean recto con costura lateral a contraste, parche trasero bordado y botón personalizado LeaL.",
  });
});

/* Camisas de lino */
const linoVariants = [
  { name: "Blanco/Rosa", base: BRAND.white, accent: BRAND.pink },
  { name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink },
  { name: "Rosa/Negro", base: BRAND.pink, accent: BRAND.black },
];
const linoSlugs = ["raya", "palmeras-negro", "escudo-negro", "blanco-negro",
  "negro-rosa", "rosa-negro", "rosa-negro-2", "palmeras-blanco"];
["Raya", "Palmeras", "Escudo", "Ribete", "Negro Rosa", "Clásica Rosa", "Rosa Total", "Costa Blanca"].forEach((n, i) => {
  addProduct({
    category: "camisas-lino",
    name: `Camisa de Lino "${n}"`,
    tagline: "Verano · Mismas raíces, nuevos veranos",
    kind: "shirt",
    price: 54000,
    variants: [linoVariants[i % linoVariants.length]],
    photos: [`lino-${linoSlugs[i]}.jpg`],
    desc: `Camisa de lino manga corta "${n}", cuello camisero, botones nacarados y logo LL bordado.`,
  });
});

/* Mallas / shorts de baño */
const mallaVariants = [
  { name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink },
  { name: "Rosa/Negro", base: BRAND.pink, accent: BRAND.black },
  { name: "Blanco/Rosa", base: BRAND.white, accent: BRAND.pink },
];
const mallaSlugs = ["clasica", "palmeras", "marmolada", "bicolor",
  "rosa-negro", "brush", "blanca", "rosa-total", "texto", "split", "rosa-negro-2", "ribete"];
["Clásica", "Palmeras", "Marmolada", "Bicolor", "Rosa/Negro", "Brush", "Blanca", "Rosa Total",
 "Tipografía", "Split", "Doble Rosa", "Ribete"].forEach((n, i) => {
  addProduct({
    category: "mallas",
    name: `Malla de Baño "${n}"`,
    tagline: "Leal todo el año",
    kind: "short",
    price: 30000,
    variants: [mallaVariants[i % mallaVariants.length]],
    sizes: ["S", "M", "L", "XL"],
    photos: [`malla-${mallaSlugs[i]}.jpg`],
    desc: `Short de baño modelo "${n}", tela quick-dry, cordón ajustable y bolsillo con cierre.`,
  });
});

/* Gorras New Era */
const gorraVariants = [
  { name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink },
  { name: "Rosa/Negro", base: BRAND.pink, accent: BRAND.black },
  { name: "Blanco/Negro", base: BRAND.white, accent: BRAND.black },
];
const gorraSlugs = ["negro-rosa", "negro-rosa-escudo", "blanco-negro-minimal", "negro-rosa-brush",
  "rosa-negro", "blanco-negro", "negro-rosa-outline", "rosa-blanco", "blanco-rosa-negro", "rosa-negro-escudo"];
["Bordado LL", "Escudo", "Minimal", "Brush", "Rosa/Negro", "Blanco/Negro",
 "Outline", "Rosa/Blanco", "Raya Doble", "Escudo Rosa"].forEach((n, i) => {
  addProduct({
    category: "gorras",
    name: `Gorra New Era 59FIFTY "${n}"`,
    tagline: "Colección 2025",
    kind: "cap",
    price: 38000,
    variants: [gorraVariants[i % gorraVariants.length]],
    sizes: ["7", "7 1/8", "7 1/4", "7 3/8", "7 1/2"],
    photos: [`gorra-${gorraSlugs[i]}.jpg`],
    desc: `Gorra cerrada New Era 59FIFTY, bordado "${n}", visera plana y sticker original.`,
  });
});

/* Accesorios varios */
addProduct({ category: "accesorios", name: "Mochila LeaL FC", tagline: "Un equipo, una familia", kind: "bag", price: 42000, sizes: ["Única"],
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["acc-mochila.jpg"], desc: "Mochila urbana con bordado LEAL, compartimento acolchado para notebook." });
addProduct({ category: "accesorios", name: "Bolso Deportivo", tagline: "Más que fútbol", kind: "bag", price: 39000, sizes: ["Única"],
  variants: [{ name: "Rosa/Negro", base: BRAND.pink, accent: BRAND.black }], photos: ["acc-bolso.jpg"], desc: "Bolso de lona reforzada, ideal para el bolso de entrenamiento." });
addProduct({ category: "accesorios", name: "Medias LeaL Rosa", tagline: "Detalles que diferencian", kind: "short", price: 9000, sizes: ["Única"],
  variants: [{ name: "Rosa/Blanco", base: BRAND.pinkLight, accent: BRAND.white }], photos: ["acc-medias-1.jpg"], desc: "Medias deportivas con franjas y logo R bordado." });
addProduct({ category: "accesorios", name: "Medias LeaL Negras", tagline: "Detalles que diferencian", kind: "short", price: 9000, sizes: ["Única"],
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["acc-medias-2.jpg"], desc: "Medias deportivas con franjas y logo R bordado." });
addProduct({ category: "accesorios", name: "Boxer LeaL", tagline: "Comodidad total", kind: "short", price: 12000, sizes: ["S", "M", "L", "XL"],
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["acc-boxer.jpg"], desc: "Calzoncillo boxer de algodón elastizado con cintura LEAL." });
addProduct({ category: "accesorios", name: "Gorro de Lana", tagline: "Invierno LeaL", kind: "cap", price: 21000, sizes: ["Única"],
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["acc-gorro-lana.jpg"], desc: "Gorro de lana acanalado con logo bordado R." });

/* Outfit Joda / streetwear */
addProduct({ category: "outfit-joda", name: "Remera Oversize LeaL FC", tagline: "La noche también es nuestra", kind: "jersey", price: 34000,
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["outfit-remera-oversize.jpg"], desc: "Remera oversize 100% algodón, estampa frontal y espalda con escudo y frases del club." });
addProduct({ category: "outfit-joda", name: "Buzo Capucha Oversize", tagline: "Outfit Joda 2025", kind: "hoodie", price: 62000,
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["outfit-buzo-capucha.jpg"], desc: "Buzo oversize streetwear con capucha, ideal para looks urbanos." });
addProduct({ category: "outfit-joda", name: "Campera Rompeviento Bicolor", tagline: "Siempre Leal", kind: "hoodie", price: 65000,
  variants: [{ name: "Negro/Rosa", base: BRAND.black, accent: BRAND.pink }], photos: ["outfit-campera-rompeviento.jpg"], desc: "Campera rompeviento bicolor negro/rosa, corte relajado." });

/* Precio único para todo el catálogo (pedido del cliente) */
products.forEach(p => { p.price = 20000; });

/* ---- helpers de acceso ---- */
function getProductsByCategory(catId) {
  return products.filter(p => p.category === catId);
}
function getProductById(id) {
  return products.find(p => p.id === id);
}
function searchProducts(q) {
  q = (q || "").trim().toLowerCase();
  if (!q) return products;
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.tagline.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    (LEAL_CATEGORIES.find(c => c.id === p.category)?.name || "").toLowerCase().includes(q)
  );
}
