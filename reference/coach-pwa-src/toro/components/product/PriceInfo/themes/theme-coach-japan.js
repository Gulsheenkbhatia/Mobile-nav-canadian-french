export default {
  parts: [
    'SalePriceBlackText',
    'DisPercentageText',
    'ListPriceText',
    'SalePriceRedText',
    'PriceTaxIncluded',
  ],
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: ({ isMobile, isSticky }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-display2-s'],
          }
        : isSticky
        ? theme.typography['text-display2-s']
        : theme.typography['text-display2-l']),
    }),
    DisPercentageText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-body2-s'],
          }
        : theme.typography['text-body2-m']),
    }),
    PriceTaxIncluded: ({ isMobile, isSticky }) => ({
      ...theme.typography['text-body2-m'],
      fontSize: isMobile ? theme.fontSizes.xs : theme.fontSizes.sm,
      fontWeight: '500',
      color: 'var(--color-neutral-base)',
      ml: !isMobile && isSticky && 'var(--spacing-1)',
    }),
    ListPriceText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-body2-s'],
            textDecoration: 'line-through',
          }
        : {
            ...theme.typography['text-body2-m'],
            marginRight: 'var(--chakra-space-s)',
            textDecoration: 'line-through',
          }),
    }),
    SalePriceRedText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-display2-s'],
          }
        : theme.typography['text-display2-l']),
    }),
  }),
}
