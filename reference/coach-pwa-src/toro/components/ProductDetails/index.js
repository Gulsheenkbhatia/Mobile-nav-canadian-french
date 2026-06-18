import { useState, useEffect, memo, useContext, useReducer } from 'react'
import { useIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'
import Accordion from 'toro/components/Accordion'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import useStructuredCopy from 'toro/hooks/useStructuredCopy'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import CustomSlot from 'toro/cms/components/CustomSlot'
import FreeShipping from 'toro/components/FreeShipping'
import { subBrandSuffixAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import {
  accordionsReducer,
  ACCORDIONS_REDUCER_ACTIONS,
  initialState,
} from 'toro/components/ProductDetails/accordionsReducer'

import ProductDetailsItem from 'toro/components/ProductDetails/ProductDetailsItem'

const ProductDetails = ({
  productData,
  isDiscontinued,
  skuId,
  isVisible,
  tangibleeData,
  variantData,
  isCustomized,
  apploading,
  sustainabilityIconsData,
  isBundleProduct,
  selectedVariantOrVG,
}) => {
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const { isMobile } = useViewportType()
  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)
  const isPdpV3BelowTheFoldExperiment = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD) && isMobile
  const [freeShippingAccVisible, setFreeShippingAccVisible] = useState(true)
  const [{ activeIndexes }, accordionsDispatch] = useReducer(accordionsReducer, initialState)
  const {
    storefrontConfigs: { sectionExpandCollapsed: accordionSectionExpandValue },
  } = usePreference({
    'Storefront Configs': ['sectionExpandCollapsed'],
  })

  const productSlots = get(productData, 'productSlots')
  const freeShippingReturn = get(productSlots, 'contentSlots["free-shipping-return"]', {})
  const shippingInfo = !!get(freeShippingReturn, 'content.shippinginfo', '')

  const isOnline = get(freeShippingReturn, 'online.default', false)
  const isShoppingAndReturnVisible =
    !isDiscontinued && freeShippingAccVisible && !shippingInfo && isOnline

  const styles = useMultiStyleConfig('ProductDetailsItem')

  const brand = get(appData, 'brand')

  const isOrderable = selectedVariantOrVG?.orderable

  const isFinalSale = get(productData, 'custom.c_isFinalSale')
  const productDescription = get(productData, 'longDescription')

  const description2 = get(productData, 'custom.c_longDescription2', '')
  const productDetails = get(productData, 'productDetails', [])
  const { hasStructuredCopy } = useStructuredCopy(productDetails)
  const editorNotes = get(productData, 'custom.c_editorsNoteDescription', '')
  const freeShipping = get(productSlots, 'contentSlots["free-shipping"]', {})
  const bundleORCAfreeShippingReturn = get(
    productSlots,
    'contentSlots["bundle-or-ca-free-shipping-return"]',
    {}
  )
  const productCare = get(productSlots, 'contentSlots["product-care"]')

  const freeShippingText = isOrderable
    ? isFinalSale
      ? get(freeShipping, 'content.text', '')
      : get(freeShippingReturn, 'content.text', '')
    : isBundleProduct
    ? brand === 'coach-outlet'
      ? get(freeShippingReturn, 'content.text', '')
      : get(bundleORCAfreeShippingReturn, 'content.text', '')
    : ''

  const isOutlet = brand === 'coach-outlet'
  const shippingBody =
    !productData?.isBundleProduct && isOrderable
      ? isFinalSale
        ? freeShipping
        : freeShippingReturn
      : productData?.isBundleProduct
      ? isOutlet
        ? freeShippingReturn
        : bundleORCAfreeShippingReturn
      : ''

  const onAccordionChange = (expandedIndex) => {
    accordionsDispatch({
      type: ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES,
      payload: expandedIndex,
    })
  }

  useEffect(() => {
    setFreeShippingAccVisible(!!freeShippingText?.trim())

    if (isPdpV3BelowTheFoldExperiment) {
      return accordionsDispatch({ type: ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES, payload: [] })
    }

    accordionsDispatch({
      type: ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES_BY_PARAMS,
      payload: { freeShippingAccVisible: !!freeShippingText, accordionSectionExpandValue },
    })
  }, [freeShippingText, isPdpV3BelowTheFoldExperiment, accordionSectionExpandValue])

  if (apploading) {
    return (
      <Box width="100%">
        <Skeleton minH="100px" width="100%" mt="22px" mb="22px">
          <Box mb="mar" />
        </Skeleton>
      </Box>
    )
  }

  return (
    <>
      {shippingInfo && isOnline && <CustomSlot content={shippingBody} Component={FreeShipping} />}
      <Accordion
        allowMultiple
        allowToggle
        onChange={onAccordionChange}
        index={activeIndexes}
        id="product-info"
        sx={styles.accordionWrapper}
      >
        {isShoppingAndReturnVisible && !isEmpty(productSlots) && (
          <ProductDetailsItem
            productSlots={productSlots}
            isFinalSale={isFinalSale}
            productData={productData}
            variantData={variantData}
            isBundleProduct={isBundleProduct}
            sx={styles.shippingReturns}
            isShoppingAndReturnVisible={isShoppingAndReturnVisible}
            styles={styles}
          />
        )}
        {(!isEmpty(productDescription) || hasStructuredCopy) && (
          <ProductDetailsItem
            isProductDetailSection
            content={productDescription}
            label={formatMessage({
              id: `pdp.product.productDetail${subBrandSuffix}.title`,
              defaultMessage: 'Product Details',
            })}
            content2={hasStructuredCopy ? undefined : description2}
            productDetails={hasStructuredCopy ? productDetails : undefined}
            productCare={productCare}
            id="product-details"
            skuId={skuId}
            isVisible={isVisible}
            tangibleeData={tangibleeData}
            productData={productData}
            variantData={variantData}
            isCustomized={isCustomized}
            apploading={apploading}
            isSSRExpanded
            sustainabilityIconsData={sustainabilityIconsData}
            sx={styles.productDetails}
            isShoppingAndReturnVisible={isShoppingAndReturnVisible}
            styles={styles}
          />
        )}
        {!isEmpty(editorNotes) && (
          <ProductDetailsItem
            content={editorNotes}
            productData={productData}
            id="editorsNotes"
            label={formatMessage({
              id: `pdp.product.editorNotes${subBrandSuffix}.title`,
              defaultMessage: "Editor's Notes",
            })}
            isSSRExpanded
            sx={styles.editorNotes}
            styles={styles}
          />
        )}
      </Accordion>
    </>
  )
}

ProductDetails.propTypes = {
  productData: PropTypes.object,
  isDiscontinued: PropTypes.bool,
  skuId: PropTypes.string,
  isVisible: PropTypes.bool,
  tangibleeData: PropTypes.object,
  variantData: PropTypes.object,
  isCustomized: PropTypes.bool,
  apploading: PropTypes.bool,
  sustainabilityIconsData: PropTypes.array,
  isBundleProduct: PropTypes.bool,
  brand: PropTypes.string,
}

ProductDetails.defaultProps = {
  productData: {},
  isDiscontinued: false,
  skuId: '',
  isVisible: false,
  tangibleeData: {},
  variantData: {},
  isCustomized: false,
  apploading: false,
  sustainabilityIconsData: [],
  isBundleProduct: false,
}

export default withErrorBoundaryWrapper(memo(ProductDetails))
