import { memo } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import RecommendationItem from 'toro/components/Certona/RecommendationItem'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import useViewportType from 'toro/hooks/useViewportType'
import Grid from 'toro/components/Grid'
import LLMRecommendationPrice from './LLMRecommendationPrice'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import usePageType from 'toro/hooks/usePageType'
import { useIntl } from 'react-intl'

const defaultPromoDisabledSchemes = []

const LLMRecommendations = ({
  products,
  variant = undefined,
  isGrid = false,
  onItemClick = undefined,
  hidePrice = false,
  scheme = 'product1_llm',
  hideLabel = false,
  hideLLMPromo = false,
  hideWishlist = false,
  label = undefined,
}) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('LLMRecommendation', { variant })
  const labelValue =
    label ??
    formatMessage({
      id: 'pdp.product.shopSimilarTitle',
      defaultMessage: 'Visually Similar',
    })
  const { viewport } = useViewportType()
  const { isPLP } = usePageType()
  const { addImpression, selectRecommItem, addToWishlistRecommItem } = useRecommAnalytics({
    products,
    certonaData: {
      experience_id: 'product1_llm',
    },
  })

  const {
    toggleSiteFeatures: { enableVisuallySimilar },
    recommendations: { promoDisabledSchemes = defaultPromoDisabledSchemes },
  } = usePreference({
    ToggleSiteFeatures: ['enableVisuallySimilar'],
    recommendations: ['promoDisabledSchemes'],
  })

  const enableVisuallySimilarStrikeOffPrice = get(
    enableVisuallySimilar,
    'enableVisuallySimilarStrikeOffPrice',
    false
  )
  const hideVisuallySimilarPrice = get(enableVisuallySimilar, 'hideVisuallySimilarPrice', false)
  const dataQaPromotionalCallout = isPLP
    ? 'plp_visually_similar_llm_promotions'
    : 'pdp_visually_similar_llm_promotions'
  const isLLMPromoDisabled = promoDisabledSchemes.includes('visually_similar')

  if (isGrid) {
    return (
      <Flex sx={styles.recommendationGridWrapper} flexDirection="column" w="100%">
        {!hideLabel && labelValue && (
          <Box as="h2" sx={styles.title} data-qa="visually_similar_llm_title">
            {labelValue}
          </Box>
        )}
        <Grid sx={styles.mobileRecommendationGrid}>
          {products?.map((product, idx: number) => (
            <RecommendationItem
              key={`recommendation-item-${idx}`}
              product={product}
              idx={idx}
              hidePrice={hidePrice}
              viewport={viewport}
              addImpression={addImpression}
              selectRecommItem={selectRecommItem}
              addToWishlistRecommItem={addToWishlistRecommItem}
              variant={variant}
              isSendOnceInViewport={true}
              isLLMrecommendation={true}
              onItemClick={onItemClick}
              label={labelValue}
              scheme={scheme}
              hideLLMPromo={hideLLMPromo}
              dataQaPromotionalCallout={dataQaPromotionalCallout}
              hideWishlist={hideWishlist}
            />
          ))}
        </Grid>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" w="100%" sx={styles.wrapper}>
      {!hideLabel && labelValue && (
        <Box as="h2" sx={styles.title} data-qa="visually_similar_llm_title">
          {labelValue}
        </Box>
      )}
      <Box maxW="100vw" sx={styles.mobileRecommendationWrapper}>
        <Flex
          maxWidth="100vw"
          sx={styles.mobileRecommendationItems}
          className="mob-recommend-items"
        >
          {products?.map?.((product, idx) => {
            return (
              <Box key={product?.ID}>
                <RecommendationItem
                  idx={idx}
                  product={product}
                  label={labelValue}
                  viewport="mobile"
                  variant="LLMRecommendation"
                  hidePrice={hideVisuallySimilarPrice || !enableVisuallySimilarStrikeOffPrice}
                  addImpression={addImpression}
                  selectRecommItem={selectRecommItem}
                  addToWishlistRecommItem={addToWishlistRecommItem}
                  isSendOnceInViewport={true}
                  isLLMrecommendation={true}
                  scheme={scheme}
                  hideLLMPromo={hideLLMPromo}
                />
                {!hideVisuallySimilarPrice && !enableVisuallySimilarStrikeOffPrice && (
                  <LLMRecommendationPrice product={product} styles={styles} />
                )}
                {!isLLMPromoDisabled &&
                  product.promotionalCallouts?.map(({ type, content }) => (
                    <Box
                      data-qa={dataQaPromotionalCallout}
                      key={type}
                      sx={styles.llmPromotion}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ))}
              </Box>
            )
          })}
        </Flex>
      </Box>
    </Flex>
  )
}

export default memo(LLMRecommendations)
