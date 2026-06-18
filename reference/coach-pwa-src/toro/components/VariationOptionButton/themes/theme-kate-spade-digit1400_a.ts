export default {
  parts: ['sizeVariationButton'],
  baseStyle: ({ theme }) => ({
    sizeVariationButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-m'],
        padding: '18px var(--spacing-6)',
        borderRadius: 'var(--border-radius-s)',
        borderColor: '#e6e6e6',
        textTransform: 'capitalize',
        height: '47px',
      },
    },
  }),
}
