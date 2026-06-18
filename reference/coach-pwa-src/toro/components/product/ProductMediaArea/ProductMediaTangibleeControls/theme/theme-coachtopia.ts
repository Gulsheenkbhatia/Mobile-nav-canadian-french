export default {
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
            mb: 0,
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-extrabold)',
          lineHeight: 'var(--line-height-xl)',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-primary)',
          py: '14px', // missing in the design token
          paddingRight: 'var(--spacing-4)',
          bottom: '26px',
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& svg': {
            mb: 0,
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-extrabold)',
          fontWeight: 800,
          lineHeight: 1,
        },
      },
    }),
    adaptiveTabbedPDPNumericPagination: ({ theme }) => ({
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pr: '9px', // missing in the design token
          ...theme.typography['text-cta2-xs'],
          fontSize: 'var(--text-12)',
          textTransform: 'none',
          mt: '0px',
        },
      },
    }),
  },
}
