const sharedTextStyles = {
  color: 'var(--color-black-base)',
  textAlign: 'center',
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-12)',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'var(--line-height-100)',
  letterSpacing: '0.2px',
}

export default {
  baseStyle: ({ theme }) => ({
    starReviewRatingWrapper: {
      display: 'flex',
      height: '27px',
      padding: '6px 7px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '3px',
      borderRadius: 'var(--border-radius-s)',
      backgroundColor: 'var(--color-white-base)',
      cursor: 'pointer',
    },
    starReviewRatingIcon: {
      marginBottom: '2px',
    },
    starReviewRatingValue: {
      ...theme.typography['text-cta2-xs'],
      ...sharedTextStyles,
    },
    starReviewRatingCount: {
      ...theme.typography['text-cta2-xs'],
      ...sharedTextStyles,
    },
  }),
}
