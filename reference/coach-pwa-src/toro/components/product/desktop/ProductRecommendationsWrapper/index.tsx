import React, { FC, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendationsSliderSkeleton from 'toro/components/product/desktop/RecommendationsSlider/RecommendationsSliderSkeleton'
import RecommendationsSlider, {
  RecommendationsSliderProps,
  RecommendationProvider,
} from 'toro/components/product/desktop/RecommendationsSlider'
import useEinsteinRecommendations from 'toro/components/Einstein/useEinsteinRecommendations'
import usePreference from 'toro/hooks/usePreference_new'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { useIntl } from 'react-intl'
import { CertonaScheme } from 'store/certona-schemes.atoms'
import isEmpty from 'lodash/isEmpty'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import { IMPRESSION_NAMES, PAGE_TYPES } from 'toro/constants/googleAnalytics'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import MobileRecommendationsSection from 'toro/components/product/mobile/MobileRecommendationsSection'
import { appendRrecParam } from 'toro/components/Einstein/helpers'
import useProductData from 'toro/hooks/useProductData'

export enum RecommenderPosition {
  YMAL = 'YMAL',
  RECENTLY_VIEWED = 'RECENTLY_VIEWED',
}

enum RecommenderSchemeCertona {
  YMAL = 'product1_rr',
  RECENTLY_VIEWED = 'product2_rr',
}

export enum RecommenderTypeEnstein {
  YMAL = 'product-to-product',
  RECENTLY_VIEWED = 'recently-viewed',
}

const RECOMMENDER_TITLES = {
  [RecommenderPosition.YMAL]: {
    titleMessageId: 'pdp.product.youMayLike',
    titleDefaultMessage: 'You may also like',
  },
  [RecommenderPosition.RECENTLY_VIEWED]: {
    titleMessageId: 'pdp.product.recentlyViewed',
    titleDefaultMessage: 'Recently viewed',
  },
} as const

type EinsteinRecommendationsObject = {
  recommendations: {
    recs: {
      product_url: string
      image_url: string
      product_name: string
      price: {
        currency: string
        fullprice: string
        saleprice: string
        discountpercentage: string
      }
    }[]
  }
  isLoadingRecommendations: boolean
}

type ProductRecommendationsWrapperProps = {
  recommenderPosition: RecommenderPosition
  variant?: string
}

interface RecommendationsContainerProps extends RecommendationsSliderProps {
  loading: boolean
}
const RecommendationsContainer = ({ loading, ...props }: RecommendationsContainerProps) => {
  const isPDPv6Template = useTemplate([TemplateName.pdpv6])

  if (loading) {
    return <RecommendationsSliderSkeleton />
  }
  if (!props?.products?.length) {
    return null
  }
  if (isPDPv6Template) {
    return (
      <MobileRecommendationsSection
        title={props.title}
        products={props.products}
        hidePrice={props.hidePrice}
        addImpression={props.addImpression}
        selectRecommItem={props.selectRecommItem as (payload: any) => void | Promise<void>}
        scheme={props.scheme}
      />
    )
  }

  return <RecommendationsSlider {...props} />
}

type EinsteinWrapperProps = {
  suggestionRecommender: {
    recommender: string
    recommenderName: string
  }
  titleConfig: typeof RECOMMENDER_TITLES[keyof typeof RECOMMENDER_TITLES]
}

const EinsteinWrapper: FC<EinsteinWrapperProps> = ({ suggestionRecommender, titleConfig }) => {
  const { formatMessage } = useIntl()
  const { ref, inView } = useInView({ triggerOnce: true })
  const selectedMasterId = useVariantGroupData('masterId')
  const masterId = useProductData('masterId')
  const productId = selectedMasterId || masterId

  const {
    recommendations: { recs },
    isLoadingRecommendations,
  } = useEinsteinRecommendations({
    pageType: 'PDP',
    isInView: inView,
    productId,
    recommender: suggestionRecommender?.recommender,
    isEinsteinEnabled: true,
  }) as unknown as EinsteinRecommendationsObject

  const data = useMemo(() => {
    if (recs?.length > 0 && inView) {
      const formattedEinsteinProduct = recs?.map((item) => ({
        detailURL: appendRrecParam(item.product_url),
        imageURL: `${item.image_url}?$imageRec$`,
        name: item.product_name,
        price: item.price,
        ...item,
      }))
      return formattedEinsteinProduct
    }
    return []
  }, [recs, isLoadingRecommendations, inView])

  const { addImpression, selectRecommItem } = useRecommAnalytics({
    products: data,
  })

  return (
    <Box ref={ref}>
      <RecommendationsContainer
        title={formatMessage({
          id: titleConfig.titleMessageId,
          defaultMessage: `${
            suggestionRecommender?.recommenderName || titleConfig.titleDefaultMessage
          }`,
        })}
        products={data}
        loading={isLoadingRecommendations}
        hidePrice={true} // always hide for einstein
        addImpression={addImpression}
        selectRecommItem={selectRecommItem}
        scheme={suggestionRecommender?.recommender}
        provider={RecommendationProvider.einstein}
      />
    </Box>
  )
}

type CertonaWrapperProps = {
  certonaScheme?: CertonaScheme
  hidePrice: boolean
  titleConfig: typeof RECOMMENDER_TITLES[keyof typeof RECOMMENDER_TITLES]
  variant?: string
}

const CertonaWrapper: FC<CertonaWrapperProps> = ({
  certonaScheme,
  hidePrice,
  titleConfig,
  variant,
}) => {
  const { formatMessage } = useIntl()

  const data = useMemo(() => {
    const isCertonaAvailable =
      Boolean(certonaScheme?.items?.length) && certonaScheme?.display?.toLowerCase() !== 'no'

    if (isCertonaAvailable) {
      return certonaScheme.items
    }
    return []
  }, [certonaScheme])

  const { addImpression, selectRecommItem } = useRecommAnalytics({
    products: data,
    certonaData: certonaScheme,
    impressionName: IMPRESSION_NAMES[certonaScheme?.scheme],
  })

  return (
    <Box>
      <RecommendationsContainer
        title={
          certonaScheme?.explanation ||
          formatMessage({
            id: titleConfig.titleMessageId,
            defaultMessage: titleConfig.titleDefaultMessage,
          })
        }
        products={data}
        loading={false}
        hidePrice={hidePrice}
        addImpression={addImpression}
        selectRecommItem={selectRecommItem}
        scheme={certonaScheme?.scheme}
        provider={RecommendationProvider.certona}
        experienceId={certonaScheme?.experience_id}
        variant={variant}
      />
    </Box>
  )
}

const ProductRecommendationsWrapper: FC<ProductRecommendationsWrapperProps> = ({
  recommenderPosition,
  variant,
}) => {
  const titleConfig = RECOMMENDER_TITLES[recommenderPosition]
  const productId = useSelectedVariantData('id')

  const {
    recommendations: {
      hideRecommendations,
      hideRecommendationPrice,
      disableRecommendationOnPages,
      hideRecentlyViewedOnPages,
    },
    einsteinRecommendation: { isEinsteinRecomEnabled, isEinsteinRecomEnabledPDP, recommendorsList },
    certona: { certonaEnabled = true },
  } = usePreference({
    recommendations: [
      'hideRecommendations',
      'hideRecommendationPrice',
      'disableRecommendationOnPages',
      'hideRecentlyViewedOnPages',
    ],
    EinsteinRecommendation: [
      'isEinsteinRecomEnabled',
      'isEinsteinRecomEnabledPDP',
      'recommendorsList',
    ],
    Certona: ['CertonaEnabled'],
  })

  const certonaScheme = useCertonaScheme(RecommenderSchemeCertona[recommenderPosition], {
    pagetype: PAGE_TYPES.PDP as 'product',
    enabled: certonaEnabled,
    itemid: productId,
  }) as CertonaScheme

  const hideRecommendationPages =
    recommenderPosition === RecommenderPosition.YMAL
      ? disableRecommendationOnPages
      : hideRecentlyViewedOnPages

  if (
    hideRecommendations ||
    (!!hideRecommendationPages?.length && hideRecommendationPages?.includes('PDP')) ||
    (!isEinsteinRecomEnabled && isEmpty(certonaScheme))
  ) {
    return null
  }

  const suggestionRecommender = recommendorsList?.PDP?.find(
    (recommenderItem) =>
      recommenderItem?.recommender === RecommenderTypeEnstein[recommenderPosition]
  )

  return (
    <>
      {isEinsteinRecomEnabledPDP ? (
        <EinsteinWrapper suggestionRecommender={suggestionRecommender} titleConfig={titleConfig} />
      ) : (
        <CertonaWrapper
          certonaScheme={certonaScheme}
          hidePrice={hideRecommendationPrice}
          titleConfig={titleConfig}
          variant={variant}
        />
      )}
    </>
  )
}

export default withErrorBoundaryWrapper(ProductRecommendationsWrapper)
