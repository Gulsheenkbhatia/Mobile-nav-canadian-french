type TrackPayload = {
  productId: string
  selectedQty: number
  merchantId: string
}

type ExternalTrackPayload = {
  sessionId: string
  userId: string
  merchantId: string
}

interface WindowWithStaffStart extends Window {
  staffStart?: {
    external?: {
      sendTrackingRequest: (merchantId: string, payload: Record<string, any>) => void
    }
    cart?: {
      sendTrackingRequest: (merchantId: string, payload: Record<string, any>) => void
    }
  }
  ss_tracking_merchant_id?: string
}

declare const window: WindowWithStaffStart

export const sendStaffStartTrackReq = ({
  merchantId,
  productId,
  selectedQty,
}: TrackPayload): void => {
  if (!selectedQty || !productId || !merchantId) return

  window?.staffStart?.cart?.sendTrackingRequest?.(merchantId, {
    product_code: productId,
    count: selectedQty,
  })
}

export const sendStaffStartExternalTrackReq = ({
  sessionId,
  userId,
  merchantId,
}: ExternalTrackPayload): void => {
  const external = window?.staffStart?.external
  if (!external || !sessionId || !merchantId) return

  external.sendTrackingRequest(merchantId, {
    user_id: userId,
    session_id: sessionId,
  })
  window.ss_tracking_merchant_id = merchantId
}
