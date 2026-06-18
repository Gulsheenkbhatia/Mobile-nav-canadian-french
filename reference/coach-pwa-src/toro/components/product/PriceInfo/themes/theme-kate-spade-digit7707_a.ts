export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-20)',
        fontFamily: 'var(--font-face1-medium)',
      },
    }),
    SalePriceRedText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-20)',
        fontFamily: 'var(--font-face1-medium)',
      },
    }),
  }),
}
