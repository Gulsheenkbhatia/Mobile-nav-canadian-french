export default {
  parts: ['stickyPrice', 'stickyPriceWrapper', 'stickyAddToBagWrapper'],
  baseStyle: ({ theme }) => ({
    stickyPrice: {
      alignItems: 'center',
      '& > div:last-child': {
        marginLeft: 'auto',
      },
    },
    stickyPriceWrapper: {
      flexWrap: 'nowrap',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexWrap: 'wrap',
      },
    },
    stickyAddToBagWrapper: {
      flexBasis: '100%',
    },
  }),
}
