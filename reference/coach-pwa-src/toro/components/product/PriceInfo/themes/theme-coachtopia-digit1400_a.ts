export default {
  parts: [
    'PriceInfoBox',
    'ListPriceWrapper',
    'SalePriceRedText',
    'SalePriceBlackText',
    'ListPriceText',
    'StrikeThroughPriceText',
    'DisPercentageText',
  ],
  baseStyle: () => ({}),
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
    adaptiveTabbedPDP: ({ theme }) => ({
      PriceInfoWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          gap: 'var(--spacing-1)',
        },
      }),
      PriceInfoBox: () => ({
        minHeight: 0,
        marginRight: 0,
      }),
      SalePriceRedText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extrabold)',
          fontSize: 'var(--text-14)',
          fontWeight: 800,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-error-primary)',
        },
      }),
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extrabold)',
          fontSize: 'var(--text-14)',
          fontWeight: 800,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
      ListPriceWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          minHeight: 0,
          marginRight: 0,
        },
      }),
      ListPriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          fontStyle: 'normal',
          color: 'var(--color-neutral-1)',
          fontWeight: 500,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textDecoration: 'line-through',
        },
      }),
      DisPercentage: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginRight: 0,
        },
      }),
      DisPercentageText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          fontStyle: 'normal',
          color: 'var(--color-success-primary)',
          fontWeight: 500,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
    }),
  },
}
