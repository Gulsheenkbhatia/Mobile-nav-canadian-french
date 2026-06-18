import Badges from 'toro/components/badges/Badges'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { useAtomValue } from 'jotai/utils'
import { productDataForMarketingBadgesAtom, productCarouselActiveIndexAtom } from 'store/pdp.atom'
import Box from 'toro/components/Box'
import useIsKS from 'toro/helpers/isKS'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { BadgeVariant } from 'toro/components/badges/Badge'

const OnImageBadge = (): JSX.Element | null => {
  const productDataForMarketingBadges = useAtomValue(productDataForMarketingBadgesAtom)
  const productCarouselActiveIndex = useAtomValue(productCarouselActiveIndexAtom)
  const isKateSpade = useIsKS()
  const headerHeight = useHeaderHeight()
  const topPosition = isKateSpade ? `${headerHeight}px` : `unset`
  const isBentoCarouselEnabled = useExperiment(EXPERIMENTS.BENTO_BOX_PDP_CAROUSEL)

  if (productCarouselActiveIndex !== 0) {
    return null
  }

  return (
    <Box className="pdpv6-on-image-badge" position="relative" top={topPosition}>
      <Badges
        area={BadgeArea.ON_IMAGE_PDP}
        page="pdp"
        variant={
          isBentoCarouselEnabled
            ? BadgeVariant.BentoCarouselBadge
            : BadgeVariant.MarketingContentPdpV6
        }
        maxDisplayedBadges={1}
        {...productDataForMarketingBadges}
      />
    </Box>
  )
}

export default OnImageBadge
