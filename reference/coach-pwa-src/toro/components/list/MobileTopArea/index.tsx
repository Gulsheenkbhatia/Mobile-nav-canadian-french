import React, { memo, RefObject } from 'react'
import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import CustomSlot from 'toro/cms/components/CustomSlot'
import CategoryTopContentSlot from 'toro/components/list/CategoryTopContentSlot'
import { RVPLPPositions } from 'toro/constants/adaptiveExperience'
import { isSubBrandActiveAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RVAndBecauseYouViewedContainer from 'toro/components/list/RVAndBecauseYouViewedContainer'

type MobileTopAreaProps = {
  children?: React.ReactNode
  topContentSlot?: Record<string, unknown>
  showTopBanner?: boolean
  onCmsClick?: React.MouseEventHandler<HTMLElement>
  rvCarouselNodeSetter?: (node: { getHeight: () => number } | null) => void
  quickViewedProduct?: unknown | null
  topBannerNode?: RefObject<HTMLDivElement>
}

const MobileTopArea = ({
  children,
  topContentSlot,
  showTopBanner,
  onCmsClick,
  rvCarouselNodeSetter,
  quickViewedProduct,
  topBannerNode,
}: MobileTopAreaProps): JSX.Element => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const {
    toggleSiteFeatures: { recentlyViewConfiguration },
  } = usePreference({
    ToggleSiteFeatures: ['recentlyViewConfiguration'],
  })

  const rvPLPPosition: string = get(
    recentlyViewConfiguration,
    isSubBrandActive ? 'subBrand.plp.position' : 'brand.plp.position',
    ''
  ).toLowerCase()

  const contentSlotComponentForMobile = showTopBanner && (
    <Box ref={topBannerNode} onClick={onCmsClick}>
      <CustomSlot
        content={topContentSlot}
        Component={CategoryTopContentSlot}
        ignoreHidden={true}
        quickViewOpened={!!quickViewedProduct}
      />
    </Box>
  )

  switch (rvPLPPosition) {
    case RVPLPPositions.RV_ABOVE_CONTENT_SLOT:
      return (
        <>
          <RVAndBecauseYouViewedContainer ref={rvCarouselNodeSetter} />
          {contentSlotComponentForMobile}
          {children}
        </>
      )
    case RVPLPPositions.RV_BELOW_CONTENT_SLOT:
      return (
        <>
          {showTopBanner && contentSlotComponentForMobile}
          <RVAndBecauseYouViewedContainer ref={rvCarouselNodeSetter} />
          {children}
        </>
      )
    case RVPLPPositions.RV_REPLACE_CONTENT_SLOT:
      return (
        <>
          <RVAndBecauseYouViewedContainer ref={rvCarouselNodeSetter} />
          {children}
        </>
      )
    case RVPLPPositions.CONTENT_SLOT_REPLACE_RV:
    default:
      return (
        <>
          {showTopBanner && contentSlotComponentForMobile}
          {!showTopBanner && <RVAndBecauseYouViewedContainer ref={rvCarouselNodeSetter} />}
          {children}
        </>
      )
  }
}

export default withErrorBoundaryWrapper(memo(MobileTopArea))
