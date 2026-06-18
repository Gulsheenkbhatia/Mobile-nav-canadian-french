export default {
  baseStyle: ({ theme }) => ({
    filterButtonText: {
      ...theme.typography['text-cta1-xs'],
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      mainWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
    }),
  },
}
