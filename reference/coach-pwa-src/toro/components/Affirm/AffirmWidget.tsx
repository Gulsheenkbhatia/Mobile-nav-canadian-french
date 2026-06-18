import { useState, useLayoutEffect, useRef } from 'react'
import Script from 'next/script'
import usePreference from 'toro/hooks/usePreference_new'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { affirmScriptLoadedAtom, setAffirmScriptLoadedAtom } from 'store/scripts.atom'
import { setAffirmPriceAtom } from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

declare global {
  interface Window {
    _affirm_config: {
      public_api_key: string
      script: string
      locale: string
      country_code: string
    }
    affirm?: {
      ui?: {
        refresh?: () => void
        ready?: () => boolean
      }
    }
  }
}

const AffirmWidget = ({ variant }: { variant?: string }) => {
  const selectedVariantPrice = useSelectedVariantData('pricingInfo.[0].sales.decimalPrice')
  const pdpActivePrice = selectedVariantPrice?.replace('.', '')
  const { defaultLocale, locale } = useIntl()
  const thisLocale = (locale || defaultLocale)?.split?.('-').join('_')
  const affirmElementRef = useRef<HTMLDivElement>(null)

  const { affirm: affirmPref } = usePreference({ affirm: '*' })
  const { AffirmScriptURL: affirmScriptUrl = '', AffirmPublicKey: affirmPublicKey = '' } =
    affirmPref

  const styles = useMultiStyleConfig('Affirm', { variant })

  const [isAffirmScriptError, setIsAffirmScriptError] = useState(false)
  const [isAffirmLabelPresent, setIsAffirmLabelPresent] = useState(false)
  const isAffirmScriptLoaded = useAtomValue(affirmScriptLoadedAtom)
  const setAffirmScriptLoaded = useUpdateAtom(setAffirmScriptLoadedAtom)
  const setAffirmPrice = useUpdateAtom(setAffirmPriceAtom)

  // Effect to observe changes in the Affirm label content
  useLayoutEffect(() => {
    const affirmElement = affirmElementRef.current
    if (!affirmElement) return

    // Check if content is present initially
    const checkContent = () => {
      const hasContent = affirmElement.innerText?.trim().length > 0
      setIsAffirmLabelPresent(hasContent)
    }

    // Initial check
    checkContent()

    // Create MutationObserver to watch for changes
    const observer = new MutationObserver(() => {
      checkContent()
    })

    // Observe changes to child elements and subtree
    observer.observe(affirmElement, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [isAffirmScriptLoaded, pdpActivePrice])

  // Effect to refresh Affirm widgets when script is already loaded (for SPA navigation)
  useLayoutEffect(() => {
    // useLayoutEffect runs synchronously after all DOM mutations
    // This ensures the DOM is ready before we call refresh
    if (
      isAffirmScriptLoaded &&
      pdpActivePrice &&
      window.affirm?.ui?.refresh &&
      affirmElementRef.current
    ) {
      window.affirm.ui.refresh()
    }
  }, [isAffirmScriptLoaded, pdpActivePrice, setAffirmPrice])

  // Effect to set the Affirm price data when label is present
  useLayoutEffect(() => {
    if (isAffirmLabelPresent && window.affirm?.ui?.ready() && affirmElementRef.current?.innerText) {
      const affirmPrice = affirmElementRef.current.querySelector('.affirm-ala-price')
      setAffirmPrice(affirmPrice?.textContent)
    }
  }, [isAffirmLabelPresent, setAffirmPrice])

  const handleScriptLoaded = () => {
    window._affirm_config = {
      public_api_key: affirmPublicKey,
      script: affirmScriptUrl,
      locale: thisLocale,
      country_code: 'USA',
    }
    setAffirmScriptLoaded(true)
  }

  const handleScriptError = () => {
    setIsAffirmScriptError(true)
  }

  // Only render if script hasn't errored - eligibility is handled by parent components using useAffirmEligibility hook
  return (
    <>
      {!isAffirmScriptError && (
        <Box
          ref={affirmElementRef}
          sx={styles.affirmWrapper}
          className="affirm-wrapper"
          data-qa="affirm_wrapper"
        >
          <Text
            sx={styles.affirmParagraph}
            as="p"
            className="affirm-as-low-as"
            data-amount={pdpActivePrice}
            data-page-type="product"
            data-learnmore-show="true"
            data-affirm-color={variant === 'pdpv5' ? 'white' : 'black'}
          />

          {!isAffirmScriptLoaded && <Skeleton style={styles.affirmSkeleton} />}

          <Script
            src={affirmScriptUrl}
            strategy="afterInteractive"
            onLoad={handleScriptLoaded}
            onError={handleScriptError}
            data-qa="affirm-script"
          />
        </Box>
      )}
    </>
  )
}

export default AffirmWidget
