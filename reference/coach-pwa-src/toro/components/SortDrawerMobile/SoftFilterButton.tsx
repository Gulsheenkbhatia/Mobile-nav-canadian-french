import React, { memo } from 'react'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import Button from 'toro/components/Button'

function SortFilterButton({ styles, handleOpen }) {
  const { formatMessage } = useIntl()

  return (
    <Button
      name="mobileFilterButton"
      sx={styles.mobileFilterButton}
      onClick={handleOpen}
      variant="outline"
      height="s"
      data-qa="m_plpsrt_rdobtn_srtby"
    >
      <Text
        key="filterButtonText"
        sx={styles.filterButtonText}
        variant="body-primary"
        size="sm"
        alignItems="center"
        data-qa="m_plpfltr_btn_fltrorsrt"
      >
        {formatMessage({ id: 'plp.filter.filterlabelMobile', defaultMessage: 'FILTER / SORT' })}
      </Text>
    </Button>
  )
}

export default memo(SortFilterButton)
