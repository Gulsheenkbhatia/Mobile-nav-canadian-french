export default {
  baseStyle: ({ theme }) => ({
    varietyOfPaymentContainer: {
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    learnMore: {
      ...theme.typography['text-title1-xs'],
    },
    learnMoreForVarietyOfPayment: {
      ...theme.typography['text-title1-xs'],
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      m: 'auto 0 auto auto',
      textDecoration: 'underline',
      color: 'var(--color-grey-80)',
      appearance: 'none',
      background: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      '&:focus-visible': {
        outline: '2px solid currentColor',
        outlineOffset: '2px',
      },
    },
  }),
}
