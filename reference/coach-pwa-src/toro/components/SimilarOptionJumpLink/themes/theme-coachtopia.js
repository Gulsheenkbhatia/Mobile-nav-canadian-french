export default {
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      similarOptionJumpLinkText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-26)',
          fontWeight: 800,
          letterSpacing: 'var(--letter-spacing-xs)',
          marginBottom: '14px',
        },
      },
      similarOptionJumpLinkButtom: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extrabold)',
          fontSize: 'var(--text-12)',
          fontWeight: 800,
          padding: '21px var(--spacing-4) 19px',
        },
      },
    }),
  },
}
