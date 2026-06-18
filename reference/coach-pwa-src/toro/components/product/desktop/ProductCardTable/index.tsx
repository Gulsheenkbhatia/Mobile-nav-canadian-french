import { type FC } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { UnorderedList } from '@chakra-ui/react'
import useProductData from 'toro/hooks/useProductData'
import HtmlContent from 'toro/components/HtmlContent'
import Text from 'toro/components/Text'
import isEmpty from 'lodash/isEmpty'
import StructuredCopyContent from 'toro/components/ProductDetails/StructuredCopyContent'
import useStructuredCopy from 'toro/hooks/useStructuredCopy'
import { useAtomValue } from 'jotai/utils'
import { subBrandSuffixAtom, isSizedProductAtom } from 'store/pdp.atom'
import SizeGuideButton from 'toro/components/product/SizeGuideButton'
import { isSubBrandActiveAtom } from 'store/global.atom'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

type ProductCardTableProps = {
  variant?: string
}

const ProductCardTable: FC<ProductCardTableProps> = ({ variant }) => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const styles = useMultiStyleConfig('ProductCardTable', {
    variant: variant || (isSubBrandActive ? 'coachtopia' : null),
  })
  const isPDPv7Template = useTemplate([TemplateName.pdpv7])
  const isPDPv6Template = useTemplate([TemplateName.pdpv6])
  const subBrandSuffix = useAtomValue(subBrandSuffixAtom)
  const { formatMessage } = useIntl()
  const isSizedProduct = useAtomValue(isSizedProductAtom)
  const [productId, sizeGuideContent] = useProductData(['id', 'sizeChartID.c_body.default.markup'])
  const showSizeGuide = !isPDPv7Template && !isPDPv6Template && isSizedProduct && sizeGuideContent

  const [longDescription2, regularDescription, editorNotes] = useProductData([
    'custom.c_longDescription2',
    'longDescription',
    'custom.c_editorsNoteDescription',
  ])
  const { productDetails, hasStructuredCopy } = useStructuredCopy()
  const content = !hasStructuredCopy ? longDescription2 || regularDescription : null

  return (
    <Box sx={styles.productCardTableContentWrapper}>
      <Box sx={styles.productCardTableFadeBefore} />
      <Box sx={styles.productCardTableWrapper}>
        <UnorderedList listStyleType="none" sx={styles.productCardTable}>
          {hasStructuredCopy && (
            <StructuredCopyContent
              id="description2"
              items={productDetails}
              sx={styles.htmlContentItem}
            />
          )}
          {!hasStructuredCopy && content && (
            <HtmlContent
              id="description2"
              sx={{
                ...styles.htmlContentItem,
                ...(!longDescription2 && styles.regularDescription),
              }}
              content={content}
            />
          )}
          {!isEmpty(editorNotes) && (
            <Box sx={styles.editorNoteWrapper}>
              <Text sx={styles.editorNoteHeader} data-qa="cm_pdp_btn_edtrs_nts_card_hdr">
                {formatMessage({
                  id: `pdp.product.editorNotes${subBrandSuffix}.title`,
                  defaultMessage: "Editor's Notes",
                })}
              </Text>
              <HtmlContent sx={styles.editorNoteDescriptions} content={editorNotes} />
            </Box>
          )}
        </UnorderedList>
      </Box>
      <Box sx={styles.productCardTableFadeAfter} />
      {showSizeGuide && (
        <SizeGuideButton
          productId={productId}
          sizeGuideContent={sizeGuideContent}
          variant="pdpV5"
        />
      )}
    </Box>
  )
}

export default ProductCardTable
