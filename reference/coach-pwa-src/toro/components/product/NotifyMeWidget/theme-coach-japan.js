export default {
  baseStyle: () => ({
    successModalPopUpHeading1: (isDesktop) => ({
      fontWeight: 'normal',
      mb: isDesktop ? 'var(--spacing-4)' : 'var(--spacing-6)',
      textAlign: 'center',
      fontSize: isDesktop ? 'var(--text-24)' : 'var(--text-20)',
    }),
    successModalPopUpHeading2: (isDesktop) => ({
      textAlign: 'center',
      mb: 0,
      p: !isDesktop && '0 var(--spacing-3)',
    }),
    continueShoppingButton: {
      m: '0 auto',
      mt: 'var(--spacing-4)',
    },
  }),
}
