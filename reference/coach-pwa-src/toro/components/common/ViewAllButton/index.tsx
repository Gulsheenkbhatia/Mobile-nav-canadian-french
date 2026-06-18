import React from 'react'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { CertonaTabFilterType } from 'toro/components/Certona/TabbedRecommendation/types'
import Arrow from 'toro/icons/arrow.svg'
import useViewportType from 'toro/hooks/useViewportType'
import Text from 'toro/components/Text'

interface ViewAllButtonProps {
  filterItem: CertonaTabFilterType
  onClick?: () => void
  variant?: 'tabbedPDPRecommendation' | 'tabbedRecommendation' | 'inlinePDPv6'
}

const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  filterItem,
  onClick,
  variant = 'tabbedRecommendation',
}) => {
  const { isDesktop } = useViewportType()
  const styles = useMultiStyleConfig('TabbedPDPRecommendation', { variant })

  if (!filterItem?.viewAllTitle || !filterItem?.viewAllLink) {
    return null
  }

  return (
    <Box sx={styles.viewAllContainer}>
      <Link href={filterItem.viewAllLink} sx={styles.viewAllProductLink} onClick={onClick}>
        <Text as="span" sx={styles.viewAllText}>
          {filterItem.viewAllTitle}
        </Text>
        {isDesktop && <Arrow />}
      </Link>
    </Box>
  )
}

export default ViewAllButton
