import React, { memo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { finalSaleShippingAtom, isShowingShippingAndReturnsModal } from 'store/pdp.atom'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { BopisArrowRightIcon, ShoppingBagSpeedIcon } from 'toro/icons'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'

const ShippingAndReturnsModal = dynamic(() => import('toro/components/ShippingAndReturnsModal'), {
  ssr: false,
})

const FreeShippingAndReturns = () => {
  const { finalSaleText, shippingBody } = useAtomValue(finalSaleShippingAtom)
  const styles = useMultiStyleConfig('FreeShippingAndReturns')
  const [isShowShippingAndReturnModal, setShowShippingAndReturnModal] = useAtom(
    isShowingShippingAndReturnsModal
  )
  const analytics = useAnalytics()
  const productId = useProductData('id')
  const { formatMessage } = useIntl()

  const titleText = formatMessage({
    id: 'pdp.freeShipping.title',
    defaultMessage: 'Free shipping',
  })
  const thresholdText = formatMessage({
    id: 'pdp.freeShipping.threshold',
    defaultMessage: 'On orders $75 +',
  })

  const handleIconClick = (e) => {
    e.preventDefault()
    setShowShippingAndReturnModal(!isShowShippingAndReturnModal)
    analytics?.send('productInteraction', {
      eventAction: `${titleText?.toLowerCase()} ${thresholdText?.toLowerCase()} click`,
      eventLabel: productId,
    })
  }

  if (!finalSaleText) {
    return null
  }

  return (
    <Box sx={styles.shippingAndReturnContainer}>
      <ShippingAndReturnsModal title={finalSaleText} shippingBody={shippingBody} />
      <Box sx={styles.shippingIconContainer} data-qa="shopping-bag-speed-icon">
        <ShoppingBagSpeedIcon width="24" height="24" />
      </Box>
      <Box sx={styles.textContainer}>
        <Text sx={styles.shippingTitle}>{titleText}</Text>
        <Text sx={styles.shippingThreshold}>{thresholdText}</Text>
      </Box>
      <Flex sx={styles.learnMore} onClick={handleIconClick} data-qa="learn-more-link">
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

export default withErrorBoundaryWrapper(memo(FreeShippingAndReturns))
