import dynamic from 'next/dynamic'
import { memo, useEffect, useRef, useContext, useMemo } from 'react'
import Box from 'toro/components/Box'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import { useRouter } from 'next/router'
import useProductData from 'toro/hooks/useProductData'
import { useUpdateAtom } from 'jotai/utils'
import { toggleIsShowingSignUpDisclaimerModalAtom } from 'store/pdp.atom'

interface WindowWithAttentive extends Window {
  __attentive?: {
    trigger: (arg1: null, arg2: null, arg3: null, attentiveCreativeId: string) => void
  }
}
declare const window: WindowWithAttentive

const SignUpDisclaimerModal = dynamic(() => import('toro/components/SignUpDisclaimerModal'), {
  ssr: false,
})

const SignupOfferCTA = ({
  content = '',
  v3RotationBanner = false,
  signUpDisclaimerContent = '',
}) => {
  const analytics = useAnalytics()
  const {
    pdpPreferences: { attentiveCreativeId },
  } = usePreference({
    PDPPreferences: ['attentiveCreativeId'],
  })
  const router = useRouter()
  const { query } = router
  const { selectedVariantData } = useContext(ProductMainSectionBreakpointContext)
  const defaultVariantID = useProductData('defaultVariantID')

  const toggleIsShowingSignUpDisclaimerModal = useUpdateAtom(
    toggleIsShowingSignUpDisclaimerModalAtom
  )

  const itemVariant = selectedVariantData?.id || query?.frp || defaultVariantID

  const container = useRef(null)
  const variantIdRef = useRef(itemVariant)
  variantIdRef.current = itemVariant

  useEffect(() => {
    const handleTooltipIconClick = (e) => {
      e.preventDefault()
      toggleIsShowingSignUpDisclaimerModal()
    }
    const tooltipIcon = container.current?.querySelector('div.SMStooltip')
    tooltipIcon?.addEventListener('click', handleTooltipIconClick)
    return () => {
      tooltipIcon?.removeEventListener('click', handleTooltipIconClick)
    }
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      e.preventDefault()
      analytics.send('productInteraction', {
        event: 'product_interaction',
        eventAction: container.current?.innerText || '',
        eventLabel: variantIdRef.current,
        eventLocation: 'promotions',
      })
      if (attentiveCreativeId) {
        window?.__attentive?.trigger(null, null, null, attentiveCreativeId)
      } else {
        console.warn('CreativeID is not defined')
      }
    }
    const link = container.current?.querySelector('a')
    link?.addEventListener('click', handleClick)
    return () => {
      link?.removeEventListener('click', handleClick)
    }
  }, [])

  return useMemo(
    () => (
      <>
        <SignUpDisclaimerModal content={signUpDisclaimerContent} />
        <Box borderRadius={v3RotationBanner ? '8px' : '0px'} overflow="hidden" width="100%">
          <Box ref={container} dangerouslySetInnerHTML={{ __html: content }} />
        </Box>
      </>
    ),
    [v3RotationBanner, content, signUpDisclaimerContent]
  )
}

export default memo(SignupOfferCTA)
