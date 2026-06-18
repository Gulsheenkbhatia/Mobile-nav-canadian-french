import React, { memo } from 'react'
import dynamic from 'next/dynamic'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { AccountBalanceWalletIcon, BopisArrowRightIcon } from 'toro/icons'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import { isShowingPaymentVarietyModalAtom, paymentVarietyPdpAtom } from 'store/pdp.atom'

const ShippingAndReturnsModal = dynamic(() => import('toro/components/ShippingAndReturnsModal'), {
  ssr: false,
})

const VarietyOfPayment = () => {
  const { modalTitle, shippingBody, hasContent } = useAtomValue(paymentVarietyPdpAtom)
  const setShowPaymentVarietyModal = useUpdateAtom(isShowingPaymentVarietyModalAtom)
  const styles = useMultiStyleConfig('VarietyOfPayment')
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const productId = useProductData('id')

  const titleText = formatMessage({
    id: 'pdp.paymentVariety.title',
    defaultMessage: 'Variety of payment',
  })
  const subtitleText = formatMessage({
    id: 'pdp.paymentVariety.subtitle',
    defaultMessage: 'Multiple secure ways to pay at checkout.',
  })

  const modalTitleResolved = modalTitle || titleText

  if (!hasContent) {
    return null
  }

  const handleLearnMoreClick = () => {
    setShowPaymentVarietyModal((open) => !open)
    analytics?.send('productInteraction', {
      eventAction: `${titleText?.toLowerCase()} ${subtitleText?.toLowerCase()} click`,
      eventLabel: productId,
      eventLocation: 'Variety Of Payment confidence strip',
    })
  }

  return (
    <Box sx={styles.varietyOfPaymentContainer} data-qa="variety-of-payment-block">
      <ShippingAndReturnsModal
        title={modalTitleResolved}
        shippingBody={shippingBody}
        openStateAtom={isShowingPaymentVarietyModalAtom}
      />
      <Box sx={styles.varietyOfPaymentIconContainer} data-qa="variety-of-payment-icon">
        <AccountBalanceWalletIcon width="24" height="24" />
      </Box>
      <Box sx={styles.textContainer}>
        <Text sx={styles.varietyOfPaymentTitle}>{titleText}</Text>
        <Text sx={styles.varietyOfPaymentSubtitle}>{subtitleText}</Text>
      </Box>
      <Flex
        as="button"
        type="button"
        sx={styles.learnMoreForVarietyOfPayment}
        onClick={handleLearnMoreClick}
        data-qa="learn-more-link"
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

export default withErrorBoundaryWrapper(memo(VarietyOfPayment))
