import { useMemo, useRef } from 'react'
import PrestyledAccordion from 'toro/components/PrestyledAccordion'
import HtmlContent from 'toro/components/HtmlContent'
import { useIntl } from 'react-intl'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import Lazy from 'toro/components/Lazy'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import type { DetailedProduct } from 'toro/types/productTypes'

const FAQComponent = () => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const faqItemsWithContent = useProductData('faqData') as DetailedProduct['faqData']

  const {
    toggleSiteFeatures: { enableFaqAccordions = false },
  } = usePreferenceNew({
    ToggleSiteFeatures: ['enableFaqAccordions'],
  })

  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
  const variant = isPDPv6 ? 'pdpv6' : isPDPv5_1 ? 'pdpv5_1' : undefined
  const previousItemsRef = useRef<number[]>([])

  const accordionTitle = formatMessage({
    id: 'pdp.product.customerFaq.title',
    defaultMessage: 'Customer FAQs',
  })

  const accordionItems = useMemo(
    () =>
      faqItemsWithContent?.map((item) => ({
        title: item?.title,
        content: <HtmlContent content={item?.html} lazyLoadVideos lazyLoadImages />,
      })),
    [faqItemsWithContent]
  )

  function handleAccordionChange(currentItems: number[]) {
    const newItemIndex = currentItems.find((item) => !previousItemsRef.current.includes(item))
    previousItemsRef.current = currentItems
    if (newItemIndex === undefined) {
      return
    }
    const newItem = faqItemsWithContent[newItemIndex]
    const eventLabel = `${accordionTitle.toLowerCase()}:${newItem.title.toLowerCase()}`
    analytics.send('productInteraction', {
      eventAction: 'faq module click',
      eventLabel,
      eventLocation: 'product',
    })
  }

  function handleOnVisible(visible: boolean) {
    if (visible) {
      analytics.send('productInteraction', {
        eventAction: 'faq module impression',
        eventLabel: accordionTitle.toLowerCase(),
        eventLocation: 'product',
      })
    }
  }

  if (!enableFaqAccordions || !faqItemsWithContent || faqItemsWithContent.length === 0) {
    return null
  }

  return (
    <Lazy onVisible={handleOnVisible}>
      {accordionItems.length > 0 && (
        <PrestyledAccordion
          accordionTitle={accordionTitle}
          accordionItems={accordionItems}
          variant={variant}
          allowToggle
          allowMultiple
          onChange={handleAccordionChange}
        />
      )}
    </Lazy>
  )
}

export default FAQComponent
