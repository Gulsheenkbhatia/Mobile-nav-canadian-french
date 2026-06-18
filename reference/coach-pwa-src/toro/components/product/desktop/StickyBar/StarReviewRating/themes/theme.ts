export default {
  baseStyle: ({ theme }) => ({
    starReviewRatingWrapper: {
      borderRight: '1px solid var(--Neutrals-color-neutral-light-1, #F0F0F0)',
      pr: 'var(--spacing-2)',
      mr: 'var(--spacing-2)',
      cursor: 'pointer',
      h: '15px',
    },
    starReviewRatingValue: {
      ...theme.typography['text-eyebrow2-s'],
      color: 'var(--color-neutral-1)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      fontWeight: '400',
      lineHeight: '100%',
      letterSpacing: 'var(--letter-spacing-xs)',
      ml: 'var(--spacing-1)',
      mt: '3px',
    },
  }),
}
