const learnMoreBase = ({ theme }) => ({
  ...theme.typography['text-title1-s'],
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-1)',
  m: 'auto 0 auto auto',
  textDecoration: 'underline',
  color: 'var(--color-grey-80)',
})

export default {
  parts: [
    'varietyOfPaymentContainer',
    'varietyOfPaymentIconContainer',
    'textContainer',
    'varietyOfPaymentTitle',
    'varietyOfPaymentSubtitle',
    'learnMore',
    'learnMoreForVarietyOfPayment',
  ],
  baseStyle: ({ theme }) => ({
    varietyOfPaymentContainer: {
      display: 'flex',
      p: 'var(--spacing-4) var(--spacing-3)',
      borderTop: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      borderBottom: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      backgroundColor: 'var(--color-neutral-light)',
      mb: '-1px',
      alignItems: 'center',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '70%',
    },
    varietyOfPaymentTitle: {
      ...theme.typography['text-title1-s'],
      fontWeight: 400,
    },
    varietyOfPaymentSubtitle: {
      ...theme.typography['text-title1-xs'],
      color: 'var(--color-black-70)',
    },
    learnMore: learnMoreBase({ theme }),
    learnMoreForVarietyOfPayment: {
      ...learnMoreBase({ theme }),
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
    varietyOfPaymentIconContainer: {
      mr: 'var(--spacing-2)',
    },
  }),
}
