import { useContext } from 'react'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import ApplyCode from 'toro/components/CouponTracker/ApplyCode'

const COUPON_PARAMETER = 'offerCode'

const CouponTracker = () => {
  const { session } = useContext(SessionContext)
  const basketId = get(session, 'cart.basket_id', '')
  const searchParams = new URLSearchParams(window?.location?.search)
  const couponCode = searchParams.get(COUPON_PARAMETER)

  if (session.initialized && couponCode && basketId) {
    return <ApplyCode couponCode={couponCode} />
  }

  return null
}

export default CouponTracker
