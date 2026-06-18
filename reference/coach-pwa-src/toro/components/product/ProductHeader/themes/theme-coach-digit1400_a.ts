export default {
  parts: ['productHeaderTitle', 'ReviewAndRating'],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-l'],
        marginBottom: '0px',
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-20)',
        fontWeight: 700,
        letterSpacing: 'var(--letter-spacing-xs)',
        lineHeight: 'var(--line-height-120)',
        color: 'var(--color-primary)',
        fontStyle: 'normal',
        marginTop: '18px',
        flexGrow: 1,
        '&.tabbed-pdp-product-title': {
          marginTop: '11px',
        },
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
          p: '18px 8px 8px',
          m: '0 -8px -8px',
        },
      },
    },
  }),
  variants: {
    bundle: ({ theme }) => ({
      productHeaderTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-xl)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-primary)',
          fontWeight: 400,
        },
      }),
      ReviewAndRating: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: 'var(--spacing-3) 0',
        },
      }),
      badgeWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: 0,
        },
      }),
    }),
    mobile: ({ theme }) => ({
      badgesWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: 0,
        },
      },
      breadcrumbsWrapperSmall: {
        width: 'calc(100% - 154px)', // rounded 129.52px + 24px
      },
      breadcrumbsWrapperLarge: {
        width: '100%',
      },
    }),
  },
}
