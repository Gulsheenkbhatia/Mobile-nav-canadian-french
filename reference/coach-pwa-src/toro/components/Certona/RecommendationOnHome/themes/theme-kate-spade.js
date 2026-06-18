export default {
  baseStyle: ({ theme }) => ({
    certonaTitle: (isDesktop) => ({
      '@media (min-width: 769px)': {
        marginBottom: 'var(--spacing-8)',
      },
      marginBottom: 'var(--spacing-6)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
      textTransform: 'capitalize',
      ...(isDesktop ? theme.typography['text-display1-m'] : theme.typography['text-display1-s']),
    }),
    productNameWrapper: () => ({
      mt: 'var(--spacing-3)',
      paddingLeft: 'var(--spacing-3)',
    }),
    recommendedPriceMainWrapper: {
      paddingLeft: 'var(--spacing-3)',
      m: 'var(--spacing-3) 0 0 0',
      ...theme.typography['text-body2-m'],
      '&.recommended-price': {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'var(--spacing-2)',
        marginLeft: 'var(--spacing-2)',
      },
    },
    productName: {
      '@media (max-width: 769px)': {
        textAlign: 'left',
      },
      ...theme.typography['text-body2-m'],
    },
    recommendedPriceText: () => ({
      textAlign: 'left',
      ...theme.typography['text-body2-m'],
      overflow: 'hidden',
    }),
    oldPriceText: {
      ...theme.typography['text-body2-m'],
      color: 'var(--color-neutral-base)',
      overflow: 'hidden',
    },
    certonaTitleHome: () => ({
      '@media (max-width: 769px)': {
        fontSize: 'var(--text-30)',
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-xs)',
        textAlign: 'start',
      },
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-36)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
      lineHeight: 'var(--line-height-107)',
      letterSpacing: '-0.9px', //Doesn't exist in design tokens
    }),
  }),
}
