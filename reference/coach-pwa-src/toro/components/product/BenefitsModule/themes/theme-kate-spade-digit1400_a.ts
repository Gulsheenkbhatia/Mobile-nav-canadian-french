export default {
  baseStyle: ({ theme }) => ({
    benefitsContainer: {
      padding: '0 var(--spacing-3) var(--spacing-10)',
      marginTop: 'var(--spacing-8)',
      display: 'flex',
      flexDirection: 'column',
    },
    benefitsTitle: {
      ...theme.typography['text-body1-m'],
      marginBottom: 'var(--spacing-2)',
    },
    benefitsItemsWrapper: {
      '::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none' /* IE and Edge */,
      'scrollbar-width': 'none' /* Firefox */,
    },
    benefitItem: {
      paddingRight: 'var(--spacing-6)',
      marginRight: 'var(--spacing-6)',
    },
    benefitText: () => ({
      ...theme.typography['text-body1-l'],
    }),
  }),
}
