import React, { useCallback, useContext, useMemo, memo } from 'react'
import get from 'lodash/get'
import useTheme from 'toro/hooks/useTheme'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import PWAContext from 'components/common/PWAContext'
import getStyleObjectFromString from 'toro/helpers/getStyleObjectFromString'
import { isThreadUpModalVisibleAtom } from 'store/global.atom'
import { useUpdateAtom } from 'jotai/utils'
import generateCategoryQaAttribute from 'toro/helpers/generateCategoryQaAttribute'
import usePreference from 'toro/hooks/usePreference_new'
import SubBrandLogo from 'sub-theme-tokens/logo/primary-black.svg'

const menuItemsLinkStyles = {
  whiteSpace: 'nowrap',
  '&:hover': {
    textDecoration: 'none',
  },
}

const tierTextProps = {
  tier1: {
    variant: 'body-primary',
    fontSize: 'xs',
    letterSpacing: 'xl',
    lineHeight: '1.15',
  },
  tier2: {
    variant: 'body-text-secondary',
    fontSize: 'lg',
    display: 'inline',
    lineHeight: '1.2',
  },
  tier3: {
    variant: 'body-text-secondary',
    fontSize: 'md',
    display: 'inline',
    lineHeight: '1.4',
  },
}

const DesktopNavigationItem = ({
  data = {},
  variant,
  isActive,
  onNavigation,
  callOutData,
  onMouseOver,
  ...props
}) => {
  const theme = useTheme()
  const styles = useMultiStyleConfig('DesktopNavigationItem', { variant })
  const analytics = useAnalytics()
  const textProps = tierTextProps[variant] || {}
  const {
    name,
    parentCategoryTree,
    cgid,
    calloutinfo,
    navFlyoutCategoryStyle,
    thredUpFlag,
    url,
    isCoachtopiaSubCategory,
    isCoachtopiaRootCategory,
  } = data
  const { appData } = useContext(PWAContext)
  const {
    toggleSiteFeatures: { showBundleOnPLP: showBundleSave },
    oneCoach: { oneCoachTabConfig = {} },
  } = usePreference({
    ToggleSiteFeatures: ['showBundleOnPLP'],
    oneCoach: ['oneCoachTabConfig'],
  })
  const parsedTextStyles = getStyleObjectFromString(navFlyoutCategoryStyle)
  const setIsThreadUpModalVisible = useUpdateAtom(isThreadUpModalVisibleAtom)
  const concatenatedTextStyles = {
    ...styles.text(theme, isActive),
    ...parsedTextStyles,
  }
  const thredUpModalTitle = get(appData, 'thredUpModalContent.contentSlots.hElem', '<>')

  const wrapperStyles = useMemo(
    () =>
      typeof styles.wrapper === 'function'
        ? styles.wrapper(theme)
        : {
            margin: `0 ${theme.space.l} ${theme.space.xl} ${theme.space.l}`,
          },
    [theme]
  )
  const callOutStyles = useMemo(
    () => styles.desktopNavigationItemBox(callOutData?.[0]),
    [callOutData]
  )

  const onNavigationClick = useCallback(() => {
    onNavigation(data)
  }, [data])

  const dataQa = generateCategoryQaAttribute(parentCategoryTree)
  if (!showBundleSave && name?.toLowerCase() === 'bundle and save') {
    return null
  }
  const triggerModal = (e) => {
    e.preventDefault()
    analytics.send('navClick', {
      eventLocation: 'header',
      text: name,
    })
    analytics.send('modalImpression', {
      eventLocation: 'popup',
      eventAction: 'thredup modal open',
      modalTitle: Array.isArray(thredUpModalTitle)
        ? thredUpModalTitle.join(' ')
        : `${thredUpModalTitle}`,
    })
    setIsThreadUpModalVisible(true)
  }

  const text = (
    <Text
      {...textProps}
      {...props}
      sx={concatenatedTextStyles}
      data-qa={dataQa}
      onMouseOver={() => onMouseOver(cgid)}
    >
      {cgid === 'coachtopia' &&
      appData?.isSubBrandEnabled &&
      oneCoachTabConfig?.enable === 'true' ? (
        <SubBrandLogo />
      ) : (
        name || ''
      )}
    </Text>
  )

  return (
    <Box
      __css={wrapperStyles}
      key={`${cgid}-${name}`}
      data-iscoachtopiasubcategory={isCoachtopiaSubCategory}
      data-iscoachtopiarootcategory={isCoachtopiaRootCategory}
    >
      {thredUpFlag ? (
        <Link title={name} href="/" sx={menuItemsLinkStyles} onClick={triggerModal}>
          {text}
        </Link>
      ) : (
        <Link
          title={name}
          href={url}
          sx={menuItemsLinkStyles}
          onClick={onNavigationClick}
          prefetch={url?.includes('/shop/')}
          prefetchUrl={getAPIURL(url)}
        >
          {text}
        </Link>
      )}
      {callOutData !== undefined && callOutData.length > 0 && (
        <Box whiteSpace="nowrap" _hover={{ textDecoration: 'none' }} as="span" sx={callOutStyles}>
          {calloutinfo || ''}
        </Box>
      )}
    </Box>
  )
}

export default memo(DesktopNavigationItem)
