export default {
  parts: ['SearchResultWrapper'],
  baseStyle: ({ theme }) => ({
    SearchResultSkeletonMessageText: (isMobile) => ({
      color: theme.colors.main.black,
      textAlign: 'center',
      m: isMobile ? `10px ${theme.space.xxl} 0` : `15px ${theme.space.xxl} 0`,
      ...(isMobile ? theme.typography['text-body2-s'] : theme.typography['text-body2-l']),
    }),
  }),
  variants: {
    plpV3: ({ theme }) => ({
      SearchResultWrapper: () => ({
        pt: '14px',
        pb: theme.space.xs,
        borderBottom: '1px solid var(--color-neutral-light-2, #e1e1e1)',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--color-product-image-bg)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-product-image-bg)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pt: '42px',
          pb: '0',
          justifyContent: 'start',
          px: 'var(--spacing-6)',
          border: 'none',
          maxWidth: '1344px',
          margin: 'auto',
        },
      }),
    }),
  },
}
