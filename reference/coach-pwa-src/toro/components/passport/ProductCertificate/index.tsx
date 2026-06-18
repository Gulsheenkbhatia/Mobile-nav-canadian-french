import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Button from 'toro/components/Button'
import Link from 'toro/components/Link'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useRouter } from 'next/router'
import usePreference from 'toro/hooks/usePreference_new'
import { formatLabel } from 'toro/helpers/formatLabel'
import useViewportType from 'toro/hooks/useViewportType'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { FormErrorOutlineIcon as ErrorIcon, SelectedIcon } from 'toro/icons'
import useAnalytics from 'toro/analytics/useAnalytics'
import type { NormalizedMedia } from 'toro/types/productTypes/normalizers'

interface ProductCertificateProps {
  refId?: string
  name?: string
  media?: NormalizedMedia
  isProductSold?: boolean
  isSignedIn?: boolean
  isProductConnected?: boolean
  passportMembershipId?: string
  userMemberShipId?: string
}

const ProductCertificate = ({
  refId,
  name,
  media,
  isProductSold,
  isSignedIn,
  isProductConnected,
  passportMembershipId,
  userMemberShipId,
}: ProductCertificateProps) => {
  const { formatMessage } = useIntl()
  const { viewport } = useViewportType()

  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('PassportProductCertificate')

  const productImage = media?.thumbnails?.[0] || media?.full?.[0]
  const displayedImageSrc = getProductImageSrc(productImage?.src, viewport || 'desktop', undefined)
  const router = useRouter()
  const queryObj = {
    skuId: router?.query?.skuid,
    refId: router?.query?.refid,
  }

  const {
    coachtopia: { productConnectURL: redirectUrlPref = {}, poshmarkConfigs },
  } = usePreference({ coachtopia: ['productConnectURL', 'poshmarkConfigs'] })

  const productConnectUrl = formatLabel(redirectUrlPref?.productConnect, queryObj)
  const myProductUrl = formatLabel(redirectUrlPref?.myProduct, queryObj)
  const isEnableResellCTA = poshmarkConfigs?.enable
  const resellProductUrl = poshmarkConfigs?.url?.replace('{reference_id}', refId)

  const isConnectedToCurrentUser =
    isSignedIn &&
    isProductConnected &&
    userMemberShipId &&
    userMemberShipId === passportMembershipId

  const showSignInCTA = useMemo(() => {
    if (isSignedIn && isProductSold) {
      return isProductConnected ? isConnectedToCurrentUser : true
    }
    return isProductSold
  }, [isConnectedToCurrentUser, isSignedIn, isProductConnected, isProductSold])

  const ctaMessage = useMemo(() => {
    if (!isProductConnected && !isSignedIn)
      return formatMessage({
        id: 'home.passport.addToMyCollection',
        defaultMessage: 'Add to my collection',
      })
    if (isProductConnected && !isSignedIn)
      return formatMessage({
        id: 'home.passport.viewInMyCollection',
        defaultMessage: 'View in my collection',
      })
    if (!isProductConnected && isSignedIn)
      return formatMessage({
        id: 'home.passport.addToMyCollection',
        defaultMessage: 'Add to my collection',
      })
    if (isConnectedToCurrentUser)
      return formatMessage({
        id: 'home.passport.viewInMyCollection',
        defaultMessage: 'View in my collection',
      })
    return ''
  }, [isSignedIn, isProductConnected, isConnectedToCurrentUser, formatMessage])

  const handleClick = () => {
    analytics.send('coachtopiaInteraction', {
      eventLocation: 'product passport',
      eventPageLocation: 'coachtopia passport',
      eventAction: 'product passport click',
      eventLabel: ctaMessage,
    })
    router.push(`/${isProductConnected ? myProductUrl : productConnectUrl}`)
  }

  return (
    <Box sx={styles.rootWrapper}>
      <Box sx={styles.productCard}>
        {isProductSold && (
          <Box sx={styles.connectionStatusWrapper}>
            {isProductConnected ? (
              <SelectedIcon width="16" height="16" />
            ) : (
              <Box sx={styles.productCardNotConnectedIcon}>
                <ErrorIcon width="16" height="16" />
              </Box>
            )}
            <Text sx={styles.connectionStatus}>
              {isProductConnected
                ? formatMessage({ id: 'home.passport.connected', defaultMessage: 'Connected' })
                : formatMessage({
                    id: 'home.passport.notConnected',
                    defaultMessage: 'Not connected',
                  })}
            </Text>
          </Box>
        )}
        <Text sx={styles.certificateTitle}>
          {formatMessage({
            id: 'home.passport.productCertificateTitle',
            defaultMessage: 'Product Certificate',
          })}
        </Text>
        {refId && (
          <Box sx={styles.digitalIdBadge}>
            <Text sx={styles.digitalIdText}>
              {formatMessage({ id: 'home.passport.digitalIdLabel', defaultMessage: 'Digital ID:' })}{' '}
              {refId}
            </Text>
          </Box>
        )}
        <Box sx={styles.productContainer}>
          <Image alt={productImage?.alt} src={displayedImageSrc} sx={styles.productImageCentered} />
          <Box sx={styles.productDetailsContainer}>
            <Text sx={styles.productName}>{name}</Text>
            {showSignInCTA && (
              <Button sx={styles.button} onClick={handleClick} size="lg">
                {ctaMessage}
              </Button>
            )}
            {isEnableResellCTA && isConnectedToCurrentUser && (
              <Link href={resellProductUrl} target="_blank">
                <Button sx={{ ...styles.button, ...styles.connectButtonPoshmark }} size="lg">
                  {formatMessage({
                    id: 'headless_config_pdp.poshMarkResellCTAText',
                    defaultMessage: 'Resell with poshmark',
                  })}
                </Button>
              </Link>
            )}
            {showSignInCTA && !isProductConnected && (
              <Text sx={styles.circularServicesSubcopy}>
                {formatMessage({
                  id: 'home.passport.circularServicesSubcopy',
                  defaultMessage:
                    'and access our post-purchase services, like instant resale, and more!',
                })}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductCertificate
