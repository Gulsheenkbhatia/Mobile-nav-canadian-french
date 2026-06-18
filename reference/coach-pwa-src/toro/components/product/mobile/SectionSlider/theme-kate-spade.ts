export default {
  baseStyle: () => ({}),
  variants: {
    visuallySimilarPDPv6: ({ theme }) => ({
      sectionSliderTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display2-m'],
          fontWeight: '400',
        },
      },
    }),
    visuallySimilarPDPv7: ({ theme }) => ({
      sectionSliderWrapper: {
        background: 'var(--color-neutral-light-1, #f0f0f0)',
        padding: 'var(--spacing-12) var(--spacing-3)',
      },

      sectionSliderTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-l'],
          textAlign: 'center',
          fontWeight: 400,
          lineHeight: 'var(--line-height-100)',
        },
      },
    }),
  },
}
