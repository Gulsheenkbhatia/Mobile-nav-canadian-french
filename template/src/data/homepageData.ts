import liveHeroesJson from './homepageHeroes.live.json'

export type HomepageHero = {
  id: string
  eyebrow?: string
  title: string
  body?: string
  primaryCta: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
  /** Gradient fallback when no live CDN image is available. */
  imageBg?: string
  /** Live coach.com CMS / Scene7 hero photography. */
  imageUrl?: string
  /** Local hero video (webm) — only when synced from live CMS. */
  videoUrl?: string
  /** Shorter promo tile between main heroes. */
  compact?: boolean
}

export type HomepageCategory = {
  id: string
  name: string
  imageBg: string
  imageUrl?: string
}

export type HomepageProduct = {
  id: number
  name: string
  price: string
  compareAt?: string
  tag?: string
  imageBg: string
  imageBg2: string
  swatches: string[]
}

export type HomepageStory = {
  id: string
  eyebrow: string
  title: string
  body: string
  cta: string
  secondaryCta?: string
  imageBg: string
  imageUrl?: string
}

type LiveHeroRecord = {
  id: string
  eyebrow?: string
  title: string
  body?: string
  primaryCta: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
  imageUrl?: string | null
  syncedAt?: string
}

const liveHeroes = liveHeroesJson as LiveHeroRecord[]

const CMS_FALLBACK =
  'https://cms.coach.com/i/coach/20260603-hp1-tabby-still-new?&w=640&fmt=webp&$qlt_med$'

export type HomepageSubnavLink = {
  id?: string
  label: string
  href: string
}

/** Quick links under the homepage hero — coach.com mobile (Jun 2026). */
export const homepageSubnavLinks: HomepageSubnavLink[] = [
  { label: 'Shop Tabby', href: '/shop/women/collections/tabby' },
  { label: 'Shop Charms', href: '/shop/women/accessories/bag-accessories-keychains' },
  { label: "Shop Women's", href: '/shop/women/view-all' },
]

/** Primary + shoulder-bags heroes — refresh copy/images via npm run sync:heroes. */
export const homepageHeroes: HomepageHero[] = liveHeroes.slice(0, 2).map((hero, index) => ({
  id: hero.id || `home-hero-${index + 1}`,
  eyebrow: hero.eyebrow,
  title: hero.title,
  body: hero.body ?? '',
  primaryCta: hero.primaryCta,
  primaryHref: hero.primaryHref,
  secondaryCta: hero.secondaryCta,
  secondaryHref: hero.secondaryHref,
  imageUrl: hero.imageUrl ?? undefined,
  imageBg:
    index === 0
      ? 'linear-gradient(180deg, #3d2c24 0%, #231F20 100%)'
      : 'linear-gradient(135deg, #8B6F47 0%, #231F20 100%)',
}))

/** Image promo modules between hero and shoulder-bags banner. */
export const homepagePromoModules: HomepageHero[] = [
  {
    id: 'promo-womens',
    eyebrow: 'Emotional Support',
    title: "Shop Women's",
    primaryCta: "Shop Women's",
    primaryHref: '/shop/women/view-all',
    imageUrl: CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg,#B85C3A 0%,#5A2D28 100%)',
    compact: true,
  },
  {
    id: 'promo-charms',
    eyebrow: 'Owning my style',
    title: 'Shop Charms',
    primaryCta: 'Shop Charms',
    primaryHref: '/shop/women/accessories/bag-accessories-keychains',
    imageUrl: CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg,#D4B896 0%,#8B6F47 100%)',
    compact: true,
  },
  {
    id: 'promo-tabby',
    title: 'Shop Tabby',
    primaryCta: 'Shop Tabby',
    primaryHref: '/shop/women/collections/tabby',
    imageUrl:
      'https://cms.coach.com/i/coach/20260603-hp1-tabby-video-mobile?&w=640&fmt=webp&$qlt_med$',
    imageBg: 'linear-gradient(135deg,#8B6F47 0%,#231F20 100%)',
    compact: true,
  },
]

/** Shop-by-category trio — coach.com mobile homepage. */
export const homepageCategories: HomepageCategory[] = [
  {
    id: 'bags',
    name: 'Bags',
    imageUrl: CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg,#8B6F47 0%,#5A3C22 100%)',
  },
  {
    id: 'women',
    name: "Women's",
    imageUrl: CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg,#B85C3A 0%,#5A2D28 100%)',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    imageUrl: CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg,#F5E6D3 0%,#C4A57A 100%)',
  },
]

export const homepageStoriesSectionTitle = 'Catch up on Coach.'

/** Editorial carousel — coach.com “Catch up on Coach” modules. */
export const homepageStories: HomepageStory[] = [
  {
    id: 'explore-your-story',
    eyebrow: 'Coach Spring 2026 Explore Your Story campaign',
    title: 'Wear your Tabby with a story worth sharing.',
    body: '',
    cta: 'Discover the Campaign',
    imageBg: 'linear-gradient(135deg,#231F20 0%,#000 100%)',
    imageUrl: CMS_FALLBACK,
  },
  {
    id: 'summer-shoes',
    eyebrow: 'Shoes',
    title: "Discover (and learn how to style) the summer's best shoes.",
    body: '',
    cta: 'Shop Shoes',
    secondaryCta: 'Explore Our Style Guides',
    imageBg: 'linear-gradient(135deg,#F5E6D3 0%,#8B6F47 100%)',
    imageUrl: CMS_FALLBACK,
  },
  {
    id: 'tabby-tour',
    eyebrow: 'Tabby Tour',
    title: 'The Tabby Tour is coming to a city near you.',
    body: '',
    cta: 'Learn More',
    imageBg: 'linear-gradient(135deg,#8B6F47 0%,#231F20 100%)',
    imageUrl: CMS_FALLBACK,
  },
  {
    id: 'wnba',
    eyebrow: 'WNBA',
    title:
      'Get to know the newly drafted WNBA players championing self-expression.',
    body: '',
    cta: 'See More',
    imageBg: 'linear-gradient(135deg,#B85C3A 0%,#231F20 100%)',
    imageUrl: CMS_FALLBACK,
  },
]

/** Coach Outlet mobile homepage — pseudo content aligned with outlet nav spots. */
export const outletHomepageHeroes: HomepageHero[] = [
  {
    id: 'outlet-hero-1',
    eyebrow: 'Limited time',
    title: 'Outlet New Arrivals',
    body: 'Styles starting under $100',
    primaryCta: 'Shop now',
    imageUrl: liveHeroes[1]?.imageUrl ?? CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg, #8B1A1A 0%, #231F20 100%)',
  },
  {
    id: 'outlet-hero-2',
    eyebrow: 'Extra savings',
    title: 'Clearance up to 50% off',
    body: 'Last chance on seasonal favorites.',
    primaryCta: 'Shop clearance',
    imageUrl: liveHeroes[0]?.imageUrl ?? CMS_FALLBACK,
    imageBg: 'linear-gradient(135deg, #231F20 0%, #000 100%)',
  },
]

export const outletHomepageSubnavLinks: HomepageSubnavLink[] = [
  { label: 'New', href: '#' },
  { label: 'Women', href: '#' },
  { label: 'Men', href: '#' },
  { label: 'Bags', href: '#' },
  { label: 'Clearance', href: '#' },
]

export const outletHomepageCategories: HomepageCategory[] = [
  {
    id: 'outlet-bags',
    name: 'Bags',
    imageBg: 'linear-gradient(135deg,#8B6F47 0%,#5A3C22 100%)',
  },
  {
    id: 'outlet-wallets',
    name: 'Wallets',
    imageBg: 'linear-gradient(135deg,#B85C3A 0%,#7A3B22 100%)',
  },
  {
    id: 'outlet-women',
    name: 'Women',
    imageBg: 'linear-gradient(135deg,#231F20 0%,#000 100%)',
  },
  {
    id: 'outlet-men',
    name: 'Men',
    imageBg: 'linear-gradient(135deg,#F5E6D3 0%,#C4A57A 100%)',
  },
  {
    id: 'outlet-clearance',
    name: 'Clearance',
    imageBg: 'linear-gradient(135deg,#8B1A1A 0%,#5A1010 100%)',
  },
]

export const outletHomepageStories: HomepageStory[] = [
  {
    id: 'outlet-clearance',
    eyebrow: 'Clearance',
    title: 'Extra savings on last-chance styles.',
    body: 'Shop handbags, wallets, and ready-to-wear at outlet prices — while supplies last.',
    cta: 'Shop clearance',
    imageBg: 'linear-gradient(135deg,#8B1A1A 0%,#231F20 100%)',
  },
  {
    id: 'outlet-bags',
    eyebrow: 'Bags',
    title: 'Iconic silhouettes, outlet prices.',
    body: 'Discover bestsellers and new arrivals starting under $100.',
    cta: 'Shop bags',
    imageBg: 'linear-gradient(135deg,#8B6F47 0%,#231F20 100%)',
  },
]

export const outletHomepageProductGridMeta = {
  title: 'Outlet bestsellers',
  subtitle: 'Top styles at up to 50% off',
}

/** Legacy mock grid — outlet tab only. */
export const outletHomepageProducts: HomepageProduct[] = [
  {
    id: 101,
    name: 'Tabby shoulder bag 26',
    price: '$225',
    compareAt: '$450',
    tag: '50% off',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#231F20', '#8B6F47', '#5B3A29'],
  },
  {
    id: 102,
    name: 'Rowan file bag',
    price: '$149',
    compareAt: '$298',
    tag: 'Sale',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#2E2E2E', '#F5E6D3'],
  },
  {
    id: 103,
    name: 'Brooklyn bag 28',
    price: '$297',
    compareAt: '$595',
    tag: 'Best Seller',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#B85C3A', '#231F20', '#F5E6D3'],
  },
  {
    id: 104,
    name: 'Tabby wallet',
    price: '$97',
    compareAt: '$195',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#949494', '#231F20'],
  },
]
