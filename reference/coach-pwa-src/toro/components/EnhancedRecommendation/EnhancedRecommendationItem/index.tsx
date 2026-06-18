import { useMemo, memo, useState } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import getAPIURL from 'helpers/getAPIURL'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import getProductURLHref from 'helpers/getProductURLHref'
import noop from 'lodash/noop'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'
import { EnhancedRecommendationItemProps } from 'toro/components/EnhancedRecommendation/EnhancedRecommendationItem/types'
import AddToBagButton from 'toro/components/AddToBagButton'
import usePreference from 'toro/hooks/usePreference_new'
import Box from 'toro/components/Box'

function EnhancedRecommendationItem({
  product,
  idx,
  hidePrice,
  addImpression,
  selectRecommItem = noop,
  scheme = undefined,
  label = undefined,
  experienceId,
  variant,
  onItemClick = undefined,
  isrecommTypeGrid = false,
  vendor = RecommendationVendors.CERTONA,
}: EnhancedRecommendationItemProps) {
  const styles = useMultiStyleConfig('EnhancedPDPRecommendation', { variant })
  const labelValue = label?.trim?.()
  const pdpUrl = getProductURLHref(product?.detailURL)
  const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)
  const {
    certonaConfiguration: { certonaATBConfigs },
  } = usePreference({
    CertonaConfiguration: ['certonaATBConfigs'],
  })

  const onTileVisible = () => {
    addImpression({
      listName: labelValue,
      product: { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' },
      idx,
      certonaScheme: scheme,
      recAIType: vendor,
      recommTypeGrid: isrecommTypeGrid,
    })
  }

  const onLinkClick = async () => {
    onItemClick?.()
    selectRecommItem({
      listName: labelValue,
      product: { ...product, is_quick_add: isATBButtonDisabled ? '0' : '1' },
      idx,
      eventLocation: scheme,
      recAIType: vendor,
    })
  }

  const hasATBButton = !!certonaATBConfigs?.[scheme]
  const stringifiedProductData = useMemo(() => JSON.stringify(product), [product])

  return (
    <ImpressionSensor
      key={`product-${product?.ID}`}
      onVisible={onTileVisible}
      threshold={1}
      rootMargin={'0px'}
      payload={undefined}
      className="recommendation-wrapper"
      style={styles.recommendationImpressionSensor}
    >
      {hasATBButton && (
        <Box sx={styles.atbContainer}>
          <AddToBagButton
            styles={{
              buttonText: styles.atbButtonText,
              button: styles.atbButton,
              icon: styles.atbIcon,
            }}
            variantId={product.VariationIdV2}
            variantGroupId={product.ID}
            isSizedProduct={product.SizeFlag}
            analyticsData={{
              eventLocation: scheme,
              experienceId,
              recAIType: vendor,
            }}
            setIsATBButtonDisabled={setIsATBButtonDisabled}
          />
        </Box>
      )}
      <Link
        href={pdpUrl}
        prefetchUrl={getAPIURL(pdpUrl)}
        prefetch={true}
        onClick={onLinkClick}
        pageData={stringifiedProductData}
        sx={styles.productLink}
        className="recommendation-tile-wrapper"
      >
        <Image
          className="product-image"
          src={product?.imageURL}
          alt={`${product?.name}, ${product?.Color}, ProductTile`}
          maxWidth={'none'}
          sx={styles.productImage}
          lazy
          data-qa="m_plp_link_pt_img"
        />
        <RecommendationPrice
          product={product}
          hidePrice={hidePrice}
          scheme={scheme}
          variant={'EnhancedPDPRecommendation'}
        />
      </Link>
    </ImpressionSensor>
  )
}

export default memo(EnhancedRecommendationItem)
