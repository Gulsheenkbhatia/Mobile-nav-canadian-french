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
}
