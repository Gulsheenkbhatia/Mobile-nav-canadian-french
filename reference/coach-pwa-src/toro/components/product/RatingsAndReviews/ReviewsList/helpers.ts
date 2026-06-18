import { RollUpProperty, RollUpPropertyValue } from './types'

const small = 1
const perfectFit = 3
const large = 5

export const computeIndicatorsValue = (counts: number[]) => {
  const [first = 0, middle = 0, end = 0] = counts || [0, 0, 0]
  return (small * first + perfectFit * middle + large * end) / (first + middle + end)
}

const getCountByLabel = (labelArray: RollUpPropertyValue[], label: string) => {
  let count = 0
  const labelObject = labelArray?.find?.((value) => value?.label === label)
  if (!!labelObject?.count) {
    count = labelObject.count
  }
  return count
}

export const getCountsByKey = (properties: RollUpProperty[], key: string) => {
  let countArray = [0, 0, 0]
  const property = properties?.find?.((property) => property?.key === key)
  if (property?.values?.length) {
    countArray = property?.display_values?.map?.((display_value) => {
      return getCountByLabel(property.values, display_value)
    })
  }
  return countArray
}
