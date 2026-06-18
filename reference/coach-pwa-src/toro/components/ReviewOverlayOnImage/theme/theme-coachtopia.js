export default {
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      reviewOverlayTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-16)',
          fontWeight: 800,
        },
      },
      reviewOverlayNameText: {
        fontWeight: 500,
      },
      reviewOverlayHeadline: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontWeight: 800,
        },
      },
      reviewOverlayComment: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: '6px',
          color: 'var(--color-white-base)',
        },
      },
      reviewOverlayButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extrabold)',
          fontWeight: 800,
          fontSize: 'var(--text-12)',
          letterSpacing: 'var(--letter-spacing-l)',
        },
      },
    }),
  },
}
