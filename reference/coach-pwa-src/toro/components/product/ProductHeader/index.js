import Heading from 'toro/components/Heading'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import StarRating from 'toro/components/StarRating'
import Text from 'toro/components/Text'
import get from 'lodash/get'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import Hidden from 'toro/components/Hidden'
import PriceBadge from 'toro/components/product/PriceBadge'
import usePreference from 'toro/hooks/usePreference_new'
import getAPIURL from 'helpers/getAPIURL'
import Link from 'toro/components/Link'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useMemo, useState } from 'react'
import IconContainer from 'toro/components/product/IconContainer'
import PropTypes from 'prop-types'
import Image from 'toro/components/Image'
import OnPurposePopOver from '../OnPurposePopOver'
import SaveForLater from 'toro/components/SaveForLater'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import { getAverageRating, getTotalReviews } from 'toro/helpers/getReviewData'

const messages = []

function ProductHeader({
  currentVariationGroupId,
  tangibleeWidgetProps,
  onAddToWishlistSuccess,
  onRemoveFromWishlistSuccess,
  productData,
  variant,
  badges,
  allLevelsProductsData,
  isDiscontinued,
  isQuickView,
  selectedColor,
  apploading,
  isBundleVariant,
  selectedVariantData,
  bundleVariantUrl,
  bundleCardRedirect,
  selectedBundleVariantsData,
  selectedVariant,
  onPurposeProps,
}) {
  const { formatMessage } = useIntl()
  const { isMobile } = useViewportType()
  const styles = useMultiStyleConfig('ProductHeader', {
    variant: isBundleVariant && isMobile && 'bundle',
  })
  const quickviewStyles = useMultiStyleConfig('ProductHeader', { variant: 'quickview' })
  const mobileStyles = useMultiStyleConfig('ProductHeader', { variant: 'mobile' })
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const {
    name,
    isBundleProduct = false,
    megaPDPEligibleOptions = {},
    isNewMegaPDP = false,
  } = productData || {}
  const isNewMegaPDPTurnOn = get(megaPDPEligibleOptions, 'isMegaPDPEligible', false) && isNewMegaPDP
  const { url: activeUrl } = selectedVariantData || selectedColor || productData || {}

  const pref = usePreferenceGroup({ groupId: 'badging' })
  const {
    powerReviews: { isEnableLoaderOnPDP = true, enableEmplifi: isReviewsEnabled = true },
    pdpPreferences: { enableProductSKU = false },
  } = usePreference({
    powerReviews: ['isEnableLoaderOnPDP', 'enableEmplifi'],
    PDPPreferences: ['enableProductSKU'],
  })

  const averageRating = getAverageRating(productData)
  const totalReviews = getTotalReviews(productData)

  const isEnableFitReviewLink = get(productData, 'isEnableFitReviewLink')
  const [isOnPurposeOpen, setIsOnPurposeOpen] = useState(false)
  const { textSize } = useStyleConfig('ProductHeader', {
    variant: isQuickView ? 'quickview' : variant,
  })
  const isTangibleeVisible = tangibleeWidgetProps?.onHeroImage && tangibleeWidgetProps?.isVisible
  const isOnlyColor = Object.keys(get(selectedVariant, 'variationValues', {})).every(
    (item) => item === 'color'
  )
  const { isOnPurposeEnabled, onPurposeMaterials, onPurposeBadgeImage } = onPurposeProps || {}
  const saveForLaterVariant = useMemo(
    () =>
      selectedColor?.isCustomized || selectedColor?.isMonogrammed
        ? { ...selectedColor, productId: selectedColor?.id }
        : !isOnlyColor
        ? selectedVariant
        : {
            ...selectedColor,
            productId: currentVariationGroupId,
          },
    [
      selectedVariant?.id,
      currentVariationGroupId,
      selectedColor?.isCustomized,
      selectedColor?.isMonogrammed,
    ]
  )
  function handleOnPurposeEnter() {
    setIsOnPurposeOpen(true)
  }

  function handleOnPurposeLeave() {
    setIsOnPurposeOpen(false)
  }

  const renderStarRating = (additionalProps) => {
    const starRating = (
      <StarRating
        rating={averageRating}
        count={totalReviews}
        variant={variant}
        fitReview={isEnableFitReviewLink}
        isQuickView={isQuickView}
        bundleCardRedirect={bundleCardRedirect}
        {...additionalProps}
      />
    )

    const currentUrl = isBundleVariant ? bundleVariantUrl : activeUrl
    const matches = currentUrl?.match(/[a-z\d]+=[a-z\d]+/gi)
    const count = matches ? matches.length : 0

    return isQuickView || isBundleVariant ? (
      <Link
        href={
          isBundleVariant
            ? `${currentUrl}`
            : `${currentUrl}${count === 0 ? '?' : '&'}scrollToReview=true`
        }
        variant="unstyled"
        prefetchUrl={getAPIURL(currentUrl)}
        pointerEvents={isEnableLoaderOnPDP ? null : 'none'}
      >
        {starRating}
      </Link>
    ) : (
      <>{starRating}</>
    )
  }

  const productHeaderTitle = useMemo(
    () => ({
      productHeaderTileStyle: styles.productHeaderTitle({
        variant,
        isBundleVariant,
        textSize,
        isNewMegaPDPTurnOn,
      }),
      badgeWrapper: styles.badgesWrapper(pref),
    }),
    [variant, isBundleVariant, textSize, pref]
  )
  const onPurposePopOverProps = { className: 'tooltip-content' }
  const renderPopOver = (onPurposePopOverProps) => {
    if (isOnPurposeOpen && onPurposeMaterials) {
      return (
        <div dangerouslySetInnerHTML={{ __html: onPurposeMaterials }} {...onPurposePopOverProps} />
      )
    }
  }

  const onPurposeImageProps = {
    src: onPurposeBadgeImage,
    ...styles.productHeaderOnPurposeBadgeImage,
  }
  const renderImage = (onPurposeImageProps) => <Image {...onPurposeImageProps} />

  const ProductHeading = (
    <Heading
      level="1"
      variant="secondary"
      data-qa={
        isQuickView
          ? 'qv_txt_pdt_name'
          : isBundleVariant
          ? 'bundle_look_pdt_name_txt'
          : 'pdp_txt_pdt_title'
      }
      sx={{
        ...productHeaderTitle.productHeaderTileStyle,
      }}
      className={bundleCardRedirect ? 'individual-bundle-product-title' : 'pdp-product-title'}
    >
      {name}
      {isOnPurposeEnabled && variant !== 'mobile' && (
        <OnPurposePopOver
          sx={styles.productHeaderOnPurposeBadge}
          onMouseEnter={handleOnPurposeEnter}
          onMouseLeave={handleOnPurposeLeave}
        >
          {renderImage(onPurposeImageProps)}
          {renderPopOver(onPurposePopOverProps)}
        </OnPurposePopOver>
      )}
    </Heading>
  )

  const ProductHeadingRedesign = (
    <Flex sx={styles.productHeadingWrapper}>
      {ProductHeading}
      {!isBundleVariant && (
        <SaveForLater
          name={productData.name}
          selectedColor={selectedColor}
          productData={productData}
          selectedVariant={saveForLaterVariant}
          onAddToWishlistSuccess={onAddToWishlistSuccess}
          onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
          isTangibleeVisible={isTangibleeVisible}
          className="wishlist-btn js-wishlist-btn"
          isQuickView={isQuickView}
          pdpQaTag={isMobile ? 'pdpQaTagMobile' : 'pdpQaTag'}
          isProductHeader
          isNewMegaPDPTurnOn={isNewMegaPDPTurnOn}
        />
      )}
    </Flex>
  )

  const mobileBadgesStyle =
    typeof mobileStyles?.badges === 'function' ? mobileStyles?.badges(pref) : ''

  const isHideReview = productData?.custom?.c_hideReview
  const reviewAndRatingStyles = useMemo(
    () => styles.ReviewAndRating(isBundleVariant, totalReviews, averageRating),
    [isBundleVariant, totalReviews, averageRating]
  )
  const reviewAndRatingStylesMobile = useMemo(
    () =>
      styles.ReviewAndRatingDesktop(
        isBundleVariant,
        totalReviews,
        averageRating,
        variant,
        isQuickView
      ),
    [isBundleVariant, totalReviews, averageRating, variant, isQuickView]
  )
  const productSKUId = useMemo(() => {
    if (!enableProductSKU) {
      return ''
    }

    if (isBundleVariant) {
      const { id } = selectedBundleVariantsData || {}
      const { requestedVariantId } = productData?.normalizeBundleProduct || {}
      const bundleVariantSKUId = id || requestedVariantId || ''
      return bundleVariantSKUId
    } else {
      const { productId } = productData?.defaultVariant || ''
      const productSKUValue = selectedVariantData?.id || selectedVariant?.id || productId
      return productSKUValue
    }
  }, [enableProductSKU, selectedVariantData, selectedBundleVariantsData, selectedVariant?.id])
  return (
    <Box
      width={variant === 'mobile' && '100%'}
      data-qa="d_qv_txt_pdt_wrapper"
      sx={styles.productHeadingBadgesWrapper}
    >
      <IconContainer />
      {isBundleVariant && (
        <Link href={bundleVariantUrl} prefetchUrl={getAPIURL(bundleVariantUrl)} scroll={false}>
          <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
            {ProductHeadingRedesign}
          </Experiment>
          <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
            {ProductHeading}
          </Experiment>
        </Link>
      )}
      {!isBundleVariant && (
        <>
          <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
            {ProductHeadingRedesign}
          </Experiment>
          <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
            {ProductHeading}
          </Experiment>
        </>
      )}
      {productSKUId && !isBundleProduct && (
        <Flex>
          <Box>
            <Text fontSize="xs" as="span" sx={styles.productSku}>
              <span>
                {formatMessage({
                  id: 'pdp.product.productSKU',
                  defaultMessage: 'Product number',
                })}
              </span>
              : {productSKUId}
            </Text>
          </Box>
        </Flex>
      )}
      <Hidden onNonMobile mb="10px" sx={mobileStyles.badgesWrapper}>
        <Flex sx={styles.badgeWrapper(variant)}>
          {!isBundleVariant && badges && (
            <Box className="pdp-header-badges-container">
              <Box sx={mobileBadgesStyle}>
                <Flex
                  wrap={'wrap'}
                  className="pdp-header-badges-list"
                  gridGap={1}
                  sx={styles.badgesListContainer}
                >
                  {badges}
                </Flex>
              </Box>
            </Box>
          )}
          {isPDPV3Mobile &&
            isBundleVariant &&
            isReviewsEnabled &&
            (totalReviews > 0 || averageRating > 0) &&
            !isHideReview && (
              <ConditionalWrapper
                Wrapper={Experiment}
                notForIDs={EXPERIMENTS.PDP_V3}
                condition={!isBundleVariant}
              >
                <Box>
                  <Box sx={reviewAndRatingStyles} className="rating-and-review-container">
                    {/* removed preference condition as preference we are laoding client side. later we can move it to server side. */}
                    {(totalReviews > 0 || averageRating > 0) && (
                      <Box>
                        <Flex
                          sx={mobileStyles.reviewsWrapper}
                          className="rating-and-review-flex-container"
                        >
                          {renderStarRating()}
                        </Flex>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ConditionalWrapper>
            )}
        </Flex>
      </Hidden>
      <Hidden onMobile>
        {!isBundleVariant && badges && (
          <Box sx={productHeaderTitle.badgeWrapper}>{badges && <Flex>{badges}</Flex>}</Box>
        )}
        {isReviewsEnabled && (totalReviews > 0 || averageRating > 0) && !isHideReview && (
          <Box sx={reviewAndRatingStylesMobile}>
            {/* removed preference condition as preference we are laoding client side. later we can move it to server side. */}
            {(totalReviews > 0 || averageRating > 0) && (
              <Flex sx={isQuickView ? quickviewStyles.reviewsContainer : styles.reviewsContainer}>
                {renderStarRating({
                  pdpQaTag: 'pdpQaTag',
                  productData,
                })}
              </Flex>
            )}
          </Box>
        )}
      </Hidden>
      {!isDiscontinued && !isBundleVariant && (
        <Hidden onMobile w="100%">
          <PriceBadge
            productData={productData}
            allLevelsProductsData={allLevelsProductsData}
            variant={variant}
            isQuickView={isQuickView}
            selectedColor={selectedColor}
            apploading={apploading}
            selectedVariantData={selectedVariantData}
            selectedVariant={selectedVariant}
          />
        </Hidden>
      )}

      {!!messages?.length && (
        <Box sx={styles.headerPromoMessages}>
          {messages.map((message) => (
            <ProductInfoMessage key={message} isQuickView={isQuickView}>
              {message}
            </ProductInfoMessage>
          ))}
        </Box>
      )}
    </Box>
  )
}

ProductHeader.propTypes = {
  productData: PropTypes.object,
  variant: PropTypes.string,
  allLevelsProductsData: PropTypes.object,
  isDiscontinued: PropTypes.bool,
  isQuickView: PropTypes.bool,
  selectedColor: PropTypes.object,
  apploading: PropTypes.bool,
  isBundleVariant: PropTypes.bool,
  selectedVariantData: PropTypes.object,
  bundleVariantUrl: PropTypes.string,
  bundleCardRedirect: PropTypes.bool,
  selectedBundleVariantsData: PropTypes.object,
}

ProductHeader.defaultProps = {
  productData: {},
  variant: '',
  allLevelsProductsData: {},
  isDiscontinued: false,
  isQuickView: false,
  apploading: false,
  isBundleVariant: false,
  bundleVariantUrl: '',
  bundleCardRedirect: false,
  selectedBundleVariantsData: {},
}

export default ProductHeader
