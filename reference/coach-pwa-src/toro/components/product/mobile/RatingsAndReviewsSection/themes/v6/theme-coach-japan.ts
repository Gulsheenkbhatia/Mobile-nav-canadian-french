export default {
  baseStyle: ({ theme }) => ({
    ratingWithPercentContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '26px auto 36px',
        gridGap: 'var(--spacing-3)',
      },
    },
    reviewHeader: () => ({
      '&.reviews__heading': {
        ...theme.typography['text-title2-m'],
        fontSize: 'var(--text-24)',
      },
    }),
    reviewsCount: {
      ...theme.typography['text-body1-s'],
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-3)',
      marginTop: 'var(--spacing-3)',
    },
  }),
}
