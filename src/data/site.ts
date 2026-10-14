// ─────────────────────────────────────────────────────────────────────────────
// HAVOC WATCHES — site content.
// VERBATIM: every sentence below is copied from havocwatches.co.uk (scraped
// 14 Oct 2026). Do not reword. Neutral UI labels (e.g. "Order on WhatsApp",
// "Photo 2 of 6") are marked UI and are not client copy.
// Product copy lives in products.json, feature articles in articles.json,
// privacy policy in privacy.json — all generated from the old site.
// ─────────────────────────────────────────────────────────────────────────────
import productsJson from './products.json';
import articlesJson from './articles.json';
import seoJson from './seo.json';

export const contact = {
  phone: '+44 7362 367694',
  phoneHref: 'tel:+447362367694',
  whatsapp: 'https://wa.me/447362367694',
  email: 'havocwatches26@gmail.com',
  instagram: 'https://www.instagram.com/havocwatches26/',
  instagramHandle: '@havocwatches26',
  facebook: 'https://www.facebook.com/havocwatches26/',
  company: 'HAVOC Watches Ltd',
};

export const brand = {
  name: 'HAVOC Watches',
  tagline: 'UNTRACEABLE BY DESIGN',
  homeTitle: 'Havoc Watches: Untraceable by Design. Military Timepieces.',
  homeDesc: 'WELCOME TO HAVOC WATCHES. FUNCTIONAL • RELIABLE • POWERFUL. TIMEPIECES WHICH HONOUR OUR MILITARY HERITAGE AND MEET MODERN DEMANDS.',
};

// Home hero slides (old Slider Revolution) — verbatim
export const heroSlides = [
  { line1: 'UNTRACEABLE', line2: 'BY DESIGN', kicker: 'HAVOC WATCHES', sub: 'FUNCTIONAL • RELIABLE • POWERFUL', cta: 'VISIT STORE' },
  { line1: 'MILITARY', line2: 'INSPIRED', kicker: 'HAVOC WATCHES', sub: 'DEPENDABLE • PRECISE • DURABLE', cta: 'VISIT STORE' },
];

export type CollectionSlug = 'armoured' | 'stealth' | 'british-icons' | 'dismounted';
export const collections: { slug: CollectionSlug; name: string; label: string; title: string; text: string; cta: string; image: string }[] = [
  { slug: 'armoured', name: 'Armoured', label: 'THE ARMOURED COLLECTION', title: 'RUGGED CAPABILITY', text: 'A range of iconic timepieces designed to perform without compromise - in everyday life or out in the field.', cta: 'BROWSE ARMOURED', image: '/img/2026/06/patrolii2.webp' },
  { slug: 'stealth', name: 'Stealth', label: 'THE STEALTH COLLECTION', title: 'TACTICAL STEALTH', text: 'A range designed for those who move quietly, operate independently and demand complete reliability.', cta: 'BROWSE STEALTH', image: '/img/2026/06/stealth2.webp' },
  { slug: 'british-icons', name: 'British Icons', label: 'THE BRITISH ICONS COLLECTION', title: 'ENDURING CLASSICS', text: 'Exquisite watches created in honour of some of the most enduring icons of the British military.', cta: 'BROWSE ICONIC', image: '/img/2026/06/cambrai4.webp' },
  { slug: 'dismounted', name: 'Dismounted', label: 'THE DISMOUNTED COLLECTION', title: 'ACTIVE LIFESTYLES', text: 'Versatile, durable timepieces which look as stylish beneath the cuff of a dress jacket as they do at the gym.', cta: 'BROWSE DISMOUNTED', image: '/img/2026/07/7852.webp' },
];

export const founder = {
  // The old homepage showed this quote twice with slightly different wording;
  // this is the version that matches the Our Story page ("one clear mission").
  quote: '“HAVOC was created with a single clear mission: to build purpose driven mechanical watches that honour military heritage while meeting the demands of modern life.”',
  name: 'Lee Johnson',
  role: 'Founder: Havoc Watches',
  cta: 'READ THE HAVOC STORY',
  label: 'UNTRACEABLE BY DESIGN',
  photo: { src: '/img/2026/07/about-photo-lee.webp', w: 500, h: 595, alt: 'Lee Johnson, founder of HAVOC Watches, in uniform on operations' },
};

export const fullRange = {
  title: 'BROWSE OUR FULL RANGE',
  text: 'We’re confident the perfect timepiece is waiting for you.',
};

export const bespokeTeaser = {
  title: 'as unique as you',
  p1: 'Work with our team to design a timepiece which reflects your style, your story and your legacy.',
  p2: 'Create a bespoke watch which manifests your organisation perfectly – from the style of the hands to the case material; from the dial colour to the placement of your logo or insignia.',
  cta: 'DISCOVER HAVOC BESPOKE',
  // The four elements named in p2 — used as the numbered list beside the 3D watch.
  parts: [
    { key: 'hands', label: 'Hands', words: 'the style of the hands' },
    { key: 'case', label: 'Case', words: 'the case material' },
    { key: 'dial', label: 'Dial', words: 'the dial colour' },
    { key: 'logo', label: 'Logo', words: 'the placement of your logo or insignia' },
  ],
};

// Testimonials — verbatim from the old homepage (names were anonymised there too)
export const testimonials = [
  { title: 'MILITARY GRADE PERFORMANCE', product: 'HAVOC Patrol Carbon', slug: 'havoc-patrol-carbon', pre: '', post: 'really nails that balance between tough, military-grade performance and a lightweight carbon look. It feels just as natural out in the field or in the mountains as it does for everyday wear.', who: 'Maj *****', unit: 'HCR' },
  { title: 'QUALITY PIECE OF KIT', product: 'HAVOC Sabre', slug: 'havoc-sabre', pre: 'The', post: 'is a quality piece of kit, rugged, dependable, and fits well with my regimental colours.', who: 'Cpl *****', unit: 'QDG' },
  { title: 'THE SPIRIT OF CAMBRAI ON YOUR WRIST', product: 'HAVOC 1917', slug: 'havoc-1917', pre: 'The', post: 'carries the spirit of Cambrai on your wrist, rugged and built for those who lead from the front.', who: 'Lt Col *****', unit: 'RTR' },
  { title: 'UNCOMPROMISING DURABLITY', product: 'HAVOC Patrol II', slug: 'havoc-patrol', pre: 'The', post: 'delivers a great looking military watch with uncompromising durability, making it a trusted companion all day every day.', who: 'Mr *****', unit: 'CIV' },
  { title: 'EFFORTLESSLY CAPABLE', product: 'HAVOC Sentinel', slug: 'havoc-sentinel', pre: 'Smart, understated and effortlessly capable, the', post: 'looks every bit at home paired with a tailored suit or smart casual.', who: 'Sgt *****', unit: 'GUARDS' },
];

export const instagramBand = { title: 'VIEW OUR LATEST NEWS ON INSTAGRAM', cta: 'Follow on Instagram' };

// ─── Our Story (verbatim) ───
export const story = {
  title: 'Our Story',
  intro: 'HAVOC Watches was born from almost three decades of military service – where time was never just measured, it was mission critical.',
  h1: 'Honouring Military Heritage.',
  h2: 'Meeting Modern Demands.',
  p: [
    'Founded by British Army veteran Lee Johnson, HAVOC was created with one clear mission: to build purpose-driven mechanical watches that honour military heritage while meeting the demands of modern life.',
    'Having served in Heavy Armour, Reconnaissance and Joint Terminal Attack Controller (JTAC) roles, Lee understood first-hand the importance of dependable equipment. Whether deployed on operations, undertaking arduous training exercises or operating in demanding environments around the world, every piece of kit had to earn its place. A watch was no different – it had to be robust, reliable and ready when it mattered most.',
    'Rather than creating fashion watches, HAVOC was built to produce timepieces with purpose. Every collection draws inspiration from genuine military history, operational experience and the men and women who serve. From commemorative regimental editions to bespoke unit commissions, each watch tells a story worth wearing.',
  ],
  midTitle1: 'HAVOC Watches.',
  midTitle2: 'Untraceable by Design.',
  p2: [
    'Built around proven automatic movements, premium materials and practical functionality, every HAVOC watch is designed to be a trusted companion – not a disposable accessory. They are built to be worn, relied upon and passed down through generations.',
    'Today, HAVOC proudly works with military units, veterans, emergency services and organisations to create bespoke commemorative watches that preserve history and celebrate service. Every commission reflects the pride, identity and traditions of the people who wear them.',
  ],
  close1: 'HAVOC is more than a watch company.',
  close2: 'It is a veteran-owned British microbrand built on resilience, craftsmanship and purpose.',
};

// ─── Havoc Bespoke (verbatim) ───
export const bespoke = {
  title: 'Havoc Bespoke',
  kicker: 'A WATCH THAT REPRESENTS WHO YOU ARE',
  intro: [
    'A truly memorable watch has a purpose behind it.',
    'HAVOC Watches works with organisations – guiding them through a comprehensive manufacturing process – to develop bespoke timepieces that capture their identity, achievements and values.',
    'Watches that carry history, identity, symbolism, branding and meaning.',
    'Whether commemorating a milestone, honouring a team, celebrating a legacy or creating something exclusive for your members, every HAVOC Bespoke Watch is developed with your story at its heart.',
    'Our design team will work with you from the earliest concept through myriad options to the completed piece – transforming ideas, traditions and identity into a watch that is truly unique and unmistakably yours.',
  ],
  startCta: 'START YOUR HAVOC BESPOKE JOURNEY',
  processTitle: 'The Creation Process',
  steps: [
    { n: '1', title: 'Understanding your Story', p: ['Every organisation has something that makes it unique.', 'We begin by learning what your watch needs to represent – your history, your mission, your people, and the message you want the finished piece to convey. This foundation guides every design decision that follows.'] },
    { n: '2', title: 'Developing your Concept', p: ['Working together, we explore the directions available to your timepiece and bring your ideas to life.', 'Our team helps translate your identity into a cohesive design, ensuring every element works together rather than simply adding personal touches. The result is a watch that feels purpose-built, not adapted.'] },
    { n: '3', title: 'Crafting the Details', p: ['This is where your organisation’s identity is brought to life.', 'Every aspect of the watch can be carefully considered to create a design that feels authentic and meaningful. From the character of the dial and the balance of its layout, to the choice of colours, hands, indices, and the positioning of your logo, insignia, or other identifying features – each detail is developed with purpose.', 'The same attention extends to the finishing touches that define how the watch is experienced. Whether the design calls for the refined appearance of a steel bracelet, the versatility of a NATO strap, the timeless character of leather, the durability of rubber, or any other bespoke configuration, every element is selected to complement the overall vision.', 'The result is a timepiece where every decision contributes to a single, unified design – one that represents your organisation and could belong to no one else.'] },
    { n: '4', title: 'Final Approval', p: ['Before production begins, every aspect of your design is reviewed and perfected.', 'Once approved, your bespoke timepiece is created with the same attention to detail that shaped the concept from the beginning. The finished watch becomes a lasting representation of your organisation – something designed to be worn with pride and remembered for genetrations.'] },
  ],
  closeTitle: 'Create something that could only ever be yours',
  close: ['A HAVOC Bespoke Watch is not simply personalised. It is created with meaning, purpose and identity built into every decision.', 'Contact us today and begin creating a timepiece that truly represents your organisation.'],
  closeCta: 'Get in touch.',
  images: [
    { src: '/img/2026/07/bespoke1a.webp', w: 859, h: 859 },
    { src: '/img/2026/07/bespoke_2.webp', w: 859, h: 859 },
    { src: '/img/2026/07/bespoke_2a.webp', w: 859, h: 909 },
  ],
};

// ─── Features (heritage articles) ───
export type FeatureSlug = 'duke-of-lancasters-own-yeomanry' | 'rtr' | 'scimitar-fearsome-scout' | 'sabre-hybrid-reconnaissance' | 'jtac' | 'brough-superior';
export const features: { slug: FeatureSlug; nav: [string, string]; product: string; productLabel: string; badge?: { src: string; w: number; h: number; alt: string }; image: string; figure?: { src: string; w: number; h: number; caption: string }[] }[] = [
  { slug: 'duke-of-lancasters-own-yeomanry', nav: ['Duke of Lancasters Own Yeomanry', ''], product: 'havoc-sentinel', productLabel: 'ELEGANT DRESS WATCH', badge: { src: '/img/2026/07/duke_of_lancasters_own_yoemanry.webp', w: 640, h: 647, alt: 'Duke of Lancaster’s Own Yeomanry badge' }, image: '/img/2026/06/sentinel2.webp' },
  { slug: 'rtr', nav: ['The Royal Tank Regiment:', 'Fear Naught'], product: 'havoc-1917', productLabel: 'BRITISH ICON', badge: { src: '/img/2026/06/ROYAL_TANK_REGIMENT2.webp', w: 640, h: 640, alt: 'Royal Tank Regiment badge — Fear Naught' }, image: '/img/2026/06/cambrai1.webp', figure: [{ src: '/img/2026/06/rtr-challenger2a.webp', w: 976, h: 731, caption: 'The Challenger 2 main battle tank' }] },
  { slug: 'scimitar-fearsome-scout', nav: ['CVR(T) Scimitar:', 'Fearsome Scout'], product: 'havoc-scimitar', productLabel: 'ARMOURED ELEGANCE', image: '/img/2026/07/scimitar4.webp' },
  { slug: 'sabre-hybrid-reconnaissance', nav: ['CVR(T) Sabre:', 'Hybrid Reconnaissance'], product: 'havoc-sabre', productLabel: 'ARMOURED ELEGANCE', image: '/img/2026/06/sabre3.webp' },
  { slug: 'jtac', nav: ['JTAC:', 'Precision from Above'], product: 'havoc-jtac', productLabel: 'ELITE OPERATORS', image: '/img/2026/07/jtac2.webp' },
  { slug: 'brough-superior', nav: ['Brough Superior:', 'Transport Legend'], product: 'havocss80-broughsuperior', productLabel: 'BRITISH ICON', badge: { src: '/img/2026/06/brough-logo.webp', w: 640, h: 312, alt: 'Brough Superior logo' }, image: '/img/2026/06/brough5.webp', figure: [{ src: '/img/2026/06/brough-superior-factory.webp', w: 976, h: 842, caption: 'The Brough Superior Factory 1927' }, { src: '/img/2026/06/george-brough.webp', w: 976, h: 842, caption: 'George Brough' }] },
];

export const contactPage = { title: 'Contact Us', heading: 'GET IN TOUCH' };

// ─── Data helpers ───
export type Block = { t: 'h' | 'p' | 'li'; x: string };
export type Product = {
  slug: string; oldSlug: string; name: string; oldName: string; price: number; cats: CollectionSlug[]; tags: string[];
  title: string; meta: string; short: Block[]; desc: Block[]; images: string[]; options: { label: string; img: string | null }[]; feature: FeatureSlug | null;
};
export const products = productsJson as unknown as Product[];
export const articles = articlesJson as unknown as Record<FeatureSlug, any[]>;
export const seo = seoJson as Record<string, { title: string; desc: string }>;

export const price = (n: number) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const productBySlug = (s: string) => products.find((p) => p.slug === s)!;
export const inCollection = (c: CollectionSlug) => products.filter((p) => p.cats.includes(c));
export const catLabel = (p: Product) => (collections.find((c) => c.slug === p.cats[0])?.name ?? '').toUpperCase();

// Product image sizes (all gallery shots on the old site are 1024×1536 unless listed)
export const imgSize = (src: string): [number, number] => {
  const m: Record<string, [number, number]> = {
    '/img/2026/07/7845.webp': [1023, 1537], '/img/2026/07/7852.webp': [1071, 1469], '/img/2026/07/7853.webp': [1122, 1402], '/img/2026/07/7854.webp': [1086, 1448],
    '/img/2026/08/9355.webp': [1254, 1254], '/img/2026/08/9356.webp': [1254, 1254], '/img/2026/08/9374.webp': [1024, 1536],
    '/img/2026/08/10203.webp': [1109, 2400], '/img/2026/08/10208.webp': [1109, 2400],
    '/img/2026/09/13099.webp': [1080, 1056], '/img/2026/09/13102.webp': [1080, 575], '/img/2026/09/13105.webp': [1079, 492], '/img/2026/09/13481.webp': [832, 1592], '/img/2026/09/13484.webp': [736, 1266],
  };
  return m[src] ?? [1024, 1536];
};

export const nav = [
  { label: 'Shop', href: '/shop' },
  { label: 'Havoc Bespoke', href: '/havoc-bespoke' },
  { label: 'Features', href: '/#features', children: features.map((f) => ({ label: f.nav.filter(Boolean).join(' '), href: '/' + f.slug })) },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
];
