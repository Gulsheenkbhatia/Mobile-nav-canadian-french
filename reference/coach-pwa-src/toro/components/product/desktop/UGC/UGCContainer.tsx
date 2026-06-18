import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import { parseProductId } from 'toro/helpers/productVariations'
import useUGCPreferenceByPageType from 'toro/components/UGC/useUGCPreferenceByPageType'
import usePreference from 'toro/hooks/usePreference_new'
import UGCSkeleton from 'toro/components/product/desktop/UGC/UGCSkeleton'
import UGCSlider from 'toro/components/product/desktop/UGC/UGCSlider'
import HtmlContent from 'toro/components/HtmlContent'
import { isPdpV7UgcAnchorNavVisibleAtom } from 'store/pdp.atom'

const UGCContainer = ({ topContent, ugcPreferences }) => {
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('UGC')
  const { isEnable, loading, showImages, UGCItemCount } = ugcPreferences
  const setPdpV7UgcAnchorNavVisible = useUpdateAtom(isPdpV7UgcAnchorNavVisibleAtom)

  useEffect(() => {
    const hasRenderableUgc = isEnable && !loading && !!UGCItemCount && (showImages?.length ?? 0) > 0
    setPdpV7UgcAnchorNavVisible(hasRenderableUgc)
    return () => setPdpV7UgcAnchorNavVisible(false)
  }, [isEnable, loading, UGCItemCount, showImages, setPdpV7UgcAnchorNavVisible])

  useEffect(() => {
    if (isEnable && UGCItemCount)
      analytics.send('UGCUgcInteraction', {
        eventLocation: 'content tile',
        eventAction: 'ugc container impression',
        eventLabel: 'none',
      })
  }, [isEnable, UGCItemCount])

  if (loading) {
    return <UGCSkeleton />
  }
  if (!UGCItemCount || showImages?.length === 0) {
    return null
  }

  return (
    <Box sx={styles.UGCContainerRoot}>
      {topContent && (
        <Box sx={styles.topContent}>
          <HtmlContent content={topContent} />
        </Box>
      )}
      <UGCSlider showImages={showImages} styles={styles} />
    </Box>
  )
}

const UGCLazyContainer = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  })

  const [topContent, emplifiVPC, rawModelID, rawMasterId, rawMasterId2] = useProductData([
    'wyngContent',
    'custom.c_emplifiVPC',
    'custom.c_model',
    'masterId',
    'master.ID',
  ])
  const {
    wyng: { wyngExternalIDType = 'masterId' },
  } = usePreference({
    wyng: ['wyngExternalIDType'],
  })

  const { masterId } = parseProductId(rawMasterId || rawMasterId2)
  const modelId = rawModelID || masterId
  const ids = { masterId, modelId }

  const UGCPreferences = useUGCPreferenceByPageType({
    enabled: inView,
    pageType: 'pdp',
    externalId: ids[wyngExternalIDType],
    emplifiVPC,
  })

  return (
    UGCPreferences.isEnable && (
      <Box ref={ref} id="social-section">
        <UGCContainer topContent={topContent} ugcPreferences={UGCPreferences} />
      </Box>
    )
  )
}

export default withErrorBoundaryWrapper(UGCLazyContainer)
