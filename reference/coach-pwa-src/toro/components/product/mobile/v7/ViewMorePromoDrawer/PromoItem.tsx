import { memo } from 'react'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'

import useStyles from 'toro/hooks/useStyles'

type PromoItemProps = {
  label: string
}
function PromoItem({ label }: PromoItemProps) {
  const styles = useStyles()

  return (
    <Flex sx={styles.promoListItem}>
      <Text sx={styles.promoItemText}>{label}</Text>
    </Flex>
  )
}

export default memo(PromoItem)
