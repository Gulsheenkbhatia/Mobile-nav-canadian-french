export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-20)',
      },
    }),
    SalePriceRedText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-20)',
      },
    }),
  }),
  variants: {
    plpV3Pricing: ({ theme }) => ({
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
        },
      }),
      SalePriceRedText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
        },
      }),
    }),
  },
}
