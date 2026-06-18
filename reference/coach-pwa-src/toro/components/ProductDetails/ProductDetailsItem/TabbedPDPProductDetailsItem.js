import { useMemo, memo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import HtmlContent from 'toro/components/HtmlContent'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import get from 'lodash/get'
import Heading from 'toro/components/Heading'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import isEmpty from 'lodash/isEmpty'
import useViewportType from 'toro/hooks/useViewportType'
import PropTypes from 'prop-types'
import { useDisclosure } from '@chakra-ui/react'
import TangibleeWidget from 'toro/components/product/Tangiblee/TangibleeWidget'
import ProductCareModal from 'toro/components/ProductDetails/ProductCareModal'
import ProductCareContent from 'toro/components/ProductDetails/ProductCareContent'
import { useAtomValue } from 'jotai/utils'
import { subBrandSuffixAtom } from 'store/pdp.atom'

const SustainabilityExperienceContainer = dynamic(
  () => import('toro/components/product/SustainableExperience/SustainabilityExperienceContainer'),
  { ssr: false }
)

const ProductDetailsItem = ({
  content,
  content2,
  productCare,
  id,
  skuId,
  isVisible,
  tangibleeData,
  productData,
  variantData,
  isCustomized,
  sustainabilityIconsData,
  variant,
}) => {
  const { formatMessage } = useIntl()
  const { isMobile } = useViewportType()
  const { isOpen: careModalOpened, onOpen, onClose } = useDisclosure()
  const [editorReadMore, setEditorReadMore] = useState(true)
  const styles = useMultiStyleConfig('ProductDetailsItem', { variant })
  const editorNotes = get(productData, 'custom.c_editorsNoteDescription', '')
  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)
  const productCareEnabled = useMemo(() => {
    if (!isEmpty(productCare) && content) {
      return get(productCare, 'online.default', true)
    }
    return false
  }, [productCare, content])

  if (!content) {
    return null
  }

  const stylesObj = {
    ...styles.propertiesHtmlContent,
    ...styles.propertiesHtmlContentItem,
  }

  const productDetailsItemsDataQA = (productDetailsDataQa) => {
    return id === 'product-details' ? productDetailsDataQa : ''
  }

  const onEditorReadMoreClick = () => {
    setEditorReadMore(!editorReadMore)
  }

  const textContentMarkup = (
    <>
      {content && !content2 ? (
        <HtmlContent id="description1" sx={styles.propertiesHtmlContent} content={content} />
      ) : content2 ? (
        <HtmlContent
          id="description2"
          sx={stylesObj}
          content={content2}
          data-qa="visual_product_details"
        />
      ) : null}
    </>
  )

  return (
    <>
      <Box
        className="product-properties"
        sx={{ ...styles.productPropertiesWrapper(), ...styles.tabbedPDPWrapper }}
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
          {!isCustomized && isVisible && (
            <Box
              sx={{
                ...(Boolean(content2) ? styles.content2TangibleeButton : styles.tangibleeButton),
                ...styles.tangibleeButtonTabbedPDP,
              }}
              className="tangiblee-button-wrapper"
            >
              <TangibleeWidget
                skuId={skuId}
                tangibleeData={tangibleeData}
                productData={productData}
                variantData={variantData}
                rulerIconSrc={styles.rulerIconSrc}
                variant={'buttonCTA'}
              />
            </Box>
          )}
          {textContentMarkup}
          {!isEmpty(editorNotes) && content2 && (
            <Box
              sx={styles.editorWrapper}
              className={!isEmpty(productCare) && productCareEnabled ? 'productCareActive' : ''}
              data-qa="editors_note_details"
            >
              <Heading sx={styles.editorHeaderText}>
                {formatMessage({
                  id: `pdp.product.editorNotes${subBrandSuffix}.title`,
                  defaultMessage: "Editor's Notes",
                })}
              </Heading>
              <Box flex="50%">
                <Text>
                  <HtmlContent
                    className={editorReadMore ? 'editor-notes' : ''}
                    sx={styles.editorDescriptions}
                    content={editorNotes}
                  />
                </Text>
                {editorNotes.length > 75 && (
                  <Heading
                    sx={styles.editorReadMoreButton}
                    size="3"
                    cursor="pointer"
                    width="fit-content"
                    onClick={onEditorReadMoreClick}
                  >
                    {editorReadMore
                      ? formatMessage({
                          id: 'pdp.product.adaptiveReadMoreRatingReview',
                          defaultMessage: 'Read more...',
                        })
                      : formatMessage({
                          id: 'pdp.product.readLessRatingReview',
                          defaultMessage: 'Read Less',
                        })}
                  </Heading>
                )}
              </Box>
            </Box>
          )}
          {sustainabilityIconsData?.length > 0 && (
            <SustainabilityExperienceContainer
              sustainabilityIconsData={sustainabilityIconsData}
              isMobile={isMobile}
              productData={productData}
            />
          )}
          {!isEmpty(productCare) && productCareEnabled && (
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
        </Text>
      </Box>
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
  content: PropTypes.string,
  content2: PropTypes.string,
  productCare: PropTypes.object,
  id: PropTypes.string,
  productData: PropTypes.object,
  variantData: PropTypes.object,
  isCustomized: PropTypes.bool,
  skuId: PropTypes.string,
  isVisible: PropTypes.bool,
  tangibleeData: PropTypes.object,
  sustainabilityIconsData: PropTypes.array,
}

ProductDetailsItem.defaultProps = {
  content: '',
  content2: '',
  id: '',
  productData: {},
  variantData: {},
  isCustomized: false,
  skuId: '',
  isVisible: false,
  tangibleeData: {},
  sustainabilityIconsData: [],
}

export default memo(ProductDetailsItem)
