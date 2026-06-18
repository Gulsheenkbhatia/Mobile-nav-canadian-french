import get from 'lodash/get'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'
import { price as formatPrice } from 'toro/helpers/price-format'
import { Filter, Option, Refinement } from 'toro/types/productTypes/common'
import { ActiveFilter } from 'store/search-results.atom'

export const getActiveFilters = (filters: Filter[], refinements: Refinement[]) => {
  const activeFilters = []
  for (const filter of filters) {
    const facet = refinements.find((refinement) => refinement.id === filter.id)
    if (!facet) continue
    filter.values.forEach((filterOption) => {
      const option = (facet.options as Option[]).find((o) => o.refvalue === filterOption)
      if (!option) return
      activeFilters.push({
        ...option,
        type: filter.id,
        id: facet.id,
        name: facet.name,
      })
    })
  }
  const priceMinimumFilter = filters.find((f) => f.id === 'pmin')
  const priceMaximumFilter = filters.find((f) => f.id === 'pmax')

  if (priceMinimumFilter && priceMaximumFilter) {
    const priceMinimum = get(priceMinimumFilter, 'values.0')
    const priceMaximum = get(priceMaximumFilter, 'values.0')

    activeFilters.push({
      id: REFINEMENT_TYPE.PRICE,
      type: REFINEMENT_TYPE.PRICE,
      refvalue: `${priceMinimum}-${priceMaximum}`,
      name: 'PRICE',
    })
  }
  return activeFilters
}

export const getFilterDisplayName = (
  { type, refvalue: refinementValue, displayName }: ActiveFilter,
  currencyOptions,
  formatMessage
) => {
  if (type === REFINEMENT_TYPE.PRICE) {
    const [priceMinimum, priceMaximum] = refinementValue.split('-')
    const formattedPriceMinimum = formatPrice(Number(priceMinimum), currencyOptions)
    const formattedPriceMaximum = formatPrice(Number(priceMaximum), currencyOptions)
    return `${formattedPriceMinimum} - ${formattedPriceMaximum}`
  }

  if (type === 'size') {
    const sizeText = formatMessage({
      id: 'pdp.product.sizeText',
      defaultMessage: 'Size',
    })
    return `${sizeText} ${refinementValue}`
  }

  return displayName || refinementValue
}

type Viewport = 'd' | 'm'

export const getActiveFiltersQAAttributes = (viewport: Viewport) => {
  return {
    appliedFilterSection: `${viewport}_plpfltr_sctn_aplyd_fltr`,
    appliedFilterClearAll: 'm_plpfltr_link_clearall',
    appliedFilterlabelLink: 'm_plpfltr_link_aplyd_fltr_label',
    appliedFilterLabel: `${viewport}_plpfltr_txt_aplyd_fltr_label`,
    appliedFilterLabelRemove: `${viewport}_plpfltr_icon_aplyd_fltr_label_rmv`,
    appliedFilterCategory: `${viewport}_plpfltr_link_aplyd_fltr`,
  }
}
