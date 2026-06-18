export default {
  baseStyle: ({ theme }) => ({
    totalProductsCount: {
      ...theme.typography['text-body1-m'],
      lineHeight: 'var(--line-height-140)',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      categoryHeader: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
    }),
  },
}
