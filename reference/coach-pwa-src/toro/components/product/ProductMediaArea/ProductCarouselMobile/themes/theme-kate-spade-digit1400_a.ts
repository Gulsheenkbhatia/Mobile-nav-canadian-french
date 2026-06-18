export default {
  baseStyle: () => ({
    container: {
      '.splide__pagination': {
        paddingLeft: 'var(--spacing-3)',
        paddingRight: 'var(--spacing-3)',
        bottom: 'var(--spacing-3) !important',
      },
      '.splide__pagination__page': {
        transition: 'all 0.5s cubic-bezier(0.83, 0, 0.17, 1) !important',
      },
    },
  }),
}
