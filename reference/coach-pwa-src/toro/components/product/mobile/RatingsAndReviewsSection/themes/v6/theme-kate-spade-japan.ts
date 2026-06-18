export default {
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewHeader: () => ({
        '&.reviews__heading': {
          ...theme.typography['text-title2-m'],
          fontSize: 'var(--text-24)',
        },
      }),
    }),
  },
}
