import { type FC, memo, useCallback, useRef, useMemo, Suspense } from 'react'
import { setAccessorizeItNodeAtom } from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { accessorizeItProductsDataAtom, setAccessorizeItInViewAtom } from 'store/accessorizeIt.atom'
import { useAccessorizedImageUrl } from 'toro/components/product/AccessorizeIt/hooks'
import { useInView } from 'react-intersection-observer'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import DesktopTemplate from 'toro/components/product/AccessorizeIt/DesktopTemplate'
import MobileTemplate from 'toro/components/product/AccessorizeIt/MobileTemplate'
import AccessorizeItSkeleton from 'toro/components/product/AccessorizeIt/AccessorizeItSkeleton'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useViewportType from 'toro/hooks/useViewportType'

const AccessorizeIt: FC = () => {
  const setAccessorizeItNode = useUpdateAtom(setAccessorizeItNodeAtom)
  const setAccessorizeItInView = useUpdateAtom(setAccessorizeItInViewAtom)
  const accessorizeItProductsData = useAtomValue(accessorizeItProductsDataAtom)
  const analytics = useAnalytics()
  const variantId = useSelectedVariantData('id')
  const isPdpV6 = useTemplate([TemplateName.pdpv6])
  const isPdpV5_1 = useTemplate([TemplateName.pdpv5_1])
  const hasTrackedImpression = useRef(false)
  const imageUrl = useAccessorizedImageUrl()
  const isAccessorizeItDesktopEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT_DESKTOP)
  const isAccessorizeItMobileEnabled = useExperiment(EXPERIMENTS.ACCESSORIZE_IT)
  const { isMobile } = useViewportType()

  const { ref: inViewRef } = useInView({
    triggerOnce: false,
    onChange: (inView) => {
      setAccessorizeItInView(inView)
      if (inView && !hasTrackedImpression.current) {
        hasTrackedImpression.current = true
        analytics.send('productInteraction', {
          eventAction: `accessorize it module impression`,
          eventLabel: variantId,
          eventLocationForced: 'product',
        })
      }
    },
  })

  const accessorizeItRef = useCallback(
    (node) => {
      inViewRef(node)
      node && setAccessorizeItNode(node)
    },
    [inViewRef, setAccessorizeItNode]
  )

  const isDataEmpty = useMemo(() => {
    return !accessorizeItProductsData?.charms?.length && !accessorizeItProductsData?.straps?.length
  }, [accessorizeItProductsData])

  if (isDataEmpty) {
    return null
  }

  if (isAccessorizeItDesktopEnabled && isPdpV5_1) {
    return <DesktopTemplate accessorizeItRef={accessorizeItRef} imageUrl={imageUrl} />
  }

  if (isMobile && isAccessorizeItMobileEnabled) {
    return (
      <MobileTemplate accessorizeItRef={accessorizeItRef} imageUrl={imageUrl} isPdpV6={isPdpV6} />
    )
  }

  return null
}

const MemoizedAccessorizeIt = memo(AccessorizeIt)

const AccessorizeItWithSuspense: FC = () => {
  return (
    <Suspense fallback={<AccessorizeItSkeleton />}>
      <MemoizedAccessorizeIt />
    </Suspense>
  )
}

export default AccessorizeItWithSuspense
