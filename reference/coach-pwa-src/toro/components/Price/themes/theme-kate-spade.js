const searchSuggestionsCommonStyles = (theme) => ({
  prices: {
    fontFamily: theme.fontFamily.primaryBold,
  },
  strikethroughListPriceText: {
    fontFamily: theme.fontFamily.primaryNormal,
  },
  priceWrapper: () => ({
    '.salePriceWrapper:has(> .dohPrice):has(> .discount-percentage)': {
      '> .discount-percentage': {
        fontFamily: 'var(--font-face1-normal)',
      },
    },
  }),
})

export default {
  parts: [
    'comparablePriceTheme',
    'discPercent',
    'strikethroughListPriceText',
    'comparablePriceWrapper',
  ],
  baseStyle: ({ theme }) => ({
    priceWrapper: () => ({
      justifyContent: 'center',
      alignItems: 'center',
    }),
    kssPriceWrapper: {
      '.comparablePriceWrapper + .salePriceWrapper': {
        '.salesPrice': {
          color: '#cc0000',
        },
      },
    },
    dohPromoPrice: {
      ...theme.typography['text-body2-m'],
      color: theme.colors.main.saleRed,
    },
    dohPromoPricePercentage: {
      ...theme.typography['text-body2-m'],
      color: theme.colors.main.gray,
      pt: 0,
    },
    discPercent: ({ isKsSur }) => ({
      color: isKsSur ? 'var(--color-sale)' : 'var(--color-neutral-base)',
      fontSize: isKsSur ? 'var(--text-12)' : null,
      alignSelf: isKsSur ? 'flex-start' : null,
      ml: 'var(--spacing-2)',
    }),
    strikethroughText: {
      color: 'var(--color-neutral-base)',
    },
    prices: {
      ...theme.typography['text-body2-m'],
      '&.dohPrice': {
        color: theme.colors.main.gray,
        pt: 0,
      },
    },
    sameRangePrice: {
      ...theme.typography['text-body2-m'],
    },
    comparablePriceWrapper: {
      my: 'var(--spacing-1)',
    },
    comparablePriceTheme: () => ({
      ...theme.typography['text-body2-s'],
    }),
  }),

  variants: {
    searchSuggestions: ({ theme }) => ({
      priceWrapper: () => ({
        justifyContent: 'initial',
        alignItems: 'initial',
      }),
      prices: {
        ...theme.typography['text-body2-s'],
      },
      searchPrices: {
        ...theme.typography['text-body2-s'],
      },
    }),
    plpV3: ({ theme }) => ({
      priceWrapper: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&.with-comparable-price .salesPrice': {
            color: 'var(--color-error-primary, #D50032)',
          },
        },
      }),
      comparablePriceWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          my: '0',
        },
      },
      prices: {
        ...theme.typography['text-body2-s'],
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.ksOutletBundlePrice': {
            flexDirection: 'column',
            color: 'var(--color-black-base)',
            '.bundlePriceContent': {
              color: 'var(--color-black-base)',
              '& span:first-child': {
                fontWeight: '500',
              },
              '&.bundlePriceContentWithDiscount': {
                color: 'var(--color-error-primary)',
              },
            },
            '.ksOutletBundlePriceCaption': {
              color: 'var(--color-neutral-dark)',
            },
          },
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'], // Medium
          fontSize: 'var(--text-14)',
          '&.priceRange': {
            color: 'var(--color-error-primary, #D50032)',
          },
        },
      },
      kssPriceWrapper: {
        '.comparablePriceWrapper + .salePriceWrapper': {
          '.salesPrice': {
            color: 'var(--color-error-primary)',
          },
        },
      },
      discPercent: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-error-primary)',
        ml: 'var(--spacing-1)',
        mr: 'var(--spacing-1)',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'], // Medium
          color: 'var(--color-error-primary, #D50032)',
          marginRight: 'var(--spacing-0, 0px)',
        },
      }),
      comparablePriceTheme: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-neutral-dark)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: '400',
          color: 'var(--color-neutral-1, #6D6D6D)',
          marginBottom: '2px',
        },
      }),
      strikethroughListPriceText: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-neutral-dark)',
        ml: 'var(--spacing-1)',
        [`@media (max-width:  ${theme.breakpoints.sm})`]: {
          marginTop: 0,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: '400',
          textDecoration: 'line-through',
          color: 'var(--color-neutral-medium, #696969)',
          marginTop: '0px',
          marginRight: '0px',
        },
      },
      bundleListPriceCaption: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-12)',
        },
      },
    }),
    searchSuggestionsMobileV2: ({ theme }) => ({
      ...searchSuggestionsCommonStyles(theme),
    }),
    searchSuggestionsExposed: ({ theme }) => ({
      ...searchSuggestionsCommonStyles(theme),
    }),
  },
}
