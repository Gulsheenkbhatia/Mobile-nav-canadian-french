import { Fragment, memo, useMemo } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useProductData from 'toro/hooks/useProductData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useAtomValue } from 'jotai/utils'
import { isMegaPDPEligibleAtom, isNewMegaPDPEligibleAtom } from 'store/pdp.atom'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import isEmpty from 'lodash/isEmpty'
import { useExpandableAccordionLogic } from 'toro/hooks/useExpandableAccordionLogic'
import { ExpandableAccordionItem } from 'toro/components/product/mobile/ExpandableProductDetails/ExpandableAccordions'
import { useIntl } from 'react-intl'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'

const FeaturedContent = () => {
  const styles = useMultiStyleConfig('FeaturedContent')
  const { shouldShowCollapsible } = useExpandableAccordionLogic()
  const { formatMessage } = useIntl()
  const vgId = useSelectedColorData('vgId')
  const [header, image, productId] = useProductData([
    'featuredContentData.header',
    `featuredContentData.images[${vgId}]`,
    'id',
  ])
  const analytics = useAnalytics()
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)

  const sendFeaturedContentInteraction = () => {
    analytics.send('productInteraction', {
      event: 'product_interaction',
      eventLocation: isMegaPDPEligible || isNewMegaPDPEligible ? 'mega product' : 'product',
      eventAction: `content module impression: ${header?.toLowerCase() || 'features'}`,
      eventLabel: productId,
    })
  }

  const title = formatMessage({
    id: 'pdp.product.featuredContent.title',
    defaultMessage: 'Featured Content',
  })

  const productImageSrc = useMemo(
    () => getProductImageSrc(image?.src, 'mobile', 'pdp'),
    [image?.src]
  )

  if (isEmpty(image)) {
    return null
  }

  const Wrapper = shouldShowCollapsible ? ExpandableAccordionItem : Fragment

  const featuredContentComponent = (
    <ImpressionSensor onVisible={sendFeaturedContentInteraction}>
      <Box sx={styles.container} data-qa="pdp_featured_content">
        <Box as="h2" sx={styles.header} data-qa="pdp_featured_content_header">
          {header}
        </Box>
        <Box sx={styles.imageWrapper}>
          <Image
            src={productImageSrc}
            alt={image?.alt || header}
            title={image?.title || header}
            sx={styles.image}
            data-qa="pdp_featured_content_image"
          />
        </Box>
      </Box>
    </ImpressionSensor>
  )

  return (
    <Wrapper id="featured_content" title={title}>
      {featuredContentComponent}
    </Wrapper>
  )
}

export default withErrorBoundaryWrapper(memo(FeaturedContent))
