import { useEffect, useState } from 'react'
import type { BrandId } from '../NavSearchExposed'
import {
  getCategoryDetail,
  getDefaultCategoryId,
  getMenuTopCategories,
} from '../../../data/mobileMenuData'
import { getV1ContentSpots, v1UtilityLinks } from '../../../data/v1ContentSpots'
import {
  ContentSpotDuo,
  ContentSpotHero,
} from '../invoked/content-spots/ContentSpotParts'
import { MenuL1List, MenuL2Drilldown } from '../invoked/InvokedMenuParts'
import { DrillOverlay } from '../drill/DrillOverlay'
import { useDrillBack } from '../drill/useDrillBack'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'

type V1MenuBodyProps = {
  open: boolean
  menuBrand: BrandId
}

export function V1MenuBody({ open, menuBrand }: V1MenuBodyProps) {
  const [depth, setDepth] = useState(0)
  const [categoryId, setCategoryId] = useState(getDefaultCategoryId(menuBrand))
  const [l2ContentKey, setL2ContentKey] = useState(0)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!open) {
      setDepth(0)
      setExitingIndex(null)
      return
    }
    setDepth(0)
    setExitingIndex(null)
    setCategoryId(getDefaultCategoryId(menuBrand))
  }, [open, menuBrand])

  const topCategories = getMenuTopCategories(menuBrand).filter(
    (item) => item.id !== 'help',
  )
  const category = getCategoryDetail(categoryId, menuBrand)
  const spots = getV1ContentSpots(menuBrand)

  const openCategory = (id: string) => {
    setCategoryId(id)
    setDepth(1)
    setL2ContentKey((key) => key + 1)
  }

  const goBack = useDrillBack({
    depth,
    exitingIndex,
    setExitingIndex,
    setDepth,
  })

  return (
    <div className="invoked-menu__stack">
      <div
        className={`invoked-menu__base${depth > 0 && exitingIndex !== 0 ? ' invoked-menu__base--covered' : ''}`.trim()}
        aria-hidden={depth > 0 && exitingIndex !== 0}
      >
        <div className="invoked-menu__screen v1-menu__l1-screen">
          <div className="v1-menu__l1-scroll">
            <MenuL1List
              categories={topCategories}
              onSelect={openCategory}
              showChevron
            />

            <div className="v1-menu__spots">
              <ContentSpotHero block={spots.hero} />
              <ContentSpotDuo tiles={spots.duo} />
            </div>
          </div>

          <footer className="v1-menu__footer">
            <ul className="v1-menu__footer-links">
              {v1UtilityLinks.map((link) => (
                <li key={link.id}>
                  <button type="button" className="v1-utility-link">
                    {toNavHeadlineCase(link.label)}
                  </button>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </div>

      {depth >= 1 && (
        <DrillOverlay
          isTop={depth === 1 && exitingIndex === null}
          isExiting={exitingIndex === 0}
          isRevealed={false}
          contentKey={l2ContentKey}
        >
          <div className="invoked-menu__screen">
            <MenuL2Drilldown category={category} onBack={goBack} />
          </div>
        </DrillOverlay>
      )}
    </div>
  )
}
