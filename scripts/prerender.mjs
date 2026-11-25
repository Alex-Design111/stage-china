// Writes a finished HTML file for every address, plus 404.html and sitemap.xml.
// Runs after `vite build` (client) and `vite build --ssr` (renderer).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const { render, ALL_ROUTES, routePath, seoFor, SITE_ORIGIN } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function withHead(html, seo) {
  const url = SITE_ORIGIN + seo.path;
  const t = esc(seo.title), d = esc(seo.description), img = esc(seo.image);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`);
}

const written = [];
for (const r of ALL_ROUTES) {
  const p = routePath(r);
  const seo = seoFor(r);
  const app = render(p);
  const html = withHead(template, seo).replace('<div id="root"></div>', `<div id="root">${app}</div>`);
  // "/portfolio" -> dist/portfolio.html (Netlify serves it at /portfolio without a trailing slash)
  const file = p === "/" ? path.join(dist, "index.html") : path.join(dist, `${p.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(p);
}

// Real "not found" page: Netlify serves it with a 404 status for unknown addresses
const notFound = withHead(template, { title: "Page not found | Stagency China", description: "This page doesn't exist. Go to the Stagency China home page.", path: "/", image: SITE_ORIGIN + "/assets/og-image.jpg" })
  .replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />')
  .replace(/<script type="module"[^>]*><\/script>/, "")
  .replace('<div id="root"></div>', `<div id="root"><main style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;background:#000;color:#fff;text-align:center;padding:24px;font-family:var(--font-sans)">
    <a href="/"><img src="/assets/stagency-logo-nav.png" alt="Stagency China" style="height:56px;width:auto"></a>
    <h1 style="font-size:clamp(2rem,6vw,4rem);font-weight:700;text-transform:uppercase;margin:0">Page not found</h1>
    <p style="margin:0;color:rgba(255,255,255,.7)">The page you're looking for doesn't exist or has moved.</p>
    <p style="margin:0;display:flex;gap:12px;flex-wrap:wrap;justify-content:center"><a class="btn btn-brand cut-sm" href="/">Home page</a><a class="btn btn-ghost" href="/portfolio" style="color:#fff">Our cases</a></p>
  </main></div>`);
fs.writeFileSync(path.join(dist, "404.html"), notFound);

// Sitemap with every page
const today = new Date().toISOString().slice(0, 10);
const urls = written.map((p) => `  <url><loc>${SITE_ORIGIN}${p}</loc><lastmod>${today}</lastmod><priority>${p === "/" ? "1.0" : p === "/portfolio" ? "0.8" : "0.6"}</priority></url>`).join("\n");
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${written.length} pages + 404.html + sitemap.xml`);
