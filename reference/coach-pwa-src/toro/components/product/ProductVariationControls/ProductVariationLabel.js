import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import FitReviewText from 'toro/components/product/ProductVariationControls/FitReviewText'
import get from 'lodash/get'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import { useMemo, memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  countryTabIndexAtom,
  isTabbedAdaptivePDPEligibleAtom,
  setFitReviewAtom,
} from 'store/pdp.atom'
import { useAtom } from 'jotai'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import TabsButton from 'toro/components/TabsButton'
import useViewportType from 'toro/hooks/useViewportType'
import capitalize from 'lodash/capitalize'
import isFunction from 'lodash/isFunction'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

const ProductAttributes = {
  Color: 'color',
  Size: 'size',
  Width: 'width',
  Material: 'material',
  StyleType: 'style type',
  HeelHeight: 'heel height',
  Lifecycle: 'lifecycle',
}

const emptyVatiationLabel = [
  ProductAttributes.Color,
  ProductAttributes.Material,
  ProductAttributes.Lifecycle,
]

function ProductVariationLabel({
  label,
  customFitNote,
  value,
  showError,
  rangeValue,
  gender,
  isSticky,
  variantType,
  isNeutralSizingApplicable,
  neutralSizingCountryTypes,
  megaPDPLabel,
  isMegaPDPEligible,
  isBundleCard,
  onTabChange,
  styleVariant,
}) {
  const styles = useMultiStyleConfig('ProductVariationCSS', {
    variant: isBundleCard ? 'bundle' : styleVariant || variantType,
  })
  const [countryTabIndex, setCountryTabIndex] = useAtom(countryTabIndexAtom)
  const setFitReview = useUpdateAtom(setFitReviewAtom)
  const { formatMessage } = useIntl()
  const fitReviewTextRef = useRef('')
  const { isMobile } = useViewportType()
  const isPDPTemplateV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isMegaPDPTemplateV3Mobile = isPDPTemplateV3Mobile && isMegaPDPEligible

  const sizeText = {
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

  const widthText = {
    1: formatMessage({ id: 'pdp.product.runsNarrowText', defaultMessage: 'Runs narrow' }),
    2: formatMessage({
      id: 'pdp.product.runsSlightlyNarrowText',
      defaultMessage: 'Runs slightly narrow',
    }),
    3: formatMessage({ id: 'pdp.product.runsTrueToSize', defaultMessage: 'Runs true to size' }),
    4: formatMessage({
      id: 'pdp.product.runsSlightlyWideText',
      defaultMessage: 'Runs slightly wide',
    }),
    5: formatMessage({ id: 'pdp.product.runsWideText', defaultMessage: 'Runs wide' }),
  }

  const lowerCaseLable = label?.toLowerCase()
  const lowerCaseVariantType = variantType?.toLocaleLowerCase()
  const isFullLabelShow = !emptyVatiationLabel.includes(lowerCaseVariantType || lowerCaseLable)

  let displayValue = value
  if (showError) {
    displayValue = `${formatMessage({
      id: 'pdp.product.pleaseSelectAText',
      defaultMessage: 'Please select a',
    })} ${lowerCaseLable}`
  }

  const displayedLabel = useMemo(() => {
    if (label === 'size') {
      return formatMessage({
        id: `pdp.variant.size.${gender?.toLocaleLowerCase?.() ?? 'unisex'}`,
        defaultMessage: 'Size:',
      })
    }
    return (
      formatMessage({
        id: `pdp.product.variant.${lowerCaseLable}`,
        defaultMessage: label,
      }) + ':'
    )
  }, [label, gender])

  let labelStyles = {
    ...styles.variationLabelText,
    ...(isMegaPDPTemplateV3Mobile ? { textTransform: 'none' } : {}),
  }

  useEffect(() => {
    if (variantType === ProductAttributes.Size) {
      fitReviewTextRef.current = get(customFitNote, 'customFitSize') || sizeText[rangeValue]
      labelStyles = styles.variationLabelNormalNoTransformText
      setFitReview({ [variantType]: fitReviewTextRef.current })
    }

    if (variantType === ProductAttributes.Width) {
      fitReviewTextRef.current = get(customFitNote, 'customFitWidth') || widthText[rangeValue]
      setFitReview({ [variantType]: fitReviewTextRef.current })
    }
  }, [variantType, rangeValue, customFitNote])

  const labelDataQa = useMemo(() => {
    switch (lowerCaseVariantType) {
      case ProductAttributes.Color:
        return 'cm_txt_pdt_label_color'
      case ProductAttributes.Size:
        return 'cm_txt_pdt_label_size'
      case ProductAttributes.Width:
        return 'cm_txt_pdt_label_width'
      case ProductAttributes.Material:
        return 'cm_txt_pdt_label_material'
      case ProductAttributes.StyleType:
        return 'cm_txt_pdt_label_styletype'
      case ProductAttributes.HeelHeight:
        return 'cm_txt_pdt_label_heelheight'
      default:
        return ' '
    }
  }, [label, lowerCaseVariantType])

  const labelValueDataQa = useMemo(() => {
    switch (lowerCaseVariantType) {
      case ProductAttributes.Color:
        return 'cm_txt_pdt_label_color_msg'
      case ProductAttributes.Size:
        return 'cm_txt_pdt_label_size_msg'
      case ProductAttributes.Width:
        return 'cm_txt_pdt_label_width_msg'
      case ProductAttributes.Material:
        return 'cm_txt_pdt_label_material_msg'
      case ProductAttributes.StyleType:
        return 'cm_txt_pdt_label_styletype_msg'
      case ProductAttributes.HeelHeight:
        return 'cm_txt_pdt_label_heelheight_msg'
      default:
        return ' '
    }
  }, [label, lowerCaseVariantType])

  const onTabChangeHandler = (index) => {
    setCountryTabIndex(index)
    isFunction(onTabChange) && onTabChange(neutralSizingCountryTypes[index], index)
  }

  return (
    <Flex
      sx={styles.prodVariationLabelWrapper()}
      className="variation-wrapper product-variation-label"
    >
      <Flex>
        {(isTabbedAdaptivePDPEligible ||
          isMegaPDPTemplateV3Mobile ||
          !isPDPTemplateV3Mobile ||
          isFullLabelShow ||
          isBundleCard) && (
          <Text as="h2" sx={labelStyles} variant="body-primary" size="md" data-qa={labelDataQa}>
            {isMegaPDPTemplateV3Mobile ? capitalize(displayedLabel) : displayedLabel}
          </Text>
        )}
        {(!isMegaPDPTemplateV3Mobile || isTabbedAdaptivePDPEligible || isFullLabelShow) &&
          (displayValue ? (
            <Text
              sx={
                megaPDPLabel
                  ? { ...styles.variationLabelValue, ...styles.variationLabelValueMegaPDP }
                  : styles.variationLabelValue
              }
              variant="body-primary"
              size="md"
              className={`${lowerCaseLable}-name variation-label`}
              data-pid={displayValue}
              data-qa={labelValueDataQa}
            >
              {displayValue}
            </Text>
          ) : (
            <Text variant="body-primary" size="md" sx={styles.variationLabelValue}>
              {formatMessage(
                {
                  id: 'pdp.product.selectVariation',
                  defaultMessage: 'Please select a {label}',
                },
                { label }
              )}
            </Text>
          ))}
      </Flex>
      {isNeutralSizingApplicable && neutralSizingCountryTypes.length > 0 && (
        <TabsButton
          tabsData={neutralSizingCountryTypes}
          styles={styles}
          translationGroup="pdp.country"
          activeTabIndex={countryTabIndex}
          onTabChange={onTabChangeHandler}
        />
      )}
      {!isNeutralSizingApplicable && fitReviewTextRef.current && (
        <FitReviewText
          label={label}
          variantType={variantType}
          isSticky={isSticky}
          styleVariant={styleVariant}
        />
      )}
    </Flex>
  )
}

ProductVariationLabel.propTypes = {
  customFitNote: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
  showError: PropTypes.bool,
  rangeValue: PropTypes.number,
  isQuickView: PropTypes.bool,
  gender: PropTypes.string,
  isNeutralSizingApplicable: PropTypes.bool,
  neutralSizingCountryTypes: PropTypes.array,
  isSticky: PropTypes.bool,
}

ProductVariationLabel.defaultProps = {
  customFitNote: {},
  label: '',
  value: '',
  showError: false,
  isQuickView: false,
  isNeutralSizingApplicable: false,
  neutralSizingCountryTypes: [],
  isSticky: false,
}

export default memo(ProductVariationLabel)
