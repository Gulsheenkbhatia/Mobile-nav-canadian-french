export default {
  baseStyle: () => ({
    variationLabel: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
    },
    variationLabelValue: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
    },
    sizeButton: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
    },
    sizeAreaFooter: {
      '& .fit-review-text-container': {
        '& p': {
          fontFamily: 'var(--font-face1-medium)',
          fontSize: 'var(--text-14)',
          lineHeight: 'var(--line-height-125)',
          letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
        },
      },
    },
  }),
}
