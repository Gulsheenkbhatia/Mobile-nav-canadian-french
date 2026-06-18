import size from 'lodash/size'
import uniq from 'lodash/uniq'

// taken from Salesforce B2C Commerce 21.7 docs
export const REFINEMENT_SFCC_TYPE = {
  ATTRIBUTE: 'attribute refinement',
  BOOLEAN: 'boolean refinement',
  CATEGORY: 'category refinement',
  DATE: 'date refinement',
  PRICE: 'price refinement',
  PROMOTION: 'promotion refinement',
}

// from Search API
export const REFINEMENT_TYPE = {
  DEFAULT: 'refinementDefaultStyle',
  ATTRIBUTE: 'refinementAttributeStyle',
  CHECKBOX: 'refinementCheckboxStyle',
  COLOR: 'refinementColorStyle',
  HIDDEN: 'searchRefinementsToHide',
  PRICE: '_price_', // this refinement doesn't have a refinementType in the Search API
}

export const AVAILABLE_REFINEMENT_IDS_INITIAL = [
  'pmin',
  'pmax',
  'color',
  'colorVal',
  'size',
  'heelHeight',
  'heelHeightVal',
  'filterCategory',
  'isOutlet',
  'model',
  'isEarlyAccess',
  'isEmployeeSale',
  'gender',
  'onlineExclusive',
  'material',
  'materialVal',
  'bagSize',
  'fabrication',
  'sustainableMaterials',
  'hardwareColor',
  'styleGroup',
  'prefn1', // for coach-reloved
  'prefv1', // for coach-reloved
  'merchandiseClass',
  'department',
  'occasion',
  'familyCollection',
  'earringStyle',
  'dressLength',
  'dressOccasion',
  'silhouetteDup1',
  'silhouetteDup2',
  'silhouetteDup3',
  'inStockProduct',
  'maxSalePercent',
  'widthVal',
  'shaftHeightVal',
  'bootEntry',
  'toeShape',
  'shoeFeatures',
  'ksClassic',
  'filterByDiscount',
  'heelType',
  'party',
  'compatibility',
  'influencers',
  'trends',
  'persona',
  'site_promotions',
  'collections',
  'world', // DIGIT-9915 ?world
]

export const REFINEMENT_COLUMNS = {
  default: 1,
  bagSize: 4,
  size: 4,
  sizeMobile: 5,
  gender: 3,
  onlineExclusive: 2,
  hardwareColor: 3,
  hardwareColorSize: 4,
  styleGroup: 1,
  styleGroupMobile: 2,
  fabrication: 1,
  fabricationMobile: 2,
  maxSalePercent: 2,
  materialVal: 2,
  materialValMobile: 2,
  widthVal: 3,
  toeShape: 2,
  toeShapeMobile: 3,
  shaftHeightValMobile: 2,
}

export const REFINEMENT_COLUMNS_V3 = {
  ...REFINEMENT_COLUMNS,
  materialVal: 1,
}
export const AVAILABLE_REFINEMENT_IDS = uniq([
  ...AVAILABLE_REFINEMENT_IDS_INITIAL,
  ...getAvailableRefinementsFromEnv(),
])

function getAvailableRefinementsFromEnv() {
  const filterStringEnvVar = process.env.FILTER_STRING
  if (filterStringEnvVar?.length) {
    return filterStringEnvVar
      .split('|')
      .map((item) => {
        if (!AVAILABLE_REFINEMENT_IDS_INITIAL.includes(item)) {
          return item.trim()
        }
        return ''
      })
      .filter(Boolean)
  }
  return []
}

/**
 * Extracts the available refinements and their values from the supplied query params.
 * Returns an object like this:
 * {
 *   colorVal: 'Red|Green|Blue',
 *   gender: 'Woman'
 * }
 * @param params {object} Query params object.
 * @returns {object} A query params object.
 */
export function getAvailableRefinementsFromQueryParams(params) {
  if (!size(params)) {
    return {}
  }
  const out = {}
  for (const key of Object.keys(params)) {
    if (AVAILABLE_REFINEMENT_IDS.includes(key)) {
      out[key] = params[key]
    }
  }
  return out
}

export const checkOptionType = (filterObj) =>
  filterObj?.options?.every((option) => option?.selectable !== undefined)

export const areSelectableOptions = (filterObj) =>
  filterObj.options?.some((option) => !!option?.selectable)

/**
 *
 * @param {string} key
 * @param {number} fallbackVal
 * @param {boolean} canBeNegative
 * @returns numeric value from env key. If conditions are not matched, fallback value is returned
 */
export const checkEnvNumericValues = (key, fallbackVal = 0, canBeNegative = false) => {
  if (key) {
    const envKey = process.env[key]
    if (envKey) {
      const convertedEnvKey = +envKey
      if (typeof convertedEnvKey === 'number') {
        if (canBeNegative) {
          return convertedEnvKey
        } else {
          return convertedEnvKey > 0 ? convertedEnvKey : fallbackVal
        }
      }
      return fallbackVal
    }
    return fallbackVal
  }
  return fallbackVal
}
