import isEmpty from 'lodash/isEmpty'
import {
  CertonaRequestOptions,
  CertonaScheme,
  type CertonaSchemeType,
} from 'store/certona-schemes.atoms'
import { WindowWithCertona } from 'toro/components/Certona'
import { CertonaTabFilterType } from 'toro/components/Certona/TabbedRecommendation/types'
import { useMemo } from 'react'

export const TABBED_VARIANTS = new Set(['tabbedRecommendation', 'tabbedPDPRecommendation'])

export const getFilterOptions = (filter: CertonaTabFilterType) => {
  if (!filter) return

  if (filter.filterType?.toLowerCase() === 'category') {
    return {
      Categorylevel1: filter.value,
      Categorylevel2: filter.value,
      Categorylevel3: filter.value,
    }
  }
  return {
    [filter.filterType]: filter.value,
  }
}

interface ICreateCertonaRequest {
  /**
   * Creates/queues a request to Certona for specified request options.
   * Each new request to Certona awaits until previous gets fulfilled.
   * @param {CertonaRequestOptions} options Certona request options.
   * @returns {Promise<CertonaScheme[]>} Returns a promise which gets resolved with schemes retrieved from Certona request.
   */
  (options: CertonaRequestOptions): Promise<CertonaScheme[]>
}

const createCertonaRequest: ICreateCertonaRequest = async (options) => {
  if (isEmpty(options)) {
    return
  }

  return await (<WindowWithCertona>window).callCertona(options)
}

export default createCertonaRequest

type CertonaSchemeOnPLP = {
  recommendations?: CertonaSchemeType
  filters?: Record<string, string>
}

type UseFiltersFromCertonaOnPLPConfig = {
  slots: false | Record<'inBetweenCertonaSlots' | 'bottomCertonaSlots', Array<CertonaSchemeOnPLP>>
  scheme: CertonaSchemeType
  defaultValue: any | undefined
  isEnabled: boolean
}

interface UseFiltersFromCertonaOnPLP {
  /**
   * Finds the first filter value from the certona slots on PLP for the selected certona scheme
   * Searches both inline and bottom certona slots that are configurable via `certonaPosition`
   *
   * @param {UseFiltersFromCertonaOnPLPConfig} config
   */
  (config: UseFiltersFromCertonaOnPLPConfig): any | undefined
}

export const useFiltersFromCertonaOnPLP: UseFiltersFromCertonaOnPLP = ({
  slots,
  scheme,
  defaultValue,
  isEnabled = true,
}) => {
  return useMemo(() => {
    if (!isEnabled || !slots) return defaultValue
    const allSlotsOnPLP = [...slots.inBetweenCertonaSlots, ...slots.bottomCertonaSlots]
    const slotWithFilter = allSlotsOnPLP.find((slot: CertonaSchemeOnPLP) => {
      return !!slot.filters && slot?.recommendations === scheme
    })
    if (slotWithFilter) {
      return slotWithFilter.filters
    }
    return defaultValue
  }, [slots, isEnabled, scheme, defaultValue])
}

export const formatRecommendationPrice = (price, isCoachOutletOrKSS) => {
  const priceRegex = price?.replace(/,/g, '')
  if (isCoachOutletOrKSS && parseInt(priceRegex) == parseFloat(priceRegex))
    return parseInt(priceRegex)
  return price
}
