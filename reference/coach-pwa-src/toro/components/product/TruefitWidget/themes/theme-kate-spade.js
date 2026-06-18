export default {
  baseStyle: ({ theme }) => ({
    TrueFitContainer: {
      mt: 'var(--spacing-4)',
      mb: 'var(--spacing-4)',
      minHeight: 12,
      '&:empty': {
        display: 'none',
      },
    },
    TrueFitButton: (showButtonAsAlink) => ({
      ...theme.typography['text-cta1-s'],
      borderColor: 'var(--border-color-inactive)',
      _focus: { boxShadow: 'none' },
      padding: showButtonAsAlink ? '0px' : 'var(--spacing-4)',
    }),
    IconFocus: {
      _focus: { boxShadow: 'none' },
    },
  }),
}
