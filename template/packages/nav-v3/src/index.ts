/**
 * Nav V3 handoff — public re-exports from prototype src.
 * Import paths are relative to packages/nav-v3/src/
 */

export { InvokedMenuShell } from '../../../src/components/nav/invoked/InvokedMenuShell'
export { NavV3ImageCollage } from '../../../src/components/nav/v3/NavV3ImageCollage'
export { DrillOverlay } from '../../../src/components/nav/drill/DrillOverlay'
export { useDrillBack } from '../../../src/components/nav/drill/useDrillBack'
export { DrillLinkSections } from '../../../src/components/nav/drill/DrillLinkSections'
export { DrillSubCategorySections } from '../../../src/components/nav/drill/DrillSubCategorySections'
export {
  NavEnterGroup,
  NavEnterItem,
  getNavLinkEnterPreset,
  NAV_LINK_ENTER_L1_DELAY,
  NAV_LINK_ENTER_DRILL_DELAY,
  NAV_CONTENT_SPOTS_L1_ENTER,
  NAV_CONTENT_SPOTS_DRILL_ENTER,
  NAV_CONTENT_SPOTS_DRILL_EXIT,
} from '../../../src/components/nav/v3/NavEnter'
export type { NavAnimDirection, NavLinkDepth, NavLinkPhase } from '../../../src/components/nav/v3/NavEnter'
export { CoachIconMask } from '../../../src/components/CoachIconMask'
export { NavScrim } from '../../../src/components/nav/NavScrim'
export { NAV_DRILL_MS, NAV_DRAWER_MS, NAV_DRAWER_CONTENT_DELAY_MS } from '../../../src/components/nav/navDrillMotion'
export type { DrillStackEntry } from '../../../src/components/nav/navDrillMotion'

export type {
  MenuCategory,
  MenuCategoryDetail,
  MenuLinkSection,
  MenuSubCategory,
  MenuSubCategorySection,
} from '../../../src/data/mobileMenuData'
export {
  resolveNavDrillL2Body,
  resolveSubCategorySections,
  NAV_DRILL_SECTION_GAP_PX,
  NAV_DRILL_LINK_GAP_PX,
} from '../../../src/data/navDrillSections'
export type { NavDrillL2Body } from '../../../src/data/navDrillSections'
export {
  shouldShowSectionEyebrow,
  shouldShowDrillLeadingEyebrow,
} from '../../../src/data/navEyebrowVisibility'
export {
  getV3L1ContentSpots,
  getV3L2ContentSpots,
  getV3L2LinkLabel,
  V3_L1_CONTENT_SPOTS_LAYOUTS,
  V3_L2_CONTENT_SPOTS_LAYOUTS,
} from '../../../src/data/v3ContentSpots'
export type {
  V3L1ContentSpotsConfig,
  V3L2ContentSpotsConfig,
  V3L1ContentSpotsLayout,
  V3L2ContentSpotsLayout,
  V3L2ContentSpotAspectRatio,
} from '../../../src/data/v3ContentSpots'
export { getV3L1Categories } from '../../../src/data/v3L1Categories'
export { shouldDrillNavLink, shouldShowNavLinkChevron, isViewAllNavLink } from '../../../src/utils/navLinkChevron'
export { formatDrillTitle } from '../../../src/utils/navDrillTitle'
export { toNavHeadlineCase } from '../../../src/utils/toNavHeadlineCase'
