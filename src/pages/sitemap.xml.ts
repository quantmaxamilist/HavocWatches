import { products, collections, features } from '../data/site';
const SITE = 'https://havocwatches.co.uk';
export function GET() {
  const paths = ['/', '/shop', '/our-story', '/havoc-bespoke', '/contact', '/privacy-policy',
    ...collections.map((c) => `/product-category/${c.slug}`), ...features.map((f) => `/${f.slug}`), ...products.map((p) => `/product/${p.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
