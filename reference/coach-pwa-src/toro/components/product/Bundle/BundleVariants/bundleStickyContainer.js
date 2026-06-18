import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import useTheme from 'toro/hooks/useTheme'
import Heading from 'toro/components/Heading'
import ProductSizeControls from '../../ProductVariationControls/ProductSizeControls'
import { ORDERING_ERROR } from 'toro/helpers/productVariations'
import { useIntl } from 'react-intl'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'

function StickyBundleContainer({
  selectedBundleVariantSize,
  selectedBundleVariantWidth,
  availableSizes,
  availableWidths,
  setSelectedBundleVariantSize,
  setSelectedBundleVariantWidth,
  orderingError,
  sizes,
  widths,
  productId,
  maxSizeButtonsInRow,
  thumbnail: { src, alt },
  productName,
  widthsLength,
  gender,
  isNeutralSizingApplicable,
  neutralSizingCountryTypes,
}) {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const { borderRadius, fontFamily, lineHeights } = theme
  const analytics = useAnalytics()
  const label = useMemo(
    () => ({
      size: formatMessage({ id: 'pdp.product.sizeText', defaultMessage: 'size' }),
      width: formatMessage({ id: 'pdp.product.widthText', defaultMessage: 'Width' }),
    }),
    []
  )

  const onSizeControlChange = useCallback(
    (value) => {
      setSelectedBundleVariantSize(value)
      // send analytics - size
      analytics.send('swatchInteraction', {
        eventLocation: 'product',
        eventAction: 'swatch click',
        swatchType: get(label, 'size'),
        swatchValue: value?.text,
        eventLabel: productId,
        swatchVariant: `${productId} ${value?.text} ${selectedBundleVariantWidth?.text || ''}`, // masterid-color/size width
      })
    },
    [productId, label, selectedBundleVariantWidth?.text]
  )

  const onWidthControlChange = useCallback(
    (value) => {
      setSelectedBundleVariantWidth(value)
      // send analytics - width
      analytics.send('swatchInteraction', {
        eventLocation: 'product',
        eventAction: 'swatch click',
        swatchType: get(label, 'width'),
        swatchValue: value?.text,
        eventLabel: productId,
        swatchVariant: `${productId} ${selectedBundleVariantSize?.text || ''} ${value?.text}`, // masterid-color/size width
      })
    },
    [productId, label, selectedBundleVariantWidth?.text]
  )

  return (
    <>
      <Flex mb="16px" gridGap={3} alignItems="center">
        <Image
          borderRadius={borderRadius.default}
          w="100%"
          src={src}
          alt={alt}
          sx={{ padding: 0, height: '50px', width: '42px' }}
          pdp={true}
        />
        <Heading
          level="2"
          fontSize={'20px'}
          fontWeight="400"
          fontFamily={fontFamily.secondaryNormal}
          variant="secondary"
          lineHeight={lineHeights.md}
          letterSpacing={theme.letterSpacings.sm}
        >
          {productName}
        </Heading>
      </Flex>
      <ProductSizeControls
        label={get(label, 'size')}
        gender={gender}
        items={sizes}
        selectedItem={selectedBundleVariantSize}
        availableItems={availableSizes}
        onChange={onSizeControlChange}
        showErrorIfEmpty={orderingError === ORDERING_ERROR.notSelected}
        maxItemsInRow={maxSizeButtonsInRow}
        productId={productId}
        variantType={'size'}
        isNeutralSizingApplicable={isNeutralSizingApplicable}
        neutralSizingCountryTypes={neutralSizingCountryTypes}
      />
      {widthsLength > 0 && (
        <ProductSizeControls
          label={get(label, 'width')}
          items={widths}
          selectedItem={selectedBundleVariantWidth}
          availableItems={availableWidths}
          onChange={onWidthControlChange}
          showErrorIfEmpty={orderingError === ORDERING_ERROR.notSelected}
          maxItemsInRow={3}
          productId={productId}
          variantType={'width'}
        />
      )}
    </>
  )
}

StickyBundleContainer.propTypes = {
  selectedBundleVariantSize: PropTypes.object,
  selectedBundleVariantWidth: PropTypes.object,
  availableSizes: PropTypes.array,
  availableWidths: PropTypes.array,
  setSelectedBundleVariantSize: PropTypes.func,
  setSelectedBundleVariantWidth: PropTypes.func,
  orderingError: PropTypes.string,
  sizes: PropTypes.array,
  widths: PropTypes.array,
  productId: PropTypes.string,
  maxSizeButtonsInRow: PropTypes.number,
  productName: PropTypes.string,
  widthsLength: PropTypes.number,
  gender: PropTypes.string,
}

StickyBundleContainer.defaultProps = {
  setSelectedBundleVariantSize: () => {},
  setSelectedBundleVariantWidth: () => {},
  selectedBundleVariantSize: {},
  selectedBundleVariantWidth: {},
  availableSizes: [],
  availableWidths: [],
  sizes: [],
  widths: [],
  orderingError: '',
}

export default StickyBundleContainer
