import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'
import { MAX_REACHED_MSG } from 'toro/components/AddToBagDrawer'

const getEventLocation = (isBuyNow, isMegaPDPEligible, isStickyBarScrolled) => {
  if (isBuyNow) return 'buy now pdp cta'
  if (isStickyBarScrolled) {
    return isMegaPDPEligible ? 'mega pdp sticky' : 'pdp sticky'
  }
  return isMegaPDPEligible ? 'mega pdp' : 'pdp regular'
}

export const getAddToCartEvents = ({
  gaProductData,
  submittableVariantId,
  isBuyNow,
  isMegaPDPEligible,
  isStickyBarScrolled,
}) => {
  const eventLocation = getEventLocation(isBuyNow, isMegaPDPEligible, isStickyBarScrolled)
  const eventsPayload = [
    [
      'addToCart',
      {
        selectedVariantId: submittableVariantId,
        isBuyNow,
        ...gaProductData,
        eventLocation,
      },
    ],
  ]
  if (isBuyNow) {
    const { product, ...otherProps } = gaProductData
    eventsPayload.push([
      'beginCheckout',
      {
        checkoutOption: 'regular',
        isBuyNow,
        ...otherProps,
        products: [product],
        eventLocation,
      },
    ])
  }
  return eventsPayload
}

export const getApplePayClickEvent = ({ gaProductData, submittableVariantId }) => {
  const gaParameters = {
    ...gaProductData,
    eventLocation: 'apple pay pdp cta',
  }
  const eventsPayload = [
    'addToCart',
    {
      selectedVariantId: submittableVariantId,
      isApplePayPdp: true,
      ...gaParameters,
    },
  ]
  return eventsPayload
}

export const getApplePayOpenPopupEvents = ({ gaProductData }) => {
  const { product, ...otherProps } = gaProductData
  const eventsPayload = [
    [
      'beginCheckout',
      {
        checkoutOption: 'apple pay',
        isApplePayPdp: true,
        ...otherProps,
        products: [product],
        eventLocation: 'apple pay pdp cta',
        isExpressPay: true,
      },
    ],
    [
      'modalImpression',
      {
        event: 'modal_impression',
        eventAction: 'apple pay modal impression',
        modalTitle: 'apple pay payment window',
        eventLocation: 'apple pay modal',
      },
    ],
  ]
  return eventsPayload
}

export const getProductDetailsMoveEvent = ({ selectedVariantId }) => {
  return [
    'productInteraction',
    {
      eventAction: 'visual product details swipe',
      eventLabel: selectedVariantId,
      eventLocation: 'product',
    },
  ]
}

export const getPlayVideoButtonClickEvent = ({ selectedVariantId, imagePath }) => {
  return [
    'swatchInteraction',
    {
      eventAction: 'swatch play video click',
      eventLabel: selectedVariantId,
      swatchType: 'product image',
      swatchValue: imagePath,
      swatchVariant: selectedVariantId,
    },
  ]
}

export const getNotSelectedErrorEvents = () => {
  return [
    'siteError',
    {
      eventAction: 'add to cart',
      eventLocation: 'product',
      eventLabel: 'select size and width',
    },
  ]
}

export const getQuantityNotAvailableErrorEvents = ({ isBuyNow }) => {
  return [
    'siteError',
    {
      eventAction: isBuyNow ? 'buy now' : 'add to cart button',
      eventLocation: isBuyNow ? 'buy now pdp cta' : 'add to cart',
      eventLabel: MAX_REACHED_MSG,
    },
  ]
}

export const getAtcRequestErrorEvents = ({ isBuyNow }) => {
  return [
    'siteError',
    {
      eventAction: isBuyNow ? 'buy now' : 'add to cart button',
      eventLocation: isBuyNow ? 'buy now pdp cta' : 'add to cart',
      eventLabel: 'Something went wrong, please try again',
    },
  ]
}

export const getHeroSwatchInteractionEvent = ({ eventAction, selectedVariantId, mediaSrc }) => {
  return [
    'swatchInteraction',
    {
      eventAction,
      eventLabel: selectedVariantId,
      swatchType: 'product image',
      swatchValue: getFileBaseName(mediaSrc),
      swatchVariant: selectedVariantId,
    },
  ]
}

export const getOnContentSliderMoveEvents = ({ selectedVariantId }) => {
  return [
    'productInteraction',
    {
      eventAction: 'content module swipe',
      eventLabel: selectedVariantId,
      eventLocation: 'product',
    },
  ]
}
