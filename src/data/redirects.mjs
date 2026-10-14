// Old WordPress/WooCommerce URLs that no longer exist as pages -> new homes (301).
// Page, product and category URLs keep their old paths, so they need no redirect.
export const redirects = {
  '/product/havoc-challenger-gmt-copy': '/product/havoc-challenger-gmt',
  '/product-tag/lume': '/shop',
  '/product-tag/316l-stainless-steel': '/shop',
  '/product-tag/bronze': '/product/havocss80-broughsuperior',
  '/product-tag/titanium': '/shop',
  '/product-tag/carbon': '/product/havoc-stealth-carbon',
  '/cart': '/shop',
  '/checkout': '/shop',
  '/my-account': '/contact',
  '/wishlist': '/shop',
  '/error': '/',
  '/sitemap.rss': '/sitemap.xml',
  '/page-sitemap.xml': '/sitemap.xml',
  '/product-sitemap.xml': '/sitemap.xml',
  '/product_cat-sitemap.xml': '/sitemap.xml',
  '/product_tag-sitemap.xml': '/sitemap.xml',
  '/wp-sitemap.xml': '/sitemap.xml',
};
