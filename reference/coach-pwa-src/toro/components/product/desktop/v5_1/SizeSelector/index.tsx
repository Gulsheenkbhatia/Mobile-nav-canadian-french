import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import isObject from 'lodash/isObject'
import useProductData from 'toro/hooks/useProductData'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import DesktopScrollableSwatches from 'toro/components/ScrollableSwatches/DesktopScrollableSwatches'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import {
  selectedSizeAtom,
  setSelectedSizeAtom,
  availableSizesAtom,
  setFitReviewAtom,
  sizingRangeAtom,
  dropAtbErrorsAtom,
} from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import FitReviewText from 'toro/components/product/ProductVariationControls/FitReviewText'
import SizeSelectorInventoryBadge from 'toro/components/product/desktop/StickyBar/SizeSelector/SizeSelectorInventoryBadge'
import useAnalytics from 'toro/analytics/useAnalytics'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useViewportType from 'toro/hooks/useViewportType'
import get from 'lodash/get'
import SizeGuideButton from 'toro/components/product/SizeGuideButton'

const SizeSelector = () => {
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('ProductSizeSelector')
  const { formatMessage } = useIntl()
  const { isDesktop } = useViewportType()
  const [vgGender] = useVariantGroupData(['customAttributes.c_gender'])
  const [masterId, fprGender, customFitSize, variant] = useProductData([
    'masterId',
    'custom.c_gender',
    'custom.c_customFitSize',
    'variant',
  ])
  const [sizes, selectedColorId] = useSelectedColorData(['sizes', 'id'])
  const selectedSize = useAtomValue(selectedSizeAtom)
  const setSelectedSize = useUpdateAtom(setSelectedSizeAtom)
  const availableSizes = useAtomValue(availableSizesAtom)
  const setFitReview = useUpdateAtom(setFitReviewAtom)
  const sizingRange = useAtomValue(sizingRangeAtom)
  const dropAtbErrors = useUpdateAtom(dropAtbErrorsAtom)
  const [productId, sizeGuideContent] = useProductData(['id', 'sizeChartID.c_body.default.markup'])

  const onSizeChange = (value) => {
    setSelectedSize(value)
    dropAtbErrors()
    analytics.send('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: masterId,
      eventLocation: 'product',
      swatchType: 'size',
      swatchValue: value,
      swatchVariant: variant?.find(
        (variant) =>
          variant?.variationValues?.color === selectedColorId &&
          variant?.variationValues?.size === value
      )?.id,
    })
  }

  const gender = vgGender || fprGender

  const displayedLabel = formatMessage({
    id: `pdp.variant.size.${gender?.toLocaleLowerCase?.() ?? 'unisex'}`,
    defaultMessage: 'Size:',
  })

  const label = formatMessage({ id: 'pdp.product.sizeText', defaultMessage: 'size' })
  const displayValue = selectedSize
    ? selectedSize
    : `${formatMessage({
        id: 'pdp.product.pleaseSelectAText',
        defaultMessage: 'Select a',
      })} ${label.toLowerCase()}`

  const SIZE_TEXT = {
    1: formatMessage({ id: 'pdp.product.runsSmallText', defaultMessage: 'Runs small' }),
    2: formatMessage({
      id: 'pdp.product.runsSlightlySmallText',
      defaultMessage: 'Runs slightly small',
    }),
    3: formatMessage({ id: 'pdp.product.runsTrueToSizeText', defaultMessage: 'Runs true to size' }),
    4: formatMessage({
      id: 'pdp.product.runsSlightlyLargeText',
      defaultMessage: 'Runs slightly large',
    }),
    5: formatMessage({ id: 'pdp.product.runsLarge', defaultMessage: 'Runs large' }),
  }

  const isMultiLocaleSizeExists = !!sizes?.length && isObject(get(sizes, '[0].value'))
  const { isNeutralSizingEnabled } = useNeutralSizingData()
  const customFixSizeText = customFitSize || SIZE_TEXT[sizingRange]
  const isFitSizeAvailable =
    !(isNeutralSizingEnabled && isMultiLocaleSizeExists) && customFixSizeText

  useEffect(() => {
    setFitReview({ ['size']: customFixSizeText })
  }, [customFixSizeText, selectedSize])

  return (
    <Box sx={styles.sizeSelectorWrapper} className="size-selector-wrapper">
      <Flex sx={styles.sizeAreaHeader}>
        <Flex>
          <Text
            variant="body-primary"
            size="md"
            sx={styles.variationLabel}
            data-qa="cm_txt_pdt_label_size"
          >
            {displayedLabel}
          </Text>
          <Text
            variant="body-primary"
            size="md"
            sx={styles.variationLabelValue}
            data-qa="cm_txt_pdt_label_size_msg"
          >
            {displayValue}
          </Text>
          {selectedSize && isDesktop && <SizeSelectorInventoryBadge />}
        </Flex>
      </Flex>
      <DesktopScrollableSwatches showArrows={isDesktop} styles={styles}>
        {sizes?.map((item) => {
          const isUnavailableSize =
            !availableSizes?.includes(item?.value) && !availableSizes?.includes(item?.name)
          return (
            <Button
              key={item?.name || item?.value}
              className={`product-size-button ${
                (item?.value && item?.value === selectedSize) ||
                (item?.name && item?.name === selectedSize)
                  ? 'pdp-chosen-size'
                  : ''
              }
                ${isUnavailableSize ? 'pdp-unavailable-size' : ''}`}
              sx={styles.sizeButton}
              onClick={() => onSizeChange(item?.value)}
              variant="color-option"
              data-qa={isUnavailableSize ? 'cm_btn_size_swatch_disabled' : undefined}
            >
              {item?.name}
            </Button>
          )
        })}
      </DesktopScrollableSwatches>
      <Flex sx={styles.sizeAreaFooter}>
        {sizeGuideContent && (
          <SizeGuideButton productId={productId} sizeGuideContent={sizeGuideContent} />
        )}
        {isFitSizeAvailable && <FitReviewText label={label} variantType="size" />}
      </Flex>
    </Box>
  )
}

export default SizeSelector
