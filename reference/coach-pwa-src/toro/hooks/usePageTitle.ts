import { useContext, useState, useEffect, useMemo } from 'react'
import get from 'lodash/get'
import SessionContext from 'toro/components/SessionContext'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'

interface CartProductItem {
  quantity: number
  c_customizerParentId?: string
}

const usePageTitle = (originalTitle?: string): string | undefined => {
  const { session } = useContext(SessionContext)
  const { formatMessage } = useIntl()
  const productItems = get(session, 'cart.product_items', [])
  const { isDesktop } = useViewportType()
  const [shouldShowOfflineTitle, setShouldShowOfflineTitle] = useState(false)
  const {
    toggleSiteFeatures: { enableCustomTitle },
  } = usePreference({
    ToggleSiteFeatures: ['enableCustomTitle'],
  })

  const offlineTitle = useMemo(() => {
    const totalQty = productItems.reduce((acc: number, p: CartProductItem) => {
      if (get(p, 'c_customizerParentId')) {
        return acc
      }
      return acc + p.quantity
    }, 0)

    return formatMessage(
      {
        id: 'header.inactivity.title',
        defaultMessage: `({totalQty}) Don't forget your cart`,
      },
      {
        totalQty,
      }
    )
  }, [productItems])

  useEffect(() => {
    if (enableCustomTitle) {
      const changeInactiveTabTitle = () => {
        setShouldShowOfflineTitle(document.visibilityState !== 'visible')
      }

      document.addEventListener('visibilitychange', changeInactiveTabTitle)

      return () => {
        document.removeEventListener('visibilitychange', changeInactiveTabTitle)
      }
    }
  }, [])

  if (productItems.length === 0 || !isDesktop || !enableCustomTitle) {
    return originalTitle
  }

  return shouldShowOfflineTitle ? offlineTitle : originalTitle
}

export default usePageTitle
