export default {
  parts: ['DisPercentageText', 'PriceTaxIncluded'],
  baseStyle: ({ theme }) => ({
    DisPercentageText: ({ isBundleProduct, isBundleVariant }) => ({
      color: theme.colors.main.saleRed,
      fontSize: isBundleProduct || isBundleVariant ? theme.fontSizes.sm : theme.fontSizes.md,
    }),
    PriceTaxIncluded: ({ isMobile }) => ({
      ...theme.typography['text-body2-m'],
      fontSize: isMobile ? theme.fontSizes.xs : theme.fontSizes.sm,
      fontWeight: '500',
    }),
    StandardPriceWrapper: () => ({
      bg: 'none',
    }),
    ListPriceWrapper: () => ({
      bg: 'none',
    }),
    PriceInfoBox: () => ({
      bg: 'none',
    }),
    salePriceCaption: () => ({
      bg: 'none',
    }),
    DisPercentage: () => ({
      mx: 's',
    }),
  }),
}
