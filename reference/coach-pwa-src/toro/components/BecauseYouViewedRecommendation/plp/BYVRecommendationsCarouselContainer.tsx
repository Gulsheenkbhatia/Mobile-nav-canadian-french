import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai/utils'

import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useBYVRecommendations from 'toro/hooks/useBYVRecommendations'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { XgenContainerID } from 'lib/xgen'

const CollapsibleRecommendationsCarousel = dynamic(
  () => import('toro/components/CollapsibleRVRecommendationsCarousel'),
  { ssr: false }
)

function BYVCollapsibleInner({ defaultExpanded }: { defaultExpanded: boolean }) {
  const {
    eyebrowLabel,
    title,
    referenceProduct,
    products,
    display,
    experienceId,
    vendorScheme,
    addImpression,
    selectRecommItem,
  } = useBYVRecommendations()

  const styles = useMultiStyleConfig('CollapsibleRVCarousel', {})

  const headerSlot = (
    <>
      {referenceProduct?.imageURL && (
        <Box sx={styles.thumbnailImage}>
          <Image
            sx={styles.thumbnailImageInner}
            src={referenceProduct.imageURL}
            alt={referenceProduct?.name}
            data-qa="byv-reference-thumbnail"
          />
        </Box>
      )}
      <Box sx={styles.byvHeaderTextWrapper}>
        <Text sx={styles.byvEyebrowText} data-qa="byv-eyebrow-label">
          {eyebrowLabel}
        </Text>
        {referenceProduct?.name && (
          <Text sx={styles.collapsibleTitle} data-qa="byv-primary-title">
            {referenceProduct.name}
          </Text>
        )}
      </Box>
    </>
  )

  return (
    <CollapsibleRecommendationsCarousel
      products={products}
      display={display}
      title={eyebrowLabel || title}
      experienceId={experienceId}
      vendorScheme={vendorScheme}
      addImpression={addImpression}
      selectRecommItem={selectRecommItem}
      location="PLP"
      defaultExpanded={defaultExpanded}
      headerSlot={headerSlot}
      containerId="byv_collapsible_container"
      carouselId="byv_collapsible_carousel"
      headerDataQa="byv-collapsible-header"
    />
  )
}

function BYVRecommendationsCarouselContainer() {
  const {
    adaptiveExperience: { becauseYouViewed },
    recommendations: { disabledSchemes = [] },
  } = usePreference({
    adaptiveExperience: ['becauseYouViewed'],
    recommendations: ['disabledSchemes'],
  })

  const isVariant2Enabled = useExperiment(EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2)
  const { recommendations: isXgenEnabled } = useAtomValue(xgenFeaturesAtom)

  const isSchemaDisabled = disabledSchemes.includes(XgenContainerID.sm_el_sitevisit1)

  if (isSchemaDisabled || !becauseYouViewed?.plp || !isVariant2Enabled || !isXgenEnabled) {
    return null
  }

  return <BYVCollapsibleInner defaultExpanded={Boolean(becauseYouViewed?.plpTopExpanded)} />
}

export default BYVRecommendationsCarouselContainer
