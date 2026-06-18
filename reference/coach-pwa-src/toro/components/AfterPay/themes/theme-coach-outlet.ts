export default {
  baseStyle: ({ theme }) => ({
    afterPayContainer: {
      'afterpay-placement': {
        color: 'var(--color-neutral-dark-1)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-neutral-dark-1)',
        },
      },
    },
  }),
}
