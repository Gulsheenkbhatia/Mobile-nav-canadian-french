export default {
  parts: ['LazyRatingsAndReviews'],
  baseStyle: () => ({
    LazyRatingsAndReviews: (isDesktop) => ({
      margin: isDesktop ? '0 116px 40px' : '0 0 20px',
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      selectorWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.chakra-select__wrapper': {
            height: '56px',
          },
        },
      },
      buyNowWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& button.buy-now-button': {
            fontFamily: 'var(--font-face1-extrabold)',
            fontSize: 'var(--text-16)',
            lineHeight: 1,
            paddingTop: 'var(--spacing-4)',
            fontWeight: 800,
          },
        },
      },
    }),
  },
}
