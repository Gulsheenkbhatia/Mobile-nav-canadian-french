import Button, { ButtonProps } from 'toro/components/Button'
import React, { useContext, useEffect, useState } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { CHECKOUT_URL } from 'toro/constants/Urls'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import usePreference from 'toro/hooks/usePreference_new'
import SessionContext from 'toro/components/SessionContext'
import { useUpdateAtom } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
interface BuyNowButtonProps extends ButtonProps {
  onBuyNowButtonClick: (isSticky: boolean, isBuyNow: boolean) => void
  isSticky?: boolean
  selectedVariantId: string
  selectedQty: number
  maxQuantityError: boolean
  errorType: string
  variant?: string
  isPdpV5?: boolean
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  onBuyNowButtonClick,
  isSticky,
  selectedVariantId,
  errorType,
  selectedQty = 1,
  maxQuantityError,
  variant,
  isPdpV5 = false,
}) => {
  const [isClicked, setIsClicked] = useState(false)
  const { session } = useContext(SessionContext)
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const cartProducts = get(session, 'cart.product_items', [])
  const themeComponentName = isPdpV5 ? 'AddToBagArea' : 'ProductDetailMainSection'
  const styles = useMultiStyleConfig(themeComponentName, {
    variant,
  })
  const { formatMessage } = useIntl()
  const hasErrors = maxQuantityError || Boolean(errorType)

  const {
    pdpPreferences: { buyNowURL = CHECKOUT_URL, buyNowColor = '#81CE74' },
  } = usePreference({
    PDPPreferences: ['buyNowURL', 'buyNowColor'],
  })

  const checkoutUrl = useLocaleUrl(buyNowURL) as string
  const onClickEvent = () => {
    if (hasErrors) {
      return
    }
    setFullscreenLoading(true)
    setIsClicked(true)
    onBuyNowButtonClick(isSticky, true)
  }
  useEffect(() => {
    if (!isClicked) return
    if (cartProducts?.length && !hasErrors) {
      const checkoutUrlArr = checkoutUrl.split('#')
      window.location.href = encodeURI(
        `${checkoutUrlArr[0]}&skuid=${selectedVariantId}&quantity=${selectedQty}#${
          checkoutUrlArr[1] ?? 'shipping'
        }`
      )
    } else if (hasErrors) {
      setFullscreenLoading(false)
      isClicked && setIsClicked(false)
    }
  }, [cartProducts, hasErrors])

  return (
    <Flex sx={styles.buyNowWrapper} className="buy-now-button-wrapper">
      <Button
        sx={styles.buyNowButton}
        size="lg"
        backgroundColor={buyNowColor}
        onClick={onClickEvent}
        className="buy-now-button"
        disabled={maxQuantityError}
        data-qa="buy_now_cta"
      >
        {formatMessage({
          id: 'pdp.product.BuyNow',
          defaultMessage: 'Buy Now',
        })}
      </Button>
    </Flex>
  )
}

export default BuyNowButton
