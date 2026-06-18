export default {
  baseStyle: ({ theme }) => ({
    tileRatingsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignItems: 'center',
      },
    },
    starRatingReviewsLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-s'],
        borderBottom: 'none',
        color: 'var(--color-black-base)',
        fontStyle: 'normal',
        fontWeight: 500,
        borderLeft: 'var(--border-width-s) solid #d9d9d9',
        marginLeft: 'var(--spacing-2)',
        paddingLeft: 'var(--spacing-2)',
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
        position: 'relative',
        '&:after': {
          content: '""',
          borderBottom: '1px solid var(--color-black-base)',
          width: 'calc(100% - var(--spacing-2))',
          position: 'absolute',
          display: 'block',
          bottom: '-1px',
          right: 0,
        },
      },
    },
    starRatingNumberLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow2-m'],
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
        marginRight: '3px',
      },
    },
    startRatingIconWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '0 2px 1px 0',
      },
    },
    ratingStars: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        transform: 'scale(0.791) !important',
        transformOrigin: 'left',
        color: 'var(--color-black-base)',
      },
    },
    reviewCount: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-s'],
        lineHeight: 'var(--line-height-140)',
        fontStyle: 'normal',
        ml: 'calc(0px - var(--spacing-3))',
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
