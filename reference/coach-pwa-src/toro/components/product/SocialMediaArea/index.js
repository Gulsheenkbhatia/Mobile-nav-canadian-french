import SocialMediaLinks from 'toro/components/product/SocialMediaArea/SocialMediaLinks'
import StylingAdvice from 'toro/components/product/SocialMediaArea/StylingAdvice'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import { memo } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'

function SocialMediaArea({ socialMedia, productData, tulipConfigData, isMobile }) {
  const productName = get(productData, 'name', '')
  const productId = get(productData, 'id')
  const brand = get(productData, 'brand')
  const thumbnail = get(productData, 'thumbnail.src')
  const markup = get(socialMedia, 'content.content')
  const onlineStatus = get(socialMedia, 'online', {})
  const isContentOnline = Object.values(onlineStatus)?.[0]

  const {
    socialMediaSharing: {
      isFacebookSharingEnabled = true,
      isTwitterSharingEnabled = true,
      isPinterestSharingEnabled = true,
      isEmailSharingEnabled = true,
      isLineShareEnabled = false,
    },
  } = usePreference({
    SocialMediaSharing: [
      'isFacebookSharingEnabled',
      'isTwitterSharingEnabled',
      'isPinterestSharingEnabled',
      'isEmailSharingEnabled',
      'isLineShareEnabled',
    ],
  })

  const showContentArea =
    isFacebookSharingEnabled ||
    isTwitterSharingEnabled ||
    isPinterestSharingEnabled ||
    isEmailSharingEnabled ||
    isLineShareEnabled

  const socialMediaLinksProps = {
    isFacebookSharingEnabled,
    isLineShareEnabled,
    isPinterestSharingEnabled,
    isTwitterSharingEnabled,
    isEmailSharingEnabled,
    productId,
    productName,
    brand,
    thumbnail,
  }
  const stylingAdviceProps = {
    productId,
    markup,
    isMobile,
    tulipConfigData,
  }

  return (
    <>
      {showContentArea && <SocialMediaLinks {...socialMediaLinksProps} />}
      {!!isContentOnline && <StylingAdvice {...stylingAdviceProps} />}
    </>
  )
}
SocialMediaArea.propTypes = {
  socialMedia: PropTypes.object,
  siteId: PropTypes.string,
  productData: PropTypes.object,
  tulipConfigData: PropTypes.object,
}
SocialMediaArea.defaultProps = {
  socialMedia: {},
  siteId: '',
  productData: {},
  tulipConfigData: {},
}
export default withErrorBoundaryWrapper(memo(SocialMediaArea))
