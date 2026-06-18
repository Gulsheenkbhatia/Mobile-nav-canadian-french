import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import { useInView } from 'react-intersection-observer'
import { useUpdateAtom } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Heading from 'toro/components/Heading'
import { useTangibleeScript } from 'toro/components/product/mobile/v7/hooks/useTangibleeScript'
import { isTangibleePdpV7WfiContentReadyAtom } from 'store/pdp.atom'

const SignatureFeatures = () => {
  const {
    tangiblee: { TANGIBLEE_WFI_CTR_ID: tangibleeWfiCtrId = 'tangiblee-wfi-pdp-container' },
  } = usePreference({
    Tangiblee: ['TANGIBLEE_WFI_CTR_ID'],
  })
  const styles = useMultiStyleConfig('SignatureFeatures')
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const hasTrackedImpression = useRef(false)
  const heading = formatMessage({
    id: 'pdp.product.signatureFeatureHeading',
    defaultMessage: 'Signature Features',
  })
  const subHeading = formatMessage({
    id: 'pdp.product.signatureFeatureSubHeading',
    defaultMessage: 'Thoughtfully designed, crafted with love',
  })

  const tangibleeWfiContainerRef = useRef<HTMLDivElement>(null)
  const setTangibleePdpV7WfiReady = useUpdateAtom(isTangibleePdpV7WfiContentReadyAtom)
  const isContentReady = useTangibleeScript(tangibleeWfiContainerRef, {
    onIsContentReadyChange: setTangibleePdpV7WfiReady,
  })

  const { ref: inViewRef } = useInView({
    threshold: 0.75, //at least 75% of the component must be in the viewport to trigger the callback
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && isContentReady && !hasTrackedImpression.current) {
        hasTrackedImpression.current = true
        analytics.send('tangibleeInteraction', {
          event: 'tangiblee_interaction',
          eventAction: 'what fits inside impression',
          eventLabel: heading,
        })
      }
    },
  })

  return (
    <Box
      ref={inViewRef}
      sx={
        isContentReady ? styles.signatureFeatureContainer : styles.signatureFeatureContainerHidden
      }
      data-qa="signature-features-container"
    >
      {isContentReady && (
        <Flex sx={styles.signatureFeatureHeader} data-qa="signature-features-header">
          <Heading sx={styles.signatureFeatureHeading}>{heading}</Heading>
          <Text sx={styles.signatureFeatureSubHeading}>{subHeading}</Text>
        </Flex>
      )}
      <Box
        ref={tangibleeWfiContainerRef}
        sx={isContentReady ? styles.tangibleeContainer : styles.tangibleeContainerHidden}
        data-qa="tangiblee-wfi-pdp-container"
        id={tangibleeWfiCtrId}
      />
    </Box>
  )
}

export default SignatureFeatures
