import { useMemo, memo, useCallback } from 'react'
import get from 'lodash/get'
import Accordion from 'toro/components/Accordion'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionPanel from 'toro/components/AccordionPanel'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import { getProductImageSrc } from 'toro/helpers/productImages'
import getStyleObjectFromString from 'toro/helpers/getStyleObjectFromString'
import useTheme from 'toro/hooks/useTheme'
import useAnalytics from 'toro/analytics/useAnalytics'
import { setActiveMobileMenuItemAtom } from 'store/menu-data.atom'
import { useUpdateAtom } from 'jotai/utils'
import { isThreadUpModalVisibleAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'

function getIsImageExistAtCurrentLvl(categoryData) {
  return Boolean(
    categoryData.find(
      (item) => (item.navFlyoutImage || item.navImageUrl) && item.showMobileTier3Image
    )
  )
}

const MobileNavigationItem = ({
  data,
  baseStyles,
  variantStyles,
  callOutData,
  onNavigation,
  isImageVisible,
  isImageExistAtCurrentLvl,
  AccordionIcon,
  AccordionIconExpanded,
  prefetch,
  getSubCategories,
  'data-qa': dataQa,
  renderItem,
  tierNum,
  modalTitle,
  defaultActiveT2Cgid,
}) => {
  const {
    aiGiftConcierge: {
      aiGiftConciergeData: {
        T2EntryPointCategory = 'ks-gifts-view-all',
        isGiftConciergeEnabled = false,
      } = {},
    } = {},
  } = usePreference({ aiGiftConcierge: ['aiGiftConciergeData'] })
  const analytics = useAnalytics()
  const theme = useTheme()
  const setActiveMenuItem = useUpdateAtom(setActiveMobileMenuItemAtom)
  const setIsThreadUpModalVisible = useUpdateAtom(isThreadUpModalVisibleAtom)

  const {
    name,
    calloutinfo,
    navFlyoutCategoryStyle,
    thredUpFlag,
    url,
    cgid,
    isCoachtopiaSubCategory,
    isCoachtopiaRootCategory,
  } = data || {}

  const imageSrc = useMemo(() => {
    const imageUrl = get(data, 'navImageUrl') || get(data, 'navFlyoutImage')

    return getProductImageSrc(imageUrl, 'mobile', undefined, { isMenu: true })
  }, [data])

  const hasChildren = get(data, 'subCategories.length', 0) > 0

  const { textVariant, textSize, ...textStyles } = variantStyles.navigationItem
  const buttonContentSx = useMemo(() => {
    const parsedTextStyles = getStyleObjectFromString(navFlyoutCategoryStyle)

    return {
      ...baseStyles.navigationItem(imageSrc, isImageVisible),
      ...textStyles,
      ...parsedTextStyles,
    }
  }, [baseStyles, imageSrc, isImageVisible, textStyles, navFlyoutCategoryStyle])

  const accordionItemSx = useMemo(
    () => ({ ...baseStyles.accordionItemBox, ...baseStyles.accordionSVG }),
    [baseStyles]
  )

  const sendMenuItemToGA = () => {
    analytics.send('navClick', {
      eventLocation: 'header',
      text: get(data, 'name', ''),
      navigationItemData: data,
    })
  }

  const onMenuItemClick = (e, isExpanded) => {
    e?.stopPropagation()
    !isExpanded && sendMenuItemToGA()
  }

  const triggerModal = (e) => {
    e.preventDefault()

    analytics.send('navClick', {
      eventLocation: 'header',
      text: 'ThredUp shop',
    })

    analytics.send('modalImpression', {
      eventLocation: 'popup',
      eventAction: 'thredup modal open',
      modalTitle,
    })

    setIsThreadUpModalVisible(true)
  }

  const handleNavigation = useCallback(
    (e) => {
      onNavigation?.()
      sendMenuItemToGA(e)
    },
    [data, sendMenuItemToGA]
  )

  const renderChildren = useCallback(
    (cgid) => {
      const subCategoriesData = getSubCategories(cgid)
      const isImageExist = getIsImageExistAtCurrentLvl(subCategoriesData)
      return subCategoriesData.map((data) => {
        const shouldShowBanner = isGiftConciergeEnabled && T2EntryPointCategory === data.cgid
        return renderItem(data, tierNum + 1, isImageExist, shouldShowBanner)
      })
    },
    [getSubCategories, getIsImageExistAtCurrentLvl, renderItem, tierNum, T2EntryPointCategory]
  )

  const buttonContent = (
    <>
      {isImageVisible && imageSrc && (
        <Image
          alt={name}
          src={imageSrc}
          containerProps={baseStyles.imageContainer}
          sx={baseStyles.imageBox}
          lazy
        />
      )}

      {isImageExistAtCurrentLvl && !imageSrc && <Box w="40px" mr="m" />}

      <Text
        as="span"
        flexGrow="1"
        height="50px"
        display="flex"
        size={textSize}
        textAlign="left"
        data-qa={dataQa}
        alignItems="center"
        sx={buttonContentSx}
        variant={textVariant}
        mb={isImageVisible ? 'xs' : null}
        ml={isImageVisible && imageSrc ? theme.space.m : ''}
      >
        {name}
        {callOutData !== undefined && callOutData.length > 0 && (
          <Box as="span" sx={baseStyles.callOutDataBox(callOutData, calloutinfo)}>
            {calloutinfo || ''}
          </Box>
        )}
      </Text>
    </>
  )

  if (!hasChildren) {
    return (
      <Box
        style={accordionItemSx}
        data-iscoachtopiasubcategory={isCoachtopiaSubCategory}
        data-iscoachtopiarootcategory={isCoachtopiaRootCategory}
      >
        <MenuLink
          url={url}
          prefetch={prefetch}
          thredUpFlag={thredUpFlag}
          triggerModal={triggerModal}
          handleNavigation={handleNavigation}
        >
          {buttonContent}
        </MenuLink>
      </Box>
    )
  }

  const defaultIndex = data.subCategories?.findIndex((cgid) => cgid === defaultActiveT2Cgid)
  const onAccordionChange = (idx) =>
    setActiveMenuItem({
      tn: 2,
      cgid: idx > -1 ? data.subCategories[idx] : null,
    })
  return (
    <AccordionItem
      w="100%"
      sx={accordionItemSx}
      data-iscoachtopiasubcategory={isCoachtopiaSubCategory}
      data-iscoachtopiarootcategory={isCoachtopiaRootCategory}
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            display={'flex'}
            minHeight={'48px'}
            justifyContent="space-between"
            sx={baseStyles.accordionButtonBox}
            onClick={(e) => onMenuItemClick(e, isExpanded)}
          >
            {buttonContent}
            {isExpanded ? <AccordionIconExpanded /> : <AccordionIcon />}
          </AccordionButton>

          <AccordionPanel sx={baseStyles.accordionPanelBox}>
            <Accordion
              w="100%"
              allowToggle
              defaultIndex={defaultIndex}
              onChange={onAccordionChange}
            >
              {isExpanded ? renderChildren(cgid) : null}
            </Accordion>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

function MenuLink({ thredUpFlag, triggerModal, url, handleNavigation, prefetch, children }) {
  const menuLinkLayout = {
    display: 'flex',
    minHeight: '48px',
    alignItems: 'center',
  }

  if (thredUpFlag) {
    return (
      <Link href="/" onClick={triggerModal} sx={menuLinkLayout}>
        {children}
      </Link>
    )
  }

  return (
    <Link
      href={url}
      sx={menuLinkLayout}
      onClick={handleNavigation}
      prefetchUrl={getAPIURL(url)}
      prefetch={!!(prefetch && url?.includes('/shop/'))}
    >
      {children}
    </Link>
  )
}

export default memo(MobileNavigationItem)
