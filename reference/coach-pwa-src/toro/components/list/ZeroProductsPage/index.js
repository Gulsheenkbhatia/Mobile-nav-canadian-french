import React from 'react'
import Grid from 'toro/components/Grid'
import GridItem from 'toro/components/GridItem'
import Button from 'toro/components/Button'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useFilterToggle from 'toro/hooks/useFilterToggle'
import { useIntl } from 'react-intl'

function ZeroProductsPage() {
  const theme = useTheme()
  const { clearFilters } = useFilterToggle()
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('ZeroProductsPage')

  return (
    <>
      <Grid
        width="100%"
        justifyItems="center"
        rowGap={theme.space.m}
        className="zero-products-page"
      >
        <GridItem sx={styles.noProductTitle}>
          {formatMessage({
            id: 'plp.filter.noProductsForAppliedFilters',
            defaultMessage: 'No products available based on your applied filters.',
          })}
        </GridItem>
        <GridItem sx={styles.clearFilterMessage}>
          {formatMessage({
            id: 'plp.filter.clearFiltersOrSearchNew',
            defaultMessage: 'Clear your filters to view products or start a new search below.',
          })}
        </GridItem>
        <GridItem sx={styles.clearFilterButton}>
          <Button variant="clearAll" size="md" onClick={clearFilters}>
            {formatMessage({
              id: 'plp.filter.clearAllFilters',
              defaultMessage: 'CLEAR All FILTERS',
            })}
          </Button>
        </GridItem>
      </Grid>
    </>
  )
}

export default ZeroProductsPage
