# LEAL FC — Catálogo oficial

Sitio estático (HTML/CSS/JS puro, sin build ni dependencias) con el catálogo de indumentaria de LEAL FC: camisetas, conjuntos, buzos, jeans, gorras, accesorios y más.

## Ver en local

Abrí `index.html` directo con doble clic, o corré un server simple:

```bash
python -m http.server 8080
```

y entrá a `http://localhost:8080`.

## Deploy en Render

Este repo ya incluye `render.yaml`, así que el deploy es automático como **Static Site**:

1. Subí este repo a GitHub (o GitLab/Bitbucket).
2. En [Render](https://dashboard.render.com) → **New** → **Blueprint** → elegí el repo.
3. Render detecta `render.yaml` solo y publica el sitio (no necesita build command, es HTML estático).

Si preferís hacerlo manual sin blueprint:

1. **New** → **Static Site**.
2. Conectá el repo.
3. **Build Command**: dejar vacío.
4. **Publish directory**: `.` (raíz del proyecto).
5. Deploy.

## Estructura

```
index.html          página única (SPA con router por hash)
css/styles.css       estilos (paleta rosa/negro/blanco)
js/data.js           catálogo de productos
js/app.js            router, navbar, footer, carrito, buscador
img/logo.png         escudo del club (favicon + navbar)
img/products/        fotos de producto (recortadas del material de marca)
img/source/          láminas originales (no se sube a git, ver .gitignore)
```
