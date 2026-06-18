const defaultTextAttributes = {
  fontWeight: 400,
  lineHeight: 1,
  fontFamily: 'var(--font-face1-normal)',
  fontStyle: 'normal',
  letterSpacing: 'var(--letter-spacing-xs)',
}

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
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
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
      color: 'var(--color-primary)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
  }),
})

export default {
  baseStyle: ({ theme }) => ({
    salePriceCaptionStyle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-m'],
        ...defaultTextAttributes,
        fontSize: 'var(--text-14)',
        color: 'var(--color-neutral-medium)',
      },
    },
    SalePriceBlackText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-body1-l'],
            ...defaultTextAttributes,
            fontSize: 'var(--text-16)',
            color: 'var(--color-black-base)',
            lineHeight: 1,
          }
        : {}),
    }),
    SalePriceRedText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-body1-l'],
            ...defaultTextAttributes,
            fontSize: 'var(--text-16)',
            color: 'var(--color-error-primary)',
            lineHeight: 1,
          }
        : {}),
    }),
    DisPercentageText: ({ isMobile }) => ({
      ...(isMobile
        ? {
            ...theme.typography['text-body1-m'],
            ...defaultTextAttributes,
            color: 'var(--color-error-primary)',
            mx: 0,
          }
        : {}),
    }),
    DisPercentage: ({ isMobile }) => ({
      ...(isMobile
        ? {
            minHeight: 'auto',
            m: 0,
          }
        : {}),
    }),
    ListPriceWrapper: ({ isMobile }) => ({
      ...(isMobile
        ? {
            minHeight: 'auto',
            mx: 0,
          }
        : {}),
    }),
    PriceInfoBox: ({ isMobile }) => ({
      ...(isMobile
        ? {
            minHeight: 'auto',
            mr: 0,
          }
        : {}),
    }),
    PriceInfoWrapper: ({ isMobile }) => ({
      ...(isMobile
        ? {
            gap: '6px',
            alignItems: 'center',
            height: 'auto',
            mt: 0,
          }
        : {}),
    }),
    BundlePriceWrapper: ({ isMobile }) => ({
      ...(isMobile
        ? {
            gap: '6px',
            alignItems: 'center',
            height: 'auto',
            mb: 'unset',
            mt: 'unset',
          }
        : {}),
    }),
    StandardPriceWrapper: ({ isMobile }) => ({
      ...(isMobile ? { minHeight: 'auto' } : {}),
    }),
    salePriceCaption: ({ isMobile }) => ({
      ...(isMobile ? { minHeight: 'auto', mr: 0 } : {}),
    }),
  }),
  variants: {
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
      DisPercentageText: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-l'],
          color: 'var(--color-seafoam-green)',
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
