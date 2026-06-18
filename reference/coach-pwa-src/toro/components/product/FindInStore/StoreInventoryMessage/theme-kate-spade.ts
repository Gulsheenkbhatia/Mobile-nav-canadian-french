export default {
  baseStyle: ({ theme }) => ({
    ...theme.typography['text-title2-s'],
    fontWeight: 500,
    color: 'var(--color-error-primary)',
  }),
  variants: {
    availabilityModal: ({ theme }) => ({
      ...theme.typography['text-title2-s'],
      fontWeight: 500,
      color: 'var(--color-text-primary)',
      textAlign: 'right',
    }),
  },
}
