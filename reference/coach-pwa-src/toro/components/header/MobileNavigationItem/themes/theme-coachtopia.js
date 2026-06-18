import { NAVIGATION_VARIANTS } from 'toro/components/header/MobileNavigation'

export default {
  baseStyle: ({ theme }) => ({
    variants: {
      [NAVIGATION_VARIANTS.TIER_1]: {
        navigationItem: {
          ...theme.typography['text-cta2-m'],
        },
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
