export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: ({ isQuickView, isMobile, isSticky, isBundleVariant }) => ({
      color: theme.colors.main.black,
      pt: isBundleVariant && '1px',
      ...(isQuickView
        ? theme.typography['text-display2-m']
        : isBundleVariant
        ? theme.typography['text-display2-xs']
        : isMobile
        ? isSticky
          ? theme.typography['text-display2-xs']
          : !isBundleVariant
          ? theme.typography['text-display2-m']
          : theme.typography['text-display2-s']
        : theme.typography['text-display2-s']),
    }),
    SalePriceRedText: ({ fontSize, isQuickView }) => ({
      color: theme.colors.main.saleRed,
      fontFamily: theme.fontFamily.secondaryNormal,
      fontWeight: 'normal',
      fontSize,
      lineHeight: isQuickView ? theme.lineHeights.s : '1',
    }),
    ListPriceText: ({ isQuickView, isMobile, isSticky }) => ({
      ...(isQuickView
        ? theme.typography['text-body2-s']
        : isMobile & !isSticky
        ? theme.typography['text-body2-s']
        : theme.typography['text-body2-m']),
      color: 'var(--color-neutral-base)',
      textDecoration: 'line-through',
    }),
    DisPercentageText: ({ isMobile, isQuickView, isKsSur }) => ({
      ...(isQuickView
        ? {
            ...theme.typography['text-body2-s'],
            mt: 0,
          }
        : isMobile
        ? theme.typography['text-body2-s']
        : theme.typography['text-body2-m']),
      color: isKsSur ? 'var(--color-sale)' : 'var(--color-neutral-base)',
    }),
    DisPercentage: ({ isQuickView }) => ({
      mr: 'var(--spacing-2)',
      ...(isQuickView
        ? {
            display: 'flex',
            alignItems: 'center',
          }
        : {}),
      minHeight: !isQuickView ? '0px' : '38px',
    }),
    PriceInfoBox: ({ isSticky }) => ({
      bg: 'none',
      ...(isSticky ? { display: 'flex', alignItems: 'center' } : {}),
    }),
    salePriceCaption: () => ({
      bg: 'none',
    }),
    StandardPriceWrapper: () => ({
      bg: 'none',
    }),
    ListPriceWrapper: () => ({
      bg: 'none',
    }),
    BundlePriceInfo: {
      pr: 'var(--spacing-2)',
      color: 'var(--color-primary)',
      ...theme.typography['text-display2-xs'],
    },
    salePriceCaptionStyle: {
      ...theme.typography['text-body2-m'],
    },
    StrikeThroughPriceText: (isMobile, isBundleProduct) => ({
      ...(isBundleProduct
        ? isMobile
          ? theme.typography['text-body2-s']
          : theme.typography['text-body2-m']
        : theme.typography['text-body2-s']),
    }),
    priceSectionPipe: (isBundleProduct) => ({
      ...(isBundleProduct ? theme.typography['text-body2-m'] : {}),
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-m'],
        },
      }),
      ListPriceText: () => ({
        ...theme.typography['text-body1-s'],
        color: '#696969',
        textDecoration: 'line-through',
      }),
      DisPercentageText: () => ({
        ...theme.typography['text-body1-s'],
        color: theme.colors.main.saleRed,
      }),
      DisPercentOffText: {
        color: theme.colors.main.saleRed,
      },
      PriceInfoWrapper: () => ({
        alignItems: 'baseline',
        gap: 'var(--spacing-1)',
      }),
    }),
    plpV3Pricing: ({ theme }) => ({
      SalePriceRedText: () => ({
        color: theme.colors.main.saleRed,
      }),
      DisPercentageText: () => ({
        color: theme.colors.main.saleRed,
      }),
    }),
  },
}
