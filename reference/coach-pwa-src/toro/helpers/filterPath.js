/**
 * Converts the filters array to a query params object. Returns an object like this:
 * {
 *   colorVal: 'Red|Green|Blue',
 *   gender: 'Woman'
 * }
 * @param filters {[{id: string, values: string[]}]} The filters array.
 * @returns {object} A query params object.
 */
const filtersOrder = [
  'size',
  'bagSize',
  'colorVal',
  'sustainableMaterials',
  'fabrication',
  'materialVal',
  'filterCategory',
  'style',
  'hardwareColor',
  'gender',
  'collection',
  'pmin',
  'pmax',
  'inStockProduct',
]

export function getFilterPosition(id) {
  return filtersOrder.indexOf(id)
}

const setIdRefvalueToButtonVal = (filterVal, buttonFilterId, option) => {
  const value = buttonFilterId + '=' + option?.refvalue
  if (!filterVal?.length) {
    return value
  }
  const filterArr = filterVal.split('&')
  const index = filterArr.findIndex(
    (filterItem) => getFilterPosition(filterItem.split('=')[0]) >= getFilterPosition(buttonFilterId)
  )
  index > -1 ? filterArr.splice(index, 0, value) : filterArr.push(value)
  return filterArr.join('&')
}

export const filterValuePathAppend =
  (filters, filterUrl, query = {}) =>
  (option, id) => {
    if (filters?.length > 0) {
      let buttonVal = ''
      let itemFound = false
      filters.forEach((item) => {
        if (item?.id == id) {
          itemFound = true
          const alreadySelected = item?.values?.includes(option?.refvalue)
          const filterItems = item?.values?.filter((item) => {
            return item != option?.refvalue
          })
          const buttonFilter = filterItems?.length
            ? item.id +
              '=' +
              filterItems.join('|') +
              (alreadySelected ? '' : '|' + option?.refvalue)
            : alreadySelected
            ? ''
            : item?.id + '=' + option?.refvalue
          buttonVal =
            buttonVal && buttonFilter ? buttonVal + '&' + buttonFilter : buttonVal + buttonFilter
        } else {
          buttonVal = (buttonVal ? buttonVal + '&' : '') + item?.id + '=' + item?.values?.join('|')
        }
      })
      if (!itemFound) {
        buttonVal = setIdRefvalueToButtonVal(buttonVal, id, option)
      }
      const numberOfAppliedfilters = filters.reduce(
        (prev, current) => prev + current.values.length,
        0
      )
      const q = query?.q ? `q=${query.q}&` : ''
      let url = filterUrl + (buttonVal ? '?' + q + buttonVal : q + '')
      if (numberOfAppliedfilters >= 2) {
        url = url + '&index=0'
      }
      return url
    } else {
      return filterUrl + '?' + id + '=' + option?.refvalue
    }
  }

export const convertFiltersToPath = (filters) => {
  if (filters?.length > 0) {
    const filterUrl = filters.reduce((prev, filter, currentIndex) => {
      //parse values array from filter item
      const url2 = filter.values.reduce((prevValue, currentValue, currentValueIndex) => {
        return prevValue + `${currentValueIndex !== 0 ? '|' : ''}${currentValue}`
      })

      const url = prev + `${currentIndex !== 0 ? '&' : ''}${filter?.id}=${url2}`
      return url
    }, '')
    return filterUrl
  }
  return false
}

export const FILTER_SEPERATOR = '|'

export const getFilterHref = ({ filters, asPath, query, refinementId, optionValue }) => {
  const pagePath = asPath.split('?')[0]
  const searchParams = new URLSearchParams()
  let queryParams = {}
  const appliedFiltersCount = filters.reduce((prev, current) => prev + current.values.length, 0)
  filters.forEach((appliedFilter) => {
    const filterKey = appliedFilter.id
    queryParams = { ...queryParams, [filterKey]: appliedFilter.values }
  })
  const isFilterAlreadyApplied =
    queryParams[refinementId] != null &&
    queryParams[refinementId].find((item) => item == optionValue)
  if (isFilterAlreadyApplied) {
    const filteredSearch = queryParams[refinementId].filter((item) => item != optionValue)
    queryParams[refinementId] = [...filteredSearch]
  } else {
    const previousSearch = queryParams[refinementId] || []
    queryParams[refinementId] = [...previousSearch, optionValue]
  }
  Object.keys(queryParams).forEach((key) => {
    searchParams.set(key, queryParams[key].join(FILTER_SEPERATOR))
  })
  if (query.q) {
    searchParams.set('q', query.q)
  }
  if (appliedFiltersCount >= 2) {
    searchParams.set('index', '0')
  } else {
    searchParams.delete('index')
  }
  return pagePath + '?' + searchParams.toString()
}
