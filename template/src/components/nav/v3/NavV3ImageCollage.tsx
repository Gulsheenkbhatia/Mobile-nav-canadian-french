import { useEffect, useState, useRef, useCallback, type CSSProperties } from 'react'
import { InvokedMenuShell } from '../invoked/InvokedMenuShell'
import { DrillOverlay } from '../drill/DrillOverlay'
import { useDrillBack } from '../drill/useDrillBack'
import type { DrillStackEntry } from '../navDrillMotion'
import { NAV_DRAWER_CONTENT_DELAY_MS } from '../navDrillMotion'
import { SearchIcon16 } from '../HeaderIcons'
import {
  resolveV3CategoryDetail,
  resolveV3SubCategory,
} from '../../../data/v3CategoryFixtures'
import { DrillLinkSections } from '../drill/DrillLinkSections'
import { DrillSubCategorySections } from '../drill/DrillSubCategorySections'
import { resolveNavDrillL2Body } from '../../../data/navDrillSections'
import { getV3L1Categories } from '../../../data/v3L1Categories'
import type { MenuCategory, MenuCategoryDetail, MenuSubCategory } from '../../../data/mobileMenuData'
import {
  getV3L2ContentSpots,
  getV3L1ContentSpots,
  getL1ContentSpotsAnchorCategoryId,
  isL1ContentSpotsInline,
  type V3L1ContentSpotsConfig,
  type V3L2ContentSpotsLayout,
  type V3L2ContentSpotAspectRatio,
} from '../../../data/v3ContentSpots'
import type { BrandId } from '../NavSearchExposed'
import {
  NavEnterGroup,
  NAV_CONTENT_SPOTS_L1_ENTER,
  NAV_CONTENT_SPOTS_DRILL_ENTER,
  NAV_LINK_ENTER_L1,
  NAV_LINK_ENTER_L1_DELAY,
  type NavAnimDirection,
} from './NavEnter'
import { CoachIconMask } from '../../CoachIconMask'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../CoachLogos'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import { formatDrillTitle } from '../../../utils/navDrillTitle'
import { shouldShowNavLinkChevron } from '../../../utils/navLinkChevron'

const FOOTER_LINKS = ['Track Order', 'Help', '$USD', 'Login'] as const

const CHEVRON_RIGHT = '/assets/icons/chevron-right.svg'

function animMountKey(direction: NavAnimDirection, enterKey: number): string {
  return `${direction}-${enterKey}`
}

const campaignImage = '/assets/figma/v3-campaign.png'

type NavV3ImageCollageProps = {
  open: boolean
  onClose: () => void
}

function ArrowBack() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden>
      <path
        d="M20 12H4m0 0 6.5-6.5M4 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ContentSpotTile({
  src = campaignImage,
  hero = false,
  label = 'Copy Goes Here',
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
        <span className="v3-content-spots__label-text">
          {toNavHeadlineCase(label)}
        </span>
      </div>
    </a>
  )
}

function L1ContentSpots({
  config,
  animDirection,
  enterKey,
}: {
  config: V3L1ContentSpotsConfig
  animDirection: NavAnimDirection
  enterKey: number
}) {
  const { layout, tiles } = config

  return (
    <NavEnterGroup
      key={animMountKey(animDirection, enterKey)}
      {...NAV_CONTENT_SPOTS_L1_ENTER}
      direction={animDirection}
      className={`v3-content-spots v3-content-spots--${layout}`}
    >
      {tiles.map((tile, index) => (
        <ContentSpotTile
          key={`${tile.label}-${index}`}
          src={tile.image}
          hero={layout === 'l1-3' && index === 0}
          label={tile.label}
        />
      ))}
    </NavEnterGroup>
  )
}

function L1CategoryRow({
  cat,
  onSelect,
  className,
  style,
}: {
  cat: MenuCategory
  onSelect: (id: string, title: string) => void
  className?: string
  style?: CSSProperties
}) {
  return (
    <li className={className} style={style} data-l1-category={cat.id}>
      <button
        type="button"
        onClick={() => onSelect(cat.id, cat.label)}
        className="v1-nav-link v3-l1__category-link flex w-full min-h-[28px] items-center justify-between text-left"
      >
        {isCoachtopiaCategory(cat.id) ? (
          <CoachtopiaLogo height={20} />
        ) : (
          <span className="min-w-0 flex-1 truncate font-extended text-[20px] leading-[1.2] tracking-[0.4px] text-coach-black">
            {toNavHeadlineCase(cat.label)}
          </span>
        )}
        {shouldShowNavLinkChevron(cat.label, cat.id) && (
          <CoachIconMask src={CHEVRON_RIGHT} size={16} />
        )}
      </button>
    </li>
  )
}

function L1Screen({
  menuBrand,
  onSelect,
  enterKey,
  listsMounted,
  staggerEnter,
}: {
  menuBrand: BrandId
  onSelect: (id: string, title: string) => void
  enterKey: number
  /** Keep L1 lists in the DOM while L2 covers them — avoids empty flash on drill back. */
  listsMounted: boolean
  /** True only for the initial L1 stagger — not when returning from L2. */
  staggerEnter: boolean
}) {
  const categories = getV3L1Categories(menuBrand)
  const l1ContentSpots = getV3L1ContentSpots(menuBrand)
  const inlineAfterCategoryId = getL1ContentSpotsAnchorCategoryId(l1ContentSpots.placement)
  const showAboveCategories = !isL1ContentSpotsInline(l1ContentSpots.placement)
  const categoryRowCount = categories.length + (inlineAfterCategoryId ? 1 : 0)
  const utilityDelay =
    NAV_LINK_ENTER_L1_DELAY + categoryRowCount * NAV_LINK_ENTER_L1.stagger
  const contentSpotsAnimDirection: NavAnimDirection = staggerEnter ? 'enter' : 'idle'
  const listMountKey = `l1-${enterKey}`

  return (
    <div className="v3-l1">
      <div className="invoked-menu__search-wrap">
        <label className="invoked-menu__search">
          <span className="invoked-menu__search-icon">
            <SearchIcon16 />
          </span>
          <input
            type="search"
            className="invoked-menu__search-input"
            placeholder="Search"
            aria-label="Search"
            readOnly
          />
        </label>
      </div>

      {showAboveCategories && (
        <div className="v3-l1__content-spots-wrap">
          <L1ContentSpots
            config={l1ContentSpots}
            animDirection={contentSpotsAnimDirection}
            enterKey={enterKey}
          />
        </div>
      )}

      <div className="v3-l1__categories">
        {listsMounted && (
          <NavEnterGroup
            key={`${listMountKey}-categories`}
            as="ul"
            list
            delay={NAV_LINK_ENTER_L1_DELAY}
            {...NAV_LINK_ENTER_L1}
            direction={staggerEnter ? 'enter' : 'idle'}
            className="v3-l1__category-list"
          >
            {categories.flatMap((cat) => {
              const row = (
                <L1CategoryRow key={cat.id} cat={cat} onSelect={onSelect} />
              )

              if (inlineAfterCategoryId && cat.id === inlineAfterCategoryId) {
                return [
                  row,
                  <li
                    key={`${listMountKey}-content-spots`}
                    className="v3-l1__content-spots-list-item"
                  >
                    <L1ContentSpots
                      config={l1ContentSpots}
                      animDirection={contentSpotsAnimDirection}
                      enterKey={enterKey}
                    />
                  </li>,
                ]
              }

              return [row]
            })}
          </NavEnterGroup>
        )}

        {listsMounted && (
          <nav className="v3-l1__utility-section" aria-label="Account and support">
            <NavEnterGroup
              key={`${listMountKey}-utility`}
              as="ul"
              list
              delay={utilityDelay}
              {...NAV_LINK_ENTER_L1}
              direction={staggerEnter ? 'enter' : 'idle'}
              className="v3-l1__utility-list"
            >
              {FOOTER_LINKS.map((label) => (
                <li key={`utility-${label}`}>
                  <button
                    type="button"
                    className="v1-utility-link flex items-center"
                  >
                    {toNavHeadlineCase(label)}
                  </button>
                </li>
              ))}
            </NavEnterGroup>
          </nav>
        )}
      </div>
    </div>
  )
}

function L2ContentSpots({
  layout,
  tiles,
  tileAspectRatio = '16:9',
  animDirection,
  enterKey,
}: {
  layout: V3L2ContentSpotsLayout
  tiles: { label: string; image?: string }[]
  tileAspectRatio?: V3L2ContentSpotAspectRatio
  animDirection: NavAnimDirection
  enterKey: number
}) {
  const ratioClass =
    tileAspectRatio === '4:5' ? ' v3-content-spots--tile-ratio-4-5' : ''

  return (
    <NavEnterGroup
      key={animMountKey(animDirection, enterKey)}
      {...NAV_CONTENT_SPOTS_DRILL_ENTER}
      direction={animDirection}
      className={`v3-content-spots v3-content-spots--${layout} v3-content-spots--l2-under-headline${ratioClass}`.trim()}
    >
      {tiles.map((tile, i) => (
        <ContentSpotTile key={`${tile.label}-${i}`} src={tile.image} label={tile.label} />
      ))}
    </NavEnterGroup>
  )
}

function DrillHeader({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="v3-l2__header">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="v3-l2__header-back flex size-6 items-center justify-center text-coach-black"
      >
        <ArrowBack />
      </button>
      <h2
        className="v3-l2__header-title v1-nav-link font-extended text-[20px] leading-[1.2] tracking-[0.4px] text-coach-black"
        title={toNavHeadlineCase(title)}
      >
        {formatDrillTitle(title)}
      </h2>
    </div>
  )
}

function L2Screen({
  screenTitle,
  detail,
  onBack,
  onSelectSub,
  enterKey,
  animDirection,
}: {
  screenTitle: string
  detail: MenuCategoryDetail
  onBack: () => void
  onSelectSub: (subId: string, title: string) => void
  enterKey: number
  animDirection: NavAnimDirection
}) {
  const contentSpots = getV3L2ContentSpots(detail.id)
  const drillBody = resolveNavDrillL2Body(detail)
  const mountKey = animMountKey(animDirection, enterKey)
  const sectionsClassName = contentSpots
    ? 'v3-l2__sections v3-l2__sections--after-content-spots'
    : 'v3-l2__sections'

  return (
    <div className={`v3-l2${contentSpots ? ' v3-l2--with-content-spots' : ''}`.trim()}>
      <DrillHeader title={screenTitle} onBack={onBack} />

      {contentSpots && (
        <L2ContentSpots
          layout={contentSpots.layout}
          tiles={contentSpots.tiles}
          tileAspectRatio={contentSpots.tileAspectRatio}
          animDirection={animDirection}
          enterKey={enterKey}
        />
      )}

      {drillBody?.kind === 'sub-category-sections' && (
        <div className={contentSpots ? 'v3-l2__category-block' : undefined}>
          <DrillSubCategorySections
            sections={drillBody.sections}
            className={sectionsClassName}
            screenTitle={screenTitle}
            leadingEyebrow={contentSpots?.eyebrow}
            animDirection={animDirection}
            mountKey={mountKey}
            onSelectSub={onSelectSub}
          />
        </div>
      )}

      {drillBody?.kind === 'flat-sections' && (
        <DrillLinkSections
          sections={drillBody.sections}
          className={sectionsClassName}
          depth="l2"
          screenTitle={screenTitle}
          animDirection={animDirection}
          mountKey={mountKey}
        />
      )}
    </div>
  )
}

function L3Screen({
  screenTitle,
  sub,
  onBack,
  enterKey,
  animDirection,
}: {
  screenTitle: string
  sub: MenuSubCategory
  onBack: () => void
  enterKey: number
  animDirection: NavAnimDirection
}) {
  const mountKey = animMountKey(animDirection, enterKey)

  return (
    <div className="v3-l3">
      <DrillHeader title={screenTitle} onBack={onBack} />
      <DrillLinkSections
        sections={sub.sections}
        className="v3-l3__sections"
        depth="l3"
        screenTitle={screenTitle}
        animDirection={animDirection}
        mountKey={mountKey}
      />
    </div>
  )
}

function DrilldownBody({
  open,
  menuBrand,
  menuBodyRef,
}: {
  open: boolean
  menuBrand: BrandId
  menuBodyRef: React.RefObject<HTMLDivElement>
}) {
  const [stack, setStack] = useState<DrillStackEntry[]>([])
  const [l1AnimKey, setL1AnimKey] = useState(0)
  const [l1ShouldEnter, setL1ShouldEnter] = useState(false)
  const [l1ContentReady, setL1ContentReady] = useState(false)
  const [l2AnimKey, setL2AnimKey] = useState(0)
  const [l3AnimKey, setL3AnimKey] = useState(0)
  const [l2ShouldEnter, setL2ShouldEnter] = useState(false)
  const [l3ShouldEnter, setL3ShouldEnter] = useState(false)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const l1EnterTimerRef = useRef<number | null>(null)
  const prevMenuBrandRef = useRef(menuBrand)
  const [l1StaggerReady, setL1StaggerReady] = useState(false)
  const [exitStackHeight, setExitStackHeight] = useState<number | null>(null)
  const l1ScrollTopRef = useRef(0)

  const clearL1EnterTimer = useCallback(() => {
    if (l1EnterTimerRef.current !== null) {
      window.clearTimeout(l1EnterTimerRef.current)
      l1EnterTimerRef.current = null
    }
  }, [])

  /** Bump L1 mount key; defer stagger until drawer lands (or run immediately when already open). */
  const armL1Enter = useCallback(
    (contentDelayMs: number) => {
      clearL1EnterTimer()
      setL1ShouldEnter(true)
      setL1ContentReady(false)
      setL1StaggerReady(false)
      setL1AnimKey((key) => key + 1)

      if (contentDelayMs <= 0) {
        setL1ContentReady(true)
        return
      }

      l1EnterTimerRef.current = window.setTimeout(() => {
        setL1ContentReady(true)
        l1EnterTimerRef.current = null
      }, contentDelayMs)
    },
    [clearL1EnterTimer],
  )

  /** Two frames after drawer lands — mount link lists so CSS stagger always fires. */
  useEffect(() => {
    if (!open || !l1ContentReady) {
      setL1StaggerReady(false)
      return
    }

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setL1StaggerReady(true))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [open, l1ContentReady, l1AnimKey])

  useEffect(() => {
    if (open) {
      l1ScrollTopRef.current = 0
      armL1Enter(NAV_DRAWER_CONTENT_DELAY_MS)
      return () => clearL1EnterTimer()
    }

    clearL1EnterTimer()
    setL1ContentReady(false)
    setL1StaggerReady(false)
    setStack([])
    setExitingIndex(null)
    setL1ShouldEnter(false)
    setL2ShouldEnter(false)
    setL3ShouldEnter(false)
  }, [open, armL1Enter, clearL1EnterTimer])

  useEffect(() => {
    if (!open) {
      prevMenuBrandRef.current = menuBrand
      return
    }
    if (prevMenuBrandRef.current === menuBrand) return
    prevMenuBrandRef.current = menuBrand
    setStack([])
    setExitingIndex(null)
    setL2ShouldEnter(false)
    setL3ShouldEnter(false)
    armL1Enter(0)
  }, [menuBrand, open, armL1Enter])

  const popStack = useDrillBack({
    depth: stack.length,
    exitingIndex,
    setExitingIndex,
    setDepth: (update) => {
      setStack((current) => {
        const nextDepth = update(current.length)
        return current.slice(0, nextDepth)
      })
    },
    onComplete: () => {
      setL3ShouldEnter(false)
      setExitStackHeight(null)
    },
  })

  const handleBack = useCallback(() => {
    if (stackRef.current) {
      setExitStackHeight(stackRef.current.offsetHeight)
    }
    popStack()
  }, [popStack])

  useEffect(() => {
    if (exitingIndex === null) {
      setExitStackHeight(null)
    }
  }, [exitingIndex])

  /** Restore L1 scroll on drill back; scroll to top when entering a drill panel. */
  useEffect(() => {
    if (!open || exitingIndex !== null) return
    const body = menuBodyRef.current
    if (!body) return

    if (stack.length === 0) {
      body.scrollTo(0, l1ScrollTopRef.current)
    } else {
      body.scrollTo(0, 0)
    }
  }, [stack.length, exitingIndex, open, menuBodyRef])

  const pushCategory = (categoryId: string, title: string) => {
    if (menuBodyRef.current) {
      l1ScrollTopRef.current = menuBodyRef.current.scrollTop
    }
    setL1ShouldEnter(false)
    setL2ShouldEnter(true)
    setL3ShouldEnter(false)
    setStack([{ id: categoryId, title }])
    setL2AnimKey((key) => key + 1)
  }

  const pushSubCategory = (subId: string, title: string) => {
    setL2ShouldEnter(false)
    setL3ShouldEnter(true)
    setStack((current) => [...current, { id: subId, title }])
    setL3AnimKey((key) => key + 1)
  }

  const l2AnimDirection: NavAnimDirection =
    exitingIndex !== null && exitingIndex < 1 ? 'idle' : l2ShouldEnter ? 'enter' : 'idle'

  const l3AnimDirection: NavAnimDirection =
    exitingIndex === 1 ? 'idle' : l3ShouldEnter ? 'enter' : 'idle'

  const categoryEntry = stack[0]
  const categoryId = categoryEntry?.id
  const l2Title = categoryEntry?.title ?? ''
  const subEntry = stack[1]
  const subId = subEntry?.id
  const l3Title = subEntry?.title ?? ''
  const categoryDetail = categoryId
    ? resolveV3CategoryDetail(categoryId, menuBrand)
    : null
  const subCategory =
    categoryId && subId
      ? resolveV3SubCategory(categoryId, subId, menuBrand)
      : undefined

  const l1ListsMounted = open && exitingIndex !== 1
  const l1StaggerEnter = l1ListsMounted && l1ShouldEnter && exitingIndex === null

  return (
    <div
      ref={stackRef}
      className="invoked-menu__stack"
      style={exitStackHeight ? { minHeight: exitStackHeight } : undefined}
    >
      <div
        className={`invoked-menu__base${stack.length > 0 && exitingIndex !== 0 ? ' invoked-menu__base--covered' : ''}${l1StaggerReady ? ' invoked-menu__base--l1-ready' : ''}`.trim()}
        aria-hidden={stack.length > 0 && exitingIndex !== 0}
      >
        <L1Screen
          key={l1AnimKey}
          menuBrand={menuBrand}
          onSelect={pushCategory}
          enterKey={l1AnimKey}
          listsMounted={l1ListsMounted}
          staggerEnter={l1StaggerEnter}
        />
      </div>

      {stack.length >= 1 && categoryDetail && (
        <DrillOverlay
          isTop={stack.length === 1 && exitingIndex === null}
          isExiting={exitingIndex === 0}
          isRevealed={exitingIndex === 1}
          contentKey={l2AnimKey}
        >
          <L2Screen
            screenTitle={l2Title}
            detail={categoryDetail}
            onBack={handleBack}
            onSelectSub={pushSubCategory}
            enterKey={l2AnimKey}
            animDirection={l2AnimDirection}
          />
        </DrillOverlay>
      )}

      {stack.length >= 2 && subCategory && (
        <DrillOverlay
          isTop={stack.length === 2 && exitingIndex === null}
          isExiting={exitingIndex === 1}
          isRevealed={false}
          contentKey={l3AnimKey}
        >
          <L3Screen
            screenTitle={l3Title}
            sub={subCategory}
            onBack={handleBack}
            enterKey={l3AnimKey}
            animDirection={l3AnimDirection}
          />
        </DrillOverlay>
      )}
    </div>
  )
}

/** MVP V3 — Nav + L1/L2 content spots (matches coach-nav.vercel.app V3). */
export function NavV3ImageCollage({ open, onClose }: NavV3ImageCollageProps) {
  return (
    <InvokedMenuShell open={open} onClose={onClose} aria-label="Shop navigation">
      {({ menuBrand, menuBodyRef }) => (
        <DrilldownBody open={open} menuBrand={menuBrand} menuBodyRef={menuBodyRef} />
      )}
    </InvokedMenuShell>
  )
}
