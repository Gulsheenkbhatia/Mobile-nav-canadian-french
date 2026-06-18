export default {
  parts: ['sectionSliderWrapper', 'sectionSliderTitle', 'sectionSliderContainer', 'arrows'],
  baseStyle: ({ theme }) => ({
    sectionSliderWrapper: {
      maxWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
    },
    sectionSliderTitle: {
      ...theme.typography['text-display4-s'],
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display4-s'],
        fontFamily: 'var(--font-face1-extended-bold)',
        color: 'var(--color-black-base)',
        fontWeight: '700',
        fontSize: 'var(--text-24)',
        paddingLeft: 'var(--spacing-3)',
      },
    },
    sectionSliderContainer: {
      padding: 'var(--spacing-10) 0',
    },
    arrows: {
      display: 'none',
    },
  }),
}
