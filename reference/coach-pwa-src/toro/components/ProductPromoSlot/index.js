import { useContext, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import useAnalytics from 'toro/analytics/useAnalytics'

import withPromoModal from 'toro/hocs/withPromoModal'
import { handlePromotionEvent } from 'toro/analytics/useCmsAnalytics'
import { isQuickViewAtom, quickViewedProductAtom } from 'store/pdp.atom'
import Script from 'next/script'
import initializeSlotLinks from 'toro/helpers/initializeSlotLinks'
import { TRACK_PROMOTIONS_CLASS } from 'toro/cms/constants'
import PWAContext from 'components/common/PWAContext'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

function ProductPromoSlot({ content = '', scriptContent, masterId, onClick, shouldInjectJquery }) {
  const router = useRouter()
  const analytics = useAnalytics()
  const cleanups = useRef([])
  const isQuickView = useAtomValue(isQuickViewAtom)
  const setQuickViewedProduct = useUpdateAtom(quickViewedProductAtom)
  const { injectJquery } = useContext(PWAContext)

  const elRefSetter = useCallback(
    (node) => {
      if (!node) {
        return
      }
      const promoListener = (event) => {
        onClick?.(event)
        handlePromotionEvent(event, analytics.send)
      }
      node.addEventListener('click', promoListener)
      cleanups.current.push(() => node.removeEventListener('click', promoListener))
      const linkCleanups = initializeSlotLinks(node, {
        onNavigation: router.push,
        onClick: (event) => {
          if (isQuickView) {
            setQuickViewedProduct(null)
          }
          const eventAction = event.target.closest(`.${TRACK_PROMOTIONS_CLASS}`)?.textContent
          if (eventAction && masterId) {
            analytics.send('productInteraction', {
              eventLocation: 'promotions',
              eventAction,
              eventLabel: masterId,
            })
          }
        },
      })
      cleanups.current.concat(linkCleanups)
    },
    [content, masterId]
  )

  useEffect(() => {
    return () => {
      cleanups.current.forEach((cleanup) => cleanup?.())
    }
  }, [])

  const onMount = async () => {
    try {
      await injectJquery()
    } catch (e) {
      console.log('Error when init Jquery', e)
    }
  }

  useEffect(() => {
    if (shouldInjectJquery) {
      onMount()
    }
  }, [shouldInjectJquery])

  return (
    <>
      {scriptContent && (
        <Script id={`promo-script-${masterId}`} strategy="afterInteractive">
          {scriptContent}
        </Script>
      )}
      <div
        ref={elRefSetter}
        dangerouslySetInnerHTML={{ __html: content }}
        data-qa="cm_txt_pdt_pomocallout_msg"
      />
    </>
  )
}

export default withPromoModal(ProductPromoSlot)
