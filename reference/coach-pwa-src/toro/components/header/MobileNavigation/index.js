import { useCallback, useMemo, useContext, Fragment } from 'react'
import get from 'lodash/get'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Accordion from 'toro/components/Accordion'
import MobileNavigationItem from 'toro/components/header/MobileNavigationItem'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import menuDataAtom, {
  activeMobileMenuItemsAtom,
  setActiveMobileMenuItemAtom,
} from 'store/menu-data.atom'
import PWAContext from 'components/common/PWAContext'
import { getCategoriesByCgIds } from 'toro/helpers/menu'
import ShopAssistNavMenuBanner from 'toro/components/header/ShopAssistNavMenuBanner'
import ShopAssistNavT2Banner from 'toro/components/header/ShopAssistNavMenuBanner/ShopAssistNavT2Banner'

function getIsImagesVisible(categoryData) {
  return get(categoryData, 'showMobileTier3Image', false)
}

export const NAVIGATION_VARIANTS = {
  TIER_1: 'tier1',
  TIER_2: 'tier2',
  TIER_3: 'tier3',
}

function getDataQa(data, tierNum) {
  if (tierNum === 1) {
    return `l1_nav_${data?.cgid}`
  }
  if (tierNum === 2) {
    return `l2_nav_${data?.parentCategoryId}_${data?.cgid}`
  }
  return `l3_nav_${data.parentCategoryTree[0]?.cgid}_${data?.parentCategoryId}_${data?.cgid}`
}

const MobileNavigation = ({ onNavigation }) => {
  const {
    aiGiftConcierge: {
      aiGiftConciergeData: { T1EntryPointsCategory = '', isGiftConciergeEnabled = false } = {},
    } = {},
  } = usePreference({ aiGiftConcierge: ['aiGiftConciergeData'] })
  const menuData = useAtomValue(menuDataAtom)
  const activeMenuItems = useAtomValue(activeMobileMenuItemsAtom)
  const setActiveMenuItem = useUpdateAtom(setActiveMobileMenuItemAtom)
  const { appData } = useContext(PWAContext)
  const modalTitle = get(appData, 'thredUpModalContent.contentSlots.hElem', '<>')

  const t1Categories = useMemo(
    () => getCategoriesByCgIds(menuData, menuData?.topCategories),
    [menuData]
  )

  const getSubCategories = useCallback(
    (cgid) => {
      const subCategoriesCgIds = get(menuData, `[${cgid}].subCategories`)
      return getCategoriesByCgIds(menuData, subCategoriesCgIds)
    },
    [menuData]
  )

  const { AccordionIcon, AccordionIconExpanded } = useMultiStyleConfig('Icons')
  const { styles, variants } = useMultiStyleConfig('MobileNavigationItem')

  const { navFlyoutStylings } = usePreference({ navFlyoutStylings: '*' })
  const { enableNavCategoryCallout, navCalloutInfoColor } = navFlyoutStylings || {}

  const callOutData = useMemo(
    () => (enableNavCategoryCallout ? [navCalloutInfoColor] : []),
    [enableNavCategoryCallout, navCalloutInfoColor]
  )

  const onAccordionChange = (idx) => {
    setActiveMenuItem({ tn: 1, cgid: idx > -1 ? t1Categories[idx].cgid : null })
  }

  const t1EntryPointBannerIndex =
    T1EntryPointsCategory === 'end'
      ? t1Categories.length - 1
      : t1Categories.findIndex(({ cgid }) => cgid === T1EntryPointsCategory)

  const renderItem = useCallback(
    (data, tierNum, isImageExist, showBanner = false) => {
      const isImageVisible = tierNum > 1 && getIsImagesVisible(data)

      return (
        <Fragment key={data.cgid}>
          <MobileNavigationItem
            tierNum={tierNum}
            prefetch={tierNum < 3}
            data={data}
            baseStyles={styles}
            key={data.cgid}
            callOutData={callOutData}
            onNavigation={onNavigation}
            AccordionIcon={AccordionIcon}
            data-qa={getDataQa(data, tierNum)}
            getSubCategories={getSubCategories}
            AccordionIconExpanded={AccordionIconExpanded}
            isImageVisible={isImageVisible}
            isImageExistAtCurrentLvl={isImageExist}
            variantStyles={variants[NAVIGATION_VARIANTS[`TIER_${tierNum}`]]}
            renderItem={renderItem}
            defaultActiveT2Cgid={activeMenuItems.t2}
            modalTitle={modalTitle}
          />
          {showBanner && <ShopAssistNavT2Banner />}
        </Fragment>
      )
    },
    [
      styles,
      onNavigation,
      AccordionIcon,
      AccordionIconExpanded,
      getSubCategories,
      variants,
      modalTitle,
    ]
  )

  return (
    <Accordion
      w="100%"
      my="l"
      allowToggle
      defaultIndex={t1Categories.findIndex((data) => data.cgid === activeMenuItems.t1)}
      onChange={onAccordionChange}
    >
      {t1Categories.map((data, index) =>
        isGiftConciergeEnabled &&
        t1EntryPointBannerIndex > -1 &&
        index === t1EntryPointBannerIndex ? (
          <Fragment key={data.cgid}>
            {renderItem(data, 1, false)}
            <ShopAssistNavMenuBanner />
          </Fragment>
        ) : (
          renderItem(data, 1, false)
        )
      )}
    </Accordion>
  )
}

export default withErrorBoundaryWrapper(MobileNavigation)
