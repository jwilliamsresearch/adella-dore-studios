/**
 * Content for the site. Everything here is drawn from Adell Adore Studios'
 * own public posts on TikTok, Threads and Instagram — no invented claims.
 * Update `site.contact` once the studio confirms a public enquiry address.
 */

export const site = {
  name: 'Adell Adore Studios',
  shortName: 'Adell Adore',
  tagline: 'Crafting moments, creating memories',
  city: 'Manchester',
  region: 'Greater Manchester',
  country: 'United Kingdom',
  countryCode: 'GB',
  url: 'https://www.adelladorestudios.com',
  handle: '@adelladorestudios',
  founded: '2022',
  // The hero runs as a slow crossfading set. The first entry is also the
  // social card and the preloaded LCP image, so keep the strongest shot first.
  covers: [
    {
      img: 'cover-1',
      position: '50% 55%',
      alt: 'A brick-and-beam Manchester venue laid for a wedding breakfast — long trestle tables, navy runners and chair sashes, eucalyptus garlands, candles and festoon lighting.',
    },
    {
      img: 'cover-2',
      position: '52% 50%',
      alt: 'A bride seated with a cascading bouquet of white orchids and roses, her lace-edged cathedral veil fanned across the floor.',
    },
    {
      img: 'cover-3',
      position: '50% 50%',
      alt: 'A brass candelabra with ivory tapers on a dressed dining table of white roses, gypsophila and blue menu cards against a deep green wall.',
    },
    {
      img: 'cover-4',
      position: '50% 45%',
      alt: 'A ceremony aisle lined with eucalyptus, pillar candles and navy chair sashes, leading to a floral moon gate beneath hanging greenery.',
    },
    {
      img: 'cover-5',
      position: '50% 55%',
      alt: 'A top table dressed with a white rose and eucalyptus garland, candles and a Mr & Mr sign, beside a floor-to-ceiling window over the city.',
    },
  ],
  // Studio marks — both are artwork on the house green, so they sit on the
  // green navbar and footer without a plate. `main` is the tall stacked
  // lockup (studio section); `wordmark` is the horizontal one that fits a bar.
  logos: {
    main: 'main-logo',
    wordmark: 'footer-logo',
  },
  socials: {
    instagram: 'https://www.instagram.com/adelladorestudios/',
    threads: 'https://www.threads.com/@adelladorestudios',
    tiktok: 'https://www.tiktok.com/@adelladorestudios',
  },
  // Verified from the studio's public TikTok profile.
  proof: [
    { value: '880K+', label: 'Likes across TikTok' },
    { value: '2.4K', label: 'Followers and growing' },
    { value: 'Est. 2022', label: 'Designing in Manchester' },
  ],
};

export const services = [
  {
    id: 'full-design',
    title: 'Full Wedding Design',
    lede: 'Inception to execution',
    body:
      'We take a wedding from the first mood board to the last candle being lit — concept, colour story, floral direction, tablescapes, backdrops, supplier coordination and on-the-day styling.',
    includes: ['Concept & mood boarding', 'Colour and floral direction', 'Supplier sourcing', 'On-the-day styling'],
  },
  {
    id: 'styling',
    title: 'Styling & Décor',
    lede: 'The details people remember',
    body:
      'Draped backdrops, greenery runners, balloon installations, candle work and place settings. Built for the room you actually have, not a template.',
    includes: ['Tablescapes & place settings', 'Backdrops & draping', 'Balloon garlands', 'Candle & greenery work'],
  },
  {
    id: 'celebrations',
    title: 'Intimate Celebrations',
    lede: 'Small rooms, high craft',
    body:
      'Baby showers, milestone birthdays, dinner parties and bridal showers. The same standard of design applied at a scale that stays personal.',
    includes: ['Baby & bridal showers', 'Milestone birthdays', 'Dinner parties', 'Catering & buffet styling'],
  },
  {
    id: 'brand-events',
    title: 'Brand & Private Events',
    lede: 'Hosting, handled',
    body:
      'Private views, launches and networking evenings — planned and coordinated end to end, including guest flow, food styling and the small ceremonial touches.',
    includes: ['Private views & launches', 'Networking evenings', 'Guest flow & run sheets', 'Food & drink styling'],
  },
];

export const process = [
  {
    n: '01',
    title: 'Consultation',
    body: 'We talk through the date, the room, the guest count and what the day needs to feel like.',
  },
  {
    n: '02',
    title: 'Concept',
    body: 'A design direction comes back to you — colour story, florals, layout, materials, references.',
  },
  {
    n: '03',
    title: 'Coordination',
    body: 'Suppliers are sourced and briefed, timings are locked, and every element is costed before it is confirmed.',
  },
  {
    n: '04',
    title: 'Execution',
    body: 'We build the room on the day. You arrive to it finished, and we stay to keep it running.',
  },
];

// Each entry maps to a real post on the studio's TikTok.
export const work = [
  {
    img: 'work-07',
    title: 'The Cult Gaia Bag Bouquet',
    meta: 'Bridal · Floral design',
    alt: 'A bride seated in ivory satin holding a cascading bouquet of white roses and orchids with amber orchids and trailing crimson amaranthus, built into a white Cult Gaia bag.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7507924886044560662',
    feature: true,
  },
  {
    img: 'work-03',
    title: 'Adanna & Ryan',
    meta: 'Manchester · Full wedding design',
    alt: 'A long wooden banquet table in a red-brick Manchester venue being dressed with a trailing greenery runner, glassware and folded linen napkins.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7619314067873844502',
  },
  {
    img: 'work-02',
    title: 'Sage & Candlelight',
    meta: 'Wedding · Tablescape',
    alt: 'A sage green table runner dressed with eucalyptus, white blossom and ivory pillar candles being arranged by hand.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7644924497501359383',
  },
  {
    img: 'work-04',
    title: 'Burgundy & Gold',
    meta: 'Milestone birthday',
    alt: 'A burgundy, cream and gold balloon garland arching over a cake table with red roses, a gold-framed arch mirror and a decorated birthday cake.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7462499893123239201',
  },
  {
    img: 'work-01',
    title: 'The Draped Backdrop',
    meta: 'Outdoor ceremony',
    alt: 'A tall champagne-coloured draped fabric backdrop set on grass under open sky, flanked by white floral and gypsophila arrangements.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7671993854165355798',
  },
  {
    img: 'work-09',
    title: 'Cherry Theme Dinner',
    meta: 'Private dinner party',
    alt: 'A birthday dinner table in white linen with tiered dessert stands, red roses, a sculptural candle and a burgundy, gold and white balloon garland behind.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7462499893123239201',
  },
  {
    img: 'work-05',
    title: 'Unveiling the Unspoken Canvas',
    meta: 'Private view · The Horsfall',
    alt: 'A champagne wall filled with poured flutes beside an exhibition poster for Unveiling the Unspoken Canvas at a Manchester gallery.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7523293660713159958',
  },
  {
    img: 'work-06',
    title: 'Orchid Cascade',
    meta: 'Bridal · Floral design',
    alt: 'Close view of a bag bouquet of white roses, phalaenopsis orchids, amber orchids and trailing crimson amaranthus held in the sunlight.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7508649658504285462',
  },
  {
    img: 'work-10',
    title: 'Bee Girlies Socials',
    meta: 'Networking · Event design',
    alt: 'A long table set for a creative workshop with paint palettes, linen napkins, taper candles, fruit and small floral arrangements.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7455078529001180448',
  },
  {
    img: 'work-08',
    title: 'Flowers with Bee Girlies',
    meta: 'Workshop · Floral',
    alt: 'Wrapped bouquets of pink and burgundy chrysanthemums and gerberas with gold butterfly details at a floral arrangement workshop.',
    href: 'https://www.tiktok.com/@adelladorestudios/video/7471224702241967382',
  },
];

export const faqs = [
  {
    q: 'Where is Adell Adore Studios based?',
    a: 'We are based in Manchester and work across Greater Manchester and the North West. We also travel elsewhere in the UK for full-design weddings.',
  },
  {
    q: 'What kind of events do you design?',
    a: 'Weddings are the heart of the studio, alongside baby showers, milestone birthdays, dinner parties, private views and networking events. We take on both full design and styling-only briefs.',
  },
  {
    q: 'Do you only do full wedding planning?',
    a: 'No. Some couples want the whole thing carried from concept to the final clear-down; others already have a planner and want us purely for design and styling. Both are welcome.',
  },
  {
    q: 'How far in advance should we book?',
    a: 'For a full wedding design, six to twelve months gives the most room to build the concept properly. Smaller celebrations can often be turned around in a matter of weeks — it is always worth asking.',
  },
  {
    q: 'How do we enquire?',
    a: 'Send us a message on Instagram, Threads or TikTok with your date, venue and rough guest count, and we will come back to you with availability and next steps.',
  },
];
