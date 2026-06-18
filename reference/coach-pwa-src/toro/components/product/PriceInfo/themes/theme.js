export default {
  parts: [
    'DealPriceWrapper',
    'DealPriceBox',
    'DealPriceText',
    'DisPercentOff',
    'DisPercentOffText',
    'StandardPriceWrapper',
    'StandardPriceText',
    'PriceInfoWrapper',
    'PriceInfoBox',
    'SalePriceRedText',
    'SalePriceBlackText',
    'ListPriceWrapper',
    'ListPriceText',
    'DisPercentage',
    'DisPercentageText',
    'BundlePriceInfo',
    'PriceTaxIncluded',
    'StrikeThroughPriceText',
  ],
  baseStyle: ({ theme }) => ({
    DealPriceWrapper: ({ isMobile, isSticky, isImplicitPromotion }) => ({
      alignItems: 'center',
      mt: isMobile ? (isSticky && isImplicitPromotion ? '-5px' : '5px') : '',
      mr: isMobile && isSticky && isImplicitPromotion && '90px',
      pt: isMobile ? '5px' : '',
    }),
    DealPriceBox: ({ salePrice }) => ({
      mr: 'xs',
      display: 'flex',
      alignItems: 'center',
      bg: salePrice === undefined ? theme.colors.main.inactive : '',
    }),
    DealPriceText: ({ isQuickView, variant, isMobile, isSticky, isImplicitPromotion }) => ({
      color: theme.colors.main.saleRed,

      fontSize:
        isQuickView || variant === 'mobile' || isMobile
          ? isSticky && isImplicitPromotion
            ? theme.fontSizes.lg
            : theme.fontSizes.xl
          : theme.fontSizes.xl,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
    }),
    DisPercentOff: {
      mr: 's',
    },
    DisPercentOffText: {
      color: theme.colors.main.gray,
    },
    StandardPriceWrapper: ({ salePrice, isCustom, isBundleProduct }) => ({
      mr: 's',
      bg:
        salePrice === undefined && !isCustom && !isBundleProduct ? theme.colors.main.inactive : '',
      display: 'flex',
      alignItems: 'center',
    }),
    salePriceCaption: ({ salePrice, isBundleProduct }) => ({
      bg: salePrice === undefined && !isBundleProduct ? theme.colors.main.inactive : '',
    }),
    StandardPriceText: {
      textDecoration: 'line-through',
      color: theme.colors.main.gray,
    },
    PriceInfoWrapper: () => ({
      alignItems: 'center',
      gap: theme.space.s,
    }),
    PriceInfoBox: ({ salePrice, isCustomized, isBundleProduct }) => ({
      mr: 's',
      bg:
        salePrice === undefined
          ? !isCustomized && !isBundleProduct
            ? theme.colors.main.inactive
            : ''
          : '',
      minHeight: theme.space.xxl,
    }),
    SalePriceRedText: ({ isMobile, isQuickView, isSticky, isBundleVariant }) => ({
      color: theme.colors.main.saleRed,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
      fontSize:
        isQuickView || isMobile
          ? theme.fontSizes.xl
          : isSticky && !isMobile
          ? theme.fontSizes.md
          : isBundleVariant
          ? theme.fontSizes.lg
          : theme.fontSizes.double,
    }),
    SalePriceBlackText: ({ isMobile, isQuickView, isSticky, isBundleVariant }) => ({
      color: theme.colors.main.black,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
      fontSize:
        isQuickView || isMobile
          ? theme.fontSizes.xl
          : isSticky && !isMobile
          ? theme.fontSizes.md
          : isBundleVariant
          ? theme.fontSizes.lg
          : theme.fontSizes.double,
    }),
    ListPriceWrapper: ({ listPrice }) => ({
      alignItems: 'center',
      mr: 'xs',
      bg: listPrice === undefined ? theme.colors.main.inactive : '',
      '&.discount-percent': {
        '@media (max-width: 769px)': {
          minHeight: '24px !important',
          '.price-text': {
            lineHeight: '25px',
          },
        },
      },
    }),
    PriceTaxIncluded: ({ isMobile, isSticky }) => ({
      whiteSpace: isSticky && 'nowrap',
      fontSize: isMobile ? theme.fontSizes.xs : theme.fontSizes.sm,
      color: 'var(--color-neutral-base)',
      display: isSticky && 'flex',
      alignItems: isSticky && !isMobile && 'center',
    }),
    ListPriceText: ({ isMobile }) => ({
      textDecoration: 'line-through',
      color: theme.colors.neutral.dark,
      fontSize: isMobile ? theme.fontSizes.sm : theme.fontSizes.md,
    }),
    DisPercentage: () => ({
      mr: 's',
    }),
    DisPercentageText: ({ isBundleProduct, isBundleVariant }) => ({
      color: theme.colors.main.gray,
      fontSize: isBundleProduct || isBundleVariant ? theme.fontSizes.sm : theme.fontSizes.md,
    }),
    BundlePriceInfo: {
      fontWeight: 'normal',
      fontFamily: theme.fontFamily.secondaryNormal,
      color: theme.colors.black,
      fontSize: theme.fontSizes.lg,
      lineHeight: theme.lineHeights.s,
      pr: '8px',
    },
    bundlePriceWrapper: () => {},
  }),
  variants: {
    plpV3Pricing: ({ theme }) => ({
      PriceInfoBox: () => ({
        mr: '0',
      }),
      ListPriceWrapper: () => ({
        mr: '0',
      }),
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-20)',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'var(--line-height-120)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
      SalePriceRedText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-20)',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'var(--line-height-120)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
      ListPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'rgba(109, 109, 109, 0.87)', // missed in design-token
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
          textDecorationLine: 'line-through',
          m: 0,
        },
        textDecorationLine: 'line-through',
      }),
      StrikeThroughPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          lineHeight: 'var(--line-height-xl)',
          color: 'rgba(109, 109, 109, 0.87)', // missed in design-token
        },
      }),
      DisPercentageText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
          color: '#057550',
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-16)',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'var(--line-height-135)',
          letterSpacing: 'var(--letter-spacing-xs)',
          ml: 0,
        },
      }),
    }),
  },
}
