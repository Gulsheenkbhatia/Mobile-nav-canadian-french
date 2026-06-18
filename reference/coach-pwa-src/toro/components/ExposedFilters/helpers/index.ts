export type PriceFilter = {
  label: string
  min: number
  max: number
}

export type PriceRefinement = {
  name: 'Price'
  type: '_price_'
  id: '_price_'
  options: {
    refvalue: string
    displayName: string
    selectable: boolean
  }[]
}

export const parseCategoryFilterPriceToRefinement = (
  filterPrices: PriceFilter[],
  minPriceValue: number
): PriceRefinement | null => {
  if (!filterPrices?.length) {
    return null
  }

  return {
    name: 'Price',
    type: '_price_',
    id: '_price_',
    options: filterPrices.map((filter) => {
      const minPrice = filter?.min > 0 ? filter.min : minPriceValue
      const maxPrice = filter?.max > minPrice ? filter.max : minPrice + 1

      return {
        displayName: filter?.label || '',
        refvalue: `${minPrice}-${maxPrice}`,
        selectable: true,
      }
    }),
  }
}
