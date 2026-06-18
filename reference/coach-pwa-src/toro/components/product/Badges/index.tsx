import { useMemo, type FC } from 'react'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import Badges from 'toro/components/badges/Badges'
import useProductData from 'toro/hooks/useProductData'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import { useAtomValue } from 'jotai/utils'
import { selectedVariantAtom, selectedVariantGroupAtom } from 'store/pdp.atom'
import {
  prioritize,
  selectBadgeDataFromSelectedVariant,
} from 'toro/components/product/desktop/StickyBar/ProductTitleBadge/helpers'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import { BadgeVariant } from 'toro/components/badges/Badge'
import { ProductForBadges, ValidBadgeID } from 'toro/components/badges/types'

interface ProductBadgesProps {
  area: BadgeArea
  variant?: BadgeVariant
  maxDisplayedBadges?: number
  notAllowedBadges?: ValidBadgeID[]
}

const ProductBadges: FC<ProductBadgesProps> = ({
  area,
  variant,
  maxDisplayedBadges,
  notAllowedBadges,
}) => {
  const [
    masterInventory,
    inventoryThreshold,
    avgRatingEmplifi,
    revCountEmplifi,
    masterSourceCodeBadge,
    masterSourceCodeMessage,
    masterMarketingBadgeConf,
    masterMarketingMessageConf,
    promotionDataBestseller,
    masterData,
  ] = useProductData([
    'inventory',
    'custom.c_inventoryThreshold',
    'custom.c_avgRatingEmplifi',
    'custom.c_revCountEmplifi',
    'sourceCodeBadge',
    'sourceCodeMessage',
    'marketingBadgeConf',
    'marketingMessageConf',
    'promotionData.bestseller',
    'master',
  ])
  const [
    validFrom,
    sourceCodeBadge,
    sourceCodeMessage,
    marketingBadgeConf,
    marketingMessageConf,
    bestSellerCheck,
    c_inventoryThreshold,
    c_avgRatingEmplifi,
    c_revCountEmplifi,
    c_isFinalSale,
    c_maxSalePercent,
  ] = useVariantGroupData([
    'validFrom',
    'sourceCodeBadge',
    'sourceCodeMessage',
    'marketingBadgeConf',
    'marketingMessageConf',
    'bestSellerCheck',
    'customAttributes.c_inventoryThreshold',
    'customAttributes.c_avgRatingEmplifi',
    'customAttributes.c_revCountEmplifi',
    'customAttributes.c_isFinalSale',
    'customAttributes.c_maxSalePercent',
  ])

  const productVariant = useAtomValue(selectedVariantAtom)
  const inventory = useAtomValue(selectedVariantInventoryAtom)
  const selectedVG = useAtomValue(selectedVariantGroupAtom)

  const badgesProps = useMemo(() => {
    const badgeDataProductVariant = selectBadgeDataFromSelectedVariant(productVariant)

    const customAttributes = {
      c_inventoryThreshold: prioritize(
        badgeDataProductVariant.c_inventoryThreshold,
        c_inventoryThreshold,
        inventoryThreshold
      ),
      c_avgRatingEmplifi: prioritize(
        badgeDataProductVariant.c_avgRatingEmplifi,
        c_avgRatingEmplifi,
        avgRatingEmplifi
      ),
      c_revCountEmplifi: prioritize(
        badgeDataProductVariant.c_revCountEmplifi,
        c_revCountEmplifi,
        revCountEmplifi
      ),
      c_isFinalSale: prioritize(badgeDataProductVariant.c_isFinalSale, c_isFinalSale),
      c_maxSalePercent: prioritize(badgeDataProductVariant.c_maxSalePercent, c_maxSalePercent),
    } as ProductForBadges['custom']

    return {
      bestSellerCheck: prioritize(badgeDataProductVariant.bestSellerCheck, bestSellerCheck),
      product: {
        inventory: prioritize(inventory, masterInventory),
        promotionData: {
          bestseller: promotionDataBestseller,
        },
        sourceCodeBadge: prioritize(
          badgeDataProductVariant.sourceCodeBadge,
          sourceCodeBadge,
          masterSourceCodeBadge
        ),
        sourceCodeMessage: prioritize(
          badgeDataProductVariant.sourceCodeMessage,
          sourceCodeMessage,
          masterSourceCodeMessage
        ),
        marketingBadgeConf: prioritize(
          badgeDataProductVariant.marketingBadgeConf,
          marketingBadgeConf,
          masterMarketingBadgeConf
        ),
        marketingMessageConf: prioritize(
          badgeDataProductVariant.marketingMessageConf,
          marketingMessageConf,
          masterMarketingMessageConf
        ),
        customAttributes: customAttributes,
        custom: customAttributes,
        pickedProps: {
          validFrom: prioritize(badgeDataProductVariant.validFrom, validFrom),
        } as ProductForBadges['pickedProps'],
      },
      masterData,
      selectedVG,
    }
  }, [
    masterInventory,
    inventoryThreshold,
    avgRatingEmplifi,
    revCountEmplifi,
    masterSourceCodeBadge,
    masterSourceCodeMessage,
    masterMarketingBadgeConf,
    masterMarketingMessageConf,
    promotionDataBestseller,
    masterData,
    validFrom,
    sourceCodeBadge,
    sourceCodeMessage,
    marketingBadgeConf,
    marketingMessageConf,
    bestSellerCheck,
    c_inventoryThreshold,
    c_avgRatingEmplifi,
    c_revCountEmplifi,
    c_isFinalSale,
    c_maxSalePercent,
    productVariant,
    inventory,
    selectedVG,
  ])

  return (
    <Badges
      area={area}
      page="pdp"
      variant={variant}
      maxDisplayedBadges={maxDisplayedBadges}
      {...badgesProps}
      notAllowedBadges={notAllowedBadges}
    />
  )
}
export default ProductBadges
