import React, { useEffect, useRef } from 'react'
import { alterCtaToShowAtom, AlterCtaToShow, promoCouponCodeAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import useGetCurrencyOptions from 'toro/hooks/useGetCurrencyOptions'

const PaymentWidget = withFeatureFlag(
  dynamic(() => import('toro/components/PaymentWidget/PaymentWidget')),
  {
    applePayConfigs: ['enableApplePayOnPDP'],
  }
)

const PaymentWidgetWrapper = ({
  variant = undefined,
  productData,
  selectedQty = 1,
  onClick,
  onOpen,
  disabled,
  isPdpV5 = false,
}) => {
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const productId = productData?.id
  const productIdRef = useRef(productId)
  const selectedQtyRef = useRef(selectedQty)
  const onClickRef = useRef(onClick)
  const onOpenRef = useRef(onOpen)
  const promoCouponCodeRef = useRef<string | null>(null)
  const promoCouponCode = useAtomValue(promoCouponCodeAtom)
  const getCurrencyOptions = useGetCurrencyOptions()
  const { currency: defaultCurrency } = getCurrencyOptions()

  useEffect(() => {
    if (promoCouponCode) {
      promoCouponCodeRef.current = promoCouponCode
    }
  }, [promoCouponCode])

  useEffect(() => {
    selectedQtyRef.current = selectedQty
    productIdRef.current = productId
    onClickRef.current = onClick
    onOpenRef.current = onOpen
  }, [selectedQty, productId, onClick, onOpen])

  if (alterCtaToShow !== AlterCtaToShow.EMPTY && alterCtaToShow !== AlterCtaToShow.APPLEPAY)
    return null

  const itemPrice =
    get(productData, 'pricingInfo[0].sales.value') || get(productData, 'pricingInfo[0].list.value')
  const totalPrice = itemPrice * selectedQty
  const currency =
    get(productData, 'pricingInfo[0].sales.currency') ||
    get(productData, 'pricingInfo[0].list.currency') ||
    defaultCurrency

  return (
    <PaymentWidget
      productIdRef={productIdRef}
      totalPrice={totalPrice}
      variant={variant}
      selectedQtyRef={selectedQtyRef}
      onClickRef={onClickRef}
      onOpenRef={onOpenRef}
      disabled={disabled}
      promoCouponCodeRef={promoCouponCodeRef}
      isPdpV5={isPdpV5}
      currency={currency}
    />
  )
}

export default PaymentWidgetWrapper
