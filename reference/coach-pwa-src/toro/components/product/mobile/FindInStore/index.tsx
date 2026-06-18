import { FC, useState, useEffect, useCallback, useContext, useMemo, memo } from 'react'
import dynamic from 'next/dynamic'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import get from 'lodash/get'
import minBy from 'lodash/minBy'
import PWAContext from 'components/common/PWAContext'
import { LIMIT, getSearchResults, getZipCode } from 'toro/components/product/FindInStore/helpers'
import localStorage from 'toro/helpers/localStorage'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Lazy from 'toro/components/Lazy'
import { useAtom } from 'jotai'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import SessionContext from 'toro/components/SessionContext'
import {
  runSearchFetchAtom,
  isMegaPDPEligibleAtom,
  gaProductDataAtom,
  selectedQtyAtom,
  isFindInStorePickupAtom,
  shouldRenderFindInStoreAtom,
  selectedSubmittableVariantDataAtom,
} from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { usePickUpInStoreClick } from 'toro/hooks/usePickUpInStoreClick'
import FindInStoreComponent from 'toro/components/product/FindInStore/FindInStoreWidget/FindInStoreComponentV3Redesign'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import usePreference from 'toro/hooks/usePreference_new'
import { createLazyImporter, scheduleIdleLazyLoad } from 'toro/helpers/dynamicImportUtils'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import { getCustomerGroupsFromSession } from 'toro/helpers/menu'
import intersection from 'lodash/intersection'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import Box from 'toro/components/Box'

const lazyImportAvailabilityModal = createLazyImporter(
  () => import('toro/components/product/FindInStore/AvailabilityModal')
)

const AvailabilityModal: React.ComponentType<any> = dynamic(lazyImportAvailabilityModal, {
  ssr: false,
})

const FindInStore: FC<{ lazyMinHeight?: number }> = ({ lazyMinHeight }) => {
  const { appData } = useContext(PWAContext)
  const { session } = useContext(SessionContext)
  const productId = useSelectedVariantData('id')
  const gaProductData = useAtomValue(gaProductDataAtom)
  const selectedQty = useAtomValue(selectedQtyAtom)
  const userPostalCode = get(session, 'user.postal_code')
  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
  const [{ loading, error, data: storesData }, runSearchFetch] = useAtom(runSearchFetchAtom)
  const [isStoreAPIError, setIsStoreAPIError] = useState(false)
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const TRIGGER_LOCATION = isMegaPDPEligible ? 'mega pdp' : 'pdp regular'
  const [isCustomized, isMonogrammed] = useSelectedColorData(['isCustomized', 'isMonogrammed'])
  const isCustomProduct = isCustomized || isMonogrammed
  const isFindInStorePickup = useAtomValue(isFindInStorePickupAtom)
  const onPickUpInStoreClick = usePickUpInStoreClick()
  const shouldRenderFindInStore = useAtomValue(shouldRenderFindInStoreAtom)
  const selectedSubmittableVariantData = useAtomValue(selectedSubmittableVariantDataAtom)
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])

  const {
    sfraUnifiedFeatureCartridge: { sfraEnableFindInStoreV4 },
    ...restPreferences
  } = usePreference({
    'SFRA Unified Feature Cartridge': ['sfraEnableFindInStoreV4'],
    'StoreLocator Configs': ['bopisAllowedCustomerGroups'],
  })
  const bopisAllowedCustomerGroups =
    restPreferences?.storeLocatorConfigs?.bopisAllowedCustomerGroups || []
  const userCustomerGroups = getCustomerGroupsFromSession(session)
  const isBopisAllowedByCustomerGroups =
    bopisAllowedCustomerGroups?.length === 0 ||
    intersection(bopisAllowedCustomerGroups, userCustomerGroups)?.length > 0

  const {
    product,
    canShowMore,
    storesPageResult,
    stores,
    zipCode,
    closestStore,
    defaultISPUMessaging,
    location,
    isNeedFindStore,
    errorNoSearchResult,
  } = useMemo(() => {
    const product = get(storesData, 'renderProducts.[0]', {})
    const canShowMore = get(storesData, 'canShowMore')
    const errorNoSearchResult = get(storesData, 'errorNoSearchResult')
    const storesPageResult = storesData.stores ? Math.ceil(storesData.stores.length / LIMIT) : 0
    const { stores } = storesData
    const defaultISPUMessaging = get(appData, 'defaultISPUMessaging', '')
    const closestStore = stores?.find((store) => !!get(store, 'storeAvailability.[0].IN_STOCK'))
    const location = closestStore?.name

    let zipCode = getZipCode(appData.siteId) || userPostalCode
    const zipCodeNearYou = get(storesData, 'findAStoreNearyou', '')
    if (
      zipCodeNearYou &&
      zipCodeNearYou.toLowerCase() !== 'null' &&
      zipCodeNearYou.toLowerCase() !== 'undefined'
    ) {
      localStorage.setItem('bopis_last_zipCode', zipCodeNearYou)
      zipCode = zipCodeNearYou
    }

    const isNeedFindStore = Boolean(zipCode) && isFindInStorePickup

    return {
      product,
      canShowMore,
      storesPageResult,
      stores,
      zipCode,
      closestStore,
      defaultISPUMessaging,
      location,
      isNeedFindStore,
      errorNoSearchResult,
    }
  }, [storesData, appData, userPostalCode])

  const handleAnalyticsOnClick = useCallback(
    (click = {}) => {
      if (!Object.keys(click).length) return
      analytics.send('storeSearchClick', {
        event: 'store_search_click',
        storeSearchType: 'find your store',
        storeZip: (storesData as { gtmData?: { store_zip?: string } })?.gtmData?.store_zip,
        totalLocation: String(storesData?.stores?.length),
        mileRadius: String((storesData as { radius?: number })?.radius),
        nearestLocationId: minBy(storesData?.stores)?.ID,
        clickedLocationId: click.clickedLocationId,
        clickedText: click.clickedText,
        eventLocation: 'product detail find in store',
      })
    },
    [storesData]
  )

  const handleAnalyticsAddToCart = useCallback(() => {
    analytics.send('addToCart', {
      ...gaProductData,
      eventLocation: TRIGGER_LOCATION,
    })
  }, [analytics, TRIGGER_LOCATION, gaProductData, selectedQty])

  const handleAnalyticsBopis = useCallback(
    (eventAction) => {
      analytics.send('bopisInteraction', {
        eventAction,
        eventLabel: productId,
        eventLocation: TRIGGER_LOCATION,
      })
    },
    [analytics, productId, TRIGGER_LOCATION]
  )

  const handleOnPickUpInStoreClick = useCallback(() => {
    onPickUpInStoreClick(closestStore?.ID)
    handleAnalyticsBopis('pick up in store')
    handleAnalyticsAddToCart()
  }, [onPickUpInStoreClick, closestStore, handleAnalyticsBopis, handleAnalyticsAddToCart])

  const handleOpenModal = useCallback(() => {
    const bopisAction = !isNeedFindStore
      ? 'find a store for pickup'
      : zipCode && !location
      ? 'edit bopis zip code product unavailable'
      : 'edit bopis zip code product available'

    setIsAvailabilityModalOpen(true)
    handleAnalyticsBopis(bopisAction)
    analytics.send('storePickupModalInteraction', {
      event: 'modal_impression',
      eventAction: location ? 'find/edit store' : 'find a store for pickup',
      modalTitle: 'pickup availability',
      eventLocation: TRIGGER_LOCATION,
    })
  }, [
    setIsAvailabilityModalOpen,
    location,
    zipCode,
    isNeedFindStore,
    handleAnalyticsBopis,
    analytics,
    TRIGGER_LOCATION,
  ])

  const handleClose = () => {
    setIsAvailabilityModalOpen(false)
  }

  useEffect(() => {
    const cancelIdleCallback = scheduleIdleLazyLoad(lazyImportAvailabilityModal)
    return () => {
      cancelIdleCallback()
    }
  }, [])

  const handleFetchError = useCallback(
    (error) => {
      console.error({
        error,
        context: {
          detail: {
            productId,
          },
        },
      })
    },
    [productId]
  )

  const handleSearch = useCallback(
    (zipCodeParam, successCallback) => {
      runSearchFetch({
        onSuccess: successCallback,
        onError: handleFetchError,
        sendStoreSearchData: (data) =>
          analytics.send('storeSearch', {
            event: 'store_search',
            storeSearchType: 'find your store',
            storeZip: data?.gtmData?.store_zip,
            totalLocation: String(data?.stores?.length),
            mileRadius: String(data?.radius),
            nearestLocationId: (minBy(data?.stores) as { ID?: string })?.ID,
            eventLocation: 'product detail find in store',
          }),
        promise: getSearchResults(productId, zipCodeParam),
        productId,
      })
    },
    [runSearchFetch, handleFetchError, analytics, productId]
  )

  const handleMoreResults = useCallback(() => {
    runSearchFetch({
      page: storesPageResult,
      onError: handleFetchError,
      promise: getSearchResults(productId, zipCode, storesPageResult),
      productId,
    })
  }, [runSearchFetch, storesPageResult, handleFetchError, productId, zipCode])

  useEffect(() => {
    // Note: we cannot mutate FullscreenLoading in runSearchFetchAtom because
    //       the request happens at the root level not at the modal level
    if (isAvailabilityModalOpen) {
      setFullscreenLoading(loading)
    }
  }, [isAvailabilityModalOpen, loading])

  useEffect(() => {
    if (productId) {
      runSearchFetch({
        productId: productId,
        promise: getSearchResults(productId, zipCode),
      })
    }
  }, [productId, zipCode])

  const shouldRenderFindInStoreByCustomerGroups =
    shouldRenderFindInStore && isBopisAllowedByCustomerGroups

  const renderInfoMessage = () => {
    if (isPDPv5_1) {
      return (
        <ProductInfoMessage variant="alert">
          {formatMessage({
            id: 'pdp.product.sizeStoreAvailabilityText',
            defaultMessage: 'Please select a size to see store availability.',
          })}
        </ProductInfoMessage>
      )
    }

    return (
      <ProductInfoMessage>
        <Box className="findInStoreProductInfoMessage">
          {formatMessage({
            id: 'pdp.product.sizeWidthStoreAvailabilityText',
            defaultMessage: 'Please select a size and width for store availability',
          })}
        </Box>
      </ProductInfoMessage>
    )
  }

  return shouldRenderFindInStoreByCustomerGroups ? (
    <Lazy
      className="findInStoreWrapper"
      style={
        !sfraEnableFindInStoreV4
          ? {
              minHeight: lazyMinHeight || 1,
            }
          : undefined
      }
    >
      {!sfraEnableFindInStoreV4 && (
        <FindInStoreComponent
          handleOnPickUpInStoreClick={handleOnPickUpInStoreClick}
          handleOpenModal={handleOpenModal}
          location={location}
          zipCode={zipCode}
          isNeedFindStore={isNeedFindStore}
          closestStore={closestStore}
        />
      )}
      {isAvailabilityModalOpen && (
        <AvailabilityModal
          zipCode={zipCode}
          handleClose={handleClose}
          stores={stores}
          defaultISPUMessaging={defaultISPUMessaging}
          product={product}
          canShowMore={canShowMore}
          handleSearch={handleSearch}
          handleMoreResults={handleMoreResults}
          errorNoSearchResult={errorNoSearchResult || error}
          onPickUpInStoreClick={onPickUpInStoreClick}
          isFindInStorePickup={isFindInStorePickup}
          isStoreAPIError={isStoreAPIError}
          setIsStoreAPIError={setIsStoreAPIError}
          handleAnalyticsAddToCart={handleAnalyticsAddToCart}
          handleAnalyticsOnClick={handleAnalyticsOnClick}
        />
      )}
    </Lazy>
  ) : (
    !isCustomProduct && !selectedSubmittableVariantData && renderInfoMessage()
  )
}

export default withErrorBoundaryWrapper(memo(FindInStore))
