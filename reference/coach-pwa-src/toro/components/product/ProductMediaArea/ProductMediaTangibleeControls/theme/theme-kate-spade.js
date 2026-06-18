export default {
  baseStyle: ({ theme }) => ({
    tangibleeLabel: {
      ...theme.typography['text-eyebrow1-l'],
      fontWeight: '500',
    },
  }),
  variants: {
    pdpV3Redesign: ({ theme }) => ({
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-primary)',
          py: '11px', // missing in the design token
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& svg': {
            mt: '1px', // missing in the design token
            mb: 0,
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
          fontWeight: 500,
          lineHeight: 'var(--line-height-l)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: 'var(--spacing-2) var(--spacing-4)',
          height: '40px',
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& svg': {
            marginBottom: 0,
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body2-m'],
          paddingRight: 'var(--spacing-2)',
        },
      },
    }),
  },
}
