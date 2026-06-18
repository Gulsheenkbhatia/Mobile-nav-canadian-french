export default {
  baseStyle: () => ({
    priceWrapper: {
      my: 'xs',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      tileProductNameText: {
        ...theme.typography['text-body2-m'],
        lineClamp: 2,
        WebkitLineClamp: 2,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          display: '-webkit-box',
          lineClamp: 2,
          WebkitLineClamp: 2,
          whiteSpace: 'normal',
        },
      },
      productThumbnail: {
        mb: 'var(--spacing-3)',
      },
    }),
  },
}
