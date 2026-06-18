import { type FC } from 'react'
import { BadgeVariant } from 'toro/components/badges/Badge'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { badgeTypes } from 'toro/components/badges/constants/badgeTypes'
import ProductBadges from 'toro/components/product/Badges'

const ProductTitleBadge: FC = () => {
  return (
    <ProductBadges
      area={BadgeArea.MARKETING_CONTENT}
      variant={BadgeVariant.MarketingContentPdpV5}
      maxDisplayedBadges={1}
      notAllowedBadges={[badgeTypes.isSoldOut]}
    />
  )
}
export default ProductTitleBadge
