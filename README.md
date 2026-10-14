# HAVOC Watches — havocwatches.co.uk

Astro static site. Content is verbatim from the old WordPress site:
- `src/data/site.ts` — page copy, contact details, collections, features
- `src/data/products.json` — 15 products (generated from the old shop)
- `src/data/articles.json` — the six feature articles
- `src/data/privacy.json` — privacy policy

```
npm install
npm run dev      # http://localhost:4331
npm run build
```

Deploy: push to GitHub and import in Vercel (framework preset: Astro). `vercel.json` sets `cleanUrls` and 301s for old URLs.

Contact form: set `PUBLIC_WEB3FORMS_KEY` in Vercel env vars to send enquiries by email; without it the form opens the visitor's email app.
