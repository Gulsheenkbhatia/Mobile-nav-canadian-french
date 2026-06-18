import { type FC, useMemo } from 'react'
import { type MessageDescriptor, useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import { Accordion, AccordionItem, AccordionButton, AccordionPanel } from '@chakra-ui/react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductCardTable from 'toro/components/product/desktop/ProductCardTable'
import useProductData from 'toro/hooks/useProductData'
import HtmlContent from 'toro/components/HtmlContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import { isMegaPDPEligibleAtom, isNewMegaPDPEligibleAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useStructuredCopy from 'toro/hooks/useStructuredCopy'

const PRODUCT_DETAILS_TITLE: MessageDescriptor = {
  id: 'pdp.product.productDetail.title',
  defaultMessage: 'Product Details',
}

// Simple component for accordion content rendering
const AccordionContentSlot: FC<{ html: string }> = ({ html, ...props }) => {
  return <HtmlContent content={html} lazyLoadVideos lazyLoadImages {...props} />
}

type ExpandableProductDetailsProps = {
  variant?: string
  hideAccordionItems?: boolean
  accordionTitle?: MessageDescriptor
}

const ExpandableProductDetails: FC<ExpandableProductDetailsProps> = ({
  variant,
  hideAccordionItems = false,
  accordionTitle,
}) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('ExpandableProductDetails', { variant })
  const { AccordionIcon, AccordionIconExpanded } = useMultiStyleConfig('Icons')
  const analytics = useAnalytics()
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const [content, editorNotes, productId] = useProductData([
    'custom.c_longDescription2',
    'custom.c_editorsNoteDescription',
    'id',
  ])
  const productDetailsTitle = accordionTitle ?? PRODUCT_DETAILS_TITLE
  const { hasStructuredCopy } = useStructuredCopy()
  const hasProductDetailsContent = Boolean(content || editorNotes || hasStructuredCopy)

  // Accordion items are now processed server-side to avoid client-side computation
  const accordionItems = useProductData('pdpAccordionItems') || []
  const showPdpAccordionItems = !hideAccordionItems && accordionItems.length > 0

  // Memoize default open indexes calculation to prevent unnecessary re-renders
  const defaultOpenIndexes = useMemo(() => {
    const indexes: number[] = []
    let currentIndex = 0

    // Check if product details accordion should be open (always first if it exists)
    if (hasProductDetailsContent) {
      currentIndex++
    }

    if (!showPdpAccordionItems) {
      return indexes
    }

    // Check which dynamic accordions should be open on load
    accordionItems.forEach((item) => {
      if (item.openOnLoad) {
        indexes.push(currentIndex)
      }
      currentIndex++
    })

    return indexes
  }, [hasProductDetailsContent, accordionItems, showPdpAccordionItems])

  const accordionButtonLabel = useMemo(
    () => formatMessage(productDetailsTitle),
    [formatMessage, productDetailsTitle]
  )

  const onAccordionButtonClick = (isExpanded) => {
    if (!isExpanded) {
      analytics?.send('productInteraction', {
        eventAction: `${accordionButtonLabel?.toLowerCase()} click`,
        eventLabel: productId,
      })
    }
  }

  const onContentAccordionButtonClick = (isExpanded, title) => {
    if (!isExpanded) {
      analytics?.send('productInteraction', {
        eventAction: `content accordion click: ${title?.toLowerCase()}`,
        eventLocation: isMegaPDPEligible || isNewMegaPDPEligible ? 'mega product' : 'product',
        eventLabel: productId,
      })
    }
  }

  if (!hasProductDetailsContent && !showPdpAccordionItems) {
    return null
  }

  return (
    <Accordion
      w="100%"
      allowMultiple
      defaultIndex={defaultOpenIndexes}
      sx={styles.accordionsWrapper}
    >
      {/* Default Product Details Accordion */}
      {hasProductDetailsContent && (
        <AccordionItem w="100%" border="none">
          {({ isExpanded }: { isExpanded: boolean }) => (
            <>
              <AccordionButton
                sx={styles.accordionButton}
                justifyContent="space-between"
                data-qa="m_pdp_product_details_accordion"
                onClick={() => onAccordionButtonClick(isExpanded)}
              >
                <Text size="sm" variant="body-primary" sx={styles.accordionButtonText}>
                  {accordionButtonLabel}
                </Text>
                {isExpanded ? (
                  <AccordionIconExpanded style={styles.accordionIcon} />
                ) : (
                  <AccordionIcon style={styles.accordionIcon} />
                )}
              </AccordionButton>
              <AccordionPanel pb={4} px={0} sx={styles.accordionPanel}>
                <ProductCardTable variant={variant} />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      )}

      {showPdpAccordionItems &&
        accordionItems.map((item) => (
          <AccordionItem key={item.id} w="100%" border="none">
            {({ isExpanded }: { isExpanded: boolean }) => (
              <>
                <AccordionButton
                  sx={styles.accordionButton}
                  justifyContent="space-between"
                  data-qa={`m_pdp_${item.id}_accordion`}
                  onClick={() => onContentAccordionButtonClick(isExpanded, item.title)}
                >
                  <Text size="sm" variant="body-primary" sx={styles.accordionButtonText}>
                    {item.title}
                  </Text>
                  {isExpanded ? (
                    <AccordionIconExpanded style={styles.accordionIcon} />
                  ) : (
                    <AccordionIcon style={styles.accordionIcon} />
                  )}
                </AccordionButton>
                <AccordionPanel pb={4} px={0} sx={styles.accordionPanel}>
                  <AccordionContentSlot html={item.content} />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
    </Accordion>
  )
}

export default ExpandableProductDetails
