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
  /** Local hero video (webm) for video + subnav module. */
  videoUrl?: string
}

export type HomepageCategory = {
  id: string
  name: string
  imageBg: string
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
  imageBg: string
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

export const HOMEPAGE_HERO_VIDEO = '/assets/videos/20260603-hp1-tabby-video-mobile.webm'

export type HomepageSubnavLink = {
  id?: string
  label: string
  href: string
}

/** Quick links under the homepage video hero (local substitute for coach-prototype-base). */
export const homepageSubnavLinks: HomepageSubnavLink[] = [
  { label: 'New', href: '#' },
  { label: 'Women', href: '#' },
  { label: 'Men', href: '#' },
  { label: 'Bags', href: '#' },
  { id: 'coachtopia', label: 'Coachtopia', href: '#' },
]

/** First two heroes synced from live coach.com (refresh via npm run sync:heroes). */
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
  videoUrl: index === 0 ? HOMEPAGE_HERO_VIDEO : undefined,
  imageBg: 'linear-gradient(135deg, #8B6F47 0%, #231F20 100%)',
}))

export const homepageCategories: HomepageCategory[] = [
  {
    id: 'bags',
    name: 'Bags',
    imageBg: 'linear-gradient(135deg,#8B6F47 0%,#5A3C22 100%)',
  },
  {
    id: 'wallets',
    name: 'Wallets',
    imageBg: 'linear-gradient(135deg,#B85C3A 0%,#7A3B22 100%)',
  },
  {
    id: 'rtw',
    name: 'Ready-to-Wear',
    imageBg: 'linear-gradient(135deg,#231F20 0%,#000 100%)',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    imageBg: 'linear-gradient(135deg,#F5E6D3 0%,#C4A57A 100%)',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    imageBg: 'linear-gradient(135deg,#D4B896 0%,#8B6F47 100%)',
  },
  {
    id: 'coachtopia',
    name: 'Coachtopia',
    imageBg: 'linear-gradient(135deg,#057550 0%,#003020 100%)',
  },
]

export const homepageProducts: HomepageProduct[] = [
  {
    id: 1,
    name: 'Tabby shoulder bag 26',
    price: '$450',
    tag: 'New',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#231F20', '#8B6F47', '#5B3A29'],
  },
  {
    id: 2,
    name: 'Rowan file bag',
    price: '$298',
    compareAt: '$395',
    tag: 'Sale',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#2E2E2E', '#F5E6D3'],
  },
  {
    id: 3,
    name: 'Brooklyn bag 28',
    price: '$595',
    tag: 'Best Seller',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#B85C3A', '#231F20', '#F5E6D3'],
  },
  {
    id: 4,
    name: 'Tabby wallet',
    price: '$195',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#949494', '#231F20'],
  },
  {
    id: 5,
    name: 'Kira crossbody',
    price: '$350',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#D9A5A0', '#F5E6D3', '#231F20'],
  },
  {
    id: 6,
    name: 'Pillow Tabby 18',
    price: '$495',
    tag: 'New',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#FAFAFA', '#231F20'],
  },
  {
    id: 7,
    name: 'Charter belt bag 7',
    price: '$250',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#000'],
  },
  {
    id: 8,
    name: 'Mollie tote',
    price: '$425',
    imageBg: '#F0F0F0',
    imageBg2: '#E9E9E9',
    swatches: ['#A85A52', '#231F20'],
  },
]

export const homepageStories: HomepageStory[] = [
  {
    id: 'coachtopia',
    eyebrow: 'Coachtopia',
    title: 'Circular by design.',
    body: 'A new world of circular craft — products made from recycled, recyclable, and regenerated materials. For a generation that wants to make things better.',
    cta: 'Discover Coachtopia',
    imageBg: 'linear-gradient(135deg,#231F20 0%,#000 100%)',
  },
  {
    id: 'craftsmanship',
    eyebrow: 'Our craftsmanship',
    title: 'Made to be handed down.',
    body: 'Every Coach bag is built by hand, with leathers we source and finish ourselves. The Coach (Re)Loved program refurbishes, restores, and reimagines vintage pieces.',
    cta: 'Learn more',
    imageBg: 'linear-gradient(135deg,#B85C3A 0%,#5A2D28 100%)',
  },
]

export const homepageProductGridMeta = {
  title: 'New arrivals',
  subtitle: "Just in — this season's most-wanted",
}

/** Coach Outlet mobile homepage — pseudo content aligned with outlet nav spots. */
export const outletHomepageHeroes: HomepageHero[] = [
  {
    id: 'outlet-hero-1',
    eyebrow: 'Limited time',
    title: 'Outlet New Arrivals',
    body: 'Styles starting under $100',
    primaryCta: 'Shop now',
    imageUrl: liveHeroes[1]?.imageUrl ?? undefined,
    imageBg: 'linear-gradient(135deg, #8B1A1A 0%, #231F20 100%)',
  },
  {
    id: 'outlet-hero-2',
    eyebrow: 'Extra savings',
    title: 'Clearance up to 50% off',
    body: 'Last chance on seasonal favorites.',
    primaryCta: 'Shop clearance',
    imageUrl: liveHeroes[0]?.imageUrl ?? undefined,
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
