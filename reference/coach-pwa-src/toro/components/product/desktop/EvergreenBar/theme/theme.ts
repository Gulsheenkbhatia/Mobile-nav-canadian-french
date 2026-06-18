export default {
  baseStyle: ({ theme }) => ({
    evergreenBarContainer: {
      '.klarna-details': {
        color: 'var(--color-text-cta-primary)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        display: 'flex',
        alignItems: 'start',
        marginRight: '0px',
        'svg > path': {
          fill: 'var(--color-white-base)',
        },
      },
      '.klarna-learn-more': {
        marginLeft: 'var(--spacing-2)',
      },
      alignItems: 'flex-end',
      img: { marginRight: 'var(--spacing-2)' },
      '.shipping-return-container': {
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-text-cta-primary)',
        'svg > path': {
          fill: 'var(--color-white-base)',
        },
      },
      'afterpay-placement': {
        color: 'var(--color-text-cta-primary) !important',
        fontFamily: 'var(--font-face1-normal)',
      },
      '.afterpay-wrapper': {
        py: '0px',
        maxHeight: '18px',
      },
      '> *:not(:last-child)::after': {
        content: '""',
        display: 'inline-block',
        width: '1px',
        height: 'var(--spacing-2)',
        backgroundColor: '#2EAE82',
        mx: 'var(--spacing-8)',
        alignSelf: 'center',
      },
    },
    inventoryStatus: {
      marginBottom: '0px',
      marginTop: '1px',
      px: '0px',
      ...theme.typography['text-body1-s'],
      color: 'var(--color-text-cta-primary)',
      fontWeight: 400,
    },
  }),
}
