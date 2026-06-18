export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: ({ variant, bundle }) => ({
      display: 'flex',
      alignItems: 'center',
      mb: 'var(--border-radius-s)',
      ...(variant === 'mobile' || bundle
        ? {
            ...theme.typography['text-display2-xs'],
          }
        : theme.typography['text-display2-s']),
    }),
    productHeaderOnPurposeBadge: { cursor: 'pointer', position: 'relative' },
    productHeaderOnPurposeBadgeImage: { height: 12, width: 'auto' },
    badgesWrapper: (pref) => ({
      bg: pref ? '' : theme.colors.main.inactive,
      ...theme.typography['text-body1-s'],
    }),
    ReviewAndRating: (bundle) => ({
      mt: bundle ? 'var(--spacing-1)' : '0px',
    }),
  }),
  variants: ({ theme }) => ({
    quickview: {
      textSize: theme.fontSizes.xl,
    },
    mobile: () => ({
      textSize: 'lg',
      reviewsWrapper: {
        mb: 'm',
        ml: '-6px',
      },
      badgesWrapper: {
        mb: '0px',
      },
      badges: (pref) => ({
        bg: pref ? '' : theme.colors.main.inactive,
      }),
    }),
  }),
}
