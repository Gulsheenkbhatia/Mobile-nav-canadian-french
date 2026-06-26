import type { BrandId } from '../components/nav/NavSearchExposed'
import homepageHeroes from './homepageHeroes.live.json'

export type StoryBlock = {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
}

const heroImage =
  homepageHeroes[0]?.imageUrl ??
  'https://cms.coach.com/i/coach/20260603-hp1-tabby-still-new?&w=480&fmt=webp&$qlt_med$'
const secondaryImage =
  homepageHeroes[1]?.imageUrl ??
  'https://cms.coach.com/i/coach/20260603-hp1-tabby-video-mobile?&w=640&fmt=webp&$qlt_med$'

export function getV1ContentSpots(brand: BrandId): {
  hero: StoryBlock
  duo: StoryBlock[]
} {
  if (brand === 'outlet') {
    return {
      hero: {
        id: 'outlet-hero',
        title: 'Outlet New Arrivals',
        subtitle: 'Styles starting under $100',
        imageUrl: secondaryImage,
      },
      duo: [
        { id: 'outlet-clearance', title: 'Clearance', imageUrl: heroImage },
        { id: 'outlet-bags', title: 'Bags', imageUrl: secondaryImage },
      ],
    }
  }

  return {
    hero: {
      id: 'andcoach-hero',
      title: homepageHeroes[0]?.title ?? 'Moments of becoming.',
      subtitle: homepageHeroes[0]?.eyebrow ?? '&Coach',
      imageUrl: heroImage,
    },
    duo: [
      {
        id: 'promo-tabby',
        title: 'Shop Tabby',
        imageUrl: secondaryImage,
      },
      {
        id: 'promo-charms',
        title: 'Shop Charms',
        imageUrl: heroImage,
      },
    ],
  }
}

export const v1UtilityLinks = [
  { id: 'login', label: 'Login' },
  { id: 'currency', label: '$USD' },
  { id: 'track', label: 'Track Order' },
  { id: 'help', label: 'Help' },
]
