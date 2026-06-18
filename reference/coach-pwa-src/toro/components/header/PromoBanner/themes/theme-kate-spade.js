export default {
  baseStyle: ({ theme }) => ({
    bannerMainWrapper: {
      '.header-banner': {
        '& .promo-item': {
          ...theme.typography['text-eyebrow1-m'],
          color: 'var(--color-white-base)',
          lineHeight: 'var(--line-height-150)',
        },
        '.slick-list': {
          minHeight: { base: '74px', lg: 'var(--spacing-6)' },
        },
      },
    },
    bannerPreviousButton: {
      top: '53%',
      transform: 'translate(0%, -50%)',
    },

    bannerNextButton: {
      top: '53%',
      transform: 'translate(0%, -50%)',
    },

    containerMaxHeight: {
      minHeight: 'var(--spacing-8)',
    },
  }),
}
