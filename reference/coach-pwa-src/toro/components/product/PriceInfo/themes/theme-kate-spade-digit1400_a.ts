export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 500,
        lineHeight: 'var(--line-height-l)',
        color: 'var(--color-primary)',
      },
    }),
    SalePriceRedText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 500,
        lineHeight: 'var(--line-height-l)',
      },
    }),
    StandardPriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 'auto',
      },
    }),
    ListPriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: '#696969',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
      },
    }),
    DisPercentage: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 'auto',
        mx: 0,
      },
    }),
    DisPercentageText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: '#696969',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
      },
    }),
    PriceInfoBox: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 'auto',
        mr: 0,
      },
    }),
    ListPriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: '100%',
        mx: 0,
        '&.discount-percent': {
          minHeight: '100%',
        },
      },
    }),
    PriceInfoWrapper: ({ isBundleVariant }) => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        gap: '6px', // missing in the design token
        mb: isBundleVariant ? 0 : '20px',
        '&:has(~ .pdp-price-promotion-and-sale:not(:empty))': {
          mb: '5px',
        },
      },
    }),
    salePriceCaption: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 0,
        mr: 0,
      },
    }),
    StrikeThroughPriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-14)',
        color: '#696969',
        fontWeight: 400,
        lineHeight: 'var(--line-height-xl)',
      },
    }),
    BundlePriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        gap: '6px',
        alignItems: 'center',
      },
    }),
    BottomBadgesWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&:not(:empty)': {
          mb: '20px',
        },
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-medium)',
        },
      }),
    }),
  },
}
