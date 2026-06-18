export default {
  parts: ['PriceBadgeWrapper', 'PromoText', 'priceBadgeContainer'],
  baseStyle: ({ theme }) => ({
    PriceBadgeWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ':has(.klarna-container, +.product-variations-wrapper:empty)': {
          '.klarna-container': {
            marginBottom: 'inherit',
          },
        },
        ':has(~.product-attribute-wrapper .product-variation-message-error-container:empty)': {
          '.klarna-container': {
            marginBottom: '22.5px',
          },
        },
      },
    },
    PromoText: {
      ...theme.typography['text-body1-s'],
      pt: 'var(--spacing-2)',
      pb: 'var(--spacing-2)',
    },
    priceBadgeContainer: (isBundleProduct) => ({
      mb: !isBundleProduct ? 'var(--spacing-4)' : '0px',
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      PriceBadgeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'var(--spacing-2)',
          marginBottom: 'var(--spacing-3)',
        },
      },
    }),
  },
}
