export default {
  baseStyle: () => ({
    tileSwatchWrapper: {
      marginBottom: 'var(--spacing-2)',
    },
    priceWrapper: {
      marginBottom: 'var(--spacing-2)',
    },
    tileProductName: {
      marginBottom: 'var(--spacing-1)',
    },
    tileProductNameText: {
      display: '-webkit-box',
      lineClamp: 2,
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
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
