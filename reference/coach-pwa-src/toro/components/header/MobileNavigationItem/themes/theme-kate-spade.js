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
  baseStyle: ({ theme }) => ({
    styles: {
      accordionSVG: {
        svg: {
          mr: 'var(--spacing-1)',
        },
      },
    },
    variants: {
      [NAVIGATION_VARIANTS.TIER_1]: {
        navigationItem: {
          ...theme.typography['text-cta1-m'],
        },
        py: '20px',
      },
      [NAVIGATION_VARIANTS.TIER_2]: {
        navigationItem: {
          ...theme.typography['text-body2-m'],
        },
      },
      [NAVIGATION_VARIANTS.TIER_3]: {
        navigationItem: {
          ...theme.typography['text-body2-s'],
        },
      },
    },
  }),
}
