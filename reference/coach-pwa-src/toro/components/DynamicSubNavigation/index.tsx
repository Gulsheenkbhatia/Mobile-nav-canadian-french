import Flex from 'toro/components/Flex'
import ScrollableContent from 'toro/components/ScrollableContent'
import Link from 'toro/components/Link'
import Text from 'toro/components/Text'
import { FC, memo, useMemo } from 'react'
import Category from 'toro/types/categoryTypes'
import { useAtomValue } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import ImageCoachtopia from '@tapestry-inc/design-tokens/coachtopia/logo/primary-black.svg'
import { isOneCoachTabbedAtom, isSubBrandActiveAtom } from 'store/global.atom'
import useViewportType from 'toro/hooks/useViewportType'
import WindowShopInspirationToggle from 'toro/components/WindowShopInspirationToggle'
import { useRouter } from 'next/router'
import usePageType from 'toro/hooks/usePageType'
import get from 'lodash/get'
import menuDataAtom, {
  isOneCoachNAEnabledAtom,
  oneCoachSharedMenuDataAtom,
} from 'store/menu-data.atom'
import CoachtopiaLogoButton from 'toro/components/CoachtopiaLogoButton'
import { dynamicSubNavigationStylesAtom } from 'store/dynamic-sub-navigation-styles.atom'

export type SubNavCategory = Pick<
  Category,
  | 'cgid'
  | 'url'
  | 'name'
  | 'searchName'
  | 'parentCategoryTree'
  | 'isCoachtopiaSubCategory'
  | 'isCoachtopiaRootCategory'
  | 'bgColorForSubNavHP'
  | 'catNameColorForSubNavHP'
  | 'alternativeCategoryId'
  | 'parentCategoryId'
> & { dataQA: string }

type DynamicSubNavigationProps = {
  categories: SubNavCategory[]
  variant?: 'homeT1' | 'homeT2' | 'plpV3' | 'shopBy'
  activeCategoryId?: string
  applyDynamicStyles?: boolean
  dataQa?: string
  location?: 'home1' | 'home2' | 'plp'
}

const DynamicSubNavigation: FC<DynamicSubNavigationProps> = ({
  categories,
  variant,
  activeCategoryId,
  applyDynamicStyles = false,
  dataQa,
  location = undefined,
}) => {
  const router = useRouter()
  const { isHP } = usePageType()
  const isOutletHP = router.asPath === '/shop/outlet'
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)
  const menuData = useAtomValue(menuDataAtom)
  const sharedMenuData = useAtomValue(oneCoachSharedMenuDataAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)
  const dynamicStyles = useAtomValue(dynamicSubNavigationStylesAtom)
  const analytics = useAnalytics()
  const { isMobile } = useViewportType()
  const { asPath } = router

  const {
    coachtopia: { coachtopiaRootCategory },
    storefrontConfigs: { transparentHeader },
    adaptiveExperience: { windowShop },
  } = usePreference({
    'Storefront Configs': ['transparentHeader'],
    coachtopia: ['coachtopiaRootCategory'],
    adaptiveExperience: ['windowShop'],
  })

  const { enable: enableDynamicStyles, backgroundColor, ...textStyles } = dynamicStyles
  const isDynamicStylesApplicable = applyDynamicStyles && enableDynamicStyles

  const finalMenuData = isOneCoachNAEnabled && (isHP || isOutletHP) ? sharedMenuData : menuData
  const subNavItems = useMemo(() => {
    return categories.filter((category) => !!finalMenuData[category.cgid])
  }, [categories, finalMenuData])

  const { bgColorForSubNavHP = null } =
    activeCategoryId && location === 'home2' ? menuData[activeCategoryId] : {}

  const getContainerBackgroundColor = () => {
    if (isDynamicStylesApplicable) {
      return backgroundColor
    }
    if (location === 'plp') {
      return '#F0F0F0'
    }
    return bgColorForSubNavHP || 'var(--color-white-base)'
  }

  const containerBackgroundColor = getContainerBackgroundColor()

  const styles = useMultiStyleConfig('DynamicSubNavigation', {
    variant,
    containerBackgroundColor,
  })

  const onSubNavItemClick = (cgid, parentCategoryTree) => () => {
    const navigationItemData = { parentCategoryTree }
    analytics.send('navClick', {
      eventLocation: 'sub nav',
      navigationItemData,
    })
  }

  const getCategoryNameAdditionalStyles = (color) => ({
    color: color ? `${color} !important` : null,
    svg: {
      path: {
        fill: color ? `${color} !important` : null,
      },
    },
  })

  const windowShopEnable = get(windowShop, isSubBrandActive ? 'enableSubBrand' : 'enableBrand')
  const windowShopUrl = get(windowShop, isSubBrandActive ? 'subBrandUrl' : 'brandUrl')

  const shouldDisplayWindowShopToggle =
    !transparentHeader && windowShopEnable && (isHP || asPath.includes(windowShopUrl))

  return (
    <ScrollableContent
      sx={styles.scrollableWrapper}
      style={isMobile && isOneCoachTabbedHeaderActive ? { borderTop: 'none' } : null}
      fadeColor={containerBackgroundColor}
      hideLeftFadeInitially
      data-qa={dataQa}
      id="dynamicNav"
      variant={variant}
    >
      <Flex sx={styles.linksWrapper}>
        {shouldDisplayWindowShopToggle && (
          <Flex align="center">
            <WindowShopInspirationToggle
              windowShopUrl={windowShopUrl}
              enableTooltip={windowShop.enableTooltip}
            />
          </Flex>
        )}
        {isSubBrandActive && location === 'home2' && (
          <CoachtopiaLogoButton divider="vertical" variant="hp" />
        )}
        {subNavItems.map(
          ({
            name,
            searchName,
            cgid,
            url,
            dataQA,
            parentCategoryTree,
            isCoachtopiaSubCategory,
            isCoachtopiaRootCategory,
            catNameColorForSubNavHP,
          }) => (
            <Link
              href={url}
              sx={{ ...styles.link, ...getCategoryNameAdditionalStyles(catNameColorForSubNavHP) }}
              borderBottom={
                activeCategoryId === cgid ? '1px solid var(--border-color-black-base)' : null
              }
              key={cgid}
              onClick={onSubNavItemClick(cgid, parentCategoryTree)}
              data-iscoachtopiasubcategory={
                location !== 'home2' ? isCoachtopiaSubCategory : undefined
              }
              data-iscoachtopiarootcategory={
                location !== 'home2' ? isCoachtopiaRootCategory : undefined
              }
            >
              {cgid === coachtopiaRootCategory ? (
                <ImageCoachtopia />
              ) : (
                <Text
                  data-qa={dataQA}
                  sx={{ ...styles.categoryName, ...(isDynamicStylesApplicable ? textStyles : {}) }}
                >
                  {searchName || name}
                </Text>
              )}
            </Link>
          )
        )}
      </Flex>
    </ScrollableContent>
  )
}

export default memo(DynamicSubNavigation)
