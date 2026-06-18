import React, { memo, useState, useCallback, useEffect } from 'react'
import Tab from 'toro/components/Tab'
import TabList from 'toro/components/TabList'
import TabPanel from 'toro/components/TabPanel'
import TabPanels from 'toro/components/TabPanels'
import Tabs from 'toro/components/Tabs'
import ScrollableContent from 'toro/components/ScrollableContent'
import AccessoriesProduct from 'toro/components/product/AccessorizeIt/AccessoriesProduct'
import AddToBagButton from 'toro/components/AddToBagButton'
import { setAccessorizeItNodeAtom, submittableVariantIdAtom } from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  accessorizeItProductsDataAtom,
  accessorizeItSelectedProductIDAtom,
  setAccessorizeItSelectedProductIDAtom,
  accessorizeItSelectedProductAtom,
} from 'store/accessorizeIt.atom'
import useStyles from 'toro/hooks/useStyles'
import { useIntl } from 'react-intl'
import type { NormalizedAccessorizeItProduct } from 'toro/types/productTypes'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { useAccessorizedPrice } from 'toro/components/product/AccessorizeIt/hooks'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import debounce from 'lodash/debounce'

export const ACCESSORIZE_IT_BUNDLE_ID = 'accessorize-it-charms-straps'

const ACCESSORIZE_IT_TABS_SCROLL_ITEM_WIDTH = 66
const ACCESSORIZE_IT_TABS_SCROLL_ITEM_WIDTH_V_5_1 = 127.8 // 127.8px = 118px (product width) + 9.8px (gap)
const DEFAULT_PAGINATION_ARROWS_LIMIT = 5
const PAGINATION_BREAKPOINTS = [
  { min: 1854, limit: 5 },
  { min: 1600, limit: 4 },
  { min: 1343, limit: 3 },
  { min: 1087, limit: 2 },
]

type TabConfig = {
  title: string
  key: 'charms' | 'straps'
  dataQA: 'btn_Charms' | 'btn_Straps'
  addToCartText: string
}

const AccessorizeItTabs: React.FC = () => {
  const styles = useStyles()
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const { formatMessage } = useIntl()
  const setAccessorizeItNode = useUpdateAtom(setAccessorizeItNodeAtom)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const accessorizeItProductsData = useAtomValue(accessorizeItProductsDataAtom)
  const accessorizeItSelectedProductID = useAtomValue(accessorizeItSelectedProductIDAtom)
  const setAccessorizeItSelectedProductID = useUpdateAtom(setAccessorizeItSelectedProductIDAtom)
  const accessorizeItSelectedProduct = useAtomValue(accessorizeItSelectedProductAtom)
  const price = useAccessorizedPrice()
  const submittableVariantId = useAtomValue(submittableVariantIdAtom)
  const selectedVariantInventory = useAtomValue(selectedVariantInventoryAtom)
  const orderable = selectedVariantInventory?.orderable || false
  const isPdpV6 = useTemplate([TemplateName.pdpv6])
  const isPdpV5_1 = useTemplate([TemplateName.pdpv5_1])

  // show arrows based on the window width
  const [paginationArrowsLimit, setPaginationArrowsLimit] = useState(
    DEFAULT_PAGINATION_ARROWS_LIMIT
  )
  useEffect(() => {
    if (!isPdpV5_1) return // only for pdp v5.1

    function handleResize() {
      const bp = PAGINATION_BREAKPOINTS.find((bp) => window.innerWidth > bp.min)
      setPaginationArrowsLimit(bp?.limit || 1)
    }

    const debouncedHandleResize = debounce(handleResize, 150)

    handleResize()
    window.addEventListener('resize', debouncedHandleResize)
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      debouncedHandleResize.cancel()
    }
  }, [])

  const accessorizeItRef = useCallback(
    (node) => {
      if (node) {
        setAccessorizeItNode(node)
      }
    },
    [setAccessorizeItNode]
  )

  useEffect(() => {
    if (accessorizeItSelectedProductID) {
      setAccessorizeItSelectedProductID('')
    }
    setActiveTabIndex(0)
  }, [selectedVariantId])

  const handleChooseProduct = useCallback(
    (product: NormalizedAccessorizeItProduct) => {
      setAccessorizeItSelectedProductID(product.id)

      analytics.send('productInteraction', {
        eventAction: `accessorize it module product click`,
        eventLabel: selectedVariantId,
        eventLocationForced: 'product',
      })

      analytics.send('viewItem', {
        product: product.productDataForGA,
        selectedVariantId,
        eventLocation: 'product',
        isProductTypeBundle: true,
        bundleId: ACCESSORIZE_IT_BUNDLE_ID,
      })
    },
    [analytics, selectedVariantId]
  )

  const renderTabContent = useCallback(
    (products: NormalizedAccessorizeItProduct[]) => (
      <ScrollableContent
        dataQA="btn_colorSwatchAccessorize_It"
        showArrows={isPdpV6 || isPdpV5_1}
        boldArrows={isPdpV5_1}
        scrollItemWidth={
          isPdpV5_1
            ? ACCESSORIZE_IT_TABS_SCROLL_ITEM_WIDTH_V_5_1
            : ACCESSORIZE_IT_TABS_SCROLL_ITEM_WIDTH
        }
        countOfItems={products?.length}
        wrapperStyles={styles.scrollableContentWrapper}
        sx={styles.scrollableContainer}
        arrowStyles={styles.scrollableContentArrow}
        paginationArrowsLimit={isPdpV5_1 ? paginationArrowsLimit : undefined}
      >
        {products?.map((product) => (
          <AccessoriesProduct
            key={product.id}
            src={product.imageURL}
            id={product.id}
            isSelected={accessorizeItSelectedProductID === product.id}
            onChooseProduct={() => handleChooseProduct(product)}
            styles={styles}
          />
        ))}
      </ScrollableContent>
    ),
    [
      accessorizeItSelectedProductID,
      styles,
      isPdpV6,
      handleChooseProduct,
      paginationArrowsLimit,
      isPdpV5_1,
    ]
  )

  const tabConfigs: TabConfig[] = [
    {
      title: formatMessage({
        id: 'pdp.coachCreateCharmsTabText',
        defaultMessage: 'Charms',
      }),
      key: 'charms',
      dataQA: 'btn_Charms',
      addToCartText: formatMessage({
        id: 'pdp.coachCreateAddToBagText',
        defaultMessage: 'Add Charm to Cart',
      }),
    },
    {
      title: formatMessage({
        id: 'pdp.coachCreateStrapsTabText',
        defaultMessage: 'Straps',
      }),
      key: 'straps',
      dataQA: 'btn_Straps',
      addToCartText: formatMessage({
        id: 'pdp.coachCreateAddStrapToBag',
        defaultMessage: 'Add Strap to Cart',
      }),
    },
  ]

  const tabs = tabConfigs
    .filter(({ key }) => accessorizeItProductsData?.[key]?.length)
    .map(({ title, key, dataQA, addToCartText }) => ({
      title,
      content: renderTabContent(accessorizeItProductsData[key]),
      dataQA,
      addToCartText,
    }))
  const handleTabChange = useCallback(
    (tabIndex: number) => {
      setActiveTabIndex(tabIndex)
      setAccessorizeItSelectedProductID('')

      analytics.send('productInteraction', {
        eventAction: `accessorize it module tab: ${tabConfigs[tabIndex].key}`,
        eventLabel: selectedVariantId,
        eventLocationForced: 'product',
      })
    },
    [tabConfigs, selectedVariantId]
  )

  const handleAddAccessoryToCartClick = useCallback(() => {
    analytics.send('productInteraction', {
      eventAction: `accessorize it atb click`,
      eventLabel: selectedVariantId,
      eventLocationForced: 'product',
    })
  }, [analytics, selectedVariantId])

  const handleAddBundleToCartClick = useCallback(() => {
    analytics.send('productInteraction', {
      eventAction: `accessorize it bundle atb click`,
      eventLabel: selectedVariantId,
      eventLocationForced: 'product',
    })
  }, [analytics, selectedVariantId])

  const buttonBundleCaption = orderable
    ? formatMessage(
        isPdpV5_1
          ? {
              id: 'pdp.kateSpadeCreateAddBundleToBagText',
              defaultMessage: 'Get the Bundle',
            }
          : {
              id: 'pdp.coachCreateAddBundleToBagText',
              defaultMessage: 'Add Bundle to Bag',
            }
      )
    : formatMessage({
        id: 'pdp.product.outOfStockAdaptivePDPButton',
        defaultMessage: 'Sold Out',
      })

  const priceLabelCaption = isPdpV5_1
    ? formatMessage({
        id: 'pdp.kateSpadeCreatePriceLabel',
        defaultMessage: '1 add-on selected',
      })
    : formatMessage({
        id: 'pdp.coachCreatePriceLabel',
        defaultMessage: 'add on',
      })

  return (
    <Flex
      sx={styles.accessorizeItContanerTabsWrapper}
      id="accessorize-it-tabs-container"
      ref={accessorizeItRef}
    >
      <Tabs
        index={activeTabIndex}
        onChange={handleTabChange}
        sx={styles.accessorizeItTabs}
        className="accessorize-it-tabs"
      >
        {tabs.length > 1 && (
          <TabList className="accessorize-it-tab-list" sx={styles.accessorizeItTabList}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                className={`accessorize-it-tab ${index === activeTabIndex ? 'active-tab' : ''}`}
                sx={styles.accessorizeItTab}
                data-qa={tab.dataQA}
              >
                {tab.title}
              </Tab>
            ))}
          </TabList>
        )}
        <TabPanels sx={styles.accessorizeItTabPanels}>
          {tabs.map((tab, index) => (
            <TabPanel key={index} sx={styles.accessorizeItTabPanel}>
              {tab.content}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      {price && (
        <Flex sx={styles.accessorizeItPriceContainer}>
          <Text sx={styles.accessorizeItPriceLabel}>{priceLabelCaption}</Text>
          <Text sx={styles.accessorizeItPrice}>{price}</Text>
        </Flex>
      )}
      <Flex sx={styles.accessorizeItATBButtonsContainer}>
        <AddToBagButton
          variantId={accessorizeItSelectedProduct?.buyableVariantId}
          buttonCaption={get(tabs, `${activeTabIndex}.addToCartText`)}
          styles={{
            wrapper: styles.accessorizeItATBWrapper,
            button: styles.accessorizeItATBButton,
            buttonText: styles.accessorizeItATBButtonText,
          }}
          isStandaloneAccessory
          dataQA="btn_addCharmsToBag"
          onClick={handleAddAccessoryToCartClick}
        />
        <AddToBagButton
          variantId={submittableVariantId}
          buttonCaption={buttonBundleCaption}
          styles={{
            wrapper: styles.accessorizeItATBWrapper,
            button: styles.accessorizeItATBBundleButton,
            buttonText: styles.accessorizeItATBBundleButtonText,
          }}
          isAccessorizeItBundleProduct
          dataQA="btn_addBundleToBag"
          disabled={!orderable}
          onClick={handleAddBundleToCartClick}
          accessorizeItSelectedProduct={accessorizeItSelectedProduct}
        />
      </Flex>
    </Flex>
  )
}

export default memo(AccessorizeItTabs)
