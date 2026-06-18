export default {
  parts: [
    'productHeaderTitle',
    'productHeaderOnPurposeBadge',
    'productHeaderOnPurposeBadgeImage',
    'badgesWrapper',
    'headerPromoMessages',
    'reviewsWrapper',
    'reviewsContainer',
    'badges',
    'productSku',
    'breadcrumbsWrapperSmall',
    'breadcrumbsWrapperLarge',
    'badgesListContainer',
    'headerContainer',
  ],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: ({ variant, bundle }) => ({
      fontFamily: theme.fontFamily.secondaryNormal,
      display: 'flex',
      alignItems: 'center',
      mb: 'xs',
      letterSpacing: theme.letterSpacings.sm,
      lineHeight: variant === 'desktop' ? theme.lineHeights.s : theme.lineHeights.md,
      fontWeight: '400',
      fontSize: bundle ? theme.fontSizes.lg : theme.fontSizes.xl,
      height: variant === 'desktop' && '28px',
    }),
    productHeaderOnPurposeBadge: { cursor: 'pointer', position: 'relative' },
    productHeaderOnPurposeBadgeImage: { height: 12, width: 'auto' },
    badgesWrapper: (pref) => ({
      bg: pref.length > 0 ? '' : theme.colors.main.inactive,
      mb: pref.length > 0 ? '' : '5px',
      maxWidth: pref.length > 0 ? '' : '107px',
    }),
    headerPromoMessages: {
      mb: 'l',
    },
    reviewsContainer: {
      mb: 'm',
      ml: '-6px',
    },
    badgeWrapper: (variant) => ({
      justifyContent: variant === 'mobile' ? 'space-between' : '',
    }),
    ReviewAndRating: (bundle, totalReviews, averageRating) => ({
      mt: bundle ? '10px' : '0px',
      minHeight: (totalReviews > 0 || averageRating > 0) && '16px',
    }),
    ReviewAndRatingDesktop: (bundle, totalReviews, averageRating, variant, isQuickView) => ({
      minHeight: (totalReviews > 0 || averageRating > 0) && '16px',
      mb: (totalReviews > 0 || averageRating > 0) && isQuickView ? '0' : '16px',
      maxW: variant !== 'mobile' && '33%',
      mt: bundle && '10px',
    }),
    productSku: {
      color: 'var(--color-neutral-base)',
      fontWeight: '500',
    },
  }),
  variants: ({ theme }) => ({
    desktop: () => ({
      textSize: 'xl',
    }),
    mobile: () => ({
      textSize: 'lg',
      reviewsWrapper: {
        mb: 'm',
        ml: '-6px',
      },
      badgesWrapper: {
        mb: '10px',
      },
      badges: (pref) => ({
        bg: pref.length > 0 ? '' : theme.colors.main.inactive,
        width: pref.length > 0 ? '' : '203px',
      }),
    }),
    quickview: {
      textSize: 'xxl',
      reviewsContainer: {
        mb: 's',
        ml: '-6px',
      },
    },
  }),
  defaultProps: { variant: 'desktop' },
}
