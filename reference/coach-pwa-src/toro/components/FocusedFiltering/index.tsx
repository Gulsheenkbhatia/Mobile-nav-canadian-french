import { FC, useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'

import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Checkbox from 'toro/components/Checkbox'
import ScrollableContent from 'toro/components/ScrollableContent'
import Text from 'toro/components/Text'
import Tooltip from 'toro/components/Tooltip'
import useFilterToggle from 'toro/hooks/useFilterToggle'

import {
  FocusedFilteringProps as FocusedFilteringType,
  FocusedFilteringValue,
  ActiveFilter,
  activeFiltersAtom,
  visibleRefinementsAtom,
} from 'store/search-results.atom'
import { isPlpV3Atom, filterFocusTooltipShownAtom } from 'store/plp.atom'
import { Refinement, Option } from 'toro/types/productTypes/common'
import Skeleton from 'toro/components/Skeleton'

type FocusedFilteringProps = {
  focusedFiltering: FocusedFilteringType
  loading: boolean
}

const filterType = {
  color: 'colorVal',
  category: 'filterCategory',
}
const compareOption = (
  focusedFiltering: FocusedFilteringValue,
  option: Option,
  refinementName: string
) => {
  const comparisonValue =
    refinementName === filterType.color ? focusedFiltering?.color : focusedFiltering?.filterCategory
  return (
    comparisonValue?.toLowerCase().includes(option.refvalue.toLowerCase()) ||
    option.refvalue.toLowerCase().includes(comparisonValue?.toLowerCase())
  )
}

const checkActiveFilter = (
  type: string,
  activeFilters: ActiveFilter[],
  focusedFilteringAttribute: string
) =>
  activeFilters.some(
    ({ id, refvalue }) =>
      id === type &&
      (focusedFilteringAttribute.toLowerCase().includes(refvalue.toLowerCase()) ||
        refvalue.toLowerCase().includes(focusedFilteringAttribute.toLowerCase()))
  )

const getRelevantRefinements = (
  visibleRefinements: Refinement[],
  focusedFiltering: FocusedFilteringType
) => {
  return visibleRefinements
    .filter((refinement) => [filterType.color, filterType.category].includes(refinement.id))
    .flatMap((refinement) => {
      const option = (refinement.options as Option[])?.find((option) =>
        compareOption(focusedFiltering.value, option as Option, refinement.id)
      )
      return option ? { option, refinement } : null
    })
    .filter(Boolean) as { option: Option; refinement: Refinement }[]
}

const FocusedFiltering: FC<FocusedFilteringProps> = ({ focusedFiltering, loading = false }) => {
  const { formatMessage } = useIntl()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const styles = useMultiStyleConfig('SortDrawerMobile', {
    variant: isPlpV3 ? 'plpV3' : undefined,
  })
  const { mobileFilterButton, skeleton, skeletonContainer } =
    useMultiStyleConfig('FocusedFiltering')
  const activeFilters = useAtomValue(activeFiltersAtom)
  const visibleRefinements = useAtomValue(visibleRefinementsAtom)
  const { handleFilterChange } = useFilterToggle()
  const [tooltipShown, setTooltipShown] = useAtom(filterFocusTooltipShownAtom)

  const activeButtons = useMemo(
    () => ({
      colorVal: checkActiveFilter(filterType.color, activeFilters, focusedFiltering?.value?.color),
      filterCategory: checkActiveFilter(
        filterType.category,
        activeFilters,
        focusedFiltering.value?.filterCategory
      ),
    }),
    [activeFilters, focusedFiltering]
  )

  const refinements = useMemo(
    () => getRelevantRefinements(visibleRefinements, focusedFiltering),
    [visibleRefinements, focusedFiltering]
  )

  useEffect(() => {
    if (!tooltipShown && refinements.length > 0) {
      const timeout = setTimeout(() => {
        setTooltipShown(true)
      }, 4000)
      return () => {
        clearTimeout(timeout)
        setTooltipShown(true)
      }
    }
  }, [tooltipShown, refinements.length])

  if (!refinements.length) {
    return null
  }

  if (loading) {
    return (
      <Flex sx={skeletonContainer}>
        <Skeleton sx={skeleton} />
        <Skeleton sx={skeleton} />
      </Flex>
    )
  }

  return (
    <ScrollableContent fadeColor="var(--color-neutral-light-1)" id="focused-filtering">
      {refinements.map(({ option, refinement }, index) => {
        const checkbox = (
          <Box key={option.refvalue}>
            <Checkbox
              sx={{ ...styles.mobileFilterButton, ...mobileFilterButton }}
              isChecked={activeButtons[refinement.id]}
              onChange={() =>
                handleFilterChange({
                  optionRefValue: option.refvalue,
                  refinement,
                  targetContent: '',
                  eventLocation: 'focus filter',
                })
              }
            >
              <Flex>
                <Text
                  sx={styles.filterButtonText}
                  variant="body-primary"
                  size="sm"
                  alignItems="center"
                >
                  {`${option.refvalue} ${option.refvalue.includes('Bag') ? '' : 'Bags'}`}
                </Text>
              </Flex>
            </Checkbox>
          </Box>
        )
        if (index === 0) {
          return (
            <Tooltip
              key={`tooltip-${option.refvalue}`}
              label={formatMessage({
                id: 'header.FocusedFiltering.toolTip',
                defaultMessage: 'Suggested filters for you',
              })}
              hasArrow
              isOpen={!tooltipShown}
            >
              {checkbox}
            </Tooltip>
          )
        }
        return checkbox
      })}
    </ScrollableContent>
  )
}

export default FocusedFiltering
