import React, { memo } from 'react'
import Badge, { BadgeVariant } from 'toro/components/badges/Badge'
import useBadges from 'toro/components/badges/hooks/useBadges'
import get from 'lodash/get'
import { PageTypeLc, ProductForBadges, ValidBadgeID } from 'toro/components/badges/types'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { badgeTypes, badgeTypesOnImage } from 'toro/components/badges/constants/badgeTypes'
import { SystemStyleObject } from '@chakra-ui/react'

type BadgesProps = {
  page: PageTypeLc
  area: BadgeArea
  variant?: BadgeVariant
  maxDisplayedBadges?: number
  templateVariant?: string
  product?: ProductForBadges
  notAllowedBadges?: ValidBadgeID[]
  sx?: SystemStyleObject
}

const soldOutBadgeIds: ValidBadgeID[] = [badgeTypes.isSoldOut, badgeTypesOnImage.isSoldOut]

const Badges: React.FC<BadgesProps> = ({
  page,
  area,
  variant,
  maxDisplayedBadges,
  templateVariant,
  ...props
}) => {
  const badges = useBadges({ page, area, ...props })
  if (!badges || badges?.length === 0) return null

  if (props?.product) {
    const soldOutCustomText =
      get(props, 'product.custom.c_soldOutCustomText') ||
      get(props, 'product.defaultVariant.customAttributes.c_soldOutCustomText')
    if (soldOutCustomText) {
      for (const badge of badges) {
        if (soldOutBadgeIds.includes(badge?.badgeID)) {
          badge.content = `<label class="custom-badge mw-custom-badge">${soldOutCustomText}</label>`
        }
      }
    }
  }

  // Due to temporary fix in useBadges hook skiping the content 'promo'
  const filteredBadges = (
    !isNaN(Number(maxDisplayedBadges)) ? badges?.slice(0, maxDisplayedBadges) : badges
  )?.filter((badge) => badge?.content !== 'promo')

  const badgeElements = filteredBadges?.map?.((badge) => (
    <Badge
      badgeContentSlot={badge?.content}
      key={badge?.badgeID}
      variant={variant as BadgeVariant}
      page={page}
      templateVariant={templateVariant}
    />
  ))

  return badgeElements?.length ? <>{badgeElements}</> : null
}

export default withErrorBoundaryWrapper(memo(Badges))
