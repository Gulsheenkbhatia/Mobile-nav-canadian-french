const title = {
  color: 'var(--color-black-base)',
  fontFamily: 'var(--font-face2-normal)',
  fontSize: 'var(--text-52)',
  fontWeight: 400,
  lineHeight: 'var(--line-height-115)',
  letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
}

export default {
  parts: ['sectionSliderWrapper', 'sectionSliderTitle'],
  baseStyle: () => ({
    sectionSliderWrapper: {
      maxWidth: 'calc(100vw - var(--spacing-6))',
      marginX: 'auto',
    },
  }),
  variants: {
    pdpv5_1: () => ({
      sectionSliderWrapper: {
        maxWidth: '100vw',
        marginX: '0',
      },
      sectionSliderTitle: {
        ...title,
        '@media (max-height: 800px)': {
          ...title,
        },
      },
    }),
  },
}
