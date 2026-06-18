export default {
  baseStyle: () => ({
    starReviewRatingWrapper: {
      p: '10px',
      h: 'var(--spacing-4)',
      boxSizing: 'content-box',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      mr: 'var(--spacing-1)',
      border: '0 none',
      borderRadius: 'var(--border-radius-m)',
      backgroundColor: 'var(--color-white-base)',
    },
    starReviewRatingValue: {
      m: 'var(--spacing-0)',
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-16)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
    },
  }),
}
