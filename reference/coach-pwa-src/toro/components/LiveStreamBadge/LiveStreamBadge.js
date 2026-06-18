import React, { useMemo } from 'react'
import Badge from 'toro/components/Badge'
import Link from 'toro/components/Link'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'

const LiveStreamBadge = ({ config, styleVariant = '' }) => {
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('LiveStreamBadgeTheme', { variant: styleVariant })
  const data = useMemo(() => {
    const { Live, Recorded } = config || {}
    if (Live?.enabled) return { ...Live, isLive: true }
    if (Recorded?.enabled) return Recorded

    return null
  }, [config])

  const liveStreamingUrl = config?.content?.other_info?.liveStreamingUrl

  const onLinkClick = () => {
    analytics.send('navClick', {
      eventLocation: 'utility',
      text: `${data.itemText?.toLowerCase()} events`,
    })
  }
  if (!data || !liveStreamingUrl) return null

  return (
    <Link sx={styles.root} href={liveStreamingUrl} onClick={onLinkClick}>
      <Badge
        sx={{
          ...styles.badge,
          ...(data.isLive ? styles.liveEvent : styles.recordedEvent),
        }}
      >
        {data.itemText}
      </Badge>
      <span style={styles.eventsText}>Events</span>
    </Link>
  )
}

export default LiveStreamBadge
