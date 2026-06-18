export default {
  parts: ['productHeaderTitle', 'badgesWrapper'],
  baseStyle: ({ theme }) => ({
    productHeaderTitle: ({ variant, bundle }) => ({
      ...(variant === 'mobile' || bundle
        ? {
            ...theme.typography['text-body2-l'],
          }
        : theme.typography['text-display2-m']),
      letterSpacing: 'var(--letter-spacing-m)',
    }),
    badgeWrapper: (variant) => ({
      display: variant === 'mobile' ? 'block' : 'flex',
    }),
  }),
}
