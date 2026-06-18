import { useCallback, useContext, useEffect, useState } from 'react'
import useAnalytics from 'toro/analytics/useAnalytics'
import { fetchFullData } from 'helpers/getFullData'
import PWAContext from 'components/common/PWAContext'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'

type UseDrawerAnalytics = (args: {
  variantId: string
  isDrawerVisible: boolean
  cartProducts?: Record<string, any>[]
}) => {
  sendCheckoutDrawerCloseAction: () => void
  sendCheckoutAction: () => void
  sendViewShoppingBagAction: () => void
  sendBeginCheckoutAction: () => void
}

const useDrawerAnalytics: UseDrawerAnalytics = ({
  variantId,
  isDrawerVisible,
  cartProducts = [],
}) => {
  const { appData } = useContext(PWAContext) || {}
  const analytics = useAnalytics()

  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (!(cartProducts.length && isDrawerVisible)) return

    const fetchCartProducts = async () => {
      try {
        const products = await fetchFullData(cartProducts, {
          locale: getCurrentLocale(appData?.locale),
          includeInventory: true,
        })
        setCartItems(products)
      } catch {
        setCartItems([])
      }
    }
    void fetchCartProducts()
  }, [cartProducts, isDrawerVisible, appData?.locale])

  useEffect(() => {
    if (!isDrawerVisible) return
    analytics.send('cartInteraction', {
      eventLocation: 'checkout drawer',
      eventAction: 'checkout drawer open',
      product: { id: variantId },
    })
  }, [isDrawerVisible, variantId])

  const sendCheckoutAction = useCallback(() => {
    if (!variantId) return
    analytics.send('cartInteraction', {
      eventLocation: 'checkout drawer',
      eventAction: 'checkout',
      eventLabel: variantId,
    })
  }, [variantId])

  const sendViewShoppingBagAction = useCallback(() => {
    if (!variantId) return
    analytics.send('cartInteraction', {
      eventLocation: 'checkout drawer',
      eventAction: 'view shopping bag',
      product: { id: variantId },
    })
  }, [variantId])

  const sendCheckoutDrawerCloseAction = useCallback(() => {
    if (!variantId) return
    analytics.send('cartInteraction', {
      eventLocation: 'checkout drawer',
      eventAction: 'checkout drawer close',
      product: { id: variantId },
    })
  }, [variantId])

  const sendBeginCheckoutAction = useCallback(() => {
    if (!cartItems?.length) return
    analytics.send('beginCheckout', {
      eventLocation: 'checkout drawer',
      products: cartItems,
      eventAction: 'begin_checkout',
      checkoutOption: 'regular',
    })
  }, [cartItems])

  return {
    sendCheckoutAction,
    sendViewShoppingBagAction,
    sendCheckoutDrawerCloseAction,
    sendBeginCheckoutAction,
  }
}

export default useDrawerAnalytics
