export default {
  parts: ['StrikeThroughPriceText'],
  baseStyle: ({ theme }) => ({
    PriceInfoBox: () => ({
      bg: 'none',
      alignItems: 'center',
    }),

    DealPriceBox: ({ salePrice, isSticky }) => ({
      mr: isSticky ? '0' : 'var(--spacing-1)',
      display: 'flex',
      alignItems: 'center',
      bg: salePrice === undefined ? theme.colors.main.inactive : '',
    }),

    DealPriceWrapper: () => ({
      alignItems: 'center',
      gap: 'var(--spacing-1)',
    }),

    StrikeThroughPriceText: () => ({
      mb: 'var(--spacing-1)',
    }),

    DisPercentOffText: {
      mb: 'var(--spacing-1)',
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      DealPriceText: () => ({
        ...theme.typography['text-body2-m'],
        color: theme.colors.main.saleRed,
      }),
      StrikeThroughPriceText: () => ({
        ...theme.typography['text-body1-s'],
      }),
      DisPercentOffText: {
        ...theme.typography['text-body1-s'],
        mb: 0,
        color: 'var(--color-primary)',
      },
      DisPercentageText: () => ({
        ...theme.typography['text-body1-s'],
        color: 'var(--color-primary)',
      }),
    }),
    plpV3Pricing: ({ theme }) => ({
      ListPriceText: () => ({
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face2-normal)',
        textDecoration: 'line-through',
      }),
    }),
  },
}
