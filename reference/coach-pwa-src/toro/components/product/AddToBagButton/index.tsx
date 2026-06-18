import { useContext, useState, useEffect, useMemo } from 'react'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import get from 'lodash/get'
import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PWAContext from 'components/common/PWAContext'
import { useIntl } from 'react-intl'
import unescape from 'lodash/unescape'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import HtmlContent from 'toro/components/HtmlContent'
import FallbackErrorButton from 'toro/components/product/FallbackErrorButton'
import useEinsteinRecommendations from 'toro/components/Einstein/useEinsteinRecommendations'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom, addToBagButtonRefAtom } from 'store/pdp.atom'
import { sendStaffStartTrackReq } from 'toro/helpers/staffStartHelper'
import { isStaffStartScriptAtom } from 'store/scripts.atom'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import { ProductVariant } from 'toro/types/productTypes'
import { DetailedProduct } from 'toro/types/productTypes/detailedProduct'

const ORDERING_STATUS_ARRAY = [
  ORDERING_STATUS.backorder,
  ORDERING_STATUS.preorder,
  ORDERING_STATUS.addToBag,
]

export enum OrderingStatus {
  backorder = 'backorder',
  preorder = 'preorder',
  addToBag = 'addToBag',
  soldOut = 'soldOut',
  notForSale = 'notForSale',
}

export type AddToBagButtonProps = {
  status: OrderingStatus | ''
  productData?: DetailedProduct
  maxQuantityError?: boolean
  stickyContent?: React.ReactNode
  colors: Record<string, any>
  isSticky?: boolean
  onClick: (isSticky?: boolean) => void
  isQuickView?: boolean
  addToBagCTACustomText?: string
  apploading?: boolean
  isBundleVariant?: boolean
  btnDisable?: boolean
  selectedVariant?: ProductVariant & {
    productId?: string
  }
  selectedQty?: number
  animationATB: { active: boolean; complete: boolean }
  setAnimationATB: (val: { active: boolean; complete: boolean }) => void
  individualBundleProduct?: boolean
  variant?: string
  priceInButton?: number
  setAddToBagClicked?: (payload: {
    isAddTobagClickedForbundleProductItem: boolean
    selectedBundleVariant: DetailedProduct
    selectedQty?: number
  }) => void
} & React.ComponentProps<typeof Button>

function AddToBagButton({
  status,
  productData,
  maxQuantityError,
  stickyContent,
  colors,
  isSticky,
  onClick,
  isQuickView,
  addToBagCTACustomText,
  apploading,
  isBundleVariant,
  btnDisable,
  selectedVariant,
  selectedQty,
  animationATB = { active: false, complete: false },
  setAnimationATB,
  individualBundleProduct,
  variant,
  priceInButton,
  ...props
}: AddToBagButtonProps) {
  const styles = useMultiStyleConfig('AddToBagButton', {
    variant: individualBundleProduct ? 'bundle' : variant,
  })
  const { viewport, isMobile } = useViewportType()
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const { formatMessage } = useIntl()
  const [slidingAnimationATB, setSlidingAnimationATB] = useState(false)
  const isAdaptiveTabbedPDP = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const setAtbButtonRef = useUpdateAtom(addToBagButtonRefAtom)
  const locale = get(appData, 'locale')
  const { currencySymbol } = getCurrentLocale(locale)

  const dataPid = productData?.id
  const isBundleProduct = get(productData, 'isBundleProduct', false)
  const theme = useTheme()
  let buttonProps: React.ComponentProps<typeof Button> = {
    variant: 'primary',
    lineHeight: theme.lineHeights.xs,
    color: theme.colors.main.secondary,
  }
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const addToBagText = unescape(
    isTouchDevice || ['mobile', 'tablet']?.includes(viewport)
      ? isAdaptiveTabbedPDP
        ? formatMessage(
            {
              id: 'pdp.product.addToBagAdaptivePDPTextMobile',
              defaultMessage: 'Add to Bag',
            },
            null,
            { ignoreTag: true }
          )
        : formatMessage(
            {
              id: 'pdp.product.addToBagTextMobile',
              defaultMessage: 'Add To Bag Before Its Gone',
            },
            null,
            { ignoreTag: true }
          )
      : formatMessage(
          {
            id: 'pdp.product.addToBagTextDesktop',
            defaultMessage: 'ADD TO BAG',
          },
          null,
          { ignoreTag: true }
        )
  )
  const BUTTON_CAPTION = {
    [ORDERING_STATUS.backorder]: addToBagText,
    [ORDERING_STATUS.preorder]: formatMessage({
      id: 'pdp.product.preOrder',
      defaultMessage: 'Pre-order',
    }),
    [ORDERING_STATUS.addToBag]: addToBagText,
    [ORDERING_STATUS.soldOut]: isAdaptiveTabbedPDP
      ? formatMessage({
          id: 'pdp.product.outOfStockAdaptivePDPButton',
          defaultMessage: 'Sold Out',
        })
      : formatMessage({
          id: 'pdp.product.outOfStockButton',
          defaultMessage: 'SOLD OUT',
        }),
    [ORDERING_STATUS.notForSale]: formatMessage({
      id: 'pdp.product.notForSale',
      defaultMessage: 'Not for sale',
    }),
  }
  let buttonCaption = BUTTON_CAPTION[status]
  const { sendRecoAddToCart } = useEinsteinRecommendations({})
  const isEinsteinRecomEnabledPref = usePreference({
    groupId: 'EinsteinRecommendation',
    preferenceId: 'isEinsteinRecomEnabled',
    siteId,
    defaultValue: false,
  })
  const isEinsteinRecomEnabledPDPPref = usePreference({
    groupId: 'EinsteinRecommendation',
    siteId,
    preferenceId: 'isEinsteinRecomEnabledPDP',
    defaultValue: false,
  })

  const staffStartScriptLoaded = useAtomValue(isStaffStartScriptAtom)

  const {
    staffStartPreferences: { merchantId },
  } = usePreferenceNew({
    staffStartPreferences: ['merchantId'],
  })

  // const sizeOnlyProduct =
  //   productData?.sizes &&
  //   productData.sizes.length > 0 &&
  //   (!productData?.widths || productData?.widths?.length === 0)
  // const sizedAndWidthProduct =
  //   productData?.sizes &&
  //   productData.sizes.length > 0 &&
  //   productData?.widths &&
  //   productData?.widths?.length > 0
  // const colorOnlyProduct = !productData?.sizes || productData?.sizes?.length === 0

  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
      )
    ) {
      setIsTouchDevice(true)
    }
  }, [])
  // The check of enableMobileAddToBagButton will be commented while this is turned off on BM.
  // Leaving behind the instrucion without this checking.
  // if (buttonCaption === 'I WANT IT' && enableMobileAddToBagButton && isTouchDevice) {
  //   buttonCaption = buttonCaptionForTouchDevice
  // }

  const soldOutCustomText =
    get(productData, 'custom.c_soldOutCustomText') ||
    get(productData, 'defaultVariantData.custom.c_soldOutCustomText') ||
    get(productData, 'defaultVariationGroupData.custom.c_soldOutCustomText') ||
    get(productData, 'customAttributes.c_soldOutCustomText')

  const instockText =
    get(productData, 'custom.c_inStockCustomText') ||
    get(productData, 'instockText') ||
    get(productData, 'defaultVariantData.custom.c_inStockCustomText') ||
    get(productData, 'defaultVariationGroupData.custom.c_inStockCustomText') ||
    get(productData, 'customAttributes.c_inStockCustomText')

  if (isBundleVariant && ORDERING_STATUS_ARRAY.includes(status)) {
    buttonProps = {
      variant: 'secondary',
      lineHeight: theme.lineHeights.xs,
      color: colors.main.black,
      _hover: {
        backgroundColor: colors.main.black,
        color: colors.main.secondary,
      },
    }
  }

  if (status === ORDERING_STATUS.soldOut) {
    buttonProps = {
      variant: 'secondary',
      disabled: true,
      backgroundColor: colors.main.inactive,
      _hover: { pointerEvents: 'none' },
    }
    if (soldOutCustomText) {
      buttonCaption = soldOutCustomText
    }
  } else if (instockText && instockText !== undefined) {
    buttonProps = {
      variant: 'secondary',
      disabled: true,
      color: colors.main.black,
      backgroundColor: colors.main.gray,
    }
    buttonCaption = instockText
  }

  if (maxQuantityError || btnDisable) {
    buttonProps = {
      variant: 'secondary',
      disabled: true,
      opacity: '1 !important',
      backgroundColor: colors.main.inactive,
      color: colors.main.black,
    }
  }

  const clickEvent = (e) => {
    setAtbButtonRef(e.currentTarget)
    onClick(isSticky)

    if (!productData?.isBundleProduct && isBundleVariant) {
      props.setAddToBagClicked({
        isAddTobagClickedForbundleProductItem: true,
        selectedBundleVariant: productData,
        selectedQty,
      })
    }

    if (isEinsteinRecomEnabledPDPPref && isEinsteinRecomEnabledPref) {
      const pricingInfo = selectedVariant?.pricingInfo?.[0]
      const salePrice = pricingInfo?.sales?.value
      const listPrice = pricingInfo?.list?.value
      const productDetail = {
        id: selectedVariant?.id || selectedVariant?.productId,
        quantity: selectedQty,
        price: salePrice || listPrice,
      }
      sendRecoAddToCart({ product: productDetail })
    }

    const productId = selectedVariant?.id || selectedVariant?.productId

    if (staffStartScriptLoaded) {
      sendStaffStartTrackReq({ merchantId, selectedQty, productId })
    }
  }

  const renderAddToBagButtonLabel = () => {
    if (soldOutCustomText && status === ORDERING_STATUS.soldOut) {
      return soldOutCustomText
    }
    if (addToBagCTACustomText) {
      return addToBagCTACustomText
    }
    if (instockText && status !== ORDERING_STATUS.soldOut) {
      return instockText
    }
    if (isBundleProduct && status === ORDERING_STATUS.addToBag) {
      return formatMessage({
        id: 'pdp.product.addBundleToBag',
        defaultMessage: 'ADD All TO BAG',
      })
    }
    if (addToBagText && status === ORDERING_STATUS.addToBag) {
      return addToBagText
    }

    return unescape(buttonCaption)
  }

  const addToBagButtonStyles = useMemo(
    () => styles.addToBagButton({ buttonProps, isSticky, isMobile }),
    [buttonProps, isSticky, isMobile]
  )
  const displayIconAtc = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'displayIcononAddToBagButton',
    defaultValue: '',
    siteId,
  })

  let addToBagIcon = null
  if (isMobile && status !== ORDERING_STATUS.soldOut && displayIconAtc) {
    addToBagIcon = <HtmlContent content={displayIconAtc} />
  }

  const renderAddToBagButton = () => (
    <Button
      rightIcon={addToBagIcon}
      {...buttonProps}
      onClick={clickEvent}
      size="lg"
      w="100%"
      whiteSpace="break-spaces"
      data-pid={dataPid}
      id={isSticky ? 'add-to-cart-sticky' : 'add-to-cart'}
      data-qa={
        isQuickView
          ? 'pdp_state_btn'
          : isBundleProduct
          ? 'bundle_add_all_to_bag_btn'
          : isBundleVariant
          ? 'bndle_pdp_state_btn'
          : 'pdp_state_btn'
      }
      sx={addToBagButtonStyles}
      className="add-to-cart"
    >
      {isAdaptiveTabbedPDP && priceInButton && !instockText && status !== ORDERING_STATUS.soldOut
        ? `${renderAddToBagButtonLabel()} - ${currencySymbol}${priceInButton}`
        : renderAddToBagButtonLabel()}
    </Button>
  )

  useEffect(() => {
    if (animationATB.active) {
      setSlidingAnimationATB(true)
    }
    if (animationATB.complete) {
      setTimeout(() => {
        setAnimationATB({ active: false, complete: false })
        setSlidingAnimationATB(false)
        // 150ms we use to make the completion animation match the speed of the process animation.
      }, 150)
    }
  }, [animationATB])

  const renderButtonWithAnimation = () => (
    <>
      <Box className="atb-button-animation" sx={styles.addToBagAnimation}>
        <Box
          className={`progress ${
            animationATB.active ? 'active' : animationATB.complete ? 'complete' : ''
          }`}
          sx={styles.addToBagAnimationProgress}
        />
        <Box className="text-wrapper" sx={styles.addToBagTextWrapper}>
          <Box className={`text-slider ${slidingAnimationATB ? 'sliding' : ''}`}>
            {renderAddToBagButton()}
            <Flex
              alignItems="center"
              justifyContent="center"
              className="text-progress"
              sx={styles.animationTextProgress}
            >
              {formatMessage({
                id: 'pdp.product.addToBagProgressMobile',
                defaultMessage: 'ADDING TO BAG...',
              })}
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )

  return (
    <Box flexGrow="1" sx={styles.addToBagWrapper} className="atb-wrapper">
      {!apploading ? (
        <>
          <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
            {!buttonProps?.disabled && !individualBundleProduct
              ? renderButtonWithAnimation()
              : renderAddToBagButton()}
          </Experiment>
          <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
            {renderAddToBagButton()}
          </Experiment>
        </>
      ) : (
        <Button sx={styles.initialAddToBagWrapper} className="initial-add-to-bag">
          {isBundleProduct
            ? formatMessage({
                id: 'pdp.product.addBundleToBag',
                defaultMessage: 'ADD All TO BAG',
              })
            : buttonCaption}
        </Button>
      )}
      {stickyContent}
    </Box>
  )
}

export default withErrorBoundaryWrapper(AddToBagButton, {
  fallback: <FallbackErrorButton />,
})
