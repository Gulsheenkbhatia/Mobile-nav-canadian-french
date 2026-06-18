export default {
  baseStyle: ({ theme }) => ({
    modalContent: (isDesktop) => ({
      maxWidth: isDesktop ? '600px' : '100%',
      minHeight: isDesktop ? '500px' : '100%',
      maxHeight: '90vh',
      padding: isDesktop ? '24px' : '32px 12px',
    }),
    inputGroup: {
      '& > p': {
        position: 'absolute',
        left: '15px',
        transition: 'color 0s, transform 1s',
        visibility: 'hidden',
        color: theme.colors.main.gray,
        lineHeight: theme.lineHeights.xl,
        backgroundColor: theme.colors.main.white,
        padding: '0 5px',
        zIndex: 1,
        fontSize: '12px',
        fontWeight: 'normal',
      },
      '&:focus-within > p': {
        transform: 'translateY(-8px)',
        visibility: 'visible',
        zIndex: 1,
      },

      '&:focus-within input::placeholder': {
        color: 'transparent',
      },
    },
    input: {
      padding: '20px!important',
      border: `1px solid`,
      marginRight: '15px',
      borderColor: theme.colors.main.black,
      '&:focus': { outline: 'none', borderColor: theme.colors.main.black, boxShadow: 'none' },
      '&:not(:placeholder-shown)~p': {
        transform: 'translateY(-8px)',
        visibility: 'visible',
        zIndex: 1,
      },
    },
    rightElement: {
      right: '30px',
      top: '8px!important',
    },
    productInfoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        background: 'var(--color-neutral-light)',
        marginBottom: 'var(--spacing-4)',
        padding: 'var(--spacing-4) var(--spacing-3)',
        borderRadius: 'var(--border-radius-none)',
      },
    },
  }),
  variants: {
    desktop: () => ({}),
    mobile: () => ({}),
    table: () => ({}),
  },
  defaultProps: { variant: 'desktop' },
}
