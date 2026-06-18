import { useEffect, useReducer, useRef } from 'react'
import Tab from 'toro/components/Tab'
import TabList from 'toro/components/TabList'
import Tabs from 'toro/components/Tabs'
import Box from 'toro/components/Box'
import TabPanels from 'toro/components/TabPanels'
import TabPanel from 'toro/components/TabPanel'
import Text from 'toro/components/Text'
import type { FilterEntity } from 'toro/helpers/thinkPlp'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useRouter } from 'next/router'
import get from 'lodash/get'
import ThinkGrid from 'toro/components/list/ThinkPage/ThinkGrid'
import LazySlot from 'toro/cms/components/LandingContent/LazySlot'
import abortableFetch from 'helpers/abortableFetch'
import Button from 'toro/components/Button'
import { NavChevronDownIcon } from 'toro/icons'
import useAnalytics from 'toro/analytics/useAnalytics'

// Type for LazySlot props since it's a JS component
interface LazySlotProps {
  slot: {
    id: string
    html: string
  }
  idx: number
  lazyLoadImages?: boolean
  lazyLoadVideos?: boolean
  enableLazy?: boolean
  lazyThreshold?: number
}

interface ThinkTabbedContentProps extends Record<string, any> {
  item: FilterEntity
  rowStartPosition: number
  productsPerPage: number | null
  enableLazy?: boolean
  lazyThreshold?: number
}

const LazySlotTyped = LazySlot as React.ComponentType<LazySlotProps>

const initialState = {
  activeTab: 0,
  products: [],
  page: 1,
  isLoading: false,
  hasMorePages: false,
}

type StateAction =
  | {
      type: 'SET_PRODUCTS'
      payload: {
        products: any[] // no interface for actual products payload
        hasMorePages: boolean
        page: number
      }
    }
  | {
      type: 'SET_LOADING'
      payload: boolean
    }
  | {
      type: 'SET_HAS_MORE_PAGES'
      payload: boolean
    }
  | {
      type: 'SET_ACTIVE_TAB'
      payload: number
    }

const populateStateFromHistory = () => {
  if (typeof window !== 'undefined') {
    if (history.state?.thinkTabbedContentState) {
      return history.state.thinkTabbedContentState
    }
  }
  return initialState
}

const useProducts = (tabs: FilterEntity['tabs'], productsPerPage: number | null) => {
  const [state, dispatch] = useReducer(
    (state: typeof initialState, action: StateAction) => {
      switch (action.type) {
        case 'SET_PRODUCTS':
          return {
            ...state,
            products:
              action.payload.page === 1
                ? action.payload.products
                : [...state.products, ...action.payload.products],
            hasMorePages: action.payload.hasMorePages,
            page: action.payload.page,
          }
        case 'SET_LOADING':
          return { ...state, isLoading: action.payload }
        case 'SET_ACTIVE_TAB':
          return { ...state, activeTab: action.payload, page: 1 }
        default:
          return state
      }
    },
    initialState,
    populateStateFromHistory
  )

  const filterString = tabs?.[state.activeTab]?.filterString

  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const router = useRouter()

  const onHistoryChange = () => {
    const currentPath = location.pathname + location.search + location.hash

    const newHistoryState = {
      ...history.state,
      thinkTabbedContentState: stateRef.current,
    }

    history.replaceState(newHistoryState, document.title, currentPath)
  }

  const loadProducts = (pageToLoad: number = 1, filter: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })

    const searchParams = new URLSearchParams()
    searchParams.set('page', pageToLoad.toString())
    if (productsPerPage) {
      searchParams.set('sz', productsPerPage.toString())
    }

    const apiUrl = `/api/get-shop/${window.location.pathname.replace(
      '/shop/',
      ''
    )}?${searchParams.toString()}&${filter}`

    const { controller, fetchLatest } = abortableFetch(apiUrl)

    fetchLatest
      .then(
        (res) => res.json(),
        (err) => {
          if (!controller.signal.aborted) {
            console.error(err)
          }
        }
      )
      .then((data) => {
        const totalPages = get(data, 'pageData.totalPages', 0)
        dispatch({
          type: 'SET_PRODUCTS',
          payload: {
            products: get(data, 'pageData.products', []),
            hasMorePages: pageToLoad < totalPages,
            page: pageToLoad,
          },
        })
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false })
      })

    return () => controller.abort()
  }

  const loadMoreProducts = () => {
    loadProducts(state.page + 1, filterString)
  }

  const setActiveTab = (activeTab: number) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: activeTab })
    loadProducts(1, tabs?.[activeTab]?.filterString)
  }

  useEffect(() => {
    if (state.products.length > 0) {
      return
    }

    loadProducts(1, filterString)
  }, [])

  useEffect(() => {
    router.events.on('routeChangeStart', onHistoryChange)
    return () => {
      router.events.off('routeChangeStart', onHistoryChange)
    }
  }, [])

  return {
    products: state.products,
    hasMorePages: state.hasMorePages,
    loadMoreProducts,
    isLoading: state.isLoading,
    activeTab: state.activeTab,
    setActiveTab,
  } as const
}

const ThinkTabbedContent = ({
  item,
  rowStartPosition,
  productsPerPage,
  priceType,
  isComparablePriceValue,
  suppressMaterial,
  pageType,
  isFPC,
  isSPC,
  isComparablePriceEnabledCategory,
  enableAddToBag,
  categoryImageSequence,
  showOnlySinglePrice,
  thinkPageSwatchesDisabled,
  productTitleCharLimit = null,
  enableLazy,
  lazyThreshold,
}: ThinkTabbedContentProps) => {
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('ThinkTabbedContent')

  const { products, hasMorePages, loadMoreProducts, isLoading, activeTab, setActiveTab } =
    useProducts(item.tabs, productsPerPage)

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    analytics.send('listInteraction', {
      eventAction: 'toggle selector click',
      eventLabel: item.tabs?.[index]?.buttonText,
    })
  }

  const handleViewMore = () => {
    analytics.send('listInteraction', {
      eventAction: 'view more click',
      eventLabel: 'View More',
    })
    loadMoreProducts()
  }

  return (
    <Box sx={styles.wrapper}>
      <Text sx={styles.title} as="h3">
        {item.title}
      </Text>
      <Tabs
        index={activeTab}
        sx={styles.tabsWrapper}
        onChange={handleTabChange}
        isLazy // to load assets from content assets only when tab is active for the first time
        lazyBehavior="keepMounted" // to keep content asset loaded, instead of fetching images and videos once again
      >
        {item.tabs?.length > 1 && (
          <TabList sx={styles.tabList}>
            {item.tabs.map((tab, idx) => (
              <Tab key={idx} sx={styles.tab}>
                {tab.buttonText}
              </Tab>
            ))}
          </TabList>
        )}
        <TabPanels sx={styles.tabPanels}>
          {item.tabs.map((tab, idx) =>
            tab.content ? (
              <TabPanel key={idx} sx={styles.tabPanel}>
                <LazySlotTyped
                  key={tab.content.id}
                  slot={tab.content}
                  idx={idx}
                  lazyLoadImages
                  lazyLoadVideos
                  enableLazy={enableLazy}
                  lazyThreshold={lazyThreshold}
                />
              </TabPanel>
            ) : null
          )}
        </TabPanels>
      </Tabs>
      <ThinkGrid
        products={products}
        priceType={priceType}
        isComparablePriceValue={isComparablePriceValue}
        suppressMaterial={suppressMaterial}
        pageType={pageType}
        isFPC={isFPC}
        isSPC={isSPC}
        isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
        enableAddToBag={enableAddToBag}
        categoryImageSequence={categoryImageSequence}
        showOnlySinglePrice={showOnlySinglePrice}
        thinkPageSwatchesDisabled={thinkPageSwatchesDisabled}
        rowStartPosition={rowStartPosition}
        gridVariant="rowGrid"
        productTitleCharLimit={productTitleCharLimit}
      />
      {products.length > 0 && hasMorePages && (
        <Box sx={styles.viewMoreContainer}>
          <Button
            variant="secondary"
            onClick={handleViewMore}
            disabled={isLoading}
            sx={styles.viewMoreButton}
          >
            View More
            <NavChevronDownIcon width="16" height="16" ml={2} />
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ThinkTabbedContent
