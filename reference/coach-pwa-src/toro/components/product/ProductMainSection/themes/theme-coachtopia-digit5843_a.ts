export default {
  parts: ['LazyRatingsAndReviews'],
  baseStyle: ({ theme }) => ({
    LazyRatingsAndReviews: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '0px var(--spacing-3)',
        backgroundColor: 'var(--color-neutral-light)',
        minHeight: '204px !important',
        '&:before': {
          display: 'none',
        },
      },
    }),
  }),
}
