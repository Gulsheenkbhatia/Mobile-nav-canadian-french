export default {
  baseStyle: ({ theme }) => ({
    addToBagButton: ({ isSticky, isMobile }) => ({
      color: 'var(--color-cta-atc-pdp-default)',
      background: 'var(--color-cta-atc-pdp-background)',
      borderWidth: 'var(--border-width-cta-atc-pdp)',
      borderRadius: 'var(--border-radius-cta-atc-pdp)',
      borderColor: 'var(--border-color-cta-atc-pdp)',
      p: isSticky && isMobile ? theme.space.l : theme.space.mar,
      '&:focus': {
        boxShadow: theme.focus.boxShadow,
        outline: theme.focus.outline,

        color: 'var(--color-cta-atc-pdp-focus-default)',
        background: 'var(--color-cta-atc-pdp-focus-background)',
      },

      '&[disabled], &[disabled]:hover': {
        color: 'var(--color-cta-atc-pdp-disable-default)',
        background: 'var(--color-cta-atc-pdp-disable-background)',
      },

      '&:hover:not([disabled])': {
        color: 'var(--color-cta-atc-pdp-hover-default)',
        background: 'var(--color-cta-atc-pdp-hover-background)',
      },
      ...theme.typography['text-cta1-m'],
    }),
  }),
}
