import React, { useEffect } from 'react'
import get from 'lodash/get'
import { API_NOTIFY_ME } from 'toro/constants/Urls'
import { ORDERING_ERROR } from 'toro/helpers/productVariations'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import notifyMeModalParser from 'toro/components/product/NotifyMeWidget/NotifyMePopUp/parser'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import FallbackErrorButton from 'toro/components/product/FallbackErrorButton'
import PropTypes from 'prop-types'
import useViewportType from 'toro/hooks/useViewportType'
import { BellIcon } from 'toro/components/product/NotifyMeWidget/NotifyMeButton/BellIcon'
import BellIconV5_1 from 'toro/icons/bell.svg'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import withCorrId from 'helpers/traceability'
import {
  notifyMeModalDataAtom,
  notifyMeChosenProductIdAtom,
  setIsNotifyMeModalVisibleAtom,
  notifyMeChosenProductNameAtom,
} from 'store/notifyme.atom'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import { getFormattedPriceFromVariant, getSelectedVariantGroup } from 'toro/helpers/prices'
import { useRouter } from 'next/router'

function NotifyMeButton(props) {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const { colors, lineHeights } = theme
  const analytics = useAnalytics()
  const router = useRouter()
  const { isMobile } = useViewportType()
  const isPDPTemplateV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const isPdpRedesignV5_1Enabled = useTemplate([TemplateName.pdpv5_1])
  const isTabbedAdaptivePDP = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const setNotifyMeModalData = useUpdateAtom(notifyMeModalDataAtom)
  const setIsNotifyMeModalVisible = useUpdateAtom(setIsNotifyMeModalVisibleAtom)
  const setNotifyMeChosenProductId = useUpdateAtom(notifyMeChosenProductIdAtom)
  const setNotifyMeChosenProductName = useUpdateAtom(notifyMeChosenProductNameAtom)
  const {
    productId,
    setOrderingError,
    setQuickViewedProduct,
    isQuickView,
    selectedColor,
    selectedVariant,
    isSticky,
    isFlyoutOpen,
    setFlyoutOpen,
    isBundleVariant,
    productName,
    variant,
    isPlp = false,
    isDesktop = false,
  } = props
  const styles = useMultiStyleConfig('NotifyMeButton', { variant, isBundleVariant })
  const fetchWithCorrId = withCorrId()
  const encodedProductId = encodeURI(productId)
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPv6Enabled = useTemplate([TemplateName.pdpv6])
  let buttonProps = {}
  async function fetchModal() {
    try {
      const res = await fetchWithCorrId(`${API_NOTIFY_ME}?productId=${encodedProductId}`, {
        method: 'GET',
      })
      return await res.text()
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  const handleClick = async () => {
    if (isBundleVariant) {
      setNotifyMeModalData('')
      setIsNotifyMeModalVisible(false)
    }
    const eventLocation = isPlp ? 'category' : 'product'

    analytics.send(`${isPlp ? 'listInteraction' : 'productInteraction'}`, {
      eventLocation,
      eventAction: 'notify me',
      eventLabel: productId,
    })

    analytics.send('storePickupModalInteraction', {
      event: 'modal_impression',
      eventAction: 'notify me click',
      modalTitle: 'notify me email',
      eventLocation,
    })

    if (!productId && !selectedVariant) {
      analytics.send('siteError', {
        eventAction: 'add to cart',
        eventLocation: 'product',
        eventLabel: 'select size and width',
      })
      setOrderingError(ORDERING_ERROR.notSelected)
      if (isSticky && !isFlyoutOpen) {
        setFlyoutOpen(true)
      }
      return
    }
    setNotifyMeChosenProductId(productId)
    setNotifyMeChosenProductName(productName)
    const notifyModal = await fetchModal()
    const modalDataObj = notifyMeModalParser(notifyModal)

    let productPrice = getFormattedPriceFromVariant(selectedVariant)
    if (!productPrice) {
      // Handle PLP v3 cases
      const selectedVG = getSelectedVariantGroup(selectedVariant)
      productPrice = getFormattedPriceFromVariant(selectedVG)
    }
    setNotifyMeModalData({
      ...modalDataObj,
      productId: productId,
      productName: productName,
      productColor: get(selectedColor, 'text', ''),
      productImageSrc: get(selectedColor, 'media.thumbnail.src', ''),
      productSize: get(selectedVariant, 'size', get(selectedVariant, 'variationValues.size', '')),
      productPrice: productPrice,
    })
    setIsNotifyMeModalVisible(true)
    isQuickView && setQuickViewedProduct(null)
  }

  useEffect(() => {
    const handler = () => {
      setIsNotifyMeModalVisible(false)
    }
    router.events.on('routeChangeStart', handler)
    return () => {
      router.events.off('routeChangeStart', handler)
    }
  }, [])

  if (isBundleVariant) {
    buttonProps = {
      variant: 'secondary',
      lineHeight: lineHeights.xs,
      color: colors.main.black,
      _hover: {
        backgroundColor: colors.main.black,
        color: colors.main.secondary,
      },
    }
  }
  if (isPlp) {
    buttonProps.variant = 'button'
  }

  return (
    <Box width="100%" sx={styles.notifyMeButtonWrapper}>
      <Button
        variant="primary"
        size="lg"
        w="100%"
        id="notify-me"
        onClick={handleClick}
        sx={styles.notifyMeButton}
        data-qa="notify_me_cta"
        {...buttonProps}
        className={`${isBundleVariant && isDesktop ? 'bundle-variant-notify-me' : ''} notify-me`}
      >
        {isTabbedAdaptivePDP || isPlp || isPDPV5Enabled || isPDPv6Enabled
          ? formatMessage({ id: 'pdp.product.adaptivePDPNotifyMe', defaultMessage: 'Notify Me' })
          : formatMessage({ id: 'pdp.product.notifyMe', defaultMessage: 'NOTIFY ME' })}
        {isPDPTemplateV3Mobile && !isPlp && <BellIcon className="notify-me-button-icon" />}
        {isPdpRedesignV5_1Enabled && <BellIconV5_1 className="notify-me-button-icon" />}
      </Button>
    </Box>
  )
}

NotifyMeButton.propTypes = {
  productId: PropTypes.string,
  setOrderingError: PropTypes.func,
  setQuickViewedProduct: PropTypes.func,
  isQuickView: PropTypes.bool,
  selectedVariant: PropTypes.object,
  isSticky: PropTypes.bool,
  isFlyoutOpen: PropTypes.bool,
  setFlyoutOpen: PropTypes.func,
  isBundleVariant: PropTypes.bool,
  productName: PropTypes.string,
}

NotifyMeButton.defaultProps = {
  setOrderingError: () => {},
  setQuickViewedProduct: () => {},
  setFlyoutOpen: () => {},
  isBundleVariant: false,
  productName: '',
}

export default withErrorBoundaryWrapper(NotifyMeButton, {
  fallback: <FallbackErrorButton />,
})
