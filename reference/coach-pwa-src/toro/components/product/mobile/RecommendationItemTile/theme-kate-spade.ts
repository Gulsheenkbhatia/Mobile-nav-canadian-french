export default {
  baseStyle: ({ theme }) => ({
    tileNameWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        textAlign: 'center',
        mt: 'var(--spacing-4)',
      },
      '& p': {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-4)',
          textAlign: 'center',
          fontFamily: 'var(--font-face1-medium)',
          fontSize: 'var(--text-16)',
        },
      },
    },
    tilePriceWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        alignItems: 'center',
        textAlign: 'center',
        mt: 'var(--spacing-3)',
      },
    },
    tilePriceText: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        textAlign: 'center',
        fontFamily: 'var(--font-face1-medium)',
        fontSize: '16px',
      },
    },
    addToBagButton: {
      button: {
        padding: 'var(--spacing-4) var(--spacing-6) var(--spacing-4) var(--spacing-6)',
      },
      wrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-3)',
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
