export default {
  variants: {
    pdpV3Redesign: ({ theme }) => ({
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-primary)',
          pb: '10px', // missing in the design token
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-16)',
          fontWeight: 500,
          letterSpacing: 'var(--letter-spacing-xs)',
          lineHeight: '18px', // missing in design-tokens
        },
      },
    }),
  },
}
