import { FC, useCallback, useState } from 'react'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import WhoopsMessage from 'toro/components/AEDrawer/WhoopsMessage'
import { ResponseRecommendations } from 'toro/components/RecommendationsContainer/types'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import { useAtomValue } from 'jotai/utils'
import { aeDrawerConfigAtom } from 'store/ae-drawer.atom'
import { XgenContainerID } from 'lib/xgen'

interface AEXgenRecommendationProps {
  variant: 'aeDrawerGrid' | 'aeDrawer'
  closeAeDrawer: () => void
  pageType: string
}

const AEXgenRecommendation: FC<AEXgenRecommendationProps> = ({
  variant,
  closeAeDrawer,
  pageType,
}) => {
  const aeDrawerConfig = useAtomValue(aeDrawerConfigAtom)
  const {
    recommendations: { disabledSchemes = [] },
    adaptiveExperience: { enableAEDrawerExp },
  } = usePreference({
    recommendations: ['disabledSchemes'],
    adaptiveExperience: ['enableAEDrawerExp'],
  })
  const [isEmptyResponse, setIsEmptyResponse] = useState(false)

  const [recommender] = aeDrawerConfig?.recommenders?.length
    ? aeDrawerConfig.recommenders
    : get(enableAEDrawerExp, `${pageType}.recommenders`, [])

  const type = recommender || (pageType === 'PDP' ? 'ae_drawer' : 'ae_drawer_plp')
  const isDisabled = disabledSchemes.includes(XgenContainerID[type])

  const onResponse = useCallback(
    (response: ResponseRecommendations) => {
      if (!response?.items?.length) setIsEmptyResponse(true)
    },
    [type]
  )

  if (isEmptyResponse || isDisabled) {
    return <WhoopsMessage closeAeDrawer={closeAeDrawer} />
  }

  return (
    <RecommendationsContainer
      type={type}
      vgId={aeDrawerConfig.activeProduct.vgId}
      variant={variant}
      onResponse={onResponse}
      closeAeDrawer={closeAeDrawer}
    />
  )
}

export default AEXgenRecommendation
