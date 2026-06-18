export default {
  parts: ['affirmWrapper', 'affirmParagraph', 'affirmSkeleton'],
  baseStyle: () => ({
    affirmParagraph: {
      fontSize: 'var(--text-12)',
      fontWeight: '400',
    },
    affirmSkeleton: {
      width: '100%',
      height: '20px',
      mt: 'var(--spacing-1)',
    },
  }),
  variants: {
    pdpv5: () => ({
      affirmWrapper: {
        display: 'flex',
      },
      affirmParagraph: {
        color: 'var(--color-white-base)',
      },
    }),
  },
}
