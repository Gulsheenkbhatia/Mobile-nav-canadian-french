import { useContext, memo, useMemo } from 'react'
import { useIntl } from 'react-intl'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionPanel from 'toro/components/AccordionPanel'
import HtmlContent from 'toro/components/HtmlContent'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import get from 'lodash/get'
import Heading from 'toro/components/Heading'
import useAnalytics from 'toro/analytics/useAnalytics'
import CustomSlot from 'toro/cms/components/CustomSlot'
import FreeShipping from 'toro/components/FreeShipping'
import isEmpty from 'lodash/isEmpty'
import useViewportType from 'toro/hooks/useViewportType'
import PWAContext from 'components/common/PWAContext'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useDisclosure } from '@chakra-ui/react'
import { useAtomValue } from 'jotai/utils'
import { isSWOutletAtom } from 'store/global.atom'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { AdditionalDetailsIcon, ShippingIcon, EditorsNotesIcon } from 'toro/icons'
import useExperiment from 'toro/hooks/useExperiment'
import TangibleeWidget from 'toro/components/product/Tangiblee/TangibleeWidget'
import { PaidSocialLandingIcon } from 'toro/components/ProductDetails/ProductDetailsItem/Icons'
import StructuredCopyContent from 'toro/components/ProductDetails/StructuredCopyContent'

const ProductCareContent = dynamic(
  () => import('toro/components/ProductDetails/ProductCareContent'),
  { ssr: false }
)
const ProductCareModal = dynamic(() => import('toro/components/ProductDetails/ProductCareModal'), {
  ssr: false,
})

const SustainabilityExperienceContainer = dynamic(
  () => import('toro/components/product/SustainableExperience/SustainabilityExperienceContainer'),
  { ssr: false }
)

const accordionIconsMap = {
  'product-details': <AdditionalDetailsIcon />,
  editorsNotes: <EditorsNotesIcon />,
}

const ProductDetailsItem = ({
  label,
  isFinalSale,
  content,
  content2,
  productDetails,
  productSlots,
  productCare,
  id,
  skuId,
  isVisible,
  tangibleeData,
  productData,
  variantData,
  isCustomized,
  sustainabilityIconsData,
  styles,
  ...props
}) => {
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const { appData } = useContext(PWAContext)
  const { isMobile } = useViewportType()
  const brand = get(appData, 'brand')
  const { isOpen: careModalOpened, onOpen, onClose } = useDisclosure()
  const isPDPV3BelowTheFoldExperiment = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD)
  const isPDPV3BelowTheFoldMobile = isPDPV3BelowTheFoldExperiment && isMobile

  const isOrderable = get(variantData, 'orderable', true)
  const isOnline = get(productCare, 'online.default', true)
  const freeShipping = get(productSlots, 'contentSlots["free-shipping"]')
  const freeShippingReturn = get(productSlots, 'contentSlots["free-shipping-return"]')
  const productCareEnabled =
    !isEmpty(productCare) && (freeShipping || freeShippingReturn || content) && isOnline
  const outletShippingReturn = get(productSlots, 'contentSlots["outlet-shipping-return"]')
  const finalSetShippingReturn = get(productSlots, 'contentSlots["set-shipping-return"]')
  const bundleORCAfreeShippingReturn = get(
    productSlots,
    'contentSlots["bundle-or-ca-free-shipping-return"]'
  )

  const pdpOutletShippingAndReturns = outletShippingReturn?.content?.text || ''
  const pdpSetShippingAndReturns = finalSetShippingReturn?.content?.text || ''

  const isOutlet = brand === 'coach-outlet'
  const isSwOutletProduct = get(productData, 'custom.c_isOutlet', false)
  const isProductTypeSet = productData?.productType?.set ? true : false
  const finalSaleText = (
    isOrderable
      ? isFinalSale
        ? get(freeShipping, 'content.text', '')
        : get(freeShippingReturn, 'content.text', '')
      : productData?.isBundleProduct
      ? isOutlet
        ? get(freeShippingReturn, 'content.text', '')
        : get(bundleORCAfreeShippingReturn, 'content.text', '')
      : ''
  ).toLowerCase()

  const swShippingTitleText = useMemo(() => {
    let ShippingTitle = ''
    if (!isOrderable) {
      return
    }
    if (isProductTypeSet) {
      ShippingTitle = pdpSetShippingAndReturns
    } else {
      ShippingTitle = pdpOutletShippingAndReturns
    }
    return ShippingTitle.toLowerCase()
  }, [isOrderable, isProductTypeSet, pdpSetShippingAndReturns, pdpOutletShippingAndReturns])

  const shippingBody = useMemo(
    () =>
      !productData?.isBundleProduct && isOrderable
        ? isFinalSale
          ? freeShipping
          : freeShippingReturn
        : productData?.isBundleProduct
        ? isOutlet
          ? freeShippingReturn
          : bundleORCAfreeShippingReturn
        : '',
    [
      productData?.isBundleProduct,
      isOrderable,
      isFinalSale,
      freeShipping,
      freeShippingReturn,
      isOutlet,
      bundleORCAfreeShippingReturn,
    ]
  )

  const swShippingbody = useMemo(() => {
    let ShippingBody
    if (!isOrderable) {
      return
    }
    if (isProductTypeSet) {
      ShippingBody = finalSetShippingReturn
    } else {
      ShippingBody = outletShippingReturn
    }
    return ShippingBody
  }, [isOrderable, isProductTypeSet, finalSetShippingReturn, outletShippingReturn])

  const productInfoView = (isExpanded) => {
    if (!isExpanded) {
      analytics?.send('productInteraction', {
        eventLocation: 'accordion',
        eventAction: (label?.toLowerCase() || finalSaleText?.toLowerCase()) + ' click',
        eventLabel: productData?.id,
      })
    }
  }

  const productDetailsItemsDataQA = (productDetailsDataQa, editorsNotesDataQa) => {
    return id === 'product-details'
      ? productDetailsDataQa
      : id === 'editorsNotes'
      ? editorsNotesDataQa
      : ''
  }

  const tangibleeWidgetMarkup = (variant) => (
    <>
      {!isCustomized && isVisible && (isPDPV3BelowTheFoldMobile || productCareEnabled) && (
        <Box sx={Boolean(content2) ? styles.content2TangibleeButton : styles.tangibleeButton}>
          <TangibleeWidget
            skuId={skuId}
            tangibleeData={tangibleeData}
            productData={productData}
            variantData={variantData}
            rulerIconSrc={styles.rulerIconSrc}
            variant={variant}
          />
        </Box>
      )}
    </>
  )

  const textContentMarkup = useMemo(() => {
    if (!content && !content2 && !productDetails?.length) return null
    if (productDetails?.length)
      return (
        <StructuredCopyContent
          id="description2"
          sx={{ ...styles.propertiesHtmlContent, ...styles.propertiesHtmlContentItem }}
          items={productDetails}
        />
      )

    if (content2)
      return (
        <HtmlContent
          id="description2"
          sx={{ ...styles.propertiesHtmlContent, ...styles.propertiesHtmlContentItem }}
          content={content2}
        />
      )

    return <HtmlContent id="description1" sx={styles.propertiesHtmlContent} content={content} />
  }, [
    content,
    content2,
    productDetails,
    styles.propertiesHtmlContent,
    styles.propertiesHtmlContentItem,
  ])

  return (
    <>
      <AccordionItem sx={props.sx}>
        {({ isExpanded }) => (
          <>
            <AccordionButton
              px="0"
              sx={{ ...styles.accordionButton, ...styles.accordionSVG }}
              onClick={() => productInfoView(isExpanded)}
            >
              <Box as="h2" flex="1" textAlign="left">
                {freeShipping || freeShippingReturn || bundleORCAfreeShippingReturn ? (
                  <Box as="span" sx={styles.accordion_details}>
                    <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                      <ShippingIcon />
                    </Experiment>
                    {isSWOutlet && isSwOutletProduct ? swShippingTitleText : finalSaleText}
                  </Box>
                ) : label ? (
                  <Box
                    as="span"
                    className="accordion_details"
                    data-qa={productDetailsItemsDataQA(
                      'cm_pdp_btn_pdtls_card_hdr',
                      'cm_pdp_btn_edtrs_nts_card_hdr'
                    )}
                    sx={styles.accordion_details}
                  >
                    <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                      {accordionIconsMap[id]}
                    </Experiment>
                    {label}
                  </Box>
                ) : null}
              </Box>
              <PaidSocialLandingIcon
                isExpanded={isExpanded}
                getDataQA={productDetailsItemsDataQA}
              />
            </AccordionButton>
            <AccordionPanel
              className="product-properties"
              sx={styles.productPropertiesWrapper()}
              data-qa={productDetailsItemsDataQA(
                'cm_pdp_cntnr_pdtls_card_body',
                'cm_pdp_txt_edtrs_nts_desc'
              )}
            >
              <Text
                sx={styles.productPropertiesText}
                variant="body-text-secondary"
                size="md"
                as="div"
                id={id}
              >
                {freeShipping || freeShippingReturn || bundleORCAfreeShippingReturn ? (
                  <CustomSlot
                    content={isSWOutlet && isSwOutletProduct ? swShippingbody : shippingBody}
                    Component={FreeShipping}
                  />
                ) : content || content2 || productDetails?.length ? (
                  <>
                    <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                      {textContentMarkup}
                      <SustainabilityExperienceContainer
                        sustainabilityIconsData={sustainabilityIconsData}
                        isMobile={isMobile}
                        productData={productData}
                      />
                      {productCareEnabled && (
                        <Box sx={styles.productCareWrapper}>
                          <Heading
                            sx={styles.productCareHeading}
                            size="3"
                            cursor="pointer"
                            width="fit-content"
                            onClick={onOpen}
                          >
                            {formatMessage({
                              id: 'pdp.productCare.title',
                              defaultMessage: 'Product Care',
                            })}
                          </Heading>
                        </Box>
                      )}
                      {tangibleeWidgetMarkup()}
                    </Experiment>
                    <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                      {tangibleeWidgetMarkup('buttonCTA')}
                      {textContentMarkup}
                      <SustainabilityExperienceContainer
                        sustainabilityIconsData={sustainabilityIconsData}
                        isMobile={isMobile}
                        productData={productData}
                      />
                      {productCareEnabled && (
                        <Box
                          sx={
                            content && !content2
                              ? styles?.productCareWrapperV3WithProductDetails
                              : styles?.productCareWrapperV3
                          }
                        >
                          <Heading
                            sx={styles.productCareHeading}
                            className={content2 ? 'product-care-content' : ''}
                            size="3"
                            cursor="pointer"
                            width="fit-content"
                            onClick={onOpen}
                          >
                            {formatMessage({
                              id: 'pdp.productCare.title',
                              defaultMessage: 'Product Care',
                            })}
                          </Heading>
                        </Box>
                      )}
                    </Experiment>
                  </>
                ) : null}
              </Text>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
      {careModalOpened && (
        <ProductCareModal
          className="product-care-modal"
          sx={styles.productCareModal}
          onClose={onClose}
        >
          <ProductCareContent productCare={productCare} />
        </ProductCareModal>
      )}
    </>
  )
}

ProductDetailsItem.propTypes = {
  label: PropTypes.string,
  isFinalSale: PropTypes.bool,
  content: PropTypes.string,
  content2: PropTypes.string,
  productDetails: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      values: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    })
  ),
  productSlots: PropTypes.object,
  productCare: PropTypes.object,
  id: PropTypes.string,
  productData: PropTypes.object,
  variantData: PropTypes.object,
  isCustomized: PropTypes.bool,
  apploading: PropTypes.bool,
  isSSRExpanded: PropTypes.bool,
  isBundleProduct: PropTypes.bool,
  skuId: PropTypes.string,
  isVisible: PropTypes.bool,
  tangibleeData: PropTypes.object,
  sustainabilityIconsData: PropTypes.array,
}

ProductDetailsItem.defaultProps = {
  label: '',
  isFinalSale: false,
  content: '',
  content2: '',
  productDetails: undefined,
  productSlots: {},
  id: '',
  productData: {},
  variantData: {},
  isCustomized: false,
  apploading: false,
  isSSRExpanded: true,
  isBundleProduct: false,
  skuId: '',
  isVisible: false,
  tangibleeData: {},
  sustainabilityIconsData: [],
}

export default memo(ProductDetailsItem)
