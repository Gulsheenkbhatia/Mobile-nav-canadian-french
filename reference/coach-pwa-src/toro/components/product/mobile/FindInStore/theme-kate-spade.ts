export default {
  baseStyle: ({ theme }) => ({
    PickUpInStoreWrapper: {
      backgroundColor: '#f7f7f7',
    },
    productInfoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        background: 'var(--color-neutral-light-1)',
        marginBottom: 'var(--spacing-4)',
        padding: 'var(--spacing-4) var(--spacing-3)',
        borderRadius: 'var(--border-radius-none)',
      },
    },
  }),
}
