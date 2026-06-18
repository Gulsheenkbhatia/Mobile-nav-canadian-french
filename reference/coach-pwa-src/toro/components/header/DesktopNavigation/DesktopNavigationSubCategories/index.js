import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Flex from 'toro/components/Flex'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import MainContainer from 'toro/components/MainContainer'
import Link from 'toro/components/Link'
import NavigationFlyoutContent from 'toro/components/header/DesktopNavigation/NavigationFlyoutContent'
import CustomSlot from 'toro/cms/components/CustomSlot'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import { getSiteValueFromPref } from 'toro/helpers/preferences'

import DesktopNavigationItem from 'toro/components/header/DesktopNavigationItem'

const T2_CLASSNAME = 'desktop-menu-t2-container'
const T3_CLASSNAME = 'desktop-menu-t3-container'
const IMG_COL_CLASSNAME = 'desktop-menu-image-container'

function isCategoryImageVisible(category) {
  return get(category, 'showDesktopTier3Image', false)
}

function getCurrentFlyoutContent(activeCategories, overrideCategoryImage) {
  if (!activeCategories) {
    return {}
  }
  const showT3Image = get(activeCategories.tier2 || activeCategories.tier1, `showDesktopTier3Image`)
  const imageCategory =
    (showT3Image && isCategoryImageVisible(activeCategories.tier3) && activeCategories.tier3) ||
    (isCategoryImageVisible(activeCategories.tier2) && activeCategories.tier2) ||
    (isCategoryImageVisible(activeCategories.tier1) && activeCategories.tier1)

  const contentSlotCategory =
    activeCategories.tier3 || activeCategories.tier2 || activeCategories.tier1
  const imageSrc = overrideCategoryImage
    ? get(imageCategory, 'navFlyoutImage') || get(imageCategory, 'navImageUrl')
    : get(imageCategory, 'navImageUrl') || get(imageCategory, 'navFlyoutImage')
  const url = get(imageCategory, 'url')

  return {
    imageSrc,
    imageUrl: contentSlotCategory?.url || url,
    contentSlot: { content: contentSlotCategory?.flyoutContent },
    categoryId: contentSlotCategory?.id,
  }
}

function getMenuStylingCss(
  navFlyoutDesktopColAStyle,
  navFlyoutDesktopColBStyle,
  navFlyoutMobileContentAreaStyle
) {
  if (!navFlyoutDesktopColAStyle) {
    return
  }

  return `
    .sub-menu-wrapper { ${navFlyoutDesktopColAStyle} }
    .${T2_CLASSNAME} { ${navFlyoutDesktopColAStyle} }
    .${T3_CLASSNAME} { ${navFlyoutDesktopColBStyle} }
    .${IMG_COL_CLASSNAME} { ${navFlyoutMobileContentAreaStyle} }
  `
}

const DesktopNavigationSubCategories = ({
  activeT1Category,
  t2Categories,
  activeT2Category,
  t3Categories,
  activeT3Category,
  activeMenuItems,
  siteId,
  onNavigation,
  stopSelectT3Item,
  onT2MouseOver,
  onT3MouseOver,
  startCloseMenuCountdown,
  stopCloseMenuCountdown,
}) => {
  const styles = useMultiStyleConfig('DesktopNavigation')
  const isT3ColumnVisible = !!t3Categories?.length
  const navFlyoutStylings = usePreferenceGroup({ groupId: 'navFlyoutStylings' })
  const {
    navFlyoutDesktopColAStyle,
    navFlyoutDesktopColBStyle,
    navFlyoutMobileContentAreaStyle,
    enableNavCategoryCallout,
    navCalloutInfoColor,
    overrideCategoryImage,
  } = navFlyoutStylings.reduce((obj, pref) => {
    if (!pref.id) {
      return obj
    }
    return { ...obj, [pref.id]: getSiteValueFromPref(pref, siteId, false) }
  }, {})

  const { imageSrc, imageUrl, contentSlot, categoryId } = getCurrentFlyoutContent(
    { tier1: activeT1Category, tier2: activeT2Category, tier3: activeT3Category },
    overrideCategoryImage
  )

  const callOutData = useMemo(
    () => (enableNavCategoryCallout ? [navCalloutInfoColor] : []),
    [enableNavCategoryCallout, navCalloutInfoColor]
  )
  const menuStylingCss = getMenuStylingCss(
    navFlyoutDesktopColAStyle,
    navFlyoutDesktopColBStyle,
    navFlyoutMobileContentAreaStyle
  )
  const t3Class = isT3ColumnVisible ? T3_CLASSNAME : null

  // adds scroll inside popup for small height screens
  const containerNode = useRef()
  const [containerTopPosition, setContainerTopPosition] = useState(0)
  useEffect(() => {
    const topPosition = get(containerNode.current.getClientRects(), '[0].y')
    setContainerTopPosition(topPosition)
  }, [])

  const activeCategory = activeT3Category || activeT2Category || activeT1Category
  const onMediaClick = useCallback(() => {
    const navigationItemData = {
      ...activeCategory,
      parentCategoryTree: activeCategory?.parentCategoryTree?.map((parent) => ({
        name: `${parent.name}${parent?.cgid === activeCategory?.cgid ? ' - image click' : ''}`,
      })),
    }
    onNavigation(navigationItemData)
  }, [onNavigation, activeCategory])

  return (
    <>
      {menuStylingCss && <style>{menuStylingCss}</style>}
      <Box w="100%" position="relative">
        <Box
          onMouseOver={stopCloseMenuCountdown}
          onMouseOut={startCloseMenuCountdown}
          __css={styles.popup(containerTopPosition)}
          ref={containerNode}
          className="sub-menu-wrapper"
        >
          <MainContainer>
            <Flex sx={styles.subMenuContainer}>
              <DesktopNavigationTier
                __css={styles.t2MenuContainer}
                className={`${T2_CLASSNAME} menu-tier-2`}
              >
                {t2Categories.map((data) => (
                  <DesktopNavigationItem
                    key={data.cgid}
                    data={data}
                    variant="tier2"
                    onMouseOver={onT2MouseOver}
                    isActive={activeMenuItems.t2 === data.cgid}
                    onNavigation={onNavigation}
                    callOutData={callOutData}
                  />
                ))}
              </DesktopNavigationTier>
              <DesktopNavigationTier
                flexBasis="0"
                flexGrow="1"
                __css={styles.t3MenuContainer(isT3ColumnVisible)}
                className={`${t3Class} menu-tier-3`}
              >
                {t3Categories.map((data) => (
                  <DesktopNavigationItem
                    key={data.cgid}
                    data={data}
                    variant="tier3"
                    onMouseOver={onT3MouseOver}
                    onMouseOut={stopSelectT3Item}
                    isActive={activeMenuItems.t3 === data.cgid}
                    onNavigation={onNavigation}
                    callOutData={callOutData}
                  />
                ))}
              </DesktopNavigationTier>
              <Box
                height="480px"
                maxWidth="600px"
                overflowY="hidden"
                position="relative"
                __css={{ ...styles.imageContainer, ...styles.imageContainerDimensions }}
                className={IMG_COL_CLASSNAME}
                sx={styles.desktopMenuImageContainer}
              >
                {contentSlot.content ? (
                  <Link href={contentSlot.content?.href} onClick={onMediaClick}>
                    <CustomSlot content={contentSlot} Component={NavigationFlyoutContent} />
                  </Link>
                ) : (
                  imageSrc && (
                    <Link href={imageUrl} onClick={onMediaClick}>
                      <Image
                        src={imageSrc}
                        data-qa={categoryId ? `overlay_img_nav_${categoryId}` : ''}
                        h={'458px'}
                        sx={styles.desktopMenuImage}
                      />
                    </Link>
                  )
                )}
              </Box>
            </Flex>
          </MainContainer>
          <Box
            position="absolute"
            right="0"
            bottom="0"
            top="0"
            width="50%"
            backgroundColor={get(styles.imageContainer, 'backgroundColor')}
            className={t3Class}
          />
        </Box>
      </Box>
    </>
  )
}

const DesktopNavigationTier = withErrorBoundaryWrapper(Box)

export default withErrorBoundaryWrapper(DesktopNavigationSubCategories)
