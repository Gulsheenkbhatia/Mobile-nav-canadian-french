import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import Radio from 'toro/components/Radio'
import RadioGroup from 'toro/components/RadioGroup'
import Stack from 'toro/components/Stack'
import Filters from 'toro/components/list/Filters'
import LoadingDots from 'toro/components/LoadingDots'
import useAnalytics from 'toro/analytics/useAnalytics'
import {
  totalProductsAtom,
  sortingRuleAtom,
  sortOptionsAtom,
  setSortingRuleAtom,
  searchResultPageAtom,
  searchResultsReloadingAtom,
} from 'store/search-results.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useIntl } from 'react-intl'
import { useMemo } from 'react'

const SortDrawerContent = ({ styles, loading, onClose }) => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const reloading = useAtomValue(searchResultsReloadingAtom)
  const page = useAtomValue(searchResultPageAtom)
  const total = useAtomValue(totalProductsAtom)
  const srule = useAtomValue(sortingRuleAtom)
  const sortOptions = useAtomValue(sortOptionsAtom)
  const setSort = useUpdateAtom(setSortingRuleAtom)
  const setReloading = useUpdateAtom(searchResultsReloadingAtom)

  const defaultSortOptionCode = useMemo(
    () => sortOptions?.find((item) => item.isDefault)?.code,
    [sortOptions]
  )

  const handleSortChange = (sortOption: string) => {
    setSort(sortOption)
    setReloading(true)
    analytics.send('sort', {
      eventLocation: 'left rail',
      eventAction: 'apply',
      sortOption,
    })
  }

  return (
    <Box name="filtersDrawer" position="relative" sx={styles.filtersDrawer}>
      <Box data-qa="m_plpsrt_sctn_fltrorsrt_drawer_srtby">
        <Text
          sx={styles.sortByText}
          variant="eyebrow-primary"
          size="md"
          data-qa="m_plpsrt_txt_fltrorsrt_drawer_srtby"
        >
          {formatMessage({
            id: 'plp.filter.sortBy',
            defaultMessage: 'SORT BY',
          })}
        </Text>
        <RadioGroup onChange={handleSortChange} defaultValue={srule || defaultSortOptionCode}>
          <Stack>
            {sortOptions?.map((option) => (
              <Radio
                name="sortOptions"
                value={option.code}
                key={`option-${option.code}`}
                size="lg"
                spacing="mar"
                data-qa={'m_plpsrt_rdobtn_srtby' + `_${option.id || option.code}`}
              >
                <Text sx={styles.mobileRadioFilterText} variant="body-primary" size="md">
                  {option?.name}
                </Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
      <Filters
        name="filtersWrapper"
        sx={styles.filtersWrapper}
        data-qa="d_plpfltr_sctn_fltr_panel"
      />
      <Box
        name="viewAllProductsWrapper"
        sx={styles.viewAllProductsWrapper}
        position="fixed"
        bottom="0"
        right="0"
        left="0"
      >
        <Button
          onClick={onClose}
          isLoading={loading || (reloading && page === 1)}
          variant="primary"
          size="md"
          width="100%"
          spinner={<LoadingDots />}
          data-qa="m_plpfltr_btn_fltr_result"
          sx={styles.viewResultButton}
        >
          {formatMessage(
            {
              id: `plp.filter.${total !== undefined ? 'viewTotalProducts' : 'viewProducts'}`,
              defaultMessage: `View ${total !== undefined ? '{total} ' : ''}products`,
            },
            { total }
          )}
        </Button>
      </Box>
    </Box>
  )
}

export default SortDrawerContent
