const comparablePriceThemeAdaptivePDP = {
  lineHeight: 'var(--line-height-140)',
  fontWeight: 400,
  color: 'var(--color-neutral-1)',
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-12)',
}

export default {
  parts: ['comparablePriceContainer', 'comparablePriceWrapper'],
  baseStyle: ({ theme }) => ({
    comparablePriceContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 'calc(var(--spacing-3) + 1px)',
      },
    }),
    comparablePriceWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 0,
        position: 'relative',
        pt: 'var(--spacing-3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          height: '1px',
          width: '12px',
          backgroundColor: '#d4d4d4',
          top: 0,
        },
      },
    }),
    comparablePriceText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-xl)',
        fontWeight: 400,
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
      },
    }),
    comparablePriceValue: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-xl)',
        fontWeight: 400,
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-face1-normal)',
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
      comparablePriceContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 0,
        },
      }),
      comparablePriceWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pt: 'var(--spacing-2)',
          mt: 'var(--spacing-3)',
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
          ...comparablePriceThemeAdaptivePDP,
        },
      }),
      comparablePriceValue: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...comparablePriceThemeAdaptivePDP,
        },
      }),
    }),
  },
}
