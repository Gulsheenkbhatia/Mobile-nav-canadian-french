import {
  GONE_VIRAL_RECOMMENDER_SCHEME,
  DEALS_SCHEME,
  BECAUSE_YOU_VIEWED_RECOMMENDER_SCHEME,
} from 'toro/components/Certona/certona-schemes'
import BecauseYouViewedContainerPlp from 'toro/components/Certona/BecauseYouViewedRecommendation/plp/BecauseYouViewedContainerPlp'
import DealsContainer from 'toro/components/EnhancedRecommendation/DealsContainer'
import { XgenContainerID } from 'toro/lib/xgen/types/XgenContainer'
import GoneViralContainer from '../GoneViralRecommendation/GoneViralContainer'

const RecommendationComponents = {
  [GONE_VIRAL_RECOMMENDER_SCHEME]: GoneViralContainer,
  [BECAUSE_YOU_VIEWED_RECOMMENDER_SCHEME]: BecauseYouViewedContainerPlp,
  [DEALS_SCHEME]: DealsContainer,
  [XgenContainerID.sm_el_sitewide1]: GoneViralContainer,
}

export default RecommendationComponents
