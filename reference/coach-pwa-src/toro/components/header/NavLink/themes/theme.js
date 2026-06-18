export default {
  baseStyle: ({ theme }) => ({
    styles: {
      navLinkContainer: {
        mr: theme.space.s,
      },
      navLinkTooltip: {
        fontSize: 'xs',
      },
    },
  }),
  variants: {
    header: () => ({
      textVariant: 'body-primary',
      textSize: 'sm',
    }),
    mobileMenu: () => ({
      textVariant: 'cta-primary',
      textSize: 'sm',
      paddingLeft: 'm',
    }),
    mobileHeader: () => ({
      textVariant: 'body-primary',
      textSize: 'sm',
      childrenStyle: {
        width: '24px',
        height: '24px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        '& > svg': {
          margin: '0 auto',
        },
      },
    }),
    mobileMenuV2: () => ({
      navLinkContent: {
        flexDirection: 'column',
        color: 'var(--scheme-text-color)',
      },
      childrenStyle: {
        justifyContent: 'center',
        '& p': {
          color: 'var(--scheme-text-color)',
        },
      },
    }),
  },
  defaultProps: { variant: 'header' },
}
