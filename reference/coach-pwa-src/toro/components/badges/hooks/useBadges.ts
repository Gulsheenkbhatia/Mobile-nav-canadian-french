import { useContext, useMemo } from 'react'
import BadgesContext from 'toro/components/badges/BadgesContext'
import get from 'lodash/get'
import compact from 'lodash/compact'
import { getMarketingConf } from 'toro/helpers/preferences'
import SessionContext from 'toro/components/SessionContext'
import useViewportType from 'toro/hooks/useViewportType'
import {
  MarketingConfType,
  PageTypeLc,
  ProductForBadges,
  ValidBadgeID,
} from 'toro/components/badges/types'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { BadgeVariant } from 'toro/components/badges/Badge'
import { SearchVariationGroupData } from 'toro/search'
import { VariantGroupData } from 'toro/types/productTypes/common'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

type BadgeResult = {
  badgeID: ValidBadgeID
  content: string
}

type UseBadgesParams = {
  page: PageTypeLc
  area: BadgeArea
  notAllowedBadges?: ValidBadgeID[] | null
  allowedBadges?: ValidBadgeID[] | null
  product?: ProductForBadges
  variant?: BadgeVariant
  isViewedProduct?: boolean
  variationGroupData?: SearchVariationGroupData
  selectedVG?: VariantGroupData
  instockText?: string
}

const getMarketingSlotId = (
  type: MarketingConfType,
  props: Omit<UseBadgesParams, 'page' | 'area' | 'notAllowedBadges' | 'allowedBadges'>,
  page: PageTypeLc
): string | undefined => {
  const productConf = getMarketingConf(get(props, 'product'), type)
  const groupConf = getMarketingConf(get(props, 'variationGroupData'), type)
  const masterConf = getMarketingConf(get(props, 'masterData'), type)
  const selectedVGConf = getMarketingConf(get(props, 'selectedVG'), type)

  return get(productConf || groupConf || selectedVGConf || masterConf, page)
}

const getPrivateSlotId = (
  type: MarketingConfType,
  product: ProductForBadges,
  page: PageTypeLc,
  sourceCodeGroupID: string,
  selectedVG: VariantGroupData
): string | undefined => {
  const fieldValue = get(product, `sourceCode${type}`) || get(selectedVG, `sourceCode${type}`)
  const sourceCodeConfiguration = get(fieldValue, sourceCodeGroupID)
  if (sourceCodeConfiguration) {
    return get(
      sourceCodeConfiguration.find(({ type }) => type === page),
      'contentId'
    )
  }
}

export default function useBadges({
  page,
  area,
  notAllowedBadges = null,
  allowedBadges = null,
  ...props
}: UseBadgesParams): BadgeResult[] {
  const { actions } = useContext(BadgesContext)
  const { session } = useContext(SessionContext)
  const sourceCodeGroupID = get(session, 'user.sourceCodeGroupID')
  const { isMobile = false } = useViewportType() || {}
  const isLowInventoryAboveATB = useExperiment(EXPERIMENTS.LOW_INVENTORY_ABOVE_ATB)
  const isSocialProofEnabled = useExperiment(EXPERIMENTS.SOCIAL_PROOF_MESSAGE_PDP)
  const { isAreaEnabled, maxBadgeDisplay, badges } = useMemo(() => {
    return actions.getBadgeTypesByArea({ page, area, isMobile, ...props }) || {}
  }, [
    page,
    area,
    props.product?.id,
    props.product?.inventory,
    props.variant,
    props?.isViewedProduct,
    props?.variationGroupData,
    isMobile,
  ])

  return useMemo(() => {
    if (!isAreaEnabled) {
      return []
    }

    const isBundleProduct = !!get(props, 'product.isProductSet', get(props, 'product.set'))

    return compact(
      badges
        ?.map?.((badge) => {
          const badgeContent = actions.getContentByBadgeType({
            ...(isSocialProofEnabled && { isSocialProofEnabled }),
            isBundleProduct,
            page,
            type: badge?.badgeID
              .replace(/(BadgeContent|Badgeplp|Badgepdp|Content|Messagepdp|Messageplp)/gi, '')
              .replace(/onImageCustomMarketing/gi, 'customMarketingOnImage')
              .replace(/onImageCustomBundle/gi, 'customMarketingOnImage')
              .replace(/onImagePrivateMarketing/gi, 'privateMarketingOnImage'),
          })

          if (badge?.badgeID.includes('promotionCallout')) {
            return {
              badgeID: badge?.badgeID,
              content: 'promo',
            }
          }

          if (badge?.badgeID.includes('inStockCustom')) {
            const instockCustomText = get(
              props,
              'product.custom.c_inStockCustomText',
              props?.instockText
            )

            return {
              badgeID: badge?.badgeID,
              content: `<label class="custom-badge mw-custom-badge">${instockCustomText}</label>`,
            }
          }

          let badgeContentSlotId: string | undefined

          if (
            badge?.badgeID.includes('privateMarketingBadge') ||
            badge?.badgeID.includes('onImagePrivateMarketing')
          ) {
            badgeContentSlotId = getPrivateSlotId(
              'Badge',
              props.product,
              page,
              sourceCodeGroupID,
              props.selectedVG
            )
          } else if (badge?.badgeID.includes('privateMarketingMessage')) {
            badgeContentSlotId = getPrivateSlotId(
              'Message',
              props.product,
              page,
              sourceCodeGroupID,
              props.selectedVG
            )
          } else if (
            badge?.badgeID.includes('customMarketingBadge') ||
            badge?.badgeID.includes('onImageCustomBundleBadge') ||
            badge?.badgeID.includes('onImageCustomMarketingBadge')
          ) {
            badgeContentSlotId = getMarketingSlotId('Badge', props, page)
          } else if (badge?.badgeID.includes('customMarketingMessage')) {
            badgeContentSlotId = getMarketingSlotId('Message', props, page)
          } else {
            badgeContentSlotId = get(badgeContent, 'contentId')
            if (
              badgeContentSlotId === 'only-few-left-badge-default' &&
              (isLowInventoryAboveATB || isSocialProofEnabled) &&
              isMobile
            ) {
              badgeContentSlotId = 'only-few-left-badge-alternate'
            }
          }

          const badgeContentSlot = actions.getContentSlotBySlotId(badgeContentSlotId, props.product)

          if (!badgeContent || !badgeContent.enabled || !badgeContentSlot) {
            return null
          }

          return {
            badgeID: badge?.badgeID,
            content: badgeContentSlot,
          }
        })
        ?.filter((badge) => {
          if (badge?.content) {
            if (Array.isArray(allowedBadges) && allowedBadges?.length) {
              return allowedBadges.includes(badge?.badgeID)
            }
            if (Array.isArray(notAllowedBadges) && notAllowedBadges?.length) {
              return !notAllowedBadges.includes(badge?.badgeID)
            }
            return Boolean(badge)
          }
          return false
        })
        ?.slice(0, maxBadgeDisplay)
    )
  }, [
    badges,
    page,
    props.product?.id,
    maxBadgeDisplay,
    isAreaEnabled,
    sourceCodeGroupID,
    notAllowedBadges,
    allowedBadges,
    isLowInventoryAboveATB,
    isSocialProofEnabled,
  ])
}
