import React, { useEffect, useState } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import LowerPDPSection from 'toro/components/product/mobile/ProductDetails/LowerPDPSection'
import { SocialRecommendations } from 'toro/components/product/mobile/SocialRecommendations'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { setShowFullProductInfoPdpAtom, showFullProductInfoPdpAtom } from 'store/product-info.atom'
import { useSearchParams } from 'next/navigation'
import Button from 'toro/components/Button'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'

const SocialLanderSection: React.FC = () => {
  const searchParams = useSearchParams()
  const [utmMedium, setUtmMedium] = useState(searchParams.get('utm_medium'))
  const {
    toggleSiteFeatures: { utmMedium: utmMediumPreference },
  } = usePreference({
    ToggleSiteFeatures: ['utmMedium'],
  })
  const utmMediumPDP = get(utmMediumPreference, 'pdp.value', 'paid_soc')
  const showSocialLander = utmMedium === utmMediumPDP
  const productId = useProductData('id')

  const isExpanded = useAtomValue(showFullProductInfoPdpAtom)
  const setIsExpanded = useUpdateAtom(setShowFullProductInfoPdpAtom)

  const analytics = useAnalytics()

  const handleExpand = () => {
    setIsExpanded(true)
    window.history.pushState({ pdpExpanded: true }, '')

    analytics.send('productInteraction', {
      event: 'product_interaction',
      eventAction: formatMessage({
        id: 'pdp.viewFullDetailsCTA.titleClick',
        defaultMessage: 'view full product details click',
      }),
      eventLabel: productId,
    })
  }
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('TemplateContainer')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const updatedUtmMedium = searchParams?.get('utm_medium')
    if (utmMedium !== updatedUtmMedium) {
      setUtmMedium(updatedUtmMedium)
    }
  }, [])

  useEffect(() => {
    const handlePopState = (event) => {
      if (!event.state?.pdpExpanded) {
        setIsExpanded(false)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setIsExpanded])

  return showSocialLander && !isExpanded ? (
    <Box textAlign="center" mb="var(--spacing-3)">
      <Button
        backgroundColor="transparent"
        onClick={handleExpand}
        data-qa="m_pdp_view_full_product_details_cta"
      >
        <Text size="sm" variant="secondary" sx={styles.viewFullProductDetails}>
          {formatMessage({
            id: 'pdp.viewFullDetailsCTA.title',
            defaultMessage: 'View Full Product Details',
          })}
        </Text>
      </Button>
      <SocialRecommendations />
    </Box>
  ) : (
    <LowerPDPSection />
  )
}

export default SocialLanderSection
