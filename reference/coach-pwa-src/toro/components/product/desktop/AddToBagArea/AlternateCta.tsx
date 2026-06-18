import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
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
import PaymentWidget from 'toro/components/product/desktop/AddToBagArea/PaymentWidgetController'
import BuyNowButton from 'toro/components/product/desktop/AddToBagArea/BuyNowButtonWrapper'
import Flex from 'toro/components/Flex'
import useStyles from 'toro/hooks/useStyles'
import NotifyMeButton from 'toro/components/product/desktop/AddToBagArea/NotifyMeButtonWrapper'
import usePreference from 'toro/hooks/usePreference_new'

export type AlternateCtaProps = {
  // PDP v7 passes this. When true, Buy Now and Apple Pay are not rendered.
  hideBuyNowAndApplePay?: boolean
}

const AlternateCta = ({ hideBuyNowAndApplePay = false }: AlternateCtaProps) => {
  const isInStockText = useAtomValue(isInStockTextAtom)
  const orderingStatus = useAtomValue(orderingStatusAtom)
  const persistSoldOutSetting = useAtomValue(persistSoldOutSettingAtom)
  const alterCtaToShow = useAtomValue(alterCtaToShowAtom)
  const isNotifyMeAvailableProduct = useAtomValue(isNotifyMeAvailableProductAtom)
  const isMembershipExclusiveProduct = useProductData('master.customAttributes.c_isMemberExclusive')
  const isCustomizedProduct = useAtomValue(isCustomizedProductAtom)
  const styles = useStyles()

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

  const shouldShowBuyNowAndWallet = shouldDisplayAlterPaymentMethods && !hideBuyNowAndApplePay

  if (!shouldShowBuyNowAndWallet && !shouldDisplayNotifyMeButton) return null

  return (
    <Flex sx={styles.alternateCtaWrapper} className="alter-cta-wrapper">
      {shouldDisplayNotifyMeButton && <NotifyMeButton />}
      {shouldShowBuyNowAndWallet && (
        <>
          <BuyNowButton />
          <PaymentWidget />
        </>
      )}
    </Flex>
  )
}

export default withErrorBoundaryWrapper(AlternateCta)
