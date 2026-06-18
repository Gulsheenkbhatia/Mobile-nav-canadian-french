export default {
  baseStyle: ({ theme }) => ({
    sizeGuideContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '0',
        marginBottom: 'var(--spacing-4)',
      },
    }),
    sizeGuideButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        border: 'none',
        textDecoration: 'underline',
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: () => ({
      sizeGuideContainer: () => ({
        pl: 'var(--spacing-4)',
      }),
    }),
  },
}
