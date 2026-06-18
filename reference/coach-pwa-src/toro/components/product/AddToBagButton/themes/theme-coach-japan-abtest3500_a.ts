export default {
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      addToBagButton: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-black-base)',
          },
          border: 'none',
          borderRadius: 0,
          color: 'var(--color-white-base)',
          backgroundColor: 'var(--color-black-base)',
          padding: 'var(--spacing-3)',
          height: '56px',
          textTransform: 'none',
          paddingTop: 'var(--spacing-4)',
          '&[disabled]': {
            opacity: 1,
            backgroundColor: 'var(--color-neutral-light-2)',
            color: 'var(--color-neutral-base)',
          },
          ...theme.typography['text-cta1-s'],
          fontWeight: '300',
        },
      }),
    }),
  },
}
