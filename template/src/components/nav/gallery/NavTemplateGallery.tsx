import { NavEnterGroup, NAV_CONTENT_SPOTS_L1_ENTER, NAV_CONTENT_SPOTS_DRILL_ENTER } from '../v3/NavEnter'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import type {
  V3L1ContentSpotsLayout,
  V3L2ContentSpotsLayout,
  V3L2ContentSpotAspectRatio,
} from '../../../data/v3ContentSpots'

const campaignImage = '/assets/figma/v3-campaign.png'
const bagsTan = '/assets/figma/v3-bags-tan.png'
const bagsBlack = '/assets/figma/v3-bags-black.png'
const womenShoes = '/assets/figma/v2-women-shoes.png'

function GalleryTile({
  src = campaignImage,
  hero = false,
  label = 'Label',
}: {
  src?: string
  hero?: boolean
  label?: string
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`v3-content-spots__tile ${hero ? 'v3-content-spots__tile--hero' : ''}`}
    >
      <img src={src} alt="" loading="lazy" />
      <div className="v3-content-spots__label">
        <span className="v3-content-spots__label-text">{toNavHeadlineCase(label)}</span>
      </div>
    </a>
  )
}

type GallerySection = {
  id: string
  title: string
  depth: 'L1' | 'L2'
  layout: V3L1ContentSpotsLayout | V3L2ContentSpotsLayout
  tileAspectRatio?: V3L2ContentSpotAspectRatio
  tiles: { label: string; image?: string; hero?: boolean }[]
  notes?: string
}

const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: 'l1-1',
    title: 'L1 — l1-1 (single 16:9)',
    depth: 'L1',
    layout: 'l1-1',
    tiles: [{ label: 'New Arrivals', image: campaignImage }],
  },
  {
    id: 'l1-2',
    title: 'L1 — l1-2 (2-up 16:9)',
    depth: 'L1',
    layout: 'l1-2',
    tiles: [
      { label: 'Women', image: campaignImage },
      { label: 'Bags', image: bagsTan },
    ],
  },
  {
    id: 'l1-3',
    title: 'L1 — l1-3 (hero + 2-up)',
    depth: 'L1',
    layout: 'l1-3',
    tiles: [
      { label: 'Hero', image: campaignImage, hero: true },
      { label: 'Women', image: bagsTan },
      { label: 'Bags', image: bagsBlack },
    ],
  },
  {
    id: 'l2-1',
    title: 'L2 — l2-1 (single 16:9)',
    depth: 'L2',
    layout: 'l2-1',
    tiles: [{ label: 'The New Brooklyn', image: campaignImage }],
  },
  {
    id: 'l2-2',
    title: 'L2 — l2-2 (2-up 16:9)',
    depth: 'L2',
    layout: 'l2-2',
    tileAspectRatio: '16:9',
    tiles: [
      { label: "Women's New", image: womenShoes },
      { label: "Men's New", image: bagsTan },
    ],
  },
  {
    id: 'l2-2-45',
    title: 'L2 — l2-2 (2-up 4:5)',
    depth: 'L2',
    layout: 'l2-2',
    tileAspectRatio: '4:5',
    tiles: [
      { label: "Women's New", image: womenShoes },
      { label: "Men's New", image: bagsTan },
    ],
  },
  {
    id: 'l2-3',
    title: 'L2 — l2-3 (hero + 2-up)',
    depth: 'L2',
    layout: 'l2-3',
    tiles: [
      { label: 'Hero', image: campaignImage, hero: true },
      { label: 'Shoes', image: womenShoes },
      { label: 'Tabby', image: bagsTan },
    ],
  },
  {
    id: 'l2-4',
    title: 'L2 — l2-4 (2×2 grid)',
    depth: 'L2',
    layout: 'l2-4',
    tiles: [
      { label: 'Bags', image: bagsTan },
      { label: 'Shoes', image: womenShoes },
      { label: 'Wallets', image: bagsBlack },
      { label: 'Accessories', image: campaignImage },
    ],
  },
  {
    id: 'l2-6',
    title: 'L2 — l2-6 (2×3 grid)',
    depth: 'L2',
    layout: 'l2-6',
    tiles: Array.from({ length: 6 }, (_, i) => ({
      label: `Tile ${i + 1}`,
      image: i % 2 === 0 ? bagsTan : bagsBlack,
    })),
  },
]

function ContentSpotBlock({ section }: { section: GallerySection }) {
  const isL2 = section.depth === 'L2'
  const ratioClass =
    section.tileAspectRatio === '4:5' ? ' v3-content-spots--tile-ratio-4-5' : ''
  const enterPreset = isL2 ? NAV_CONTENT_SPOTS_DRILL_ENTER : NAV_CONTENT_SPOTS_L1_ENTER
  const l2Class = isL2 ? ' v3-content-spots--l2-under-headline' : ''

  return (
    <section id={section.id} className="nav-gallery__section">
      <h2 className="nav-gallery__heading">{section.title}</h2>
      {section.notes && <p className="nav-gallery__note">{section.notes}</p>}
      <div className="nav-gallery__preview">
        <NavEnterGroup
          {...enterPreset}
          direction="idle"
          className={`v3-content-spots v3-content-spots--${section.layout}${ratioClass}${l2Class}`.trim()}
        >
          {section.tiles.map((tile, index) => (
            <GalleryTile
              key={`${tile.label}-${index}`}
              src={tile.image}
              hero={tile.hero ?? (section.layout === 'l1-3' && index === 0)}
              label={tile.label}
            />
          ))}
        </NavEnterGroup>
      </div>
    </section>
  )
}

/** Dev-only layout index — `?gallery=nav` */
export function NavTemplateGallery() {
  return (
    <div className="nav-gallery v1-prototype min-h-[100dvh] bg-coach-white px-coach-m pb-coach-xl pt-coach-m font-extended text-coach-black">
      <header className="nav-gallery__header mb-coach-l">
        <h1 className="text-[24px] leading-[1.2] tracking-[0.4px]">Nav V3 — Content Spot Gallery</h1>
        <p className="mt-coach-xs text-[14px] leading-[1.35] text-coach-grey-60">
          Handoff reference for all L1/L2 image layouts. See{' '}
          <code className="text-coach-black">docs/NAV_V3_HANDOFF.md</code>.
        </p>
        <a
          href="/"
          className="mt-coach-s inline-block text-[14px] underline"
        >
          ← Back to prototype
        </a>
      </header>

      <nav className="nav-gallery__toc mb-coach-l flex flex-wrap gap-coach-xs">
        {GALLERY_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded border border-coach-grey-20 px-coach-xs py-1 text-[12px]"
          >
            {s.id}
          </a>
        ))}
      </nav>

      <div className="nav-gallery__grid flex flex-col gap-coach-xl">
        {GALLERY_SECTIONS.map((section) => (
          <ContentSpotBlock key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}
