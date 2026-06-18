import useStyles from 'toro/hooks/useStyles'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
interface Item {
  value: string
  name: string
  orderable?: boolean
}

interface Props {
  items: Item[]
  value: string
  onChange: (val: string) => void
  itemHeight?: number
  visibleItems?: number
}

export default function SizesList({ items, value, onChange }: Props) {
  const styles = useStyles()
  const handleClick = (item: Item) => {
    if (item.value === value) return
    onChange(item.value)
  }

  return (
    <Box sx={styles.sizesListContainer}>
      {items.map((item) => {
        const isActive = item.value === value
        const isDisabled = item.orderable === false

        return (
          <Box
            key={item.value}
            as="button"
            type="button"
            sx={{
              ...styles.sizesListItem,
              ...(isActive ? styles.sizesListItemActive : styles.sizesListItemInactive),
              ...(isDisabled ? styles.sizesListItemDisabled : styles.sizesListItemEnabled),
            }}
            onClick={() => handleClick(item)}
          >
            <Flex align="center" gap="var(--spacing-1)">
              <Text
                sx={{
                  ...styles.sizesListText,
                  ...(isDisabled
                    ? styles.sizesListTextDisabled
                    : isActive
                    ? styles.sizesListTextActive
                    : styles.sizesListTextInactive),
                }}
              >
                {item.value}
              </Text>
            </Flex>
          </Box>
        )
      })}
    </Box>
  )
}
