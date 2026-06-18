export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: ({ isQuickView, isMobile, isSticky, isBundleVariant }) => ({
      color: theme.colors.main.black,
      pt: isBundleVariant && '1px',
      ...(isQuickView
        ? isMobile
          ? theme.typography['text-display2-s']
          : theme.typography['text-display2-l']
        : isBundleVariant
        ? theme.typography['text-display2-xs']
        : isMobile
        ? isSticky
          ? theme.typography['text-display2-s']
          : !isBundleVariant
          ? theme.typography['text-display2-l']
          : theme.typography['text-display2-s']
        : isSticky
        ? theme.typography['text-display2-s']
        : theme.typography['text-display2-l']),
    }),
    ListPriceText: ({ isQuickView, isMobile, isSticky }) => ({
      ...(isQuickView
        ? theme.typography['text-body2-m']
        : isMobile & !isSticky
        ? theme.typography['text-body2-s']
        : theme.typography['text-body2-m']
        ? isSticky
          ? theme.typography['text-body2-s']
          : theme.typography['text-body2-m']
        : theme.typography['text-body2-m']),
      color: 'var(--color-neutral-base)',
      textDecoration: 'line-through',
    }),
    DisPercentageText: ({ isMobile, isQuickView }) => ({
      ...(isQuickView
        ? {
            ...theme.typography['text-body2-m'],
            mt: 0,
          }
        : isMobile
        ? theme.typography['text-body2-s']
        : theme.typography['text-body2-m']),
      color: 'var(--color-neutral-base)',
    }),
    SalePriceRedText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-display2-s'],
          }
        : theme.typography['text-display2-l']),
    }),
    PriceTaxIncluded: ({ isMobile, isSticky }) => ({
      ...(isMobile ? theme.typography['text-body2-s'] : theme.typography['text-body2-m']),
      color: 'var(--color-neutral-base)',
      ml: !isMobile && isSticky && 'var(--spacing-1)',
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      DisPercentageText: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-primary)',
      }),
      DisPercentOffText: {
        color: theme.colors.main.gray,
      },
    }),
  },
}
