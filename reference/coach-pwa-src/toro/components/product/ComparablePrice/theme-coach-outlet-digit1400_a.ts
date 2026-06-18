const comparablePriceThemePlpV3 = {
  lineHeight: 'var(--line-height-140)',
  fontWeight: 400,
  color: 'var(--color-neutral-1)',
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-12)',
}

export default {
  parts: ['comparablePriceText', 'comparablePriceValue', 'comparablePriceContainer'],
  baseStyle: ({ theme }) => ({
    comparablePriceContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '8px',
      },
    }),
    comparablePriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        paddingTop: '2px',
        margin: 0,
      },
    }),
    comparablePriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontStyle: 'normal',
        lineHeight: 1,
        fontWeight: 400,
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-12)',
      },
    }),
    comparablePriceValue: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontStyle: 'normal',
        lineHeight: 1,
        fontWeight: 400,
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-12)',
      },
    }),
    comparablePrice: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        px: 'var(--spacing-1)',
      },
    },
  }),
  variants: {
    bundle: ({ theme }) => ({
      comparablePriceWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pt: 0,
        },
      }),
    }),
    plpV3Pricing: ({ theme }) => ({
      comparablePriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          ...comparablePriceThemePlpV3,
        },
      }),
      comparablePriceValue: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          ...comparablePriceThemePlpV3,
        },
      }),
      comparablePriceContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: '3.5px',
        },
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      comparablePriceContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: '1px',
        },
      }),
      comparablePriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...comparablePriceThemePlpV3,
        },
      }),
      comparablePriceValue: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...comparablePriceThemePlpV3,
        },
      }),
    }),
    adaptiveTabbedPDP_1: ({ theme }) => ({
      comparablePriceWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pt: '1px',
        },
      }),
      comparablePriceContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: 0,
          p: 0,
        },
      }),
      comparablePriceValue: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...comparablePriceThemePlpV3,
          fontSize: 'var(--text-10)',
          color: 'var(--color-black-base)',
        },
      }),
      comparablePriceText: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...comparablePriceThemePlpV3,
          fontSize: 'var(--text-10)',
          color: 'var(--color-black-base)',
        },
      }),
    }),
  },
}
