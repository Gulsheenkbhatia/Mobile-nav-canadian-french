import React, { memo } from 'react'
import dynamic from 'next/dynamic'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { BopisArrowRightIcon, ShippingIcon } from 'toro/icons'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import { fastShippingPdpAtom, isShowingFastShippingModalAtom } from 'store/pdp.atom'

const ShippingAndReturnsModal = dynamic(() => import('toro/components/ShippingAndReturnsModal'), {
  ssr: false,
})

const FastShipping = () => {
  const { modalTitle, shippingBody, hasContent } = useAtomValue(fastShippingPdpAtom)
  const setShowFastShippingModal = useUpdateAtom(isShowingFastShippingModalAtom)
  const styles = useMultiStyleConfig('FastShipping')
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const productId = useProductData('id')

  const titleText = formatMessage({
    id: 'pdp.fastShipping.title',
    defaultMessage: 'Fast Shipping',
  })
  const subtitleText = formatMessage({
    id: 'pdp.fastShipping.subtitle',
    defaultMessage: 'Quick dispatch and reliable delivery.',
  })

  const modalTitleResolved = modalTitle || titleText

  if (!hasContent) {
    return null
  }

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowFastShippingModal((open) => !open)
    analytics?.send('productInteraction', {
      eventAction: `${titleText?.toLowerCase()} ${subtitleText?.toLowerCase()} click`,
      eventLabel: productId,
      eventLocation: 'Fast Shipping confidence strip',
    })
  }

  return (
    <Box sx={styles.fastShippingContainer} data-qa="fast-shipping-block">
      <ShippingAndReturnsModal
        title={modalTitleResolved}
        shippingBody={shippingBody}
        openStateAtom={isShowingFastShippingModalAtom}
      />
      <Box sx={styles.fastShippingIconContainer} data-qa="fast-shipping-icon">
        <ShippingIcon width="24" height="24" />
      </Box>
      <Box sx={styles.textContainer}>
        <Text sx={styles.fastShippingTitle}>{titleText}</Text>
        <Text sx={styles.fastShippingSubtitle}>{subtitleText}</Text>
      </Box>
      <Flex
        sx={styles.learnMore}
        onClick={handleLearnMoreClick}
        data-qa="fast-shipping-learn-more-link"
      >
        {formatMessage({
          id: 'pdp.freeShipping.learnMore',
          defaultMessage: 'Learn more',
        })}
        <Box as="span" data-qa="bopis-arrow-right-icon">
          <BopisArrowRightIcon height="14px" width="14px" />
        </Box>
      </Flex>
    </Box>
  )
}

export default withErrorBoundaryWrapper(memo(FastShipping))
