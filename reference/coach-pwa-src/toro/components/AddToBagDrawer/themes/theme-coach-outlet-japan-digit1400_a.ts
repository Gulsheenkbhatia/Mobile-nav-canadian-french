export default {
  baseStyle: ({ theme }) => ({
    checkoutButtonVariant: {
      sx: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-xs'],
          borderRadius: 'var(--border-radius-s)',
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-115)',
          color: 'var(--color-black-base)',
          padding: 'var(--spacing-6)',
          height: '57px',
        },
      },
    },
    viewBagButtonVariant: {
      sx: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta1-s'],
          borderRadius: 'var(--border-radius-s)',
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-115)',
          color: 'var(--color-white-base)',
          borderColor: 'var(--border-color-inactive)',
        },
      },
    },
  }),
}
