export default {
  baseStyle: ({ theme }) => ({
    tileNameWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        textAlign: 'center',
        mt: 'var(--spacing-4)',
      },
      '& p': {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-16)',
          color: 'var(--color-standout-primary, #333)',
          textAlign: 'center',
        },
      },
    },
    tilePriceWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        alignItems: 'center',
        textAlign: 'center',
        mt: 'var(--spacing-2)',
      },
    },
    tilePriceText: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        textAlign: 'center',
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
        color: 'var(--color-standout-primary, #333)',
      },
    },
    tileStrikeoffPrice: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: theme.fontSizes.md,
      },
    },
    addToBagButton: {
      button: {
        padding: 'var(--spacing-4) var(--spacing-6) var(--spacing-4) var(--spacing-6)',
      },
      wrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
        },
      },
      buttonText: { p: 0 },
    },
    saveForLaterPosition: {
      display: 'none',
      visibility: 'hidden',
    },
  }),
}
