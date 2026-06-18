const tabbedAdaptivePDPStyles = ({ theme }) => ({
  PriceInfoWrapper: () => ({
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      gap: 'var(--spacing-1)',
    },
  }),
  SalePriceRedText: () => ({
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-error-primary)',
    },
  }),
  SalePriceBlackText: () => ({
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      ...theme.typography['text-display1-xs'],
      fontWeight: 700,
    },
  }),
  ListPriceText: () => ({
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      color: 'var(--color-neutral-1)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textDecoration: 'line-through',
    },
  }),
  DisPercentageText: () => ({
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      color: 'var(--color-success-primary)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
  }),
})

export default {
  baseStyle: ({ theme }) => ({
    SalePriceBlackText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    }),
    SalePriceRedText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-error-primary)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    }),
    StandardPriceWrapper: () => ({
      minHeight: 'auto',
    }),
    ListPriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-neutral-medium)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 1,
        textDecorationLine: 'strikethrough',
        m: 0,
      },
    }),
    DisPercentage: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 'auto',
        mx: 0,
      },
    }),
    DisPercentageText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: '#696969',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: 'var(--letter-spacing-xs)',
        ml: 0,
      },
    }),
    PriceInfoBox: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 'auto',
        mr: 0,
      },
    }),
    ListPriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: 'auto !important',
        mx: 0,
        '&.discount-percent': {
          minHeight: 'auto !important',
        },
      },
    }),
    PriceInfoWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        gap: 'var(--spacing-3) 6px',
        alignItems: 'center',
        height: 'auto',
        lineHeight: 'auto',
      },
    }),
    PriceTaxIncluded: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: theme.fontSizes.xs,
        fontWeight: '500',
      },
    }),
    BundlePriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        my: 0,
        gap: 'var(--spacing-2)',
      },
    }),
    salePriceCaptionStyle: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        mr: 0,
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
      },
    },
    salePriceCaption: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        minHeight: '0',
        mr: 0,
      },
    }),
    StrikeThroughPriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-xl)',
        color: 'var(--color-neutral-medium)',
      },
    }),
    BundlePriceInfo: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-xl)',
        color: 'var(--color-primary)',
        pr: 0,
      },
    },
  }),
  variants: {
    bundle: ({ theme }) => ({
      PriceInfoWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 0,
          gap: 'var(--spacing-3) 6px',
          alignItems: 'center',
          height: 'auto',
          lineHeight: 'auto',
        },
      }),
    }),
    plpV3Pricing: ({ theme }) => ({
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
    adaptiveTabbedPDP: ({ theme }) => tabbedAdaptivePDPStyles({ theme }),
    adaptiveTabbedPDP_1: ({ theme }) => ({
      ...tabbedAdaptivePDPStyles({ theme }),
      DisPercentageText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-12)',
          fontStyle: 'normal',
          color: 'var(--color-success-primary)',
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
      SalePriceBlackText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-bold)',
          fontSize: 'var(--text-12)',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      }),
    }),
  },
}
