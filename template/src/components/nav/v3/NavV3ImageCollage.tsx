import { useEffect, useState, useRef, useCallback } from 'react'
import { InvokedMenuShell } from '../invoked/InvokedMenuShell'
import { DrillOverlay } from '../drill/DrillOverlay'
import { useDrillBack } from '../drill/useDrillBack'
import type { DrillStackEntry } from '../navDrillMotion'
import { SearchIcon16 } from '../HeaderIcons'
import {
  resolveV3CategoryDetail,
  resolveV3SubCategory,
} from '../../../data/v3CategoryFixtures'
import {
  type MenuCategoryDetail,
  type MenuLinkSection,
  type MenuSubCategory,
} from '../../../data/mobileMenuData'
import { getV3L1Categories } from '../../../data/v3L1Categories'
import {
  getV3L2Collage,
  getV3L2LinkLabel,
  getV3L1CollageLabels,
} from '../../../data/v3L2Collage'
import {
  shouldShowSectionEyebrow,
  type NavEyebrowContext,
} from '../../../data/navEyebrowVisibility'
import type { BrandId } from '../NavSearchExposed'
import { NavEnterGroup, NavEnterItem, type NavAnimDirection } from './NavEnter'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../CoachLogos'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import { formatDrillTitle } from '../../../utils/navDrillTitle'
import { isViewAllNavLink, shouldShowNavLinkChevron, shouldDrillNavLink } from '../../../utils/navLinkChevron'
import { filterDuplicateNavLinks } from '../../../utils/navLinkDedup'

const FOOTER_LINKS = ['Track Order', 'Help', '$USD', 'Login'] as const

/** L1/L2 collage tiles — vercel V3 Fd variant (fade-up + stagger). */
const COLLAGE_ENTER = {
  delay: 0.2,
  stagger: 0.1,
  variant: 'fade-up' as const,
}

function animMountKey(direction: NavAnimDirection, enterKey: number): string {
  if (direction === 'idle') return 'idle'
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

function CollageImage({
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
      className={`v3-collage__tile ${hero ? 'v3-collage__tile--hero' : ''}`}
    >
      <img src={src} alt="" loading="lazy" />
      <div className="v3-collage__label">
        <span className="v3-collage__label-text">
          {toNavHeadlineCase(label)}
        </span>
      </div>
    </a>
  )
}

function ChevronRight() {
  return (
    <img
      src="/assets/figma/v2-ic-chevron.svg"
      alt=""
      aria-hidden
      className="ml-coach-m h-3 w-[6px] shrink-0"
    />
  )
}

function L1Collage({
  animDirection,
  enterKey,
  menuBrand,
}: {
  animDirection: NavAnimDirection
  enterKey: number
  menuBrand: BrandId
}) {
  const [heroLabel, tileLabel, tileLabel2] = getV3L1CollageLabels(menuBrand)

  return (
    <NavEnterGroup
      key={animMountKey(animDirection, enterKey)}
      {...COLLAGE_ENTER}
      direction={animDirection}
      className="v3-collage v3-collage--l1-stagger"
    >
      <CollageImage hero label={heroLabel} />
      <CollageImage label={tileLabel} />
      <CollageImage label={tileLabel2} />
    </NavEnterGroup>
  )
}

function L1Screen({
  menuBrand,
  onSelect,
  enterKey,
  animDirection,
}: {
  menuBrand: BrandId
  onSelect: (id: string, title: string) => void
  enterKey: number
  animDirection: NavAnimDirection
}) {
  const categories = getV3L1Categories(menuBrand)
  const mountKey = animMountKey(animDirection, enterKey)

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

      <div className="v3-l1__collage-wrap">
        <L1Collage
          animDirection={animDirection}
          enterKey={enterKey}
          menuBrand={menuBrand}
        />
      </div>

      <div className="v3-l1__categories">
        <NavEnterGroup
          key={mountKey}
          as="ul"
          list
          delay={0.15}
          stagger={0.05}
          variant="slide-in"
          direction={animDirection}
          className="v3-l1__category-list"
        >
          {categories.map((cat) => (
            <li key={cat.id}>
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
                {shouldShowNavLinkChevron(cat.label, cat.id) && <ChevronRight />}
              </button>
            </li>
          ))}
        </NavEnterGroup>

        <NavEnterItem
          key={`${mountKey}-utility`}
          delay={0.3}
          variant="slide-in"
          direction={animDirection}
        >
          <ul className="v3-l1__utility-list">
            {FOOTER_LINKS.map((label) => (
              <li key={label}>
                <button
                  type="button"
                  className="v1-utility-link flex items-center"
                >
                  {toNavHeadlineCase(label)}
                </button>
              </li>
            ))}
          </ul>
        </NavEnterItem>
      </div>
    </div>
  )
}

function L2CollageGrid({
  images,
  animDirection,
  enterKey,
}: {
  images: string[]
  animDirection: NavAnimDirection
  enterKey: number
}) {
  return (
    <NavEnterGroup
      key={animMountKey(animDirection, enterKey)}
      {...COLLAGE_ENTER}
      direction={animDirection}
      className="v3-collage v3-collage--grid v3-collage--l2-under-headline grid w-full grid-cols-2 gap-px"
    >
      {images.map((src, i) => (
        <CollageImage key={i} src={src} />
      ))}
    </NavEnterGroup>
  )
}

function LinkSections({
  sections,
  className = 'v3-l2__sections',
  depth,
  screenTitle,
  animDirection,
  enterKey,
}: {
  sections: MenuLinkSection[]
  className?: string
  depth: NavEyebrowContext['depth']
  screenTitle: string
  animDirection: NavAnimDirection
  enterKey: number
}) {
  const ctx: NavEyebrowContext = {
    depth,
    screenTitle,
    sectionCount: sections.length,
  }

  return (
    <div className={className}>
      {sections.map((section, sectionIndex) => {
        const sectionDelay = 0.4 + sectionIndex * 0.2
        const showEyebrow =
          shouldShowSectionEyebrow(section, ctx) && section.eyebrow
        const visibleLinks = filterDuplicateNavLinks(section.links, screenTitle)

        if (visibleLinks.length === 0) return null

        return (
          <div key={section.id} className="v3-l2__section">
            {showEyebrow && section.eyebrow && (
              <NavEnterItem
                key={animMountKey(animDirection, enterKey + sectionIndex)}
                delay={sectionDelay}
                variant="slide-in"
                direction={animDirection}
              >
                <p className="v3-l2__eyebrow">
                  {toNavHeadlineCase(section.eyebrow)}
                </p>
              </NavEnterItem>
            )}
            <NavEnterGroup
              key={animMountKey(animDirection, enterKey + sectionIndex + 100)}
              as="ul"
              list
              delay={sectionDelay + (showEyebrow ? 0.05 : 0)}
              stagger={0.05}
              variant="slide-in"
              direction={animDirection}
              className="v3-l2__links"
            >
              {visibleLinks.map((link) => {
                const showChevron =
                  depth !== 'l3' &&
                  shouldShowNavLinkChevron(link.label, link.id)

                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (link.href || isViewAllNavLink(link.label, link.id)) {
                          e.preventDefault()
                          return
                        }
                        e.preventDefault()
                      }}
                      className={`v1-nav-link text-left font-extended text-[20px] leading-[1.2] tracking-[0.4px] text-coach-black ${
                        showChevron
                          ? 'flex w-full items-center justify-between'
                          : 'block w-full'
                      }`.trim()}
                    >
                      <span>{toNavHeadlineCase(link.label)}</span>
                      {showChevron && <ChevronRight />}
                    </button>
                  </li>
                )
              })}
            </NavEnterGroup>
          </div>
        )
      })}
    </div>
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
  const subCategories = detail.subCategories
  const collage = getV3L2Collage(detail.id)
  const mountKey = animMountKey(animDirection, enterKey)

  return (
    <div className={`v3-l2${collage ? ' v3-l2--with-collage' : ''}`.trim()}>
      <DrillHeader title={screenTitle} onBack={onBack} />

      {collage && (
        <L2CollageGrid
          images={collage.images}
          animDirection={animDirection}
          enterKey={enterKey}
        />
      )}

      {subCategories ? (
        <div className={collage ? 'v3-l2__category-block' : undefined}>
          {collage?.eyebrow && (
            <NavEnterItem
              key={`${mountKey}-eyebrow`}
              delay={0.4}
              variant="slide-in"
              direction={animDirection}
            >
              <p className="v3-l2__eyebrow">
                {toNavHeadlineCase(collage.eyebrow)}
              </p>
            </NavEnterItem>
          )}
          <NavEnterGroup
            key={`${mountKey}-subs`}
            as="ul"
            list
            delay={collage ? 0.45 : 0.4}
            stagger={0.05}
            variant="slide-in"
            direction={animDirection}
            className={
              collage
                ? 'v3-l2__sub-list v3-l2__sub-list--after-eyebrow'
                : 'v3-l2__sub-list'
            }
          >
            {subCategories.map((sub) => {
              const rowLabel = getV3L2LinkLabel(sub.id, sub.label)

              return (
              <li key={sub.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (shouldDrillNavLink(sub.label, sub.id)) {
                      onSelectSub(sub.id, rowLabel)
                    }
                  }}
                  className="v1-nav-link flex w-full items-center justify-between text-left"
                >
                  <span className="font-extended text-[20px] leading-[1.2] tracking-[0.4px] text-coach-black">
                    {toNavHeadlineCase(rowLabel)}
                  </span>
                  {shouldShowNavLinkChevron(sub.label, sub.id) && (
                    <ChevronRight />
                  )}
                </button>
              </li>
              )
            })}
          </NavEnterGroup>
        </div>
      ) : (
        detail.sections && (
          <LinkSections
            sections={detail.sections}
            className={
              collage
                ? 'v3-l2__sections v3-l2__sections--after-collage'
                : 'v3-l2__sections'
            }
            depth="l2"
            screenTitle={screenTitle}
            animDirection={animDirection}
            enterKey={enterKey}
          />
        )
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
  return (
    <div className="v3-l3">
      <DrillHeader title={screenTitle} onBack={onBack} />
      <LinkSections
        sections={sub.sections}
        className="v3-l3__sections"
        depth="l3"
        screenTitle={screenTitle}
        animDirection={animDirection}
        enterKey={enterKey}
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
  const [l2AnimKey, setL2AnimKey] = useState(0)
  const [l3AnimKey, setL3AnimKey] = useState(0)
  const [l2ShouldEnter, setL2ShouldEnter] = useState(false)
  const [l3ShouldEnter, setL3ShouldEnter] = useState(false)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const [exitStackHeight, setExitStackHeight] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      setL1ShouldEnter(true)
      setL1AnimKey((key) => key + 1)
      return
    }
    setStack([])
    setExitingIndex(null)
    setL1ShouldEnter(false)
    setL2ShouldEnter(false)
    setL3ShouldEnter(false)
  }, [open])

  useEffect(() => {
    setStack([])
    setExitingIndex(null)
    setL1ShouldEnter(true)
    setL2ShouldEnter(false)
    setL3ShouldEnter(false)
    setL1AnimKey((key) => key + 1)
  }, [menuBrand])

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

  /** Drill panels are in-flow — reset menu scroll so headers aren't clipped after drill/back. */
  useEffect(() => {
    if (!open || exitingIndex !== null) return
    menuBodyRef.current?.scrollTo(0, 0)
  }, [stack, open, exitingIndex, menuBodyRef])

  const pushCategory = (categoryId: string, title: string) => {
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

  const l1AnimDirection: NavAnimDirection =
    l1ShouldEnter && exitingIndex === null ? 'enter' : 'idle'

  const l2AnimDirection: NavAnimDirection =
    exitingIndex !== null ? 'idle' : l2ShouldEnter ? 'enter' : 'idle'

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

  return (
    <div
      ref={stackRef}
      className="invoked-menu__stack"
      style={exitStackHeight ? { minHeight: exitStackHeight } : undefined}
    >
      <div
        className={`invoked-menu__base${stack.length > 0 && exitingIndex !== 0 ? ' invoked-menu__base--covered' : ''}`.trim()}
        aria-hidden={stack.length > 0 && exitingIndex !== 0}
      >
        <L1Screen
          key={l1AnimKey}
          menuBrand={menuBrand}
          onSelect={pushCategory}
          enterKey={l1AnimKey}
          animDirection={l1AnimDirection}
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

/** MVP V3 — Nav + image collage (matches coach-nav.vercel.app V3). */
export function NavV3ImageCollage({ open, onClose }: NavV3ImageCollageProps) {
  return (
    <InvokedMenuShell open={open} onClose={onClose} aria-label="Shop navigation">
      {({ menuBrand, menuBodyRef }) => (
        <DrilldownBody open={open} menuBrand={menuBrand} menuBodyRef={menuBodyRef} />
      )}
    </InvokedMenuShell>
  )
}
