import { CertonaSchemeType, CertonaPageType } from 'store/certona-schemes.atoms'

export type CertonaTabFilterType = {
  filterType: string
  displayValue: string
  value: string
  viewAllTitle: string
  viewAllLink: string
}

export type MatchExperienceConfigType = {
  title: string
  recommender: CertonaSchemeType
  filters: CertonaTabFilterType[]
  channels?: Record<string, string>
}

export type TabbedRecommendation = {
  categoryID?: string
  hideRecommendationPrice?: boolean
  matchExperienceConfig?: MatchExperienceConfigType
  pageType: CertonaPageType
  variant: 'tabbedPDPRecommendation' | 'tabbedRecommendation' | 'inlinePDPv6'
  itemId?: string
  userChannel?: string
}
