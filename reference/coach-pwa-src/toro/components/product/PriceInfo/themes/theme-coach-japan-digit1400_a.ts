export default {
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-xs'],
        },
      }),
      SalePriceRedText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-xs'],
        },
      }),
      DisPercentageText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
        },
      }),
    }),
  },
}
