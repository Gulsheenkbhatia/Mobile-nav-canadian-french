import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import Button from 'toro/components/Button'
import get from 'lodash/get'
import { useState, useMemo } from 'react'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import useViewportType from 'toro/hooks/useViewportType'
import isMobileDevice from 'toro/helpers/isMobileDevice'
import usePreference from 'toro/hooks/usePreference_new'
import getAPIURL from 'helpers/getAPIURL'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import AddToBagButton from 'toro/components/AddToBagButton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const CertonaHomeRecommendationItem = ({
  product,
  idx,
  certonaData,
  onTileVisible,
  onLinkClick,
  hasATBButton,
  hidePrice,
  brand,
  siteId,
}) => {
  const { formatMessage } = useIntl()
  const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)
  const { viewport } = useViewportType()
  const styles = useMultiStyleConfig('HomeRecommendations')
  const {
    certonaConfiguration: {
      hideCertonaDiscountHomePage = false,
      CertonaHomePageCTA: isEnableCertonaHomeCTA = false,
      HomePageCertonaSlotConfig = null,
    },
  } = usePreference({
    CertonaConfiguration: [
      'HomePageCertonaSlotConfig',
      'hideCertonaDiscountHomePage',
      'CertonaHomePageCTA',
    ],
  })

  const productTileBorderColor = get(HomePageCertonaSlotConfig, 'productTileBorderColor')
  const ctaText = get(HomePageCertonaSlotConfig, 'CTAContent.en')

  const productImageMainWrapperStyles = useMemo(
    () => styles.productImageMainWrapper(viewport),
    [viewport]
  )
  const productNameWrapperStyles = useMemo(() => styles.productNameWrapper(viewport), [viewport])

  const { pdpUrl, updatedProduct } = useMemo(() => {
    const detailUrl = product?.detailURL
    const domain = siteId === 'ks_us_sur' ? 'katespadeoutlet' : brand?.replace(/-/, '')
    const pdpUrl = detailUrl?.replace(`https://www.${domain}.com`, '')

    const updatedProduct = {
      ...product,
      is_quick_add: !isATBButtonDisabled ? '1' : '0',
      id: product.ID,
    }

    return { pdpUrl, updatedProduct }
  }, [product, siteId, brand, isATBButtonDisabled])

  return (
    <ImpressionSensor
      key={`product-${product.ID}`}
      className="ImpressionSensor"
      onVisible={onTileVisible(updatedProduct, idx)}
      threshold={isMobileDevice() ? 1 : 0.5}
      rootMargin={!isMobileDevice() ? '0px 340px 0px 0px' : '0px'}
    >
      <Box sx={styles.mobileImageContainer} position="relative">
        <Link
          href={pdpUrl}
          prefetchUrl={getAPIURL(pdpUrl)}
          prefetch
          sx={styles.productLink}
          onClick={onLinkClick(updatedProduct, idx)}
          pageData={updatedProduct}
        >
          <Box
            as="div"
            position="relative"
            sx={productImageMainWrapperStyles}
            w={
              viewport !== 'mobile' &&
              isMobileDevice() &&
              'var(--certona-mobile-product-tile-width)'
            }
          >
            {/* product image */}
            <Box
              sx={{ ...styles.productImageWrapper }}
              minWidth={viewport === 'mobile' ? 'var(--certona-mobile-product-tile-width)' : '100%'}
            >
              <Image
                src={product.imageURL}
                h={viewport === 'mobile' ? 'var(--certona-mobile-product-tile-height)' : 'auto'}
                w={viewport === 'mobile' ? 'var(--certona-mobile-product-tile-width)' : 'auto'}
                border={`4px solid ${productTileBorderColor}`}
                alt={`${product.name}, ${product.Color}, ProductTile`}
                maxWidth={viewport === 'mobile' && 'none'}
                sx={styles.productImage}
                lazy
                data-qa={viewport === 'mobile' ? 'm_plp_link_pt_img' : 'd_plp_link_pt_img'}
              />
            </Box>
          </Box>
        </Link>

        <Link
          href={pdpUrl}
          prefetchUrl={getAPIURL(pdpUrl)}
          prefetch
          sx={styles.productLink}
          onClick={onLinkClick(updatedProduct, idx)}
          pageData={updatedProduct}
        >
          <Box
            as="div"
            position="relative"
            sx={{
              ...productImageMainWrapperStyles,
              height: 'auto',
              width: viewport === 'mobile' ? 'var(--certona-mobile-product-tile-width)' : 'auto',
            }}
            w={
              viewport !== 'mobile' &&
              isMobileDevice() &&
              'var(--certona-mobile-product-tile-width)'
            }
          >
            <Box sx={productNameWrapperStyles}>
              <Text
                data-qa="cm_pdt_link_pt_title"
                sx={{
                  ...styles.productName,
                  ...(hasATBButton && styles.atbEnabledProductName),
                }}
              >
                {product.name}
              </Text>
            </Box>
            <RecommendationPrice
              product={product}
              viewport={viewport}
              hidePrice={hidePrice}
              hideDiscount={hideCertonaDiscountHomePage}
              isHomePage={true}
              scheme={certonaData.scheme}
            />
          </Box>
        </Link>

        {isEnableCertonaHomeCTA && (
          <Link
            href={pdpUrl}
            prefetchUrl={getAPIURL(pdpUrl)}
            prefetch
            sx={styles.clickToShopLink}
            onClick={onLinkClick(updatedProduct, idx)}
            pageData={updatedProduct}
          >
            <Box sx={styles.clickToShopbtnContainer}>
              <Button target="_self" sx={styles.clickToShopbtn}>
                {ctaText ||
                  formatMessage({
                    id: 'home.certona.clickToShopCTA',
                    defaultMessage: 'CLICK TO SHOP',
                  })}
              </Button>
            </Box>
          </Link>
        )}

        {hasATBButton && (
          <Box sx={styles.addToBagButtonWrapper}>
            <AddToBagButton
              variantId={product.VariationIdV2}
              variantGroupId={product.ID}
              isSizedProduct={product.SizeFlag}
              analyticsData={{
                eventLocation: certonaData?.scheme,
                experienceId: certonaData?.experience_id,
                recAIType: 'certona',
              }}
              setIsATBButtonDisabled={setIsATBButtonDisabled}
            />
          </Box>
        )}
      </Box>
    </ImpressionSensor>
  )
}

export default withErrorBoundaryWrapper(CertonaHomeRecommendationItem)
