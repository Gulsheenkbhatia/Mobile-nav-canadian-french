import { useMemo, type FC } from 'react'
import Badges from 'toro/components/badges/Badges'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { useAtomValue } from 'jotai/utils'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import Box from 'toro/components/Box'
import { productCarouselActiveIndexAtom } from 'store/pdp.atom'
import { BadgeVariant } from 'toro/components/badges/Badge'
interface InventoryCalloutBadgeProps {
  variant?: BadgeVariant
}

const InventoryCalloutBadge: FC<InventoryCalloutBadgeProps> = ({
  variant = BadgeVariant.Pdpv6InventoryStatus,
}) => {
  const customAttributes = useSelectedVariantData('customAttributes')
  const inventory = useAtomValue(selectedVariantInventoryAtom)
  const activeIdx = useAtomValue(productCarouselActiveIndexAtom)
  const product = useMemo(() => {
    if (!customAttributes && !inventory) return undefined

    return {
      customAttributes,
      inventory,
    }
  }, [customAttributes, inventory])

  if (activeIdx !== 0) {
    return null
  }

  return (
    <Box className="pdpv6-inventory-callout-badge" position="relative">
      <Badges page="pdp" area={BadgeArea.INVENTORY_STATUS} product={product} variant={variant} />
    </Box>
  )
}

export default InventoryCalloutBadge
