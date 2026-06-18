import { CertonaScheme } from 'store/certona-schemes.atoms'

export type EnhancedRecommendationProps = {
  recommendationData: CertonaScheme
  skeletonVisible?: boolean
  variant?: string
  label: string
}

export type EnhancedCarouselProps = {
  recommendationData: CertonaScheme
  variant?: string
  label: string
}
