import dynamic from 'next/dynamic'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'

const CouponTrackerWithFeatureFlag = withFeatureFlag(
  dynamic(() => import('toro/components/CouponTracker/CouponTracker'), { ssr: false }),
  { ToggleSiteFeatures: ['enableAutoSMSPromo'] }
)

export default CouponTrackerWithFeatureFlag
