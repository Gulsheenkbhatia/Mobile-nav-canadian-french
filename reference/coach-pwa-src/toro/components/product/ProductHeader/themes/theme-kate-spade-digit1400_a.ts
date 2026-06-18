export default {
  parts: ['productHeaderTitle', 'ReviewAndRating', 'productHeadingBadgesWrapper'],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-24)',
        flexGrow: 1,
        mb: 0,
        lineHeight: 'var(--line-height-s)',
        letterSpacing: 'var(--letter-spacing-m)',
        color: 'var(--color-primary)',
        fontWeight: 400,
      },
    }),
    badgesListContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        gap: '0px',
      },
    },
    productHeadingWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '.btn-wishlist-container': {
          position: 'static',
          ml: 'var(--spacing-4)',
        },
        '.wishlist-btn': {
          p: '3px var(--spacing-2) var(--spacing-2)',
          m: '0 -8px -8px',
        },
      },
    },
    productHeadingBadgesWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: '14px',
        mt: '14.5px',
        '&:has(.pdp-header-badges-list:not(:empty))': {
          mb: '22px',
        },
      },
    },
  }),
  variants: {
    bundle: ({ theme }) => ({
      productHeaderTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          fontStyle: 'normal',
          color: 'var(--color-primary)',
          fontWeight: 400,
        },
      }),
      ReviewAndRating: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: '5.5px 0 0',
        },
      }),
      productHeadingBadgesWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 0,
          mb: '6.5px',
        },
      },
    }),
    mobile: () => ({
      breadcrumbsWrapperSmall: {
        width: 'calc(100% - 154px)', // rounded 129.52px + 24px
      },
      breadcrumbsWrapperLarge: {
        width: '100%',
      },
      reviewsWrapper: {
        mb: '0px',
        ml: '0px',
      },
    }),
  },
}
