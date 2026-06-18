import { memo } from 'react'
import { SystemStyleObject } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai/utils'
import { visuallySimilarDataAtom, isVisuallySimilarDataInitializedAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import EinsteinSkeleton from 'toro/components/Einstein/EinsteinSkeleton'
import get from 'lodash/get'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import AEXgenRecommendation from './AEXgenRecommendation'

const AECertonaRecommendations = dynamic(
  () => import('toro/components/AEDrawer/AECertonaRecommendations'),
  {
    ssr: false,
  }
)

const AEEinsteinRecommendation = dynamic(
  () => import('toro/components/AEDrawer/AEEinsteinRecommendation'),
  {
    ssr: false,
  }
)

const LLMRecommendations = dynamic(() => import('toro/components/LLMRecommendations'), {
  ssr: false,
})

type AEDrawerBodyProps = {
  closeOnItemClick: () => void
  variant: 'aeDrawerGrid' | 'aeDrawer'
  styles: Record<string, SystemStyleObject | any>
  pageType: string
}

function AEDrawerBody({ closeOnItemClick, variant, styles, pageType }: AEDrawerBodyProps) {
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const isVisuallySimilarDataInitialized = useAtomValue(isVisuallySimilarDataInitializedAtom)
  const { recommendations: isXgenExperience } = useAtomValue(xgenFeaturesAtom)

  const {
    einsteinRecommendation: { isEinsteinRecomEnabled },
    toggleSiteFeatures: { enableVisuallySimilar },
  } = usePreference({
    EinsteinRecommendation: ['isEinsteinRecomEnabled'],
    ToggleSiteFeatures: ['enableVisuallySimilar'],
  })

  const isPDP = pageType === 'PDP'

  const hideVisuallySimilarPrice = get(enableVisuallySimilar, 'hideVisuallySimilarPrice', false)

  if (!isPDP && !isVisuallySimilarDataInitialized) {
    return <EinsteinSkeleton variant={variant} />
  }

  if (!isPDP && visuallySimilarData?.length) {
    return (
      <LLMRecommendations
        products={visuallySimilarData}
        variant={variant}
        onItemClick={closeOnItemClick}
        isGrid={true}
        hidePrice={hideVisuallySimilarPrice}
      />
    )
  }

  if (isEinsteinRecomEnabled) {
    return (
      <AEEinsteinRecommendation onItemClick={closeOnItemClick} pageType="PLP" variant={variant} />
    )
  }

  if (isXgenExperience) {
    return (
      <AEXgenRecommendation
        variant={variant}
        closeAeDrawer={closeOnItemClick}
        pageType={pageType}
      />
    )
  }

  return (
    <AECertonaRecommendations
      closeOnItemClick={closeOnItemClick}
      isPDP={isPDP}
      variant={variant}
      styles={styles}
    />
  )
}

export default memo(AEDrawerBody)
