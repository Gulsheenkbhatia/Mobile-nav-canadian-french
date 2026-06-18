import useProductData from 'toro/hooks/useProductData'
import Text from 'toro/components/Text'
import { useAtomValue } from 'jotai/utils'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import useBadges from 'toro/components/badges/hooks/useBadges'
import HtmlContent from 'toro/components/HtmlContent'
import useStyles from 'toro/hooks/useStyles'

const SizeSelectorInventoryBadge = () => {
  const styles = useStyles()
  const custom = useProductData('custom')
  const selectedVariantInventory = useAtomValue(selectedVariantInventoryAtom)

  const inventoryBadges = useBadges({
    page: 'pdp',
    area: BadgeArea.INVENTORY_STATUS,
    product: {
      custom,
      inventory: selectedVariantInventory,
    },
  })

  if (!inventoryBadges?.length) return null

  return (
    <Text variant="body-primary" size="md" sx={styles.inventoryBadgeWrapper}>
      &nbsp;-
      {inventoryBadges?.map?.(({ content, badgeID }) => (
        <HtmlContent key={badgeID} content={content} sx={styles.inventoryBadge} />
      ))}
    </Text>
  )
}

export default SizeSelectorInventoryBadge
