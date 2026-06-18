export default {
  parts: ['PriceBadgeWrapper', 'calloutMessageWrapper'],
  baseStyle: ({ theme }) => ({
    PriceBadgeWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '18px',
        marginBottom: 'var(--spacing-3)',
        '& .klarna-container': {
          flex: '0 0 100%',
        },
        '.pdp-price-promotion-and-sale': {
          marginBottom: 'var(--spacing-2)',
        },
        ':has(.klarna-container, +.product-variations-wrapper:empty)': {
          '.klarna-container': {
            marginBottom: '13.5px',
          },
        },
        ':not(:has(.customization_cta))': {
          '.pdp-price-promotion-and-sale': {
            marginBottom: '11px',
          },
          ':has(+.product-variations-wrapper:empty):not(:has(.pdp-price-promotion-and-sale))': {
            marginBottom: '9.5px',
          },
          ':has(+.product-variations-wrapper:empty)': {
            '.klarna-container': {
              marginBottom: '14px',
            },
          },
        },
      },
    },
    calloutMessageWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '20px',
        ':not(:has(+.klarna-container))': {
          '& .callout-message-container': {
            mb: '5px',
          },
        },
      },
    },
  }),
  variants: {
    tabbedPDP: ({ theme }) => ({
      PriceBadgeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'var(--spacing-1)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      PriceBadgeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'var(--spacing-1)',
          marginBottom: '1px',
        },
      },
      calloutMessageWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
          '&.ipx1-promo-wrapper': {
            marginTop: 'var(--spacing-1)',
          },
          '&.ipx1-promo-wrapper-parallax': {
            marginTop: '10px',
          },
        },
      },
    }),
    v3PromoPriceBadge: ({ theme }) => ({
      calloutMessageWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
        },
      },
      PriceBadgeWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ':not(:has(.customization_cta))': {
            '.pdp-price-promotion-and-sale': {
              marginBottom: 0,
            },
          },
        },
      },
    }),
  },
}
