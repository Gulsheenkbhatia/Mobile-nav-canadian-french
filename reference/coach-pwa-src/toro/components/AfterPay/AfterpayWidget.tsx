import { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import Script from 'next/script'
import usePreference from 'toro/hooks/usePreference_new'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { afterpayScriptLoadedAtom, setAfterpayScriptLoadedAtom } from 'store/scripts.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  appLoadingAtom,
  productPriceAtom,
  setShouldRenderAfterPayAtom,
  setAfterPayPriceLabelAtom,
} from 'store/pdp.atom'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import { extractNumericPrice } from 'toro/helpers/extractNumericPrice'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const NO_PRICE = 'N/A'

type AfterPayRange = {
  afterPayMinValue: number
  afterPayMaxValue: number
}

const getAfterPayRange = (): AfterPayRange => {
  const afterPayMinValue = Number(process.env.AFTERPAY_MIN_VALUE ?? '1')
  const afterPayMaxValue = Number(process.env.AFTERPAY_MAX_VALUE ?? '4000')

  return {
    afterPayMinValue: !isNaN(afterPayMinValue) ? afterPayMinValue : 1,
    afterPayMaxValue: !isNaN(afterPayMaxValue) ? afterPayMaxValue : 4000,
  }
}

function isPriceInRange(price: string): boolean {
  const { afterPayMinValue, afterPayMaxValue } = getAfterPayRange()

  const priceNumber = Number(price)

  if (isNaN(priceNumber)) {
    return false
  }

  return priceNumber >= afterPayMinValue && priceNumber <= afterPayMaxValue
}

const AfterpayWidget = ({ variant }: { variant?: string }) => {
  const apploading = useAtomValue(appLoadingAtom)
  const { salePrice: productSalePrice, isCustomizedProduct } = useAtomValue(productPriceAtom)
  const { isMobile } = useViewportType()
  const { selectedVariant, cart, orderingStatus } = useContext(ProductMainSectionBreakpointContext)
  const { defaultLocale, locale } = useIntl()
  const thisLocale = (locale || defaultLocale)?.split?.('-').join('_')
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const afterPayContainerRef = useRef<HTMLDivElement>(null)

  const productAvailabilityStatus =
    orderingStatus === ORDERING_STATUS.preorder || orderingStatus === ORDERING_STATUS.backorder
  const { afterPay: afterPayPref } = usePreference({ afterPay: '*' })
  const { apJavaScript: afterPayScriptUrl, enableAfterpay, afterPayMPID } = afterPayPref

  const styles = useMultiStyleConfig('AfterPay', {
    variant,
  })

  const [pdpActivePrice, setPdpActivePrice] = useState<string>()
  const [isAfterPayScriptError, setIsAfterPayScriptError] = useState(false)
  const isAfterpayScriptLoaded = useAtomValue(afterpayScriptLoadedAtom)
  const setAfterpayScriptLoaded = useUpdateAtom(setAfterpayScriptLoadedAtom)
  const setShouldRenderAfterPay = useUpdateAtom(setShouldRenderAfterPayAtom)
  const setAfterPayPriceLabel = useUpdateAtom(setAfterPayPriceLabelAtom)

  useEffect(() => {
    if (apploading) {
      return
    }
    if (isCustomizedProduct) {
      const numeric =
        productSalePrice && productSalePrice !== NO_PRICE
          ? extractNumericPrice(String(productSalePrice))
          : null
      setPdpActivePrice(numeric == null ? undefined : String(numeric))
      return
    }
    const activePrice = selectedVariant?.pricingInfo?.[0].sales?.value
    setPdpActivePrice(activePrice != null ? String(activePrice) : undefined)
  }, [apploading, selectedVariant, isCustomizedProduct, productSalePrice])

  const handleScriptLoaded = () => {
    setAfterpayScriptLoaded(true)
  }

  const handleScriptError = () => {
    setIsAfterPayScriptError(true)
  }

  const isValidPrice = isPriceInRange(pdpActivePrice) && pdpActivePrice !== NO_PRICE
  const shouldRenderAfterPay =
    !productAvailabilityStatus && enableAfterpay && isValidPrice && !isAfterPayScriptError

  useEffect(() => {
    setShouldRenderAfterPay(shouldRenderAfterPay)
  }, [shouldRenderAfterPay, setShouldRenderAfterPay])

  useLayoutEffect(() => {
    if (!afterPayContainerRef.current) return

    const afterpayPlacement = afterPayContainerRef.current.querySelector('afterpay-placement')
    if (!afterpayPlacement || !afterpayPlacement.shadowRoot) return

    const shadowRoot = afterpayPlacement.shadowRoot
    const checkShadowContent = () => {
      const paragraph = shadowRoot.querySelector('.afterpay-paragraph')
      const paragraphByTag = shadowRoot.querySelector('p')

      if (paragraph || paragraphByTag) {
        const textContent = (paragraph || paragraphByTag)?.textContent
        setAfterPayPriceLabel(textContent)
        return true
      }
      return false
    }

    // First attempt
    if (checkShadowContent()) return

    // Set up MutationObserver to watch for shadow DOM changes
    const observer = new MutationObserver(() => {
      if (checkShadowContent()) {
        observer.disconnect()
      }
    })

    observer.observe(shadowRoot, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [shouldRenderAfterPay, isAfterpayScriptLoaded, pdpActivePrice, setAfterPayPriceLabel])

  return (
    <>
      {shouldRenderAfterPay && (
        <Box sx={styles.afterPayContainer} className="afterpay-wrapper" data-qa="After_Pay">
          <div id="square-marketplace" className="afterpay-container">
            <div
              ref={afterPayContainerRef}
              dangerouslySetInnerHTML={{
                __html: `<afterpay-placement
                  data-mpid="${afterPayMPID}"
                  data-page-type="product"
                  data-amount="${pdpActivePrice}"
                  data-currency="${cart?.currency}"
                  data-consumer-locale="${thisLocale}"
                  data-is-eligible="true"
                  data-intro-text="false"
                  data-logo-type="${isMobile || isPDPV5Enabled ? 'compact-badge' : 'lockup'}"
                  data-badge-theme="black-on-mint"
                  data-modal-theme="white"
                  data-size="xs"
                />`,
              }}
            />
          </div>

          {!isAfterpayScriptLoaded && <Skeleton style={styles.afterPaySkeleton} />}

          <Script
            src={afterPayScriptUrl}
            strategy="afterInteractive"
            onLoad={handleScriptLoaded}
            onError={handleScriptError}
            data-qa="afterpay-script"
          />
        </Box>
      )}
    </>
  )
}

export default AfterpayWidget
