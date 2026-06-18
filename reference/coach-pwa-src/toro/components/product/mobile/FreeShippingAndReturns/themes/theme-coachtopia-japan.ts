export default {
  parts: ['shippingTitle', 'shippingThreshold', 'learnMore'],
  baseStyle: ({ theme }: { theme: any }) => {
    return {
      shippingTitle: {
        ...theme.typography['text-body2-s'],
        fontWeight: 400,
      },
      shippingThreshold: {
        ...theme.typography['text-cta2-xs'],
        color: 'var(--color-black-70)',
        fontWeight: 400,
      },
      learnMore: {
        ...theme.typography['text-link2-s'],
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        m: 'auto 0 auto auto',
        textDecoration: 'underline',
        color: 'var(--color-grey-80)',
      },
    }
  },
}
