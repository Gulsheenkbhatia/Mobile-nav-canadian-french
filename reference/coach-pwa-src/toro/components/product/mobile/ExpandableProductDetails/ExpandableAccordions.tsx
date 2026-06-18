import { type ReactNode, useMemo } from 'react'
import Accordion from 'toro/components/Accordion'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionPanel from 'toro/components/AccordionPanel'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import HtmlContent from 'toro/components/HtmlContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import { isMegaPDPEligibleAtom, isNewMegaPDPEligibleAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useProductData from 'toro/hooks/useProductData'
import { useIntl } from 'react-intl'
import ProductCardTable from 'toro/components/product/desktop/ProductCardTable'
import { useExpandableAccordionLogic } from 'toro/hooks/useExpandableAccordionLogic'
import useStructuredCopy from 'toro/hooks/useStructuredCopy'

interface ExpandableAccordionItemProps {
  id: string
  title: string
  children: ReactNode
  onAccordionClick?: (isExpanded: boolean, title: string) => void
}

export const ExpandableAccordionItem = ({
  id,
  title,
  children,
  onAccordionClick,
}: ExpandableAccordionItemProps) => {
  const { shouldShowCollapsible } = useExpandableAccordionLogic()
  const styles = useMultiStyleConfig('ExpandableProductDetails', {
    variant: shouldShowCollapsible ? 'collapsible' : '',
  })
  const { AccordionIconExpanded, AccordionIcon, PlusIcon, MinusIcon } = useMultiStyleConfig('Icons')

  const ExpandedIcon = shouldShowCollapsible ? MinusIcon : AccordionIconExpanded
  const CollapsedIcon = shouldShowCollapsible ? PlusIcon : AccordionIcon

  return (
    <AccordionItem w="100%" border="none" key={id} sx={styles.accordionItem}>
      {({ isExpanded }: { isExpanded: boolean }) => (
        <>
          <AccordionButton
            sx={styles.accordionButton}
            justifyContent="space-between"
            data-qa={`m_pdp_${id}_accordion`}
            onClick={() => onAccordionClick?.(isExpanded, title)}
          >
            <Text size="sm" variant="body-primary" sx={styles.accordionButtonText}>
              {title}
            </Text>
            {isExpanded ? (
              <ExpandedIcon style={styles.accordionIcon} />
            ) : (
              <CollapsedIcon style={styles.accordionIcon} />
            )}
          </AccordionButton>
          <AccordionPanel pb={4} px={0} sx={styles.accordionPanel}>
            {children}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

export const ExpandableProductDetailsAccordion = () => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const [content, editorNotes, productId] = useProductData([
    'custom.c_longDescription2',
    'custom.c_editorsNoteDescription',
    'id',
  ])
  const { hasStructuredCopy } = useStructuredCopy()
  const title = formatMessage({
    id: 'pdp.product.productDetail.title',
    defaultMessage: 'Product Details',
  })

  const onAccordionButtonClick = (isExpanded) => {
    if (!isExpanded) {
      analytics?.send('productInteraction', {
        eventAction: `${title?.toLowerCase()} click`,
        eventLabel: productId,
      })
    }
  }

  if (!content && !editorNotes && !hasStructuredCopy) {
    return null
  }

  return (
    <ExpandableAccordionItem
      id="product_details"
      title={title}
      onAccordionClick={onAccordionButtonClick}
    >
      <ProductCardTable />
    </ExpandableAccordionItem>
  )
}

export const ExpandableProductDynamicAccordion = ({
  accordionIndex,
}: {
  accordionIndex: number
}) => {
  const accordionItems = useProductData('pdpAccordionItems') || []
  const analytics = useAnalytics()
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const [productId] = useProductData(['id'])

  const onContentAccordionButtonClick = (isExpanded, title) => {
    if (!isExpanded) {
      analytics?.send('productInteraction', {
        eventAction: `content accordion click: ${title?.toLowerCase()}`,
        eventLocation: isMegaPDPEligible || isNewMegaPDPEligible ? 'mega product' : 'product',
        eventLabel: productId,
      })
    }
  }

  const accordionData = accordionItems[accordionIndex]

  if (!accordionData) {
    return null
  }

  return (
    <ExpandableAccordionItem
      id={accordionData.id}
      title={accordionData.title}
      onAccordionClick={onContentAccordionButtonClick}
    >
      <HtmlContent content={accordionData.content} lazyLoadVideos lazyLoadImages />
    </ExpandableAccordionItem>
  )
}

export const ProductAccordions = ({ children }: { children: ReactNode }) => {
  const [pdpOpenedAccordions] = useProductData(['pdpOpenedAccordions'])
  const { shouldShowCollapsible, hasFeaturedContent } = useExpandableAccordionLogic()
  const styles = useMultiStyleConfig('ExpandableProductDetails', {
    variant: shouldShowCollapsible ? 'collapsible' : '',
  })

  const defaultIndex = useMemo(() => {
    if (shouldShowCollapsible) {
      return hasFeaturedContent ? [0] : []
    }
    return pdpOpenedAccordions
  }, [shouldShowCollapsible, hasFeaturedContent, pdpOpenedAccordions])

  return (
    <Accordion w="100%" allowMultiple defaultIndex={defaultIndex} sx={styles.accordionsWrapper}>
      {children}
    </Accordion>
  )
}
