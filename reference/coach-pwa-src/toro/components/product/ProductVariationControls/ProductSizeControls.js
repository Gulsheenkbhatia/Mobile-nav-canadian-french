import { memo, useCallback, useMemo } from 'react'
import ProductSizeControl from 'toro/components/product/ProductVariationControls/ProductSizeControl'
import useTheme from 'toro/hooks/useTheme'
import Box from 'toro/components/Box'
import ProductVariationLabel from 'toro/components/product/ProductVariationControls/ProductVariationLabel'
import { getId, parseProductId } from 'toro/helpers/productVariations'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import PropTypes from 'prop-types'
import AlignedControlsContainer from 'toro/components/product/ProductVariationControls/AlignedControlsContainer'
import get from 'lodash/get'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtom } from 'jotai'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import {
  countryTabIndexAtom,
  selectedSizeAtom,
  setSelectedSizeAtom,
  userInteractedAtom,
} from 'store/pdp.atom'
import isObject from 'lodash/isObject'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import SizeGuideButton from 'toro/components/product/SizeGuideButton'
import useAnalytics from 'toro/analytics/useAnalytics'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'

function ProductSizeControls({
  label,
  customFitNote,
  items,
  selectedItem,
  availableItems,
  showErrorIfEmpty,
  maxItemsInRow,
  onChange,
  isSticky,
  isQuickView,
  rangeValue,
  productId,
  gender,
  isVariationTypeControls,
  masterId,
  variantDataList,
  isBundleVariant,
  variantType,
  isNeutralSizingApplicable,
  neutralSizingCountryTypes,
  isNewMegaPDPEligible,
  setShowSizeGuidePopUp,
  sizeGuideContent,
  showSizeGuide,
  variant,
}) {
  const theme = useTheme()
  const { space } = theme
  const [, setFullscreenLoading] = useAtom(setFullscreenLoadingAtom)
  const [, setUserInteracted] = useAtom(userInteractedAtom)
  const countryTabIndex = useAtomValue(countryTabIndexAtom)
  const { isMobile } = useViewportType()
  const isExtendedAdaptivePDP = variant === 'extendedAdaptiveTabbedPDP'
  const alignedContainerVariant = isExtendedAdaptivePDP
    ? variant
    : isNeutralSizingApplicable || isNewMegaPDPEligible
    ? 'sizeVariation'
    : variant

  const selectedSizeValue = useAtomValue(selectedSizeAtom)
  const setSelectedSizeValue = useUpdateAtom(setSelectedSizeAtom)

  const analytics = useAnalytics()
  const myRegex = /^(?:\/\/|[^/]+)*\//
  let labelValue
  if (Array.isArray(items) && items.length && items.every((item) => item['keyAttrDisplayValue'])) {
    const labelValueObj = items.find((item) => item?.recommendedProductID === masterId)
    labelValue = labelValueObj?.keyAttrDisplayValue
  } else {
    labelValue = get(selectedItem, 'text', '') || get(selectedItem, 'name', '')
    labelValue = isObject(labelValue)
      ? labelValue[neutralSizingCountryTypes[countryTabIndex]]
      : labelValue
  }

  const styles = useMultiStyleConfig('ProductVariationCSS', {
    variant: isBundleVariant ? 'bundle' : variant,
  })

  const getOnClick = useCallback(
    (item) => () => {
      onChange?.(item)
      setSelectedSizeValue(item?.value)
    },
    [onChange]
  )

  const handleItemClick = (item) => {
    setUserInteracted(true)
    if (item?.recommendedProductID !== masterId) {
      setFullscreenLoading(true)
    }
  }

  const onSizesTabChange = useCallback(
    (tabData) => {
      analytics.send('swatchInteraction', {
        eventAction: 'swatch click',
        eventLabel: masterId || parseProductId(productId).masterId,
        swatchType: 'country size',
        swatchValue: tabData,
        swatchVariant: productId,
      })
    },
    [masterId, productId]
  )

  const productSizeControlsMemo = useMemo(
    () =>
      isVariationTypeControls
        ? items?.map((item) => (
            <Link
              key={`item:${item?.keyAttrDisplayValue}`}
              href={`/${item?.productURL?.split(myRegex)?.[1]}`}
              variant="unstyled"
              prefetch
              prefetchUrl={getAPIURL(item?.productURL)}
              pageData={
                variantDataList?.find((list) => list?.[0]?.id === item?.recommendedProductID)?.[0]
              }
              scroll={false}
              onClick={() => handleItemClick(item)}
            >
              <ProductSizeControl
                label={label}
                text={item?.keyAttrDisplayValue || item?.id}
                onClick={getOnClick(item)}
                selected={item?.recommendedProductID === masterId}
                disabled={!item?.availability}
                isQuickView={isQuickView}
                isVariationTypeControls
                productId={productId}
                variantType={variantType}
              />
            </Link>
          ))
        : items?.map((item) => (
            <ProductSizeControl
              key={item?.text || item?.name || `item:${item?.keyAttrDisplayValue}`}
              label={label}
              text={item?.text || item?.name}
              onClick={getOnClick(item)}
              selected={
                (item?.id && item?.id === selectedItem?.id) ||
                (item?.value && item?.value === selectedItem?.value) ||
                (item?.id && item?.id === selectedItem?.value) ||
                (item?.value && item?.value === selectedSizeValue)
              }
              disabled={
                !availableItems?.includes(getId(item)) && !availableItems?.includes(item.value)
              }
              isQuickView={isQuickView}
              isBundleVariant={isBundleVariant}
              variantType={variantType}
              selectedCountry={neutralSizingCountryTypes[countryTabIndex] || ''}
              isNeutralSizingApplicable={isNeutralSizingApplicable}
              isNewMegaPDPEligible={isNewMegaPDPEligible}
              variant={variant}
            />
          )),

    [
      items,
      isVariationTypeControls,
      isQuickView,
      isBundleVariant,
      getOnClick,
      label,
      productId,
      availableItems,
      countryTabIndex,
    ]
  )

  if (Array.isArray(items) && items.length === 0) return null

  return (
    <Box
      sx={styles.sizeVariantsWrapper}
      mt={isSticky ? (isMobile ? '24px' : '16px') : 0}
      w="100%"
      className={`product-size-controls ${isNewMegaPDPEligible ? 'product-size-mega-pdp' : ''}`}
      data-testid="product-size-controls"
    >
      <Box
        data-testid={isSticky ? 'isSticky-product' : 'isNotSticky-product'}
        mb={isSticky && !isMobile ? '9px' : ''}
        sx={styles.sizeControlsHeader}
      >
        <ProductVariationLabel
          label={label}
          customFitNote={customFitNote}
          gender={gender}
          value={labelValue}
          showError={showErrorIfEmpty && !labelValue}
          rangeValue={rangeValue}
          variantType={variantType}
          neutralSizingCountryTypes={neutralSizingCountryTypes}
          isNeutralSizingApplicable={isNeutralSizingApplicable}
          isSticky={isSticky}
          onTabChange={onSizesTabChange}
          isBundleCard={isBundleVariant}
          styleVariant={variant}
        />
        {showSizeGuide && (
          <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
            <SizeGuideButton
              setShowSizeGuidePopUp={setShowSizeGuidePopUp}
              sizeGuideContent={sizeGuideContent}
              productId={productId}
              isSticky={isSticky}
            />
          </Experiment>
        )}
      </Box>
      <AlignedControlsContainer
        itemsMargin={
          (isNeutralSizingApplicable || isNewMegaPDPEligible) && isMobile ? space.xs : space.s
        }
        maxItemsInRow={maxItemsInRow}
        label={label}
        isSticky={isSticky}
        variant={alignedContainerVariant}
        variantType={variantType}
        type={isNewMegaPDPEligible ? 'mega-pdp-sizes' : ''}
      >
        {productSizeControlsMemo}
      </AlignedControlsContainer>
      {showSizeGuide && (
        <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
          <SizeGuideButton
            setShowSizeGuidePopUp={setShowSizeGuidePopUp}
            sizeGuideContent={sizeGuideContent}
            productId={productId}
            isSticky={isSticky}
            variant={variant}
          />
        </Experiment>
      )}
    </Box>
  )
}

ProductSizeControls.propTypes = {
  label: PropTypes.string,
  customFitNote: PropTypes.object,
  items: PropTypes.array,
  selectedItem: PropTypes.object,
  availableItems: PropTypes.array,
  showErrorIfEmpty: PropTypes.bool,
  maxItemsInRow: PropTypes.number,
  onChange: PropTypes.func,
  isSticky: PropTypes.bool,
  isQuickView: PropTypes.bool,
  rangeValue: PropTypes.number,
  productId: PropTypes.string,
  gender: PropTypes.string,
  isBundleVariant: PropTypes.bool,
  isNeutralSizingApplicable: PropTypes.bool,
  neutralSizingCountryTypes: PropTypes.array,
}

ProductSizeControls.defaultProps = {
  label: '',
  customFitNote: {},
  items: [],
  selectedItem: {},
  availableItems: [],
  showErrorIfEmpty: false,
  maxItemsInRow: 0,
  onChange: () => {},
  isSticky: false,
  isQuickView: false,
  productId: '',
  gender: '',
  isNeutralSizingApplicable: false,
  neutralSizingCountryTypes: [],
}

export default memo(ProductSizeControls)
