export default {
  parts: ['searchTitle'],
  baseStyle: ({ theme }) => ({
    searchTitle: {
      ...theme.typography['text-display1-s'],
      fontWeight: 'normal',
      textAlign: { base: 'center' },
      '@media screen and (min-width: 992px)': {
        ...theme.typography['text-display1-l'],
      },
    },
    popularSearchesWrapper: {
      maxWidth: { base: '375px', lg: '952px' },
    },
    productName: {
      ...theme.typography['text-body2-m'],
    },
    price: {
      ...theme.typography['text-body2-m'],
    },
    fadedPrice: {
      color: 'var(--color-neutral-base)',
    },
  }),
}
