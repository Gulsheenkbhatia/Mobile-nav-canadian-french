import { useAtomValue } from 'jotai/utils'
import {
  isInStockTextAtom,
  orderingStatusAtom,
  persistSoldOutSettingAtom,
  isNotifyMeAvailableProductAtom,
  alterCtaToShowAtom,
  AlterCtaToShow,
  isCustomizedProductAtom,
} from 'store/pdp.atom'
import { NOT_AVAILABLE_STATUSES_ARRAY, ORDERING_STATUS } from 'toro/helpers/productVariations'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'

export default function usePdpV7AlternateCtaVisibility() {
  const isInStockText = useAtomValue(isInStockTextAtom)
  const orderingStatus = useAtomValue(orderingStatusAtom)
  const persistSoldOutSetting = useAtomValue(persistSoldOutSettingAtom)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const isNotifyMeAvailableProduct = useAtomValue(isNotifyMeAvailableProductAtom)
  const isMembershipExclusiveProduct = useProductData('master.customAttributes.c_isMemberExclusive')
  const isCustomizedProduct = useAtomValue(isCustomizedProductAtom)

  const {
    pdpPreferences: { showBuyNowButton },
  } = usePreference({
    PDPPreferences: ['showBuyNowButton'],
  })

  const shouldDisplayAlterPaymentMethods = Boolean(
    !persistSoldOutSetting &&
      !NOT_AVAILABLE_STATUSES_ARRAY.includes(orderingStatus) &&
      !isInStockText &&
      !isMembershipExclusiveProduct &&
      (alterCtaToShow !== AlterCtaToShow.BUYNOW || (showBuyNowButton && !isCustomizedProduct))
  )

  const shouldDisplayNotifyMeButton =
    isNotifyMeAvailableProduct && orderingStatus === ORDERING_STATUS.soldOut

  return {
    shouldDisplayAlterPaymentMethods,
    shouldDisplayNotifyMeButton,
  }
}
