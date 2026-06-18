import { NAVIGATION_VARIANTS } from 'toro/components/header/MobileNavigation'

export default {
  parts: [
    'imageBox',
    'navigationItem',
    'callOutDataBox',
    'accordionItemBox',
    'accordionButtonBox',
    'accordionPanelBox',
    'accordionSVG',
  ],
  baseStyle: () => ({
    variants: {
      [NAVIGATION_VARIANTS.TIER_2]: {
        navigationItem: {
          textTransform: 'none',
        },
      },
      [NAVIGATION_VARIANTS.TIER_3]: {
        navigationItem: {
          textTransform: 'none',
        },
      },
    },
  }),
}
