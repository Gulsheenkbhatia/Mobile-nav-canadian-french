import { memo, useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import EinsteinRecommendationWrapper from 'toro/components/Einstein/RecommendationContainer'
import { useAtomValue } from 'jotai/utils'
import { aeDrawerConfigAtom } from 'store/ae-drawer.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { useIntl } from 'react-intl'

type AEEinsteinRecommendationProps = {
  onItemClick: () => void
  pageType: string
  variant: 'aeDrawerGrid' | 'aeDrawer'
}

function AEEinsteinRecommendation({
  onItemClick,
  pageType,
  variant,
}: AEEinsteinRecommendationProps) {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const aeDrawerConfig = useAtomValue(aeDrawerConfigAtom)
  const { formatMessage } = useIntl()

  const {
    adaptiveExperience: { enableAEDrawerExp },
  } = usePreference({
    adaptiveExperience: ['enableAEDrawerExp'],
  })

  const recommenders = aeDrawerConfig?.recommenders?.length
    ? aeDrawerConfig.recommenders
    : get(enableAEDrawerExp, `${pageType}.recommenders`, [])

  const [recommender] = recommenders

  return (
    <EinsteinRecommendationWrapper
      pageType="PLP"
      siteId={siteId}
      recommenderData={{ recommender }}
      type="grid"
      label={formatMessage({
        id: 'pdp.product.similarStylesTitle',
        defaultMessage: 'Similar Styles',
      })}
      scheme={recommender}
      variant={variant}
      isAEDrawerGrid={true}
      onItemClick={onItemClick}
    />
  )
}

export default memo(AEEinsteinRecommendation)
