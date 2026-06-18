export default {
  parts: ['varietyOfPaymentTitle', 'varietyOfPaymentSubtitle', 'learnMoreForVarietyOfPayment'],
  baseStyle: ({ theme }: { theme: any }) => {
    return {
      varietyOfPaymentTitle: {
        ...theme.typography['text-body2-s'],
        fontWeight: 400,
      },
      varietyOfPaymentSubtitle: {
        ...theme.typography['text-cta2-xs'],
        color: 'var(--color-black-70)',
        fontWeight: 400,
      },
      learnMoreForVarietyOfPayment: {
        ...theme.typography['text-link2-s'],
      },
    }
  },
}
