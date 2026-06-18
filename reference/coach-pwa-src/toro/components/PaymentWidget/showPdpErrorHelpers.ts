import { ApplePayErrorType } from 'store/pdp.atom'
import { ORDERING_ERROR, ORDERING_STATUS } from 'toro/helpers/productVariations'
import { ApplePayErrorHandler } from './types'

export const handleApplePayError: ApplePayErrorHandler = (
  error,
  setOrderingStatus,
  setOrderingError
) => {
  if (!error?.errorType) return

  const { errorType } = error

  if (errorType === ApplePayErrorType.PRODUCT_NOT_AVAILABLE) {
    setOrderingStatus(ORDERING_STATUS.soldOut)
    setOrderingError(ORDERING_ERROR.notAvailable)
    return
  }

  if (errorType === ApplePayErrorType.CART_THRESHOLD_ERROR) {
    setOrderingError(ORDERING_ERROR.cartThreshold)
    return
  }
}
