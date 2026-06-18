export default {
  parts: ['discPercent', 'priceWrapper', 'comparablePriceTheme', 'bundleListPriceCaption'],
  baseStyle: ({ theme }) => ({
    discPercent: () => ({
      ml: 's',
      color: theme.colors.main.saleRed,
    }),
    sameRangePrice: {
      fontSize: theme.fontSizes.lg,
    },
    priceWrapper: () => ({
      '.comparablePriceWrapper + .salePriceWrapper': {
        '.salesPrice': {
          color: theme.colors.main.saleRed,
        },
        '.dohPrice': {
          color: 'var(--color-black-base)',
        },
      },
    }),
  }),
  variants: {
    plpV3: ({ theme }) => ({
      bundleListPriceCaption: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-14)',
        },
      },
      comparablePriceTheme: () => ({
        color: 'var(--color-neutral-1)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 'normal',
        fontSize: 'var(--text-12)',
        mb: '1px', // missing design tokens
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-14)',
        },
      }),
      priceWrapper: () => ({
        '.comparablePriceWrapper + .salePriceWrapper': {
          '.salesPrice': {
            color: 'var(--color-black-base)',
          },
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.salePriceWrapper:has(> .dohPrice):has(> .discount-percentage)': {
            alignItems: 'center',
            '> .dohPrice': {
              fontFamily: 'var(--font-face1-normal)',
              color: 'var(--color-neutral-medium)',
              p: 'unset',
            },
            '> span:not(.dohPrice):not(.discount-percentage)': {
              fontFamily: 'var(--font-face1-normal)',
              color: 'var(--color-black-base)',
              fontSize: 'var(--text-12)',
              fontWeight: 700,
            },
            '> .discount-percentage': {
              color: 'var(--color-success-primary)',
              fontFamily: 'var(--font-face1-normal)',
              fontSize: 'var(--text-12)',
              p: 'unset',
            },
          },
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& .salesPrice': {
            color: 'var(--color-black-base)',
            fontWeight: 'bold',
          },
          '.salePriceWrapper:has(> .dohPrice):has(> .discount-percentage)': {
            alignItems: 'center',
            '> .dohPrice': {
              fontFamily: 'var(--font-face1-normal)',
              color: 'var(--color-neutral-medium)',
              p: 'unset',
            },
            '> span:not(.dohPrice):not(.discount-percentage)': {
              fontFamily: 'var(--font-face1-normal)',
              color: 'var(--color-black-base)',
              fontSize: 'var(--text-14)',
              fontWeight: 700,
            },
            '> .discount-percentage': {
              color: 'var(--color-success-primary)',
              fontFamily: 'var(--font-face1-normal)',
              fontSize: 'var(--text-14)',
              p: 'unset',
            },
          },
        },
      }),
    }),
  },
}
