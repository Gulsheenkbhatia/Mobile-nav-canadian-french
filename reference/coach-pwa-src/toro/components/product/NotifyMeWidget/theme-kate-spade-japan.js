export default {
  parts: ['pdpTxtNotifymeModalHeader', 'successModalPopUpHeading1'],
  baseStyle: ({ theme }) => ({
    pdpTxtNotifymeModalHeader: {
      fontSize: 'var(--text-28)',
      lineHeight: 'var(--line-height-m)',
    },
    successModalPopUpHeading1: (isDesktop) => ({
      fontWeight: 'normal',
      mb: isDesktop ? theme.space.m : theme.space.l,
      textAlign: 'center',
      fontSize: isDesktop ? 'var(--text-24)' : 'var(--text-20)',
      lineHeight: theme.lineHeights.md,
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
