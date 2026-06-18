import type { FC } from 'react'
import { useIntl } from 'react-intl'
import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import CharmsSelector from 'toro/components/product/mobile/v7/CharmsSelector'
import SketchContainer from 'toro/components/product/mobile/v7/SketchContainer'
import WaysToWear from 'toro/components/product/mobile/v7/WaysToWear'
import AnchorSection from 'toro/components/product/mobile/v7/PDPAnchorNavV7/AnchorSection'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import SignatureFeaturesShoes from 'toro/components/product/mobile/v7/SignatureFeaturesShoes'
import ProductSpecifications from 'toro/components/product/mobile/v7/ProductSpecifications'
import usePreference from 'toro/hooks/usePreference_new'
import ContentAreas from 'toro/components/product/mobile/v7/ContentAreas'
import CompareToolsSection from 'toro/components/product/mobile/CompareToolsSection'
import useBagLowerStackFlags from 'toro/components/product/mobile/v7/hooks/useBagLowerStackFlags'
import { useIntroBrowserSession } from 'toro/hooks/useIntroBrowserSession'
import useProductCategoryFlags from 'toro/hooks/useProductCategoryFlags'
import RecentlyViewedContainer from 'toro/components/product/mobile/v7/RecentlyViewed'
import { RecommenderPosition } from 'toro/components/product/desktop/ProductRecommendationsWrapper'
import RatingsAndReviewsSectionV7 from 'toro/components/product/mobile/v7/RatingsAndReviewsSection'
import UGCContainer from 'toro/components/product/desktop/UGC/UGCContainer'
import YouMayAlsoLikeContainer from 'toro/components/product/mobile/v6/YouMayAlsoLikeContainer'
import {
  lowerStackDefaults,
  type PdpV7StackModuleId,
} from 'toro/components/product/mobile/v7/constants'
import {
  narrowPreferenceLowerStackOrder,
  resolveLowerStackCategory,
} from 'toro/components/product/mobile/v7/helpers/lowerStackModuleOrder'

const SignatureFeatures = dynamic(
  () => import('toro/components/product/mobile/v7/SignatureFeatures'),
  { ssr: false }
)

const ShoeMakeItYoursUpsell = () => {
  const { formatMessage } = useIntl()
  const {
    pdpPreferences: { templateConfigs: { pdpv7: { makeItYoursRecsLimit = 3 } = {} } = {} },
  } = usePreference({
    PDPPreferences: ['templateConfigs'],
  })

  return (
    <RecommendationsContainer
      type="upsellRecs"
      variant="recommendationsStack"
      limit={makeItYoursRecsLimit}
      showDivider={false}
      enableHeaderTitle={true}
      headerTitle={formatMessage({
        id: 'pdp.recommendations.upsellRecsHeaderTitle',
        defaultMessage: 'Make it yours',
      })}
      enableInlineAddToBag={true}
    />
  )
}

const SketchModule: FC = () => (
  <AnchorSection id="sketch">
    <SketchContainer />
  </AnchorSection>
)

const WaysToWearModule: FC = () => {
  const { isBagCategory } = useProductCategoryFlags()
  if (!isBagCategory) return null
  return (
    <AnchorSection id="waysToWear">
      <WaysToWear />
    </AnchorSection>
  )
}

const SpecsModule: FC = () => (
  <AnchorSection id="specs">
    <ProductSpecifications />
  </AnchorSection>
)

const FeaturesModule: FC = () => {
  const { isBagCategory, isShoeCategory } = useProductCategoryFlags()
  const { isFirstIntroBrowserSessionActive } = useIntroBrowserSession()
  const { isTangibleeEnabled } = useBagLowerStackFlags()

  const showBagFeatures = isBagCategory && isTangibleeEnabled
  const showShoeFeatures = isShoeCategory && isFirstIntroBrowserSessionActive

  if (!showBagFeatures && !showShoeFeatures) return null

  return (
    <AnchorSection id="features">
      {showBagFeatures ? <SignatureFeatures /> : <SignatureFeaturesShoes />}
    </AnchorSection>
  )
}

const MakeItYoursModule: FC = () => {
  const { isBagCategory, isShoeCategory } = useProductCategoryFlags()
  const { isBagCharmsSelectorVisible } = useBagLowerStackFlags()

  const showBagCharms = isBagCategory && isBagCharmsSelectorVisible
  const showShoeUpsell = isShoeCategory

  if (!showBagCharms && !showShoeUpsell) return null

  return (
    <AnchorSection id="makeItYours">
      {showBagCharms ? <CharmsSelector /> : <ShoeMakeItYoursUpsell />}
    </AnchorSection>
  )
}

const ContentAreasModule: FC = () => (
  <AnchorSection id="contentAreas">
    <ContentAreas area={1} />
    <ContentAreas area={2} />
    <ContentAreas area={3} />
  </AnchorSection>
)

const CompareModule: FC = () => (
  <AnchorSection id="compare">
    <CompareToolsSection />
  </AnchorSection>
)

const UgcModule: FC = () => {
  const styles = useMultiStyleConfig('TemplateContainerV7')
  return (
    <AnchorSection id="ugc">
      <Box sx={styles.ugcContainer}>
        <UGCContainer />
      </Box>
    </AnchorSection>
  )
}

const YmalModule: FC = () => (
  <AnchorSection id="ymal">
    <YouMayAlsoLikeContainer type="ymal" variant="visuallySimilarPDPv7" />
  </AnchorSection>
)

const RecentlyViewedModule: FC = () => (
  <AnchorSection id="recentlyViewed">
    <RecentlyViewedContainer
      type="recentlyviewed"
      recommenderPosition={RecommenderPosition.RECENTLY_VIEWED}
      variant="recentlyViewedV7"
    />
  </AnchorSection>
)

const ReviewsModule: FC = () => (
  <AnchorSection id="reviews">
    <RatingsAndReviewsSectionV7 />
  </AnchorSection>
)

const MODULES: Record<PdpV7StackModuleId, FC> = {
  sketch: SketchModule,
  waysToWear: WaysToWearModule,
  specs: SpecsModule,
  features: FeaturesModule,
  contentAreas: ContentAreasModule,
  makeItYours: MakeItYoursModule,
  compare: CompareModule,
  ugc: UgcModule,
  ymal: YmalModule,
  recentlyViewed: RecentlyViewedModule,
  reviews: ReviewsModule,
}

const PdpV7LowerStack = () => {
  const { isBagCategory, isShoeCategory } = useProductCategoryFlags()
  const { isFirstIntroBrowserSessionActive } = useIntroBrowserSession()
  const lowerStackCategory = resolveLowerStackCategory(isBagCategory, isShoeCategory)
  const session = isFirstIntroBrowserSessionActive ? 'firstVisit' : 'repeatVisit'

  const {
    pdpPreferences: {
      templateConfigs: {
        pdpv7: { lowerStackModuleOrder: lowerStackOrderPreference = {} } = {},
      } = {},
    } = {},
  } = usePreference({
    PDPPreferences: ['templateConfigs'],
  })

  const preferenceModuleIds = lowerStackOrderPreference?.[lowerStackCategory]?.[session]

  const renderedModuleIds: readonly PdpV7StackModuleId[] = preferenceModuleIds?.length
    ? narrowPreferenceLowerStackOrder(preferenceModuleIds)
    : lowerStackDefaults[lowerStackCategory][session]

  return (
    <>
      {renderedModuleIds.map((moduleId) => {
        const Module = MODULES[moduleId]
        return <Module key={moduleId} />
      })}
    </>
  )
}

export default PdpV7LowerStack
