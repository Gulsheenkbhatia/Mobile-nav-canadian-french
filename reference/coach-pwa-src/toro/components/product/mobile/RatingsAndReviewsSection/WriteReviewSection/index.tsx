import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { useIntl } from 'react-intl'
import Link from 'toro/components/Link'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import { TemplateName } from 'toro/constants/templates'
import useTemplate from 'toro/hooks/useTemplate'
import isEmpty from 'lodash/isEmpty'
import { WriteReviewSectionData } from 'toro/types/productTypes'

export const useIsWriteReviewSectionVisible = () => {
  const isPDPv6Enabled = useTemplate([TemplateName.pdpv6])
  const [productId, writeReviewSectionData] = useProductData(['masterId', 'writeReviewSectionData'])

  return isPDPv6Enabled && productId && !isEmpty(writeReviewSectionData)
}

function WriteReviewSection() {
  const styles = useStyleConfig('WriteReviewSection')
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const [productId, writeReviewSectionData] = useProductData(['masterId', 'writeReviewSectionData'])

  if (isEmpty(writeReviewSectionData)) {
    return null
  }

  const { title, body, imageSrc } = writeReviewSectionData as WriteReviewSectionData

  const onClick = () => {
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'write a review',
      eventLabel: productId,
    })
  }

  return (
    <Box sx={styles.container}>
      <Flex flexDirection="row">
        {imageSrc && (
          <Box sx={styles.imageContainer}>
            <Image src={imageSrc} sx={styles.image} lazy fetchpriority="low" />
          </Box>
        )}
        <Flex sx={styles.information}>
          <Text sx={styles.title}>{title}</Text>
          <Text sx={styles.body}>{body}</Text>
          <Flex>
            <Box sx={styles.buttonContainer}>
              <Link
                href={`/review-a-product?product=${productId}`}
                onClick={onClick}
                target="_blank"
              >
                <Box sx={styles.button}>
                  {formatMessage({
                    id: 'pdp.product.writeAReviewLc',
                    defaultMessage: 'Write a review',
                  })}
                </Box>
              </Link>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default WriteReviewSection
