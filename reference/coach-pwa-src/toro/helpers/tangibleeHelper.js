import { getSKUs } from './skuHelper'
import localStorage from 'toro/helpers/localStorage'

export const TANGIBLEE_MODE = {
  HUMAN: 'human',
  PRODUCT: 'product',
  WILLITFIT: 'willItFit',
  ARIMAGE: 'arImage',
  ARCAMERA: 'arCamera',
  HISTORY: 'history',
  VIEWIN2DCONTEXT: 'viewIn2DContext',
}

export const TANGIBLEE_TEXTS = {
  WILLITFIT: 'What fits inside',
  HUMAN: 'See how it fits me',
}

export const TANGIBLEE_EXPERIENCE = {
  COMPARE: 'compare',
  WILLITFIT: 'willItFit',
}

export const TANBILEE_EXPERIENCE_AVAILABLE_MODES = {
  [TANGIBLEE_EXPERIENCE.WILLITFIT]: [TANGIBLEE_MODE.WILLITFIT],
  [TANGIBLEE_EXPERIENCE.COMPARE]: [
    TANGIBLEE_MODE.HUMAN,
    TANGIBLEE_MODE.PRODUCT,
    TANGIBLEE_MODE.HISTORY,
    TANGIBLEE_MODE.ARIMAGE,
    TANGIBLEE_MODE.ARCAMERA,
  ],
}

const STORAGE_KEY = {
  EXPERIENCE: 'TNG_EXPERIENCE',
  MODE: 'TNG_MODE',
}

const setConfig = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    window[key] = value
  }
}

export const initializeAnalytics = (tangibleeAnalyticsTrackingId, tangibleeBrandURL) => {
  //tangiblee analytics object
  window.tangibleeAnalytics =
    window.tangibleeAnalytics ||
    function () {
      ;(window.tangibleeAnalytics.q = window.tangibleeAnalytics.q || []).push(arguments)
    }
  window.tangibleeAnalytics('setAnalyticsPlugin', 'GoogleAnalytics', {
    trackingId: tangibleeAnalyticsTrackingId,
  })
  window.tangibleeAnalytics('setAnalyticsPlugin', 'DataLayerAnalytics', {
    singleEvent: true,
  })
  window.tangibleeAnalytics('setAnalyticsPlugin', 'InfoPortalAnalyticsV2', {})
  window.tangibleeAnalytics('setRetailer', tangibleeBrandURL)
  window.tangibleeAnalytics('setVariation', 'Tangiblee ON')
}

export const trackImpression = (sku) => {
  if (!window.tangibleeAnalytics) {
    return
  }
  window.tangibleeAnalytics('setProduct', {
    category: 'Tangiblee Experience',
    categoryId: -1,
    label: sku,
    id: sku,
  })
  window.tangibleeAnalytics('trackImpression', [sku])
}

export const openModal = (tangibleeData, domain, options) => {
  const iframeEl = document.getElementById('tangiblee_iframe')
  if (iframeEl) {
    iframeEl.remove()
  }
  window.tangiblee =
    window.tangiblee ||
    function () {
      ;(window.tangiblee.q = window.tangiblee.q || []).push(arguments)
    }
  const { mode, experience, enableCTATabs, ...rest } = options

  if (mode) {
    setConfig(STORAGE_KEY.MODE, mode)
  } else {
    localStorage.removeItem(STORAGE_KEY.MODE)
  }

  if (experience) {
    setConfig(STORAGE_KEY.EXPERIENCE, experience)
    window.tangiblee(
      'availableModes',
      enableCTATabs
        ? [...TANBILEE_EXPERIENCE_AVAILABLE_MODES[experience], TANGIBLEE_MODE.VIEWIN2DCONTEXT]
        : TANBILEE_EXPERIENCE_AVAILABLE_MODES[experience] ?? []
    )
  } else {
    localStorage.removeItem(STORAGE_KEY.EXPERIENCE)
    window.tangiblee('availableModes', [])
  }

  const variations = getSKUs(tangibleeData)
  window.tangiblee('variationSKUs', variations)
  window.tangiblee('domain', domain)
  window.tangiblee('openWidget')
  window.tangiblee('productSilentUpdate', { variations, ...rest })
}

export const getTangibleeCta = (formatMessage) => [
  { bags: formatMessage({ id: 'pdp.tangibleeCTATextGroup.bag', defaultMessage: 'Bag' }) },
  { bag: formatMessage({ id: 'pdp.tangibleeCTATextGroup.bag', defaultMessage: 'Bag' }) },
  { watches: formatMessage({ id: 'pdp.tangibleeCTATextGroup.watch', defaultMessage: 'Watch' }) },
  { watch: formatMessage({ id: 'pdp.tangibleeCTATextGroup.watch', defaultMessage: 'Watch' }) },
  {
    earring: formatMessage({
      id: 'pdp.tangibleeCTATextGroup.earring',
      defaultMessage: 'Earring',
    }),
  },
  {
    earrings: formatMessage({
      id: 'pdp.tangibleeCTATextGroup.earring',
      defaultMessage: 'Earring',
    }),
  },
  {
    bracelet: formatMessage({
      id: 'pdp.tangibleeCTATextGroup.bracelet',
      defaultMessage: 'Bracelet',
    }),
  },
  {
    bracelets: formatMessage({
      id: 'pdp.tangibleeCTATextGroup.bracelet',
      defaultMessage: 'Bracelet',
    }),
  },
  {
    necklace: formatMessage({
      id: 'pdp.tangibleeCTATextGroup.necklace',
      defaultMessage: 'Necklace',
    }),
  },
  {
    necklaces: formatMessage({
      id: 'pdp.tangibleeCTATextGroup.necklace',
      defaultMessage: 'Necklace',
    }),
  },
  { ring: formatMessage({ id: 'pdp.tangibleeCTATextGroup.ring', defaultMessage: 'Ring' }) },
  { rings: formatMessage({ id: 'pdp.tangibleeCTATextGroup.ring', defaultMessage: 'Ring' }) },
  { charm: formatMessage({ id: 'pdp.tangibleeCTATextGroup.charm', defaultMessage: 'Charm' }) },
  { charms: formatMessage({ id: 'pdp.tangibleeCTATextGroup.charm', defaultMessage: 'Charm' }) },
  { bangle: formatMessage({ id: 'pdp.tangibleeCTATextGroup.bangle', defaultMessage: 'Bangle' }) },
  {
    bangles: formatMessage({ id: 'pdp.tangibleeCTATextGroup.bangle', defaultMessage: 'Bangle' }),
  },
]
