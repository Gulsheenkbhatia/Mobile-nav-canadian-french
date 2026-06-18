export default {
  baseStyle: ({ theme }) => ({
    tileStrikeoffPrice: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: '#6D6D6D', // missing in design tokens,
      },
      color: '#6D6D6D',
    },
    tileComparablePriceWrapper: {
      '& p': {
        color: '#6D6D6D',
      },
    },
  }),
}
