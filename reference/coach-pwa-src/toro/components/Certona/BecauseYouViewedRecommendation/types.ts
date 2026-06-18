import { CertonaPageType, CertonaSchemeType } from 'store/certona-schemes.atoms'

export type BecauseYouViewedRecommendationProps = {
  itemId?: string
  hidePrice: boolean
  certonaScheme: CertonaSchemeType
  pageType: CertonaPageType
  variant?: string
  isBecauseYouViewedVariant2Enabled?: boolean
}
