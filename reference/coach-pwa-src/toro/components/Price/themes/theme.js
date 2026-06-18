export const plpV3DOHStyles = {
  '.salePriceWrapper:has(> .dohPrice):has(> .discount-percentage)': {
    alignItems: 'center',
    '> .dohPrice': {
      order: '2 !important',
      fontFamily: 'var(--font-face1-normal)',
      textDecoration: 'line-through',
      color: 'var(--color-neutral-1)',
      mr: 'var(--spacing-1)',
      p: 'unset',
    },
    '> .discount-percentage': {
      order: '3 !important',
      color: 'var(--color-success-primary)',
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'normal',
      fontSize: 'var(--text-12)',
      [`@media (min-width: 769px)`]: {
        fontSize: 'var(--text-14)',
      },
      p: 'unset',
    },
    '> span:not(.dohPrice):not(.discount-percentage)': {
      order: 1,
      fontFamily: 'var(--font-face1-bold)',
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-xl)',
      fontSize: 'var(--text-12)',
      [`@media (min-width: 769px)`]: {
        fontSize: 'var(--text-14)',
      },
    },
  },
}

const mobileVariantStyles = ({ exposed = false }) => ({
  prices: {
    fontFamily: 'var(--font-face1-extended-normal)',
    color: `var(${exposed ? '--color-primary' : '--scheme-text-color'})`,
    lineHeight: 'var(--line-height-xl)',
    fontSize: 'var(--text-14)',
  },
  strikethroughListPriceText: {
    fontFamily: 'var(--font-face1-extended-normal)',
    color: `var(${exposed ? '--color-primary' : '--scheme-secondary-text-color'})`,
  },
  discPercent: () => ({
    ml: 's',
    color: `var(${exposed ? '--color-neutral-1' : '--scheme-list-price-color'})`,
  }),
  priceWrapper: () => ({
    '.salePriceWrapper:has(> .dohPrice):has(> .discount-percentage)': {
      alignItems: 'center',
      letterSpacing: 'var(--letter-spacing-xs)',
      '> .dohPrice': {
        order: '1 !important',
        fontFamily: 'var(--font-face1-normal)',
        textDecoration: 'line-through',
        lineHeight: 'var(--line-height-xl)',
        color: `var(${
          exposed ? '--color-neutral-1' : '--scheme-suggestions-strikethrough-text-color'
        })`,
        fontSize: 'var(--text-14)',
        p: 'unset',
        ml: 0,
        mr: 0,
      },
      '> span:not(.dohPrice):not(.discount-percentage)': {
        order: 2,
        fontFamily: 'var(--font-face1-bold)',
        fontWeight: 'normal',
        color: `var(${exposed ? '--color-primary' : '--scheme-suggestions-product-text-color'})`,
        lineHeight: 'var(--line-height-xl)',
        fontSize: 'var(--text-14)',
        ml: 'var(--spacing-2)',
        mr: 0,
      },
      '> .discount-percentage': {
        order: '3 !important',
        color: `var(${exposed ? '--color-primary' : '--scheme-suggestions-product-text-color'})`,
        lineHeight: 'var(--line-height-xl)',
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        ml: 'var(--spacing-2)',
        p: 'unset',
      },
    },
  }),
})

const newPlpPriceStyle = (theme) => ({
  prices: {
    fontFamily: theme.fontFamily.primaryBold,
    color: theme.colors.main.black,
    lineHeight: 'var(--line-height-xl)',
    fontSize: 'var(--text-12)',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      fontWeight: 400,
      fontSize: 'var(--text-14)',
    },
  },
  discPercent: () => ({
    color: 'var(--color-success-primary)',
    fontFamily: 'var(--font-face1-normal)',
    letterSpacing: 'var(--letter-spacing-xs)',
    fontWeight: 'normal',
    fontSize: 'var(--text-12)',
    ml: theme.space.xs,
  }),
  strikethroughListPriceText: {
    fontFamily: theme.fontFamily.primaryNormal,
    textDecoration: 'line-through',
    color: 'var(--color-neutral-1)',
    ml: theme.space.xs,
  },
  bundleListPriceCaption: {
    fontSize: 'var(--text-12)',
    fontFamily: theme.fontFamily.primaryNormal,
    color: 'var(--color-neutral-1, #4A4A4A)',
    lineHeight: 'var(--line-height-xl)',
    letterSpacing: 'var(--letter-spacing-xs)',
    fontWeight: '400',
    marginLeft: '6px',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      fontSize: 'var(--text-14)',
    },
  },
})

export default {
  parts: [
    'discPercent',
    'dohPromoPrice',
    'dohPromoPricePercentage',
    'outletDiscountPrice',
    'priceWrapper',
    'prices',
    'strikethroughText',
    'renderSalePriceWrapper',
    'mainPrice',
    'kssPriceWrapper',
    'strikethroughListPriceText',
    'bundleListPriceCaption',
  ],
  baseStyle: ({ theme }) => ({
    priceWrapper: () => ({}),
    discPercent: () => ({
      ml: 's',
      color: theme.colors.main.gray,
    }),
    prices: {
      fontFamily: 'var( --font-face2-normal)',
      '&.dohPrice': {
        color: theme.colors.main.gray,
      },
    },
    dohPromoPrice: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.main.saleRed,
    },
    dohPromoPricePercentage: {
      ml: theme.space.xs,
      pt: theme.space.xs,
      color: theme.colors.main.gray,
    },
    outletDiscountPrice: {
      ml: 's',
    },
    renderSalePriceWrapper: {
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    removeStrikethroughTextProps: {
      textDecoration: 'none',
    },
    fullWidth: {
      width: '100%',
    },
    mainPrice: ({ showRed }) => ({
      fontFamily: theme.fontFamily.secondaryNormal,
      color: showRed ? theme.colors.main.saleRed : theme.colors.main.black,
    }),
    comparablePriceTheme: () => ({}),
    strikethroughListPriceText: {},
    oneCoachComparablePriceTheme: {
      color: 'var(--color-neutral-1)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 'normal',
      fontSize: 'var(--text-12)',
      mb: '1px', // missing design tokens
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-14)',
      },
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      ...newPlpPriceStyle(theme),
      renderSalePriceWrapper: {
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'center',
      },
      priceWrapper: () => ({
        ...plpV3DOHStyles,
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: 'bold',
        },
      }),
      strikethroughListPriceText: {
        color: 'var(--color-neutral-1)',
      },
    }),
    searchSuggestionsMobileV2: ({ theme }) => ({
      ...mobileVariantStyles({ theme }),
    }),
    searchSuggestionsExposed: ({ theme }) => ({
      ...mobileVariantStyles({ theme, exposed: true }),
    }),
  },
}
