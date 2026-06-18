export default {
  baseStyle: ({ theme }) => ({
    badgesListContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        gridGap: 'unset',
      },
    },
    productHeaderTitle: ({ isNewMegaPDPTurnOn }) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        lineHeight: 'var(--line-height-s)',
        color: 'var(--color-primary)',
        fontStyle: 'normal',
        fontWeight: '700',
        marginTop: isNewMegaPDPTurnOn ? '18px' : 'var(--spacing-3)',
        marginBottom: '0px',
        flexGrow: '2',
        fontSize: 'var(--text-20)',
        letterSpacing: 'var(--letter-spacing-s)',
      },
    }),
    ReviewAndRating: () => ({
      mt: 'var(--spacing-1)',
    }),
    productHeadingWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '.wishlist-btn': {
          p: '8px',
          m: '-8px',
        },
      },
    },
  }),
  variants: {
    bundle: ({ theme }) => ({
      productHeaderTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          mb: 0,
          mt: '-3px',
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'var(--line-height-140)',
          color: 'var(--color-primary)',
        },
        '&.pdp-product-tile': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            marginTop: 'var(--spacing-6)',
          },
        },
      }),
    }),
    mobile: () => ({
      breadcrumbsWrapperSmall: {
        width: 'calc(100% - 154px)', // rounded 129.52px + 24px
      },
      breadcrumbsWrapperLarge: {
        width: '100%',
      },
    }),
  },
}
