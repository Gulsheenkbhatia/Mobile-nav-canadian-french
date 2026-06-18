import { areSelectableOptions, checkOptionType, REFINEMENT_TYPE } from 'toro/helpers/refinements'
import cloneDeep from 'lodash/cloneDeep'
import reverse from 'lodash/reverse'
import sortBy from 'lodash/sortBy'
import camelCase from 'lodash/camelCase'

export const FILTERS_NAME = {
  colorVal: 'color',
  filterCategory: 'categories',
  size: 'size',
  sustainableMaterials: 'sustainable_materials',
  fabrication: 'materials',
  gender: 'gender',
  _price_bands_: 'price',
}

/**
 * Scrolls to the top of the element matched by the selector.
 * @param {string} selector A CSS selector for the HTML element.
 */
export function scrollToTopOfElement(selector) {
  const el = document.querySelector(selector)
  if (el) {
    const headerHeight = document.querySelector('header')?.offsetHeight || 0
    window.scrollTo({
      top: el.offsetTop - headerHeight,
      left: 0,
      behavior: 'smooth',
    })
  }
}

export const scrollToHeader = (callback) => (selector) => {
  callback(false)
  scrollToTopOfElement(selector)
  setTimeout(() => {
    callback(true)
  }, 250)
}

export function toggleFilterReducer({ currentFilters, optionRefValue, refinementId }) {
  let removeFilter = { _price_: false }
  let nextFilters = currentFilters ? cloneDeep(currentFilters) : []

  const refinementIdIndex = nextFilters.findIndex((r) => r.id === refinementId)
  const optionIndex =
    refinementIdIndex !== -1 ? nextFilters[refinementIdIndex].values.indexOf(optionRefValue) : -1

  if (refinementIdIndex !== -1) {
    // if the refinement is present
    if (optionIndex !== -1) {
      // and the option is also present, we remove it
      nextFilters[refinementIdIndex].values.splice(optionIndex, 1)
      // we should also remove the refinement if there are no more options set
      if (nextFilters[refinementIdIndex].values?.length === 0) {
        nextFilters.splice(refinementIdIndex, 1)
      }

      /**
       * For Coach (Re)loved the content slots links have 'prefn1' and 'prefv1' as filters,
       * so we have to remove those too in case we remove the filter with the same id as in
       * 'prefn1'.
       * They might add multiple pairs in the future, so we'll generalize the logic instead of
       * targeting 'prefn1' and 'prefv1' only.
       */
      const refinementPrefn1Index = nextFilters.findIndex((r) => r.values.includes(refinementId))
      const refinementPrefv1Index = nextFilters.findIndex((r) => r.values.includes(optionRefValue))
      if (refinementPrefn1Index !== -1 && refinementPrefv1Index !== -1) {
        const sortedIndexes = reverse(sortBy([refinementPrefn1Index, refinementPrefv1Index]))
        for (const index of sortedIndexes) {
          nextFilters.splice(index, 1)
        }
      }
    } else {
      // otherwise if the options is missing, we add it
      nextFilters[refinementIdIndex].values.push(optionRefValue)
    }
  } else {
    if (refinementId === REFINEMENT_TYPE.PRICE) {
      nextFilters = updateNextFilters(optionRefValue, nextFilters)
      removeFilter._price_ = isPriceFilterRemoved(nextFilters)
    } else {
      nextFilters.push({
        id: refinementId,
        values: [optionRefValue],
      })
    }
  }

  return {
    optionIndex,
    nextFilters,
    removeFilter,
  }
}

export function isPriceFilterRemoved(nextFilters) {
  const price = ['pmin', 'pmax']
  return nextFilters.findIndex((r) => price.includes(r.id)) <= -1
}

export function updateNextFilters(option, nextFilters) {
  let pmin = 'pmin'
  let pmax = 'pmax'
  let _nextFilters = nextFilters

  if (option) {
    const [min, max] = option.split('-')
    const refinementIdIndexPmin = _nextFilters.findIndex((r) => r.id === pmin)
    const refinementIdIndexPmax = _nextFilters.findIndex((r) => r.id === pmax)
    // if the price filter is present let's clear or update it
    if (refinementIdIndexPmin !== -1 && refinementIdIndexPmax !== -1) {
      const pminValue = _nextFilters[refinementIdIndexPmin].values[0]
      const pmaxValue = _nextFilters[refinementIdIndexPmax].values[0]
      // if the new price values are identical to the old ones, we'll remove the price filter
      if (+pminValue === +min && +pmaxValue === +max) {
        const sortedIndexes = reverse(sortBy([refinementIdIndexPmin, refinementIdIndexPmax]))
        for (const index of sortedIndexes) {
          _nextFilters.splice(index, 1)
        }
      } else {
        // else we'll update the price filter values
        _nextFilters[refinementIdIndexPmin].values = [min]
        _nextFilters[refinementIdIndexPmax].values = [max]
      }
    } else {
      // otherwise let's add it
      _nextFilters.push(
        {
          id: pmin,
          values: [min],
        },
        {
          id: pmax,
          values: [max],
        }
      )
    }
  }
  return _nextFilters
}

export function getActiveFiltersCount({ filters, refinements }) {
  const _activeFiltersCount = {}

  if (!filters.length) return _activeFiltersCount

  for (const filter of filters) {
    if (['pmin', 'pmax'].includes(filter.id)) {
      _activeFiltersCount[REFINEMENT_TYPE.PRICE] = 1 // use id '_price_'
    } else {
      const matchingRefinement = refinements?.find(({ id }) => id === filter?.id)

      const refinementIsValid =
        !checkOptionType(matchingRefinement) || areSelectableOptions(matchingRefinement)

      const matchingOptionsCount =
        refinementIsValid &&
        filter?.values?.filter((value) => {
          const matchingOption = matchingRefinement?.options?.find(
            ({ refvalue }) => refvalue === value
          )
          return matchingOption?.selectable
        })?.length

      _activeFiltersCount[filter.id] = +matchingOptionsCount
    }
  }

  return _activeFiltersCount
}

export function getOptionQAAttribute({ selected = false, enabled = false, refinementName = '' }) {
  const filterLinks = 'plpfltr_link_fltr'
  const prefix = `${filterLinks}_${camelCase(refinementName)}_`

  const filterLinkOption = {
    s: 'swatch_slctd',
    e: 'swatch_enbld',
    d: 'swatch_dsbld',
  }
  const getStateKey = () => {
    if (selected) {
      return 's'
    }

    if (enabled) {
      return 'e'
    }

    return 'd'
  }

  return `${prefix}${filterLinkOption[getStateKey()]}`
}
