import React from 'react'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'

const TotalCount = ({ variant = null, totalCount, defaultMessage = '{itemCount} Products' }) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('Listing', { variant })
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)

  return (
    <Text
      sx={styles.totalProductsCount}
      variant="body-primary"
      whiteSpace="nowrap"
      data-qa="plp_txt_resultcount"
      className={`total-count ${isCompletePlpV3Desktop ? 'plp-v3-1' : ''}`}
    >
      {formatMessage(
        { id: 'header.totalCount.products', defaultMessage },
        { itemCount: totalCount }
      )}
    </Text>
  )
}

export default TotalCount
