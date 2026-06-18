import type { ProductVariant } from 'toro/types/productTypes'
import { atom } from 'jotai'
import _get from 'lodash/get'
import has from 'lodash/has'
import { xgenClientAtom } from 'store/xgen.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import {
  EventTypeXgenMethod,
  EventTypeXgenKey,
  trackingEventPayloadKeys,
  requiredPayloadByEventType,
  defaultPayload,
} from 'toro/constants/xgenTracking'
import { v4 as uuidv4 } from 'uuid'

type TrackXgenEventPayload = {
  eventType: 'viewItem' | 'addToCart' | 'selectItem' | 'searchOpen' | 'searchQuery'
  eventData?: Record<string, any>
}

type IsolatedSearchEventPayload = {
  query: string
  page: number
  pageType: 'Search' | 'Shop'
}

const validateRequiredPayload = (
  eventType: TrackXgenEventPayload['eventType'],
  eventData: TrackXgenEventPayload['eventData']
) => {
  const requiredPayload = requiredPayloadByEventType[eventType]
  if (!requiredPayload || !Array.isArray(requiredPayload)) {
    return true
  }
  return requiredPayload.every(([key, value]) => {
    if (value === '*') {
      return !!eventData[key]
    }
    return value.split('|').some((option) => option === eventData[key])
  })
}

const extendPayload = (
  eventType: TrackXgenEventPayload['eventType'],
  payload: Record<string, any>
) => {
  return {
    ...payload,
    ...defaultPayload[eventType],
    ...(has(payload, 'query') ? { queryId: uuidv4() } : {}),
  }
}

export const trackXgenEventAtom = atom(null, async (get, _, payload: TrackXgenEventPayload) => {
  const { tracking: isTrackingEnabled } = get(xgenFeaturesAtom)
  if (!isTrackingEnabled) {
    return
  }

  const { eventType, eventData = {} } = payload

  try {
    const methodName = EventTypeXgenMethod[eventType]
    if (!methodName) {
      return
    }

    const { getIntegrationMethod } = get(xgenClientAtom) || {}
    const trackingMethod = await getIntegrationMethod(methodName)
    if (!trackingMethod) {
      return
    }

    const isValidPayload = validateRequiredPayload(eventType, eventData)
    if (!isValidPayload) {
      return
    }

    const variantId =
      _get(eventData, 'selectedVariantId') ||
      _get(eventData, 'product.defaultVariant.id') ||
      _get(eventData, 'product.defaultVariant.productId')
    const variantData = _get(eventData, 'product.variants', [])?.find(
      (variant: ProductVariant & { productId: string }) =>
        variant.id === variantId || variant.productId === variantId
    )

    const payloadKeys = trackingEventPayloadKeys[eventType]
    const eventKey = EventTypeXgenKey[eventType]
    const trackingData = { eventData, variantData }
    const { deploymentId } = get(xgenClientAtom) || {}

    const basePayload = payloadKeys.reduce(
      (acc, [key, path]) => {
        const validPath = path.split('|').find((p) => _get(trackingData, p))
        acc[key] = _get(trackingData, validPath)
        return acc
      },
      { deploymentId }
    )

    const trackingPayload = extendPayload(eventType, basePayload)
    const methodArguments = [trackingPayload]
    if (eventKey) {
      methodArguments.unshift(eventKey)
    }

    trackingMethod?.(...methodArguments)
  } catch (error) {
    console.error(`[XGEN logs]: Failed to track XGEN event: ${error.message}`)
  }
})

export const trackIsolatedXgenSearchEventAtom = atom(
  null,
  async (get, _, payload: IsolatedSearchEventPayload) => {
    const { tracking: isTrackingEnabled } = get(xgenFeaturesAtom)
    if (!isTrackingEnabled || payload?.pageType !== 'Search' || !payload?.query) {
      return
    }

    const { getIntegrationMethod } = get(xgenClientAtom) || {}

    try {
      const dispatch = await getIntegrationMethod('ell.dispatch')
      const { deploymentId } = get(xgenClientAtom) || {}

      const dispatchPayload = extendPayload('searchQuery', { ...payload, deploymentId })
      dispatch('search-query', dispatchPayload)
    } catch (error) {
      console.error(`[XGEN logs]: Failed to track isolated XGEN search event: ${error.message}`)
    }
  }
)
