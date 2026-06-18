export default {
  parts: ['starRatingReviewsLabel', 'tileRatingsWrapper'],

  baseStyle: ({ theme }) => ({
    starRatingReviewsLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        borderBottom: 'none',
        color: 'var(--color-black)',
        fontStyle: 'normal',
        fontWeight: 400,
        borderLeft: 'var(--border-width-s) solid #d9d9d9',
        marginLeft: 'var(--spacing-2)',
        paddingLeft: 'var(--spacing-2)',
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
        textDecoration: 'underline',
      },
    },
    starRatingNumberLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow1-m'],
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xl)',
      },
    },
    startRatingIconWrapper: {
      mr: '2px',
      mt: 0,
    },
    ratingStars: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        transform: 'scale(0.791) !important',
        transformOrigin: 'left',
        color: 'var(--color-black-base)',
      },
    },
    reviewCount: (isPDP) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-140)',
        fontStyle: 'normal',
        ml: isPDP ? 'calc(0px - var(--spacing-4))' : '0',
      },
    }),
  }),
  variants: {
    pdpV3: ({ theme }) => ({
      tileRatingsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
      },
    }),
  },
}
