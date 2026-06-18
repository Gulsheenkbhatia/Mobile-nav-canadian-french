export default {
  parts: [
    'shippingAndReturnContainer',
    'infoIcon',
    'textContainer',
    'shippingTitle',
    'shippingThreshold',
    'learnMore',
  ],
  baseStyle: ({ theme }) => ({
    shippingAndReturnContainer: {
      display: 'flex',
      p: 'var(--spacing-4) var(--spacing-3)',
      borderTop: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      borderBottom: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      backgroundColor: 'var(--color-neutral-light)',
      mb: '-1px',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    shippingTitle: {
      ...theme.typography['text-title1-s'],
      fontWeight: 400,
    },
    shippingThreshold: {
      ...theme.typography['text-title1-xs'],
      color: 'var(--color-black-70)',
      fontWeight: 400,
    },
    learnMore: {
      ...theme.typography['text-title1-s'],
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      m: 'auto 0 auto auto',
      textDecoration: 'underline',
      color: 'var(--color-grey-80)',
    },
    shippingIconContainer: {
      mr: 'var(--spacing-2)',
    },
  }),
}
