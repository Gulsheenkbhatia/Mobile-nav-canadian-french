import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Text from 'toro/components/Text'
import Price from 'toro/components/Price'
import get from 'lodash/get'
import StarRating from 'toro/components/list/StarRating'
import Swatches from 'toro/components/Swatches'
import SaveForLater from 'toro/components/SaveForLater'
import Badges from 'toro/components/badges/Badges'
import useBadges from 'toro/components/badges/hooks/useBadges'
import WrapIf from 'toro/components/WrapIf'
import PWAContext from 'components/common/PWAContext'
import {
  filterProductVariants,
  hasId,
  getPropValuesFromVariationValues,
  filterColorsToSwatches,
} from 'toro/helpers/productVariations'
import SessionContext from 'toro/components/SessionContext'
import { fetchSwatchProductData } from 'toro/helpers/fetchSwatchProductData'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import useAnalytics from 'toro/analytics/useAnalytics'
import getAPIURL from 'helpers/getAPIURL'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePLP'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import CustomSlot from 'toro/cms/components/CustomSlot'
import MemberExclusive from 'toro/components/list/MemberExclusive'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useErrorHandler } from 'react-error-boundary'
import ProductTileImages from 'toro/components/list/ProductTile/ProductTileImages'
import { QUERY_PARAM_FROM_SEARCH } from 'toro/constants/appConstants'
import HtmlContent from 'toro/components/HtmlContent'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import Image from 'toro/components/Image'
import OnPurposePopOver from 'toro/components/product/OnPurposePopOver'
import LoadingWithBackdrop from 'toro/components/LoadingWithBackdrop'
import getPromoData from 'toro/helpers/getPromoData'
import { useInView } from 'react-intersection-observer'
import {
  setViewSimilarHeightForPath,
  getTileHeightForPath,
  setTileHeightForPath,
  useIsTileVisibleForPath,
  useSetTileVisibilityForPath,
} from 'toro/constants/utils.plp'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { isGoingBackAtom } from 'store/going-back.atom'
import { isOnModelPlp2UpAtom, isPlpV3Atom, qvProductAnalyticsDataAtom } from 'store/plp.atom'
import { getProductBadges } from 'toro/analytics/clients/googleAnalyticsBadges'
import { wishlistIdsAtom } from 'store/wishlist.atom'
import QuickAddToBag from 'toro/components/list/QuickAddToBag'
import { isSubBrandActiveAtom, isSWOutletAtom } from 'store/global.atom'
import { viewedProductsAtom } from 'store/viewed-products.atom'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { LOOKBOOK_EXPERIMENTS_BY_PRIORITY } from 'toro/constants/lookbookExperiments'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'
import Flex from 'toro/components/Flex'
import { isQuickATBDisabled, fetchColorSizes, getIsNotifyMeButtonVisible } from 'toro/helpers/plp'
import { sortFullMediaBySequence } from 'toro/helpers/skuHelper'
import getMediaSequence from 'toro/helpers/getMediaSequence'
import InsiderExclusiveButton from 'toro/components/list/InsiderExclusiveButton'
import { ViewSimilarIcon } from 'toro/icons'
import ViewSimilarCTA from 'toro/components/list/ViewSimilarCTA'
import ScrollableSwatches from 'toro/components/ScrollableSwatches'
import StarRatingV2 from 'toro/components/list/StarRatingV2'
import QuickViewButton from 'toro/components/list/QuickView/QuickViewButton'
import ProductTileSizeDrawer from 'toro/components/list/ProductTileSizeDrawer'
import useWithLoading from 'toro/hooks/useWithLoading'
import { isItemMaxQuantityReached } from 'toro/helpers/isItemMaxQuantityReached'
import SigninMemberButton from 'toro/components/product/SigninMemberButton'
import NotifyMeButton from 'toro/components/product/NotifyMeWidget/NotifyMeButton'
import { mergeThumbnailsWithOnModel } from 'toro/helpers/imagesHelper'
import getLookBookMedia from 'toro/helpers/getLookBookMedia'
import { productTileSections } from 'toro/constants/productList'
import { Action as MatchingExperienceAction, addInteractionAtom } from 'store/matching-experience'
import PriceTemplate from 'toro/components/PriceTemplate'
import getProductPricesFromVg from 'toro/helpers/getProductPricesFromVg'
import { visuallySimilarAttributeMapAtom } from 'store/visually-similar.atom'
import withProductDetailsTooltip from 'toro/hocs/withProductDetailsTooltip'
import BASE_TEMPLATE_CONFIG from 'toro/helpers/templating/baseConfig'
import { getTemplateComponentConfig } from 'toro/helpers/templating/merge'
import { experimentsAtom } from 'store/experiments.atom'
import { BadgeVariant } from 'toro/components/badges/Badge'
import { Color, CustomAttributes, ListingProduct, ProductVariant } from 'toro/types/productTypes'
import { SystemStyleObject } from '@chakra-ui/styled-system'
import { AnalyticsData } from 'toro/hooks/useAddToCart'
import { PricePreferences } from 'toro/hooks/usePricePreferences'

const quickViewQa = 'cm_tile_button_pt_qv'

interface ProductSizeOption {
  variantId: string
  value: string
  name: string
  orderable: boolean
}

interface TilePreferences {
  displayMaterialInfoInProductTile: boolean
  isEnableLoaderOnPDP: boolean
  isEnableSaleSuppression: boolean
  enableCategoryImageSequence: boolean
  sourceCodeGroupAttributeMapping: Record<string, string>
  showMaterial: boolean
  isDisplayOosSwatch: boolean
  onPurposeBadgeImage: string
  hideOnPurposeBadgeOnMobilePlpv3: boolean
}

interface ProductTileProps {
  product: ListingProduct
  onQuickViewClick?: (
    activeUrl: string,
    selectedVGId: string,
    masterId: string,
    variants: ProductVariant[],
    activeColorId?: string
  ) => void
  index: number
  priceType?: string
  isComparablePriceValue?: boolean
  isComparablePriceEnabledCategory?: boolean
  suppressMaterial?: boolean
  sourceCodeGroupId?: string
  tilePreferences: TilePreferences
  pricePreferences: PricePreferences
  isSPC?: boolean
  isFPC?: boolean
  onVisible?: ({ idx, cells }: { idx: number; cells?: number[] }) => void
  lastLoadedTileIndex?: number
  pageUrlHash?: string
  onImageLoad?: () => void
  pageType?: string
  onAddToBagClick: (
    product: ListingProduct,
    setDisableQuickAddButton: (disabled: boolean) => void,
    fetchSizesWithLoad?: (vgId: string) => Promise<ProductSizeOption[]>,
    setIsTileSizeDrawerVisible?: (visible: boolean) => void
  ) => () => void
  isQuickAddToBagEnabledForCategory?: boolean
  searchTerm?: string
  categoryImageSequence?: string
  onSizeDrawerAtbClickWithLoader?: (selectedVariantId: string) => void | Promise<void>
  onModelPlpSequence?: string[]
  variant?: string
  sizeVariant?: string
  showOnlySinglePrice?: boolean
  disableColorSwatches?: boolean
  isThinkPage?: boolean
  gridVariant?: string
  isVisuallySimilarSRPEnabled?: boolean
  productTitleCharLimit?: number
}

function getMedia(color: Color) {
  return get(color, 'media')
}

function handleSearchData({
  searchTerm,
  activeUrl,
  setActiveUrl,
}: {
  searchTerm: string
  activeUrl: string
  setActiveUrl: (url: string) => void
}) {
  if (searchTerm === '' || searchTerm === undefined) {
    return
  }
  const endUrlPattern = /html$/g

  setActiveUrl(
    activeUrl +
      (activeUrl.match(endUrlPattern) ? '?' : '&') +
      `${QUERY_PARAM_FROM_SEARCH}=${searchTerm}`
  )
}

const getInViewHeight = (el: Element | null): number | undefined => {
  if (!el) {
    return
  }

  const rectHeight = el.getBoundingClientRect().height
  return Math.round(rectHeight * 100) / 100
}

const ViewSimilar = ({
  styles,
  activeProduct,
  product,
  visuallySimilarProp,
}: {
  styles: Record<string, SystemStyleObject>
  activeProduct: ListingProduct
  product: ListingProduct
  visuallySimilarProp?: string
}) => {
  return (
    <Flex
      className={productTileSections.visuallySimilar.contentClass}
      minWidth="100%"
      flexGrow="1"
      alignItems="center"
      justifyContent="center"
    >
      <ViewSimilarCTA
        styles={styles}
        activeProduct={activeProduct}
        product={product}
        visuallySimilarProp={visuallySimilarProp}
        icon={<ViewSimilarIcon />}
      />
    </Flex>
  )
}

const BoxWithProductDetailsTooltip = withProductDetailsTooltip(Box)

function ProductTile({
  product,
  onQuickViewClick,
  index,
  priceType,
  isComparablePriceValue,
  isComparablePriceEnabledCategory,
  suppressMaterial,
  sourceCodeGroupId,
  tilePreferences,
  pricePreferences,
  isSPC = false,
  isFPC = false,
  onVisible,
  lastLoadedTileIndex,
  pageUrlHash,
  onImageLoad,
  pageType,
  onAddToBagClick,
  isQuickAddToBagEnabledForCategory,
  searchTerm,
  categoryImageSequence,
  onSizeDrawerAtbClickWithLoader,
  onModelPlpSequence,
  variant,
  sizeVariant,
  showOnlySinglePrice,
  disableColorSwatches = false,
  isThinkPage = false,
  gridVariant,
  isVisuallySimilarSRPEnabled,
  productTitleCharLimit,
}: ProductTileProps) {
  const { viewport, isDesktop, isMobile } = useViewportType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isOnModelPlp2Up = useAtomValue(isOnModelPlp2UpAtom)
  const isOnModelEnabled = !!onModelPlpSequence && !isOnModelPlp2Up
  const plpV3StyleVariant = isPlpV3 ? 'plpV3' : null
  const experiments = useAtomValue(experimentsAtom)

  const styles = useMultiStyleConfig('ProductTileCSS', {
    variant: variant ? variant : isOnModelPlp2Up ? 'onModelPlp2Up' : plpV3StyleVariant,
    size: sizeVariant,
  })

  const analytics = useAnalytics()
  const handleBoundaryError = useErrorHandler()
  const { isGuestUser, session } = useContext(SessionContext)
  const isLoggedIn = !!get(session, 'user.userEmail')
  const { appData } = useContext(PWAContext)
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const isGoingBack = useAtomValue(isGoingBackAtom)
  const wishlistIds = useAtomValue(wishlistIdsAtom)
  const viewedProductsIds = useAtomValue(viewedProductsAtom)
  const isLookBookMainStagePDP = useExperiment(EXPERIMENTS.LOOKBOOK_MAIN_STAGE_PDP)
  const isLookBookVideoWaysToWear = useExperiment(EXPERIMENTS.LOOKBOOK_VIDEO_WAYS_TO_WEAR)
  const isLookBookVideoWhatFitsInside = useExperiment(EXPERIMENTS.LOOKBOOK_VIDEO_WHAT_FITS_INSIDE)
  const isViewedProduct = viewedProductsIds.includes(product.masterId)
  const setQvProductAnalyticsData = useUpdateAtom(qvProductAnalyticsDataAtom)
  const [activeProduct, setActiveProduct] = useState(product)
  const [colorIsChanging, setColorIsChanging] = useState(false)
  const [tileHeight, setTileHeight] = useState(
    typeof window !== 'undefined' ? getTileHeightForPath(pageUrlHash, index) : undefined
  )
  const [firstImageLoaded, setFirstImageLoaded] = useState(false)
  const [isTileSizeDrawerVisible, setIsTileSizeDrawerVisible] = useState(false)
  const closeDrawer = useCallback(() => setIsTileSizeDrawerVisible(false), [])
  const didSetTileHeight = useRef(false)
  const isVisibleTriggeredRef = useRef(false)
  const [wasRenderedAtLeastOnce, setWasRenderedAtLeastOnce] = useState(false)
  const [fetchSizesWithLoad] = useWithLoading(fetchColorSizes, [], setColorIsChanging)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const isTileVisible = useIsTileVisibleForPath(pageUrlHash, index, isDesktop)
  const setTileVisibility = useSetTileVisibilityForPath(pageUrlHash, index)
  const visuallySimilarAttributeMap = useAtomValue(visuallySimilarAttributeMapAtom)

  const addInteractionForEnhancedMatchingExperience = useUpdateAtom(addInteractionAtom)

  const masterId = get(activeProduct, 'masterId', '')
  const ctaRef = useRef(null)
  const tileRef = useRef(null)

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const initialUrl = useMemo(() => {
    const url = get(activeProduct, 'url', '')
    if (['salePrice', 'fullPrice'].includes(priceType)) {
      const queryParamName = priceType === 'salePrice' ? 'isSPC' : 'isFPC'
      return url + `${url?.includes('?') ? '&' : '?'}${queryParamName}=true`
    }
    return url
  }, [activeProduct, priceType])

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const { membershipExclusiveProduct, isProductSet, initialColor } = useMemo(
    () => ({
      membershipExclusiveProduct:
        get(activeProduct, 'masterProductData.custom.c_isMemberExclusive') ||
        get(activeProduct, 'master.customAttributes.c_isMemberExclusive'),
      isProductSet: get(product, 'isProductSet', null),
      initialColor:
        getPropValuesFromVariationValues(product)?.color ??
        getPropValuesFromVariationValues(product, false)?.color,
    }),
    [product, activeProduct]
  )
  const isQuickAddToBagEnabled = isQuickAddToBagEnabledForCategory && !isProductSet
  const isMobileQuickAtbEnabled = isQuickAddToBagEnabled && !isDesktop

  const pricingDisplayTemplate = useMemo(
    () => get(activeProduct, 'pricingDisplayTemplate', ''),
    [activeProduct]
  )

  const memberExclusiveButtonProps = {
    productData: product,
    isGuestUser,
    isLoggedIn,
    membershipExclusiveProduct,
  }

  const [activeColorId, setActiveColorId] = useState()
  const [activeMedia, setActiveMedia] = useState(() =>
    getMedia(product?.hitType === 'set' || !initialColor ? product : initialColor)
  )
  const [activeUrl, setActiveUrl] = useState(initialUrl)
  const lastRequestedColorIdRef = useRef(null)
  const { defaultLocale, locale } = useIntl()
  const [language = 'en', countryCode = 'US'] =
    locale?.split('-') || defaultLocale?.split('-') || []
  const productName = get(activeProduct, 'name', '')

  const displayedProductName = useMemo(() => {
    if (productTitleCharLimit > 0 && productName.length > productTitleCharLimit) {
      return `${productName.slice(0, productTitleCharLimit)}...`
    }
    return productName
  }, [productName, productTitleCharLimit])

  const [disableQuickAddButton, setDisableQuickAddButton] = useState(false)
  const [isMaxQuantityReached, setIsMaxQuantityReached] = useState(false)

  const {
    powerReviews: { isEnableRatingOnPLP, enableEmplifi: isReviewsEnabled = false },
    badging: { maxPromoCalloutsDisplayPLP },
    imageSequence: { enablePDPAltImageSequence, imageVideoSequence },
    toggleSiteFeatures: {
      disableLoaderOnPLP,
      enableMaxQtyRestriction: maxQtyRestrictionEnabled = false,
      similarOptionsCTAConfig,
    },
    cartCheckoutSettings: { defaultMaxOrderQuantity: maxOrderQty = 5 },
    adaptiveExperience: { enableLookBook },
    pdpPreferences: { pdpTemplates },
  } = usePreference({
    powerReviews: ['isEnableRatingOnPLP', 'enableEmplifi'],
    badging: ['maxPromoCalloutsDisplayPLP'],
    ImageSequence: ['enablePDPAltImageSequence', 'imageVideoSequence'],
    ToggleSiteFeatures: [
      'disableLoaderOnPLP',
      'enableVisuallySimilar',
      'enableMaxQtyRestriction',
      'similarOptionsCTAConfig',
    ],
    CartCheckoutSettings: ['defaultMaxOrderQuantity'],
    adaptiveExperience: ['enableLookBook'],
    EinsteinRecommendation: ['isEinsteinRecomEnabled'],
    PDPPreferences: ['pdpTemplates'],
  })

  const flagsByExperiment = {
    [EXPERIMENTS.LOOKBOOK_VIDEO_WHAT_FITS_INSIDE]: isLookBookVideoWhatFitsInside,
    [EXPERIMENTS.LOOKBOOK_VIDEO_WAYS_TO_WEAR]: isLookBookVideoWaysToWear,
    [EXPERIMENTS.LOOKBOOK_MAIN_STAGE_PDP]: isLookBookMainStagePDP,
  }

  const activeLookBookVariant = useMemo(() => {
    if (!enableLookBook) return null
    return LOOKBOOK_EXPERIMENTS_BY_PRIORITY.find((exp) => flagsByExperiment[exp])
  }, [
    enableLookBook,
    isLookBookVideoWhatFitsInside,
    isLookBookVideoWaysToWear,
    isLookBookMainStagePDP,
  ])

  const handleInViewChange = useCallback(
    (inView) => {
      // mimics InView's 'triggerOnce' functionality
      if (inView && !isVisibleTriggeredRef.current) {
        isVisibleTriggeredRef.current = true
        onVisible?.({ idx: index, cells: product?.cells })
      }

      setTileVisibility(inView)
    },
    [onVisible, index, product]
  )

  const { ref: inViewRef, entry: inViewEntry } = useInView({
    onChange: handleInViewChange,
  })

  const canRender = useMemo(() => {
    if (isGoingBack) {
      // newly loaded tiles via pagination are always rendered from the start
      if (lastLoadedTileIndex < index) {
        return true
      }

      // if we already rendered the product we don't blank it out anymore
      if (wasRenderedAtLeastOnce) {
        return true
      }

      // when going back we use the tile's visibility by default
      return isTileVisible
    }

    // if we didn't go back we render the product by default
    return true
  }, [lastLoadedTileIndex, index, wasRenderedAtLeastOnce, isGoingBack, isTileVisible])

  useEffect(() => {
    if (index && canRender && inViewEntry && firstImageLoaded) {
      setTimeout(() => {
        if (didSetTileHeight.current) {
          return
        }

        const height = getInViewHeight(inViewEntry.target)
        if (height) {
          didSetTileHeight.current = true
          setTileHeight(height)
          setWasRenderedAtLeastOnce(true)
          setTileHeightForPath(pageUrlHash, index, height)
        }
      })
    }
  }, [index, inViewEntry, canRender, firstImageLoaded])

  const handleImageLoad = useCallback(() => {
    setFirstImageLoaded(true)
    onImageLoad?.()
  }, [index, pageUrlHash])

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const { isOnPurposeEnabled, averageOverallRating, totalReviewCount, material } = useMemo(() => {
    const custom = get(activeProduct, 'custom', {} as CustomAttributes)
    const masterCustom = get(activeProduct, 'masterProductData.custom', {})
    const isOnPurposeEnabled =
      custom?.c_isOnPurposeEnabled || masterCustom?.c_isOnPurposeEnabled || false
    const averageOverallRating = get(custom, 'c_avgRatingEmplifi')
    const totalReviewCount = get(custom, 'c_revCountEmplifi')
    const material = custom?.c_material

    return {
      isOnPurposeEnabled,
      averageOverallRating: Number(averageOverallRating || 0),
      totalReviewCount: Number(totalReviewCount || 0),
      material,
    }
  }, [activeProduct])

  const makeCertonaRequest = useCertonaRequest({
    pagetype: 'quickview',
    itemid: get(product, 'id'),
  })

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const promoData = getPromoData(activeProduct, activeColorId, maxPromoCalloutsDisplayPLP)

  const selectedVGId = useMemo(() => {
    return product?.variationGroup?.find((item) => {
      return item?.color === activeColorId
    })?.productID
  }, [activeColorId, product])

  const activeColor = useMemo(() => {
    return (
      get(activeProduct, 'colors', []).find((color) => color.id === activeColorId) ||
      get(activeProduct, 'defaultColor')
    )
  }, [activeProduct, activeColorId])

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const {
    displayMaterialInfoInProductTile,
    isEnableLoaderOnPDP,
    isEnableSaleSuppression,
    enableCategoryImageSequence,
    sourceCodeGroupAttributeMapping,
    showMaterial,
    isDisplayOosSwatch,
    onPurposeBadgeImage,
    hideOnPurposeBadgeOnMobilePlpv3,
  } = tilePreferences

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const visuallySimilarProp = useMemo(() => {
    const groupId =
      activeProduct?.variationGroup?.find(
        (group) => activeProduct?.variationValues?.color === group.color
      )?.productID || activeProduct?.id
    return visuallySimilarAttributeMap.get(groupId)
  }, [activeProduct, visuallySimilarAttributeMap])

  const isVisuallySimilarProp = !!visuallySimilarProp
  const isSimilarOptionsCtaEnabled = get(similarOptionsCTAConfig, 'PLP.enable', false)
  const similarOptionsEnabled =
    isVisuallySimilarProp ||
    (isVisuallySimilarSRPEnabled && isSimilarOptionsCtaEnabled) ||
    (isSimilarOptionsCtaEnabled && isViewedProduct)

  const prefetchProps = useMemo(() => {
    const prefetchPageData = activeColorId
      ? null
      : {
          ...activeProduct,
          isBundleProduct: isProductSet,
          isComparablePriceEnabledCategory,
          isSWOutlet,
          templateConfig: getTemplateComponentConfig({
            defaultConfig: BASE_TEMPLATE_CONFIG,
            overrideConfig: isMobile ? get(pdpTemplates, 'mobile', {}) : {},
            activeExperiments: experiments.split('-'),
          }),
        }

    if (
      prefetchPageData?.defaultColor?.media &&
      enablePDPAltImageSequence &&
      (categoryImageSequence || imageVideoSequence)
    ) {
      prefetchPageData.defaultColor.media = {
        ...prefetchPageData.defaultColor.media,
        full: sortFullMediaBySequence(
          prefetchPageData.defaultColor.media.full,
          getMediaSequence(categoryImageSequence || imageVideoSequence)
        ),
      }

      if (activeLookBookVariant && viewport === 'mobile' && prefetchPageData) {
        if (prefetchPageData?.media?.full)
          prefetchPageData.media.full = getLookBookMedia(
            prefetchPageData.media.full,
            get(prefetchPageData, 'custom.c_department'),
            enableLookBook,
            isSubBrandActive,
            activeLookBookVariant
          )

        if (prefetchPageData?.defaultColor?.media?.full)
          prefetchPageData.defaultColor.media.full = getLookBookMedia(
            prefetchPageData.defaultColor.media.full,
            get(prefetchPageData, 'custom.c_department'),
            enableLookBook,
            isSubBrandActive,
            activeLookBookVariant
          )
      }
    }
    return {
      prefetch: true,
      prefetchUrl: getAPIURL(activeUrl),
      pageData: prefetchPageData,
    }
  }, [
    activeUrl,
    activeColorId,
    activeProduct,
    isProductSet,
    isComparablePriceEnabledCategory,
    isSWOutlet,
    activeLookBookVariant,
  ])

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const filteredSwatches = useMemo(() => {
    return filterColorsToSwatches(
      product,
      isDisplayOosSwatch,
      sourceCodeGroupId,
      sourceCodeGroupAttributeMapping,
      isEnableSaleSuppression,
      isSPC,
      isFPC,
      isPlpV3
    )
  }, [
    product,
    isDisplayOosSwatch,
    sourceCodeGroupId,
    sourceCodeGroupAttributeMapping,
    isEnableSaleSuppression,
    isSPC,
    isFPC,
    isPlpV3,
  ])

  // Properties can be derived on server
  useEffect(() => {
    const updateProductTile = async () => {
      if (!activeColorId || !product || !filteredSwatches) {
        return
      }
      const color = product.colors.find(hasId(activeColorId))
      const regEx = new RegExp(product.masterId, 'ig')
      const colorUrl = color?.url
      const updatedUrl = colorUrl?.replace(regEx, masterId)

      const colorVariants = filterProductVariants(product?.variants, {
        onlyOrderable: false,
        color: activeColorId,
      })
      const id =
        colorVariants?.length === 1
          ? get(colorVariants, '0.productId')
          : `${masterId}-${activeColorId}`

      if (disableLoaderOnPLP) {
        setActiveUrl(updatedUrl)
        setActiveMedia(getMedia(color))
      }
      // Store the current color ID we're requesting data for
      lastRequestedColorIdRef.current = activeColorId
      const variationProductData = await fetchSwatchProductData({
        id,
        activeColorId,
        cached: false,
        masterId: product?.masterId,
        variants: product?.variants,
        locale: appData?.localeInPath,
      })

      addInteractionForEnhancedMatchingExperience({
        action: MatchingExperienceAction.COLOR_SWATCH,
        value: get(
          variationProductData,
          'custom.c_aiColorBucket',
          get(variationProductData, 'defaultVariantGroup.customAttributes.c_aiColorBucket')
        ),
      })

      // Skip applying changes if a new color was selected while we were fetching
      if (lastRequestedColorIdRef.current !== activeColorId) return
      if (!disableLoaderOnPLP) {
        setActiveUrl(updatedUrl)
        setActiveMedia(getMedia(color))
      }
      if (variationProductData?.error) handleBoundaryError(variationProductData.error)
      setActiveProduct(variationProductData)
      setColorIsChanging(false)
    }

    updateProductTile()
  }, [activeColorId, filteredSwatches, product])

  useEffect(() => {
    const isQuickATBButtonDisabled = isPlpV3 && isQuickATBDisabled(activeProduct, session)
    setDisableQuickAddButton(isQuickATBButtonDisabled)
  }, [activeProduct, session])

  useEffect(() => {
    handleSearchData({ searchTerm, activeUrl, setActiveUrl })
  }, [])

  const selectedVG = activeProduct?.variationGroup?.find(
    (vgProduct) =>
      vgProduct?.id === activeProduct?.id || vgProduct?.id === activeProduct?.firstVariant
  )

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const allLevelsProductData = useMemo(
    () => ({
      product: activeProduct,
      masterData: get(activeProduct, 'masterProductData', {}),
      variationGroupData: get(activeProduct, 'variationGroupData', {}),
      bestSellerCheck: activeProduct?.custom?.c_isBestSeller,
      instockText: String(
        activeProduct?.custom?.instockText ||
          activeProduct?.defaultVariant?.customAttributes?.c_inStockCustomText ||
          ''
      ),
      selectedVG,
      isViewedProduct,
    }),
    [activeProduct, product, isViewedProduct]
  )

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const selectedVariant = useMemo(() => {
    let colorId = activeColorId ?? getPropValuesFromVariationValues(product)?.color?.id

    if (!colorId) {
      colorId = getPropValuesFromVariationValues(product, false)?.color?.id
    }

    if (colorId) {
      const rightVariationGroup = get(
        product?.variationGroup.filter((item) => item?.productID.includes(colorId)),
        '[0]'
      )
      return rightVariationGroup || activeProduct
    }
  }, [activeColorId, product, activeProduct])

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const displayedThumbnails = useMemo(() => {
    const rawThumbnails = get(activeMedia, 'thumbnails', [])
    const sequencedThumbnails = get(activeMedia, 'sequence', [])
    const shouldDisplayImageSequence = sequencedThumbnails?.length && enableCategoryImageSequence

    return mergeThumbnailsWithOnModel(
      onModelPlpSequence,
      !shouldDisplayImageSequence ? rawThumbnails : sequencedThumbnails,
      rawThumbnails,
      isOnModelPlp2Up
    ).map((thumbnail, index) => ({
      ...thumbnail,
      src: getProductImageSrc(thumbnail?.src, viewport || 'desktop', 'plp', {
        isThinkPage,
        gridVariant,
      }),
      index,
    }))
  }, [activeMedia, enableCategoryImageSequence, viewport, onModelPlpSequence, isOnModelPlp2Up])

  const onPpdLinkClick = useCallback(
    (eventLocation: string, gaBadges?: AnalyticsData) => {
      const isQuickView = eventLocation === 'quickview'
      analytics.send('selectItem', {
        product: {
          ...activeProduct,
          gaBadges: isQuickView && gaBadges,
          index: index + 1,
          wishlist: wishlistIds,
          video: product.video,
        },
        eventLocation,
      })

      // This check is used to add 42px of height to the tiles which did not yet have the "View Similar" button on them
      if (!isPlpV3 && similarOptionsEnabled && !isViewedProduct) {
        setViewSimilarHeightForPath(pageUrlHash, index, 42)
      }
    },
    [index, wishlistIds, activeProduct, analytics.send, isViewedProduct]
  )

  const onSlide = useCallback(
    (idx, isForcedScroll) => {
      if (isForcedScroll) {
        return
      }
      const productId = activeProduct?.id || product?.id
      const imageSrc = getFileBaseName(displayedThumbnails[idx]?.src)
      if (isMobile) {
        addInteractionForEnhancedMatchingExperience({
          action: MatchingExperienceAction.CAROUSEL_SWIPE,
          value: get(activeProduct, 'custom.c_filterCategory'),
        })
      }
      analytics.send('swatchInteraction', {
        eventAction: `P${idx}:product image swipe`,
        eventLabel: productId,
        swatchType: 'product image',
        swatchValue: imageSrc,
        swatchVariant: productId,
      })
    },
    [displayedThumbnails, product?.id, activeProduct?.id]
  )

  const onImageCarouselArrowClick = useCallback(
    (_, idx) => {
      const productId = activeProduct?.id || product?.id
      const imageSrc = getFileBaseName(displayedThumbnails[idx]?.src)
      const defaultColorId = get(activeProduct, 'defaultColor.vgId', '')

      if (isPlpV3) {
        addInteractionForEnhancedMatchingExperience({
          action: MatchingExperienceAction.CAROUSEL_SWIPE,
          value: get(activeProduct, 'custom.c_filterCategory'),
        })
      }

      analytics.send('swatchInteraction', {
        eventAction: `P${idx}:product image scroll view`,
        eventLabel: defaultColorId,
        swatchType: 'product image',
        swatchValue: imageSrc,
        swatchVariant: productId,
      })
    },
    [displayedThumbnails, product?.id, activeProduct?.id]
  )

  const onAddToWishlistSuccess = useCallback(
    (wishlistIds) => {
      analytics.send('addToWishlist', {
        product: { ...activeProduct, index },
        selectedVariantId: selectedVariant?.firstVariant,
        eventLocation: 'product tile',
        wishlist: wishlistIds,
      })
    },
    [activeProduct, index, analytics.send]
  )

  const onRemoveFromWishlistSuccess = useCallback(
    (wishlistId) => {
      analytics.send('removeFromWishlist', {
        product: { ...activeProduct, index },
        selectedVariantId: selectedVariant?.firstVariant,
        eventLocation: 'product tile',
        wishlist: wishlistId,
      })
    },
    [index, activeProduct, analytics.send]
  )

  const onSetActiveColor = useCallback(
    (color) => {
      setActiveColorId((prevActiveColor) => {
        const colorId = get(color, 'id')
        const swatchVariationData =
          colorId !== undefined ? `${get(product, 'id')}-${colorId}` : get(product, 'id')
        setColorIsChanging(colorId !== prevActiveColor)
        setIsMaxQuantityReached(false)
        analytics.send('swatchInteraction', {
          eventLocation: pageType === 'Search' ? 'search' : 'category',
          eventAction: 'swatch click',
          eventLabel: swatchVariationData,
          swatchType: 'color',
          swatchValue: get(color, 'text'),
          swatchVariant: swatchVariationData,
        })
        return colorId
      })
    },
    [product, analytics.send]
  )

  const onArrowClick = useCallback(
    (direction) => {
      analytics.send('swatchInteraction', {
        eventLocation: pageType === 'Search' ? 'search' : 'category',
        eventAction: 'swatch carousel click',
        eventLabel: get(product, 'id'),
        swatchType: 'color',
        swatchValue: `${direction} arrow`,
        swatchVariant: get(product, 'id'),
      })
    },
    [product, analytics.send]
  )

  // TODO (DIGIT-9240, DIGIT-9241): Move to server
  const { hideComparablePrice = false, hideDiscountedRate = false } = useMemo(() => {
    const selectedVg = activeProduct?.variationGroup?.find(
      (vgProduct) =>
        vgProduct?.id === activeProduct?.id || vgProduct?.firstVariant === activeProduct?.id
    )
    const selectedVariantForSelectedVg = activeProduct?.variant?.find((val) =>
      selectedVg?.variantsAssigned?.some((val2) => val2 === val.id)
    )
    const hideComparablePriceMemo =
      !isSWOutlet &&
      !!(
        selectedVariantForSelectedVg?.customAttributes?.c_hideComparablePriceValue || // variant
        selectedVg?.customAttributes?.c_hideComparablePriceValue || // vg
        activeProduct?.hideComparablePriceValue
      )

    const hideDiscountedRateMemo =
      !isSWOutlet &&
      !!(
        selectedVariantForSelectedVg?.customAttributes?.c_hideDiscountRate || // variant
        selectedVg?.customAttributes?.c_hideDiscountRate || // vg
        activeProduct?.hideDiscountedRate
      )

    return {
      hideComparablePrice: hideComparablePriceMemo,
      hideDiscountedRate: hideDiscountedRateMemo,
    }
  }, [activeProduct, isSWOutlet])

  const oneCoachPrices = useMemo(() => {
    if (!pricingDisplayTemplate) return null
    return getProductPricesFromVg(product, activeColorId)
  }, [product, activeColorId, pricingDisplayTemplate])

  const handleQuickViewButton = useCallback(() => {
    makeCertonaRequest()
    onQuickViewClick?.(
      activeUrl,
      selectedVGId ?? get(product, 'id'),
      product?.masterId,
      product?.variants,
      activeColorId ?? get(product, 'defaultColor.id')
    )
    const badgeAnalyticsFields = analytics.createEventData(getProductBadges, {
      product,
      isBundle:
        ['set', 'product set'].includes(get(product, 'hitType', '')) ||
        product?.isBundleVariant ||
        product?.basketInfo?.c_isBundleProductLineItem,
    })
    setQvProductAnalyticsData(badgeAnalyticsFields)
    onPpdLinkClick('quickview', badgeAnalyticsFields)
  }, [
    product,
    viewport,
    countryCode,
    language,
    activeUrl,
    activeColorId,
    masterId,
    onQuickViewClick,
  ])

  const tileImageBadges = useBadges({
    page: 'plp',
    area: BadgeArea.ON_IMAGE_PLP,
    ...allLevelsProductData,
  })
  const tileUpperBadges = useBadges({
    page: 'plp',
    area: BadgeArea.UPPER,
    variant: BadgeVariant.UpperPlacementPLP,
    ...allLevelsProductData,
  })
  const tileLowerBadges = useBadges({
    page: 'plp',
    area: BadgeArea.LOWER,
    variant: BadgeVariant.LowerPlacementPLP,
    ...allLevelsProductData,
  }).filter((badge) => badge?.content !== 'promo')

  const handleRatingClick = useCallback(() => {
    analytics.send('reviewInteraction', {
      eventLocation: pageType === 'Search' ? 'search' : 'category',
      eventAction: 'product rating click',
      eventLabel: get(product, 'masterId') || get(product, 'id') || '',
    })
    onPpdLinkClick('rating')
  }, [onPpdLinkClick])

  const onTitleClick = useCallback(() => onPpdLinkClick('title', undefined), [onPpdLinkClick])
  const shouldRenderMembershipExclusiveButton = isPlpV3 && membershipExclusiveProduct && !isLoggedIn
  const allowedSwatchesCount = isPlpV3 ? 0 : 1
  const SwatchesComponent = isPlpV3 ? ScrollableSwatches : Swatches
  const tileImageBadgeWrapper =
    !isPlpV3 && membershipExclusiveProduct
      ? styles.membershipExclusiveBadgeWrapper
      : styles.tileImageBadgeWrapper

  const isReviewOrATBEnabled =
    isPlpV3 &&
    (isMobileQuickAtbEnabled ||
      (similarOptionsEnabled && (isVisuallySimilarSRPEnabled || isViewedProduct)) ||
      (isReviewsEnabled && isEnableRatingOnPLP && product?.showRatings))

  const shouldRenderOnPurpose = isPlpV3
    ? !hideOnPurposeBadgeOnMobilePlpv3 && isOnPurposeEnabled
    : isOnPurposeEnabled

  const showOnImageSaveForLater =
    !isProductSet && !isSWOutlet && !isPlpV3 && !isMobileQuickAtbEnabled

  const onPlpV3QuickAddToBagClick = useCallback(() => {
    setIsMaxQuantityReached(
      isItemMaxQuantityReached({
        product: activeProduct,
        cartSession: session,
        maxQtyRestrictionEnabled,
        maxQuantity: maxOrderQty,
      })
    )
    onAddToBagClick(
      activeProduct,
      setDisableQuickAddButton,
      fetchSizesWithLoad,
      setIsTileSizeDrawerVisible
    )()
  }, [
    activeProduct,
    session,
    maxQtyRestrictionEnabled,
    maxOrderQty,
    onAddToBagClick,
    setIsMaxQuantityReached,
  ])

  const isNotifyMeButtonVisible = getIsNotifyMeButtonVisible(activeProduct)

  function renderOnImageCta() {
    if (!isDesktop) {
      return null
    }
    if (isPlpV3) {
      if (isQuickAddToBagEnabled && !colorIsChanging) {
        return shouldRenderMembershipExclusiveButton ? (
          <SigninMemberButton
            {...memberExclusiveButtonProps}
            variant="plpV3OnImage"
            isPlpV3Desktop={true}
          />
        ) : (
          <QuickAddToBag
            onClick={onPlpV3QuickAddToBagClick}
            isMaxQuantityReached={isMaxQuantityReached}
            isProductSet={isProductSet}
            disabled={disableQuickAddButton}
            variant="plpV3OnImage"
            showOnLegacy={undefined}
          />
        )
      }
      return null
    }
    if (!(isProductSet || isSWOutlet)) {
      return (
        <QuickViewButton
          className="quick-view-container"
          onClick={handleQuickViewButton}
          data-qa={quickViewQa}
          buttonRef={undefined}
        />
      )
    }
    return null
  }

  return (
    <BoxWithProductDetailsTooltip
      ref={inViewRef}
      payload={activeProduct}
      minHeight={tileHeight ? `${tileHeight}px` : '330px'}
      sx={styles.tileWrapper}
      className={`product-tile product-tile-${product.masterId}`}
      data-on-model={isOnModelEnabled ? '' : undefined}
      data-on-model-2up={isOnModelPlp2Up ? '' : undefined}
    >
      {isPlpV3 && <Box ref={tileRef} width="100%"></Box>}
      {canRender && (
        <>
          {!disableLoaderOnPLP && colorIsChanging && (
            <LoadingWithBackdrop position={'absolute'} zIndex={10} />
          )}
          {tileImageBadges?.length > 0 && (
            <Box position="absolute" sx={tileImageBadgeWrapper}>
              <Badges
                area={BadgeArea.ON_IMAGE_PLP}
                page="plp"
                variant={BadgeVariant.OnImagePLP}
                templateVariant={isPlpV3 ? 'onImagePLPv3' : undefined}
                {...allLevelsProductData}
              />
            </Box>
          )}
          {shouldRenderOnPurpose && (
            <OnPurposePopOver sx={styles.onPurposeBadgeWrapper}>
              <Image src={onPurposeBadgeImage} {...styles.onPurposeImage} />
            </OnPurposePopOver>
          )}
          <ProductTileImages
            id={activeProduct?.id || product?.id}
            name={activeProduct?.name || productName}
            onImageLoad={handleImageLoad}
            index={index}
            displayedThumbnails={displayedThumbnails}
            styles={styles}
            activeUrl={activeUrl}
            color={activeColor}
            onSlide={onSlide}
            onPpdLinkClick={onPpdLinkClick}
            prefetchProps={prefetchProps}
            isTileVisible={isTileVisible}
            video={product.video}
            cta={renderOnImageCta()}
            onCarouselArrowClick={onImageCarouselArrowClick}
          >
            {isTileSizeDrawerVisible && (
              <ProductTileSizeDrawer
                closeDrawer={closeDrawer}
                onAddToBagClick={onSizeDrawerAtbClickWithLoader}
                styles={styles}
              />
            )}
          </ProductTileImages>
          {showOnImageSaveForLater && (
            <SaveForLater
              name={product?.name}
              productData={product} // TODO: Interface segregation
              selectedVariant={selectedVariant}
              styleVariant={variant || 'plp'}
              isRecommendationTile={undefined}
              onAddToWishlistSuccess={onAddToWishlistSuccess}
              onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
            />
          )}

          <Box sx={styles.tileInfoWrapper}>
            <Box>
              {!isPlpV3 &&
                (isVisuallySimilarProp ? (
                  <Box px="var(--spacing-2)" sx={styles.viewSimilarCTAWrapper}>
                    <ViewSimilarCTA
                      styles={styles}
                      activeProduct={activeProduct}
                      product={product}
                      visuallySimilarProp={visuallySimilarProp}
                    />
                  </Box>
                ) : (
                  similarOptionsEnabled && (
                    <Box px="var(--spacing-2)" sx={styles.viewSimilarCTAWrapper}>
                      <ViewSimilarCTA
                        styles={styles}
                        activeProduct={activeProduct}
                        product={product}
                      />
                    </Box>
                  )
                ))}
              {tileUpperBadges?.length > 0 && (
                <Box
                  sx={styles.tileUpperBadgeWrapper}
                  display="flex"
                  flexWrap="wrap"
                  data-qa={
                    isProductSet ? 'pdt_link_bundle_save' : 'cm_tile_txt_pt_upper_promobadges'
                  }
                >
                  <Badges
                    sx={styles.tileUpperBadge}
                    area={BadgeArea.UPPER}
                    page="plp"
                    variant={BadgeVariant.UpperPlacementPLP}
                    {...allLevelsProductData}
                  />
                </Box>
              )}
              <Box sx={styles.tileProductName} className="product-name">
                <Link href={activeUrl} onClick={onTitleClick} {...prefetchProps}>
                  <Text
                    variant="body-text-secondary"
                    sx={styles.tileProductNameText}
                    size="md"
                    data-qa="cm_pdt_link_pt_title"
                    title={productName}
                  >
                    {displayedProductName}
                  </Text>
                </Link>
              </Box>
              {showMaterial && !suppressMaterial && displayMaterialInfoInProductTile && (
                <Box sx={styles.tileMaterialWrapper}>
                  <Text
                    sx={styles.tileMaterial}
                    variant="body-text-secondary"
                    size="sm"
                    data-qa="cm_tile_txt_pt_mtrl"
                  >
                    {material}
                  </Text>
                </Box>
              )}
              <ConditionalWrapper
                Wrapper={Box}
                condition={isPlpV3}
                sx={styles?.bottomWrapper}
                className="price-wrapper"
              >
                <Box sx={styles.priceWrapper}>
                  {!!pricingDisplayTemplate ? (
                    <PriceTemplate
                      template={pricingDisplayTemplate}
                      productPrice={oneCoachPrices}
                      variant={isPlpV3 && 'plpV3'}
                      showOnlySinglePrice={showOnlySinglePrice}
                    />
                  ) : (
                    <Price
                      pricePreferences={pricePreferences}
                      product={activeProduct}
                      activeColorId={activeColorId}
                      isComparablePriceValue={
                        isSWOutlet ? isComparablePriceEnabledCategory : isComparablePriceValue
                      }
                      hideComparablePrice={hideComparablePrice}
                      hideDiscountedRate={hideDiscountedRate}
                      isSWOutlet={isSWOutlet}
                      isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
                      variant={isPlpV3 && 'plpV3'}
                      enhancedPlp={isPlpV3}
                      showOnlySinglePrice={showOnlySinglePrice}
                    />
                  )}
                </Box>
                {!isProductSet &&
                  product?.enableSwatches &&
                  filteredSwatches.length > allowedSwatchesCount &&
                  !disableColorSwatches && (
                    <SwatchesComponent
                      minHeight="24px"
                      colors={filteredSwatches}
                      onChange={onSetActiveColor}
                      onArrowClick={onArrowClick}
                      activeColorId={isPlpV3 && !activeColorId ? initialColor?.id : activeColorId}
                      sx={styles?.tileSwatchWrapper || {}}
                      styles={get(styles, 'productColorSwatches')}
                      className="product-color-swatches-wrapper"
                    />
                  )}
              </ConditionalWrapper>
              {tileLowerBadges?.length > 0 && (
                <Box sx={styles.tileLowerBadgeWrapper}>
                  <Badges
                    area={BadgeArea.LOWER}
                    page="plp"
                    variant={BadgeVariant.LowerPlacementPLP}
                    {...allLevelsProductData}
                  />
                </Box>
              )}
              <Box
                className={productTileSections.promoCallout.containerClass}
                sx={styles.tilePromoCalloutWrapper}
              >
                {(promoData?.promoCallOut?.length >= 1 || promoData?.length >= 1) && (
                  <Box
                    sx={styles.tileLowerBadgeWrapper}
                    className={productTileSections.promoCallout.contentClass}
                  >
                    {isProductSet ? (
                      <HtmlContent content={promoData} pt="5px" fontSize="12px" />
                    ) : (
                      <CallOutMessage promoText={get(promoData, 'promoCallOut', promoData)} />
                    )}
                  </Box>
                )}
              </Box>

              {!isPlpV3 && product?.showRatings && (
                <WrapIf
                  Component={Link}
                  condition={isEnableLoaderOnPDP}
                  href={`${activeUrl}${activeUrl.includes('?') ? '&' : '?'}scrollToReview=true`}
                  variant="unstyled"
                  data-qa="m_plp_link_pt_cr"
                  onClick={handleRatingClick}
                  pointerEvents={isEnableLoaderOnPDP ? null : 'none'}
                >
                  <StarRating
                    rating={averageOverallRating}
                    count={totalReviewCount}
                    cursor={!isEnableLoaderOnPDP ? 'default' : undefined}
                  />
                </WrapIf>
              )}
              {!isPlpV3 && membershipExclusiveProduct && (
                <CustomSlot
                  content={get(appData, 'membership.contentSlots["membership-exclusive"]')}
                  Component={MemberExclusive}
                  isGuestUser={isGuestUser}
                  isOnBadge={tileImageBadges?.length > 0}
                />
              )}
            </Box>
            {isReviewOrATBEnabled && (
              <Flex
                flexDirection="column"
                gap={isPlpV3 ? '11px' : '10px'}
                mt={isPlpV3 ? 'var(--spacing-3)' : '10px'}
                ref={ctaRef}
                className="product-tile-cta-area"
              >
                {similarOptionsEnabled || isMobileQuickAtbEnabled ? (
                  <Flex
                    gap={isPlpV3 ? '7px' : '2px'}
                    px="var(--spacing-3)"
                    flexDirection={isPlpV3 ? 'column' : 'row'}
                    justifyContent={isPlpV3 ? 'start' : null}
                  >
                    {!isPlpV3 && similarOptionsEnabled && isViewedProduct && (
                      <Flex minWidth="50%" flexGrow="1">
                        <ViewSimilarCTA
                          styles={styles}
                          activeProduct={activeProduct}
                          product={product}
                        />
                      </Flex>
                    )}

                    <Box className={productTileSections.addToBag.containerClass}>
                      {isMobileQuickAtbEnabled && (
                        <Flex
                          className={productTileSections.addToBag.contentClass}
                          minWidth="50%"
                          flexGrow="1"
                        >
                          <Box width="100%">
                            {shouldRenderMembershipExclusiveButton ? (
                              <InsiderExclusiveButton />
                            ) : isNotifyMeButtonVisible ? (
                              <NotifyMeButton
                                productId={get(activeProduct, 'id', null)}
                                selectedVariant={activeProduct}
                                variant="plp"
                                isPlp
                                productName={get(activeProduct, 'name', '')}
                                selectedColor={activeColor}
                              />
                            ) : (
                              <QuickAddToBag
                                onClick={onAddToBagClick(activeProduct, setDisableQuickAddButton)}
                                isProductSet={isProductSet}
                                disabled={disableQuickAddButton}
                              />
                            )}
                          </Box>
                        </Flex>
                      )}
                    </Box>
                    {isPlpV3 && (
                      <Box className={productTileSections.visuallySimilar.containerClass}>
                        {isVisuallySimilarProp ? (
                          <ViewSimilar
                            styles={styles}
                            activeProduct={activeProduct}
                            product={product}
                            visuallySimilarProp={visuallySimilarProp}
                          />
                        ) : (
                          similarOptionsEnabled && (
                            <ViewSimilar
                              styles={styles}
                              activeProduct={activeProduct}
                              product={product}
                            />
                          )
                        )}
                      </Box>
                    )}
                  </Flex>
                ) : (
                  isSimilarOptionsCtaEnabled && (
                    <Box className={productTileSections.visuallySimilar.containerClass} />
                  )
                )}
                <Box className={productTileSections.reviews.containerClass}>
                  {isReviewsEnabled && isEnableRatingOnPLP && product?.showRatings && (
                    <Box
                      className={productTileSections.reviews.contentClass}
                      sx={styles.tileRatingsLink}
                    >
                      <WrapIf
                        Component={({ children }) => (
                          <Link
                            href={`${activeUrl}${
                              activeUrl.includes('?') ? '&' : '?'
                            }scrollToReview=true`}
                            variant="unstyled"
                            data-qa="m_plp_link_pt_cr"
                            onClick={handleRatingClick}
                            pointerEvents={isEnableLoaderOnPDP ? null : 'none'}
                          >
                            {children}
                          </Link>
                        )}
                        condition={isEnableLoaderOnPDP}
                      >
                        <StarRatingV2
                          rating={averageOverallRating}
                          count={totalReviewCount}
                          cursor={!isEnableLoaderOnPDP ? 'default' : undefined}
                          styles={styles}
                        />
                      </WrapIf>
                    </Box>
                  )}
                </Box>
              </Flex>
            )}
          </Box>

          {!isPlpV3 && membershipExclusiveProduct && (
            <CustomSlot
              content={get(appData, 'membership.contentSlots["membership-exclusive"]')}
              Component={MemberExclusive}
              isGuestUser={isGuestUser}
            />
          )}
        </>
      )}
    </BoxWithProductDetailsTooltip>
  )
}

export default withErrorBoundaryWrapper(memo(ProductTile))
