import get from 'lodash/get'
import DEVICE_TYPES from 'toro/constants/DeviceTypes'
import Hidden from 'toro/components/Hidden'
import { memo } from 'react'
import { useRouter } from 'next/router'
import Box from 'toro/components/Box'
import ContentSlot from 'toro/cms/components/ContentSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const CustomSlot = ({
  content,
  Component,
  qaTag,
  ignoreHidden,
  isMobileMenu,
  isTangibleeVisible,
  ...props
}) => {
  const router = useRouter()
  const showOnDeviceType = get(content, 'config.device')
  const slotContent = get(content, 'content')
  const handleAnchorClick = (e) => {
    let targetLink = e.target.closest('a')
    if (!targetLink) {
      const bannerContainer = e.target.closest('.banner-container')
      targetLink = bannerContainer?.querySelector(':scope > a')
    }

    if (!targetLink) return

    const isCustomLink = targetLink.dataset.customLink === 'true'
    if (isCustomLink) return

    e.preventDefault()
    const anchorLink = targetLink.href
    if (!anchorLink) return
    const domain = new URL(anchorLink)
    const target = targetLink.target

    if (domain?.origin !== window?.location?.origin) {
      window.open(anchorLink, target || '_self')
      return
    }

    const path = anchorLink?.split(domain?.origin)[1]
    router.push(path)
  }

  if (ignoreHidden || !showOnDeviceType) {
    return (
      <Box onClick={handleAnchorClick} onKeyPress={handleAnchorClick}>
        <ContentSlot
          content={slotContent}
          Component={Component}
          qatag={qaTag}
          isMobileMenu={isMobileMenu}
          isTangibleeVisible={isTangibleeVisible}
          {...props}
        />
      </Box>
    )
  }

  return (
    <Hidden
      onNonDesktop={showOnDeviceType === DEVICE_TYPES.desktop}
      onDesktop={showOnDeviceType === DEVICE_TYPES.mobile}
      w="100%"
    >
      <Box onClick={handleAnchorClick} onKeyPress={handleAnchorClick}>
        <ContentSlot
          content={slotContent}
          Component={Component}
          isMobileMenu={isMobileMenu}
          isTangibleeVisible={isTangibleeVisible}
          {...props}
        />
      </Box>
    </Hidden>
  )
}

export default withErrorBoundaryWrapper(memo(CustomSlot))
