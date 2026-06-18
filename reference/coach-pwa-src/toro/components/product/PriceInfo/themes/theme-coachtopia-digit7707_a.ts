export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-bold)',
        fontWeight: 800,
      },
    }),
    SalePriceRedText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-s'],
        fontFamily: 'var(--font-face1-bold)',
        fontWeight: 800,
        color: 'var(--color-error-primary)',
      },
    }),
  }),
  variants: {
    plpV3Pricing: ({ theme }) => ({
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-20)',
          fontWeight: 700,
          color: 'var(--color-black-base)',
        },
      }),
      SalePriceRedText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-20)',
          fontWeight: 700,
          color: 'var(--color-black-base)',
        },
      }),
    }),
  },
}
