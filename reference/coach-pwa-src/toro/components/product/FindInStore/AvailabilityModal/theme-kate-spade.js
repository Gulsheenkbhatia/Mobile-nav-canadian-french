export default {
  baseStyle: ({ theme }) => ({
    modalContent: (isDesktop) => ({
      maxWidth: isDesktop ? '600px' : '100%',
      minHeight: isDesktop ? '500px' : '100%',
      maxHeight: isDesktop ? '90vh' : '100vh',
      padding: isDesktop ? '24px' : '32px 12px',
    }),
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
