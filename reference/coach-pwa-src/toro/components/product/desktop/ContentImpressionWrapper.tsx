import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { useCallback, useEffect, useState } from 'react'

const ContentImpressionWrapper = ({
  eventAction,
  children,
  sensorDelay = 0,
  onLoad,
  ...sensorProps
}) => {
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const [enabled, setEnabled] = useState(!sensorDelay)

  const onTileVisible = useCallback(() => {
    analytics.send('productInteraction', {
      eventAction,
      eventLabel: selectedVariantId,
      eventLocation: 'product',
    })
  }, [selectedVariantId])

  useEffect(() => {
    if (!enabled) {
      const timeout = setTimeout(() => {
        setEnabled(true)
        onLoad?.()
      }, sensorDelay)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [sensorDelay])

  if (!enabled) {
    return children
  }

  return (
    <ImpressionSensor
      onVisible={onTileVisible}
      threshold={0.5}
      rootMargin={'0px'}
      payload={undefined}
      {...sensorProps}
    >
      {children}
    </ImpressionSensor>
  )
}

export default ContentImpressionWrapper
