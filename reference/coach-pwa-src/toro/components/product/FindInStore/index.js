import { useState, useEffect, useCallback, useContext, useMemo, memo } from 'react'
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
import PropTypes from 'prop-types'
import SessionContext from 'toro/components/SessionContext'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import { runSearchFetchAtom, isMegaPDPEligibleAtom } from 'store/pdp.atom'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import { useAtomValue } from 'jotai/utils'

const FindInStoreWidget = dynamic(() =>
  import('toro/components/product/FindInStore/FindInStoreWidget')
)
const FindInStoreWidgetV3 = dynamic(() =>
  import('toro/components/product/FindInStore/FindInStoreWidget/FindInStoreWidgetV3')
)
import { createLazyImporter, scheduleIdleLazyLoad } from 'toro/helpers/dynamicImportUtils'

const lazyImportAvailabilityModal = createLazyImporter(() =>
  import('toro/components/product/FindInStore/AvailabilityModal')
)

const AvailabilityModal = dynamic(lazyImportAvailabilityModal, {
  ssr: false,
})

const FindInStore = ({
  productData,
  selectedVariant,
  onPickUpInStoreClick,
  isFindInStorePickup,
  selectedQty,
  getGAProduct,
  sfraEnableFindInStoreV4,
  lazyMinHeight,
  displayV2Bopis = false,
}) => {
  const { appData } = useContext(PWAContext)
  const { session } = useContext(SessionContext)
  const userPostalCode = useMemo(() => get(session, 'user.postal_code'), [session])
  const setFullscreenLoading = useAtomSetter(setFullscreenLoadingAtom)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
  const [{ loading, error, data: storesData }, runSearchFetch] = useAtom(runSearchFetchAtom)
  const [isStoreAPIError, setIsStoreAPIError] = useState(false)
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const productId = selectedVariant?.id
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const TRIGGER_LOCATION = isMegaPDPEligible ? 'mega pdp' : 'pdp regular'

  const {
    product,
    canShowMore,
    storesPageResult,
    stores,
    errorNoSearchResult,
    zipCode,
    closestStore,
    defaultISPUMessaging,
    location,
    isNeedFindStore,
  } = useMemo(() => {
    const product = get(storesData, 'renderProducts.[0]', {})
    const canShowMore = get(storesData, 'canShowMore')
    const storesPageResult = storesData.stores ? Math.ceil(storesData.stores.length / LIMIT) : 0
    const { stores, errorNoSearchResult } = storesData
    const siteId = get(appData, 'siteId')
    const defaultISPUMessaging = get(appData, 'defaultISPUMessaging', '')

    let zipCode = getZipCode(siteId) || userPostalCode
    const zipCodeNearYou = get(storesData, 'findAStoreNearyou', '')
    if (
      zipCodeNearYou &&
      zipCodeNearYou.toLowerCase() !== 'null' &&
      zipCodeNearYou.toLowerCase() !== 'undefined'
    ) {
      localStorage.setItem('bopis_last_zipCode', zipCodeNearYou)
      zipCode = zipCodeNearYou
    }

    const closestStore = stores?.find((store) => !!get(store, 'storeAvailability.[0].IN_STOCK'))
    const location = closestStore?.name
    const isNeedFindStore = Boolean(zipCode) && isFindInStorePickup

    return {
      product,
      canShowMore,
      storesPageResult,
      stores,
      errorNoSearchResult,
      zipCode,
      closestStore,
      defaultISPUMessaging,
      location,
      isNeedFindStore,
    }
  }, [storesData])

  const handleAnalyticsOnClick = useCallback(
    (click = {}) => {
      if (!Object.keys(click).length) return
      analytics.send('storeSearchClick', {
        event: 'store_search_click',
        storeSearchType: 'find your store',
        storeZip: storesData?.gtmData?.store_zip,
        totalLocation: String(storesData?.stores?.length),
        mileRadius: String(storesData?.radius),
        nearestLocationId: minBy(storesData?.stores)?.ID,
        clickedLocationId: click.clickedLocationId,
        clickedText: click.clickedText,
        eventLocation: 'product detail find in store',
      })
    },
    [storesData]
  )

  const productAnalytics = useMemo(() => {
    return getGAProduct({
      eventLocation: TRIGGER_LOCATION,
      product: {
        quantity: selectedQty,
      },
    })
  }, [getGAProduct, selectedQty])

  const handleAnalyticsAddToCart = useCallback(() => {
    analytics.send('addToCart', productAnalytics)
  }, [getGAProduct])

  const handleAnalyticsBopis = (eventAction) => {
    analytics.send('bopisInteraction', {
      eventAction,
      eventLabel: selectedVariant?.id,
      eventLocation: TRIGGER_LOCATION,
    })
  }

  const handleOnPickUpInStoreClick = useCallback(() => {
    onPickUpInStoreClick(closestStore?.ID)
    handleAnalyticsBopis('pick up in store')
    handleAnalyticsAddToCart()
  }, [onPickUpInStoreClick, selectedVariant, closestStore])

  const handleOpenModal = useCallback(() => {
    let bopisAction = 'edit bopis zip code product available'
    if (!isNeedFindStore) {
      bopisAction = 'find a store for pickup'
    } else if (zipCode && !location) {
      bopisAction = 'edit bopis zip code product unavailable'
    }

    setIsAvailabilityModalOpen(true)
    handleAnalyticsBopis(bopisAction)
    analytics.send('storePickupModalInteraction', {
      event: 'modal_impression',
      eventAction: location ? 'find/edit store' : 'find a store for pickup',
      modalTitle: 'pickup availability',
      eventLocation: TRIGGER_LOCATION,
    })
  }, [setIsAvailabilityModalOpen, selectedVariant, location, zipCode])

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
            nearestLocationId: minBy(data?.stores)?.ID,
            eventLocation: 'product detail find in store',
          }),
        promise: getSearchResults(productId, zipCodeParam),
        productId,
      })
    },
    [selectedVariant]
  )

  const handleMoreResults = useCallback(() => {
    runSearchFetch({
      page: storesPageResult,
      onError: handleFetchError,
      promise: getSearchResults(productId, zipCode, storesPageResult),
      productId,
    })
  }, [selectedVariant, storesPageResult, zipCode])

  useEffect(() => {
    // Note: we cannot mutate FullscreenLoading in runSearchFetchAtom because
    //       the request happens at the root level not at the modal level
    if (isAvailabilityModalOpen) {
      setFullscreenLoading(loading)
    }
  }, [isAvailabilityModalOpen, loading])

  return !(productData?.colors || productData?.variants) || selectedVariant ? (
    <Lazy
      className="findInStoreWrapper"
      // handled the minHeight conditionally as it was causing extra space when no components were rendering
      style={
        lazyMinHeight ? { minHeight: !sfraEnableFindInStoreV4 ? lazyMinHeight : '0px' } : undefined
      }
    >
      {!sfraEnableFindInStoreV4 && (
        <Experiment forMobile forIDs={EXPERIMENTS.PDP_V3}>
          <FindInStoreWidgetV3
            handleOnPickUpInStoreClick={handleOnPickUpInStoreClick}
            handleOpenModal={handleOpenModal}
            location={location}
            zipCode={zipCode}
            isNeedFindStore={isNeedFindStore}
          />
        </Experiment>
      )}
      <ConditionalWrapper
        Wrapper={Experiment}
        condition={!(sfraEnableFindInStoreV4 && displayV2Bopis)}
        notForIDs={EXPERIMENTS.PDP_V3}
        alwaysOnForDesktop
      >
        <FindInStoreWidget
          handleOnPickUpInStoreClick={handleOnPickUpInStoreClick}
          handleOpenModal={handleOpenModal}
          location={location}
          zipCode={zipCode}
          isNeedFindStore={isNeedFindStore}
        />
      </ConditionalWrapper>
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
    <ProductInfoMessage>
      {formatMessage({
        id: 'pdp.product.sizeWidthStoreAvailabilityText',
        defaultMessage: 'Please select a size and width for store availability',
      })}
    </ProductInfoMessage>
  )
}
FindInStore.propTypes = {
  productData: PropTypes.object,
  selectedVariant: PropTypes.object,
  onPickUpInStoreClick: PropTypes.func,
  isFindInStorePickup: PropTypes.bool,
  getGAProduct: PropTypes.func,
  selectedQty: PropTypes.number,
}
FindInStore.defaultProps = {
  onPickUpInStoreClick: () => {},
}

export default withErrorBoundaryWrapper(memo(FindInStore))
