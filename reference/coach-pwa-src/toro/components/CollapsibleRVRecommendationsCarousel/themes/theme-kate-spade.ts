export default {
  baseStyle: ({ theme }) => ({
    collapsibleTitle: {
      ...theme.typography['text-display2-xs'],
      fontWeight: 400,
    },
    thumbnailImage: {
      backgroundColor: 'var(--color-product-image-bg)',
    },
  }),
}
