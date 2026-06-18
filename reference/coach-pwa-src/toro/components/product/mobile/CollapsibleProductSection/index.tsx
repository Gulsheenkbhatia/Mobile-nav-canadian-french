import { type FC, ReactNode } from 'react'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import Accordion from 'toro/components/Accordion'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionPanel from 'toro/components/AccordionPanel'
import { useAtomValue } from 'jotai/utils'
import { isMegaPDPEligibleAtom, isNewMegaPDPEligibleAtom } from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'

interface CollapsibleProductSectionProps {
  children: ReactNode
}

const CollapsibleProductSection: FC<CollapsibleProductSectionProps> = ({ children }) => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const [productId] = useProductData(['id'])
  const styles = useMultiStyleConfig('CollapsibleProductSection')
  const { AccordionIcon, AccordionIconExpanded } = useMultiStyleConfig('Icons')

  const aboutProductTitle = formatMessage({
    id: 'pdp.collapsible.aboutProduct.title',
    defaultMessage: 'About this product',
  })

  const onParentAccordionClick = (isExpanded: boolean) => {
    if (!isExpanded) {
      analytics?.send('productInteraction', {
        eventLocation: isMegaPDPEligible || isNewMegaPDPEligible ? 'mega product' : 'product',
        eventAction: `accordion click: ${aboutProductTitle.toLowerCase()}`,
        eventLabel: productId,
      })
    }
  }

  return (
    <Accordion w="100%" allowToggle sx={styles.wrapper}>
      <AccordionItem w="100%" border="none" sx={styles.parentItem}>
        {({ isExpanded }: { isExpanded: boolean }) => (
          <>
            <AccordionButton
              sx={styles.parentButton}
              data-qa="m_pdp_about_product_accordion"
              onClick={() => onParentAccordionClick(isExpanded)}
            >
              <Text size="sm" variant="body-primary" sx={styles.parentButtonText}>
                {aboutProductTitle}
              </Text>
              {isExpanded ? (
                <AccordionIconExpanded style={styles.parentIcon} />
              ) : (
                <AccordionIcon style={styles.parentIcon} />
              )}
            </AccordionButton>
            <AccordionPanel sx={styles.parentPanel}>{children}</AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  )
}

export default CollapsibleProductSection
