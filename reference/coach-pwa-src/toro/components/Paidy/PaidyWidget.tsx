import { useState, useEffect, useContext } from 'react'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import Script from 'next/script'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { paidyScriptLoadedAtom, setPaidyScriptLoadedAtom } from 'store/scripts.atom'
import { appLoadingAtom } from 'store/pdp.atom'

export interface WindowWithPaidy extends Window {
  _paidy?: (action: string) => void
}

declare const window: WindowWithPaidy

const NO_PRICE = 'N/A'

const MIN_PRICE = 3000
const MAX_PRICE = 300000

function isPriceInRange(price: string): boolean {
  const numericPrice = price.replace(/[^\d]/g, '')

  const priceNumber = Number(numericPrice)

  if (isNaN(priceNumber)) {
    return false
  }

  return priceNumber >= MIN_PRICE && priceNumber <= MAX_PRICE
}

const PaidyWidget = ({
  hasPromoOnPDP,
  isRotatingBanner,
  isBelowAtcPlacement,
}: {
  hasPromoOnPDP?: boolean
  isRotatingBanner?: boolean
  /** PDP v6 mobile: centered block directly under Add to Cart / Buy Now */
  isBelowAtcPlacement?: boolean
}) => {
  const apploading = useAtomValue(appLoadingAtom)
  const { selectedColor, selectedVariant } = useContext(ProductMainSectionBreakpointContext)
  const {
    paidy: { paidy_script_url: paidyScriptUrl },
  } = usePreference({
    paidy: ['paidy_script_url'],
  })
  const getPaidyVariant = () => {
    if (isBelowAtcPlacement) {
      return 'belowCta'
    }
    if (isRotatingBanner) {
      return 'rotatingBanner'
    }
    if (hasPromoOnPDP) {
      return ''
    }
    return 'underline'
  }
  const styles = useMultiStyleConfig('Paidy', {
    variant: getPaidyVariant(),
  })

  const [pdpActivePrice, setPdpActivePrice] = useState<string>()
  const [isPaidyScriptError, setIsPaidyScriptError] = useState(false)
  const isPaidyScriptLoaded = useAtomValue(paidyScriptLoadedAtom)
  const setIsPaidyScriptLoaded = useUpdateAtom(setPaidyScriptLoadedAtom)

  useEffect(() => {
    if (apploading) {
      return
    }

    const $pdpActivePriceElement = document.querySelector('.pdp-active-price')

    if (!$pdpActivePriceElement) {
      return
    }

    const renderedPrice = get($pdpActivePriceElement, 'textContent')

    if (renderedPrice === NO_PRICE) {
      return
    }

    if (!isPriceInRange(renderedPrice)) {
      return
    }

    setPdpActivePrice(renderedPrice)
  }, [apploading, selectedColor, selectedVariant])

  useEffect(() => {
    if (pdpActivePrice) {
      window?._paidy && window._paidy('pm:refresh')
    }
  }, [pdpActivePrice])

  const handleScriptLoaded = () => {
    setIsPaidyScriptLoaded(true)
  }

  const handleScriptError = () => {
    setIsPaidyScriptError(true)
  }

  const isValidPrice = pdpActivePrice && pdpActivePrice !== '' && pdpActivePrice !== NO_PRICE
  const shouldRenderPaidy = isValidPrice && !isPaidyScriptError

  return (
    <>
      {shouldRenderPaidy && (
        <Box sx={styles.paidyContainer}>
          <div
            className="_paidy-promotional-messaging"
            data-amount={pdpActivePrice}
            data-logo-color="black"
            data-alignment={isBelowAtcPlacement ? 'center' : 'start'}
            data-font-size="12px"
            data-6-pay-enabled
            data-12-pay-enabled
            data-qa="paidy-wrapper"
          />

          {!isPaidyScriptLoaded && <Skeleton style={styles.paidySkeleton} />}
        </Box>
      )}
      <Script
        src={paidyScriptUrl}
        strategy="afterInteractive"
        onLoad={handleScriptLoaded}
        onError={handleScriptError}
        data-qa="paidy-script"
      />
    </>
  )
}

export default PaidyWidget
