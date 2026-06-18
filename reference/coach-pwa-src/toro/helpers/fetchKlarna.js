import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import serialize from 'toro/helpers/serialize'
import getLocaleFromReq from 'helpers/getLocaleFromReq'
import { isCompleteKlarnaConfig } from 'toro/helpers/isCompleteConfig'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'
import { responseLogger } from 'helpers/logger'

export const getPurchasedAmount = (product) => {
  const price = get(product, 'pricingInfo.0', {})
  let currentPrice
  if (price.type === 'range') {
    currentPrice = get(price, 'max.list.value', 0)
  } else {
    currentPrice =
      get(price, 'promotionalPrice.value', 0) ||
      get(price, 'sales.value', 0) ||
      get(price, 'list.value', 0) ||
      get(product, 'price', 0)
  }
  return { purchase_amount: parseFloat(currentPrice * 100).toFixed(0), currentPrice }
}

export const getKlarnaRange = () => {
  let klarnaMinValue = process.env.KLARNA_MIN_VALUE ?? '35'
  let klarnaMaxValue = process.env.KLARNA_MAX_VALUE ?? '2500'

  klarnaMinValue = !isNaN(klarnaMinValue) && Number(klarnaMinValue)
  klarnaMaxValue = !isNaN(klarnaMaxValue) && Number(klarnaMaxValue)
  return {
    klarnaMinValue,
    klarnaMaxValue,
  }
}

const klarnaBaseLogic = (req, priceInfo, klarnaClientID, klarnaPlacementKey) => {
  const { klarnaMinValue, klarnaMaxValue } = getKlarnaRange()
  const { purchase_amount, currentPrice } = priceInfo
  const locale = getLocaleFromReq(req)
  const isKlarnaConfigExist = isCompleteKlarnaConfig()

  const isValueValid =
    purchase_amount != 0 && currentPrice >= klarnaMinValue && currentPrice <= klarnaMaxValue

  if (!isValueValid || !isKlarnaConfigExist) {
    return null
  }

  const query = serialize({
    purchase_amount,
    locale,
    klarnaClientID,
    klarnaPlacementKey,
  })
  return fetchFromServerSideWithCorrId(req, `/api/klarnaservices${query}`)
    .then((appDataRes) => {
      responseLogger(appDataRes)
      return appDataRes.json()
    })
    .catch((err) => console.log('Error in fetching klarna data', err))
}

export const fetchKlarna = async (
  req,
  mappedProductData = [],
  klarnaClientID,
  klarnaPlacementKey
) => {
  const productPrices = mappedProductData?.map?.(getPurchasedAmount)
  const uniqPrices = uniqBy(productPrices, 'purchase_amount')

  const promises = uniqPrices?.map?.((priceInfo) => {
    return klarnaBaseLogic(req, priceInfo, klarnaClientID, klarnaPlacementKey)
  })

  try {
    const response = await Promise.all(promises)
    const klarnaDetails = uniqPrices.reduce((result, price, index) => {
      return { ...result, [price.currentPrice]: response[index] }
    }, {})
    return klarnaDetails
  } catch (error) {
    return null
  }
}

export const getKlarnaPreferences = (preferences, locale) => {
  const {
    AdyenAssociatedPaymentsEnabled: isAdyenPaymentEnabled,
    AdyenKlarnaOSMClient: adyenEnablementLocaleData,
    enableKlarna: isEnableKlarna,
  } = preferences

  let isLocaleAdyenPaymentEnabled = false
  let klarnaClientID = ''
  if (isAdyenPaymentEnabled && adyenEnablementLocaleData) {
    const adyenPaymentData = adyenEnablementLocaleData[locale?.replace('-', '_')]
    isLocaleAdyenPaymentEnabled = adyenPaymentData?.enable
    klarnaClientID = adyenPaymentData?.key
  }

  return { klarnaClientID, isLocaleAdyenPaymentEnabled, isEnableKlarna }
}
