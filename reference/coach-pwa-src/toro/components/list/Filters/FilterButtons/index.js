import { memo, useMemo } from 'react'
import Grid from 'toro/components/Grid'
import GridItem from 'toro/components/GridItem'
import FilterButton from 'toro/components/list/Filters/FilterButtons/FilterButton'
import withFilterControl from 'toro/components/list/Filters/withFilterControl'
import useViewportType from 'toro/hooks/useViewportType'
import { REFINEMENT_COLUMNS, REFINEMENT_COLUMNS_V3 } from 'toro/helpers/refinements'
import { useAtomValue } from 'jotai/utils'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'

function FilterButtons({ refinement, handleFilterChange, styles }) {
  return (
    <ButtonsGridContainer
      refinementId={refinement.id}
      optionsCount={refinement.options?.length ?? 0}
      styles={styles}
    >
      {refinement.options?.map((option) => (
        <GridItem key={`${refinement.id}-${option.refvalue}`}>
          <FilterButton
            option={option}
            styles={styles}
            refinement={refinement}
            onChange={handleFilterChange}
          />
        </GridItem>
      ))}
    </ButtonsGridContainer>
  )
}

function ButtonsGridContainer({ refinementId, optionsCount, children, styles }) {
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)
  const { isMobile } = useViewportType()

  const { columnCount, configuredColumnCount } = useMemo(() => {
    const columnSizes = isCompletePlpV3Desktop ? REFINEMENT_COLUMNS_V3 : REFINEMENT_COLUMNS

    const configuredColumnCount =
      columnSizes[`${refinementId}${isMobile ? 'Mobile' : ''}`] ||
      columnSizes[refinementId] ||
      columnSizes['default'] ||
      1

    return {
      configuredColumnCount,
      columnCount: Math.min(configuredColumnCount, optionsCount || configuredColumnCount),
    }
  }, [isCompletePlpV3Desktop, isMobile, refinementId, optionsCount])

  return (
    <Grid
      gap="s"
      width="100%"
      className={configuredColumnCount >= 3 ? 'sizes' : ''}
      templateColumns={`repeat(${columnCount}, 1fr)`}
      sx={styles.FilterButtonsWrapper}
    >
      {children}
    </Grid>
  )
}

export default withFilterControl(memo(FilterButtons))
