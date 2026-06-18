import { useState, useMemo, useEffect } from 'react'
import { useIntl } from 'react-intl'
import ProductVariationLabel from 'toro/components/product/ProductVariationControls/ProductVariationLabel'
import ProductColorControl from 'toro/components/product/ProductVariationControls/ProductColorControl'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import get from 'lodash/get'
import { getId } from 'toro/helpers/productVariations'
import ProductImagesContainer from 'toro/components/product/ProductVariationControls/ProductImagesContainer'
import useViewportType from 'toro/hooks/useViewportType'
import { filteredItemsWithSrc } from 'helpers/getColorSwatches'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { findAttributeByType } from 'toro/helpers/skuHelper'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue } from 'jotai/utils'
import TabbedAdaptivePDPColorSwatches from 'toro/components/product/TabbedAdaptivePDPSwatches'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import useScrollToSelectedColorSwatch from 'toro/hooks/useScrollToSelectedColorSwatch'
import StylesProvider from 'toro/components/StylesProvider'

const filterItems = (items = [], filterExcluded, isMegaPDPEligible, defaultColor) => {
  return !isMegaPDPEligible
    ? items.filter((item) =>
        !item?.displayIfOOS
          ? item?.orderable || item?.id === filterExcluded?.id || item?.id === filterExcluded?.value
          : true
      )
    : items.filter((item) =>
        !item?.displayIfOOS ? item?.orderable || item?.vgId === defaultColor?.vgId : true
      )
}

const PAGE_SPACING_BORDER = 12

function ProductColorControls({
  items,
  productData,
  selectedItem,
  showErrorIfEmpty,
  onChange,
  isSticky,
  isQuickView,
  masterId,
  setCustomizerVariants,
  customizerVariants,
  setSelectedColor,
  sourceCodeId,
  isMegaPDPEligible,
  isNewMegaPDPEligible,
  selectedMaterial,
  isDisplayOosSwatch,
  variant,
  defaultColor,
  hslColor,
  isExtendedAdaptivePDP,
}) {
  const { query: routerQuery } = useRouter()
  const { frp } = routerQuery || {}
  const styles = useMultiStyleConfig('ProductVariationCSS', { variant })
  const variationSrc = get(productData, 'variationGroup', [])
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)

  const {
    sceneSeven: { enableThumbnailPdpSwatch = false },
    toggleSiteFeatures: { sourceCodeGroupAttributeMapping = {}, subMaterialCalloutConfig = {} },
    salePreferences: { enablePdpSwatchSuppression: isEnableSaleSuppression = false },
  } = usePreference({
    sceneSeven: ['enableThumbnailPdpSwatch'],
    ToggleSiteFeatures: ['sourceCodeGroupAttributeMapping', 'subMaterialCalloutConfig'],
    salePreferences: ['enablePdpSwatchSuppression'],
  })

  const colorLabel = formatMessage({ id: 'pdp.product.colorText', defaultMessage: 'Color' })
  const materialValue = subMaterialCalloutConfig.enable
    ? get(productData, `custom.${subMaterialCalloutConfig.SubMaterialAttribute}`)
    : ''
  const textValue = get(selectedItem, 'text', '')
  const labelText = `${
    materialValue && (isMegaPDPEligible || isNewMegaPDPEligible) ? `${materialValue}/` : ''
  }${textValue}`

  const defaultInitialItems = useMemo(() => {
    let filterExcluded
    if (productData.isServerSide) {
      if (frp) {
        const frpVariant = productData.variant.find((vr) => {
          return vr?.id === frp
        })

        filterExcluded = items?.find((item) => item?.id === frpVariant?.variationValues?.color)
      } else {
        filterExcluded = findAttributeByType(
          productData?.defaultVariantGroup?.variationAttributes,
          'color'
        )?.values?.[0]
      }
    } else {
      if (productData?.productType?.master) {
        filterExcluded = items?.find((item) => frp?.includes(item?.id))
      } else {
        filterExcluded = productData?.defaultColor
      }
    }

    if (!isMegaPDPEligible)
      return !isDisplayOosSwatch ? filterItems(items, filterExcluded, false) : items
    else {
      return !isDisplayOosSwatch ? filterItems(items, filterExcluded, true, defaultColor) : items
    }
  }, [productData, isMegaPDPEligible, isDisplayOosSwatch, items])

  const [initialItems, setInitialItems] = useState(defaultInitialItems)

  useEffect(() => {
    setInitialItems(defaultInitialItems)
  }, [defaultInitialItems])

  const { displayedItems, activeIndex } = useMemo(() => {
    let displayedItems = initialItems
    let activeIndex
    if (variationSrc?.length > 0) {
      const filteredItems = filteredItemsWithSrc({
        items: initialItems,
        variationSrc,
        sourceCodeGroupId: sourceCodeId,
        sourceCodeGroupAttributeMapping,
        isCheckForCustomizedVariant: true,
        isEnableSaleSuppression,
        requestedId: get(productData, 'requestedId'),
      })
      displayedItems = filteredItems?.length ? filteredItems : initialItems
    }

    return {
      displayedItems: displayedItems.map((item, idx) => {
        const hasSameMasterId = get(selectedItem, 'masterId') === get(item, 'masterId')
        const isActiveColor = get(item, 'id') === get(selectedItem, 'id') && hasSameMasterId
        const shouldNavigateToAnotherProduct = isMegaPDPEligible && !hasSameMasterId
        if (isActiveColor) {
          activeIndex = idx
        }
        return {
          ...item,
          isActiveColor,
          shouldNavigateToAnotherProduct,
        }
      }),
      activeIndex,
    }
    // isMegaPDPEligible is not required in dependency array
    // since initialItems depend on it.
  }, [initialItems, variationSrc, selectedItem])

  const { setContainerRef } = useScrollToSelectedColorSwatch({
    isDisabled: isSticky,
    activeIndex,
    pageSpacingBorder: PAGE_SPACING_BORDER,
  })

  if (isTabbedAdaptivePDPEligible && !isDesktop && !isExtendedAdaptivePDP) {
    return (
      <TabbedAdaptivePDPColorSwatches
        items={displayedItems}
        onChange={onChange}
        hslColor={hslColor}
        activeColor={textValue}
      />
    )
  }

  return (
    <Box
      display={isSticky ? 'none' : 'block'}
      marginBottom="s"
      w="100%"
      className={`color-variants ${isMegaPDPEligible ? 'color-variants-mega-pdp' : ''}`}
      overflowX="hidden"
      sx={styles.colorVariantsWrapper}
    >
      <Experiment
        notForIDs={isMegaPDPEligible ? EXPERIMENTS.TABBED_ADAPTIVE_PDP : EXPERIMENTS.PDP_V3}
        alwaysOnForDesktop
      >
        <Box minH={isDesktop && '25px'} sx={styles.colorVariantLabel}>
          <ProductVariationLabel
            label={colorLabel}
            value={labelText}
            showError={showErrorIfEmpty && !labelText}
            variantType={'color'}
            isMegaPDPEligible={isMegaPDPEligible}
          />
        </Box>
      </Experiment>
      <Box
        minH={!isDesktop ? '105px' : isQuickView ? '0' : '103px'}
        overflowX={!isDesktop && 'auto'}
        className="no-scrollVisible color-images-swatches"
        sx={styles.productImagesContainer}
        ref={setContainerRef}
      >
        {enableThumbnailPdpSwatch ? (
          <StylesProvider value={styles}>
            <ProductImagesContainer
              items={displayedItems}
              onClick={onChange}
              selectedItem={selectedItem}
              productData={productData}
              isQuickView={isQuickView}
              masterId={masterId}
              setCustomizerVariants={setCustomizerVariants}
              customizerVariants={customizerVariants}
              setSelectedColor={setSelectedColor}
              setFilterItems={setInitialItems}
              isMegaPDPEligible={isMegaPDPEligible}
              selectedMaterial={selectedMaterial}
            />
          </StylesProvider>
        ) : (
          <Flex flexWrap="wrap">
            {displayedItems?.map((item) => {
              return (
                <ProductColorControl
                  key={getId(item)}
                  color={item}
                  onClick={onChange}
                  selected={getId(item) === getId(selectedItem)}
                  disabled={!get(item, 'orderable', false)}
                  styles={styles}
                />
              )
            })}
          </Flex>
        )}
      </Box>
      {variant !== 'tabbedPDP' && (
        <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
          <Box
            sx={styles.colorVariantLabel}
            className={`color-value ${isMegaPDPEligible ? 'mega-pdp' : ''}`}
          >
            <ProductVariationLabel
              label={colorLabel}
              value={labelText}
              showError={showErrorIfEmpty && !labelText}
              variantType="color"
              styleVariant={variant}
            />
          </Box>
        </Experiment>
      )}
    </Box>
  )
}

ProductColorControls.propTypes = {
  items: PropTypes.array,
  productData: PropTypes.object,
  selectedItem: PropTypes.object,
  availableItems: PropTypes.array,
  showErrorIfEmpty: PropTypes.bool,
  onChange: PropTypes.func,
  isSticky: PropTypes.bool,
  isQuickView: PropTypes.bool,
  masterId: PropTypes.string,
  setCustomizerVariants: PropTypes.func,
  customizerVariants: PropTypes.array,
  setSelectedColor: PropTypes.func,
  sourceCodeId: PropTypes.string,
  isDisplayOosSwatch: PropTypes.bool,
  isMegaPDPEligible: PropTypes.bool,
  selectedMaterial: PropTypes.object,
  isExtendedAdaptivePDP: PropTypes.bool,
}

ProductColorControls.defaultProps = {
  items: [],
  productData: {},
  selectedItem: {},
  availableItems: [],
  showErrorIfEmpty: false,
  onChange: () => {},
  isSticky: false,
  isQuickView: false,
  masterId: '',
  sourceCodeId: '',
  isDisplayOosSwatch: false,
  isExtendedAdaptivePDP: false,
}

export default ProductColorControls
