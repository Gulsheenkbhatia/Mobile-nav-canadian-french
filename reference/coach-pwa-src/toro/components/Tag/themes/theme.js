export default {
  parts: ['appliedFilterText', 'appliedFilterLabelRemove'],
  baseStyle: ({ theme }) => ({
    appliedFilterText: {
      color: theme.colors.main.gray,
    },
    appliedFilterLabelRemove: {
      color: theme.colors.main.gray,
      marginLeft: '6px',
    },
  }),
  variants: {
    tagV2: ({ theme }) => ({
      appliedFilterText: {
        color: theme.colors.main.black,
        fontSize: 'var(--text-10)',
        fontWeight: 400,
        letterSpacing: '0.7px',
        lineHeight: '15px',
      },
    }),
    tagV3: ({ theme }) => ({
      appliedFilterText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-12) !important',
          letterSpacing: 'var(--letter-spacing-xs)',
          lineHeight: 'var(--line-height-xl) !important',
        },
      },
      appliedFilterLabelRemove: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-grey-80) !important',
          marginLeft: '4px',
          fontSize: 'var(--text-12) !important',
          lineHeight: 'var(--text-12) !important',
          width: '12px',
          height: '12px',
          marginBottom: '2px',
          '&.filterIconRemove:last-child': {
            marginTop: '3px',
          },
        },
      },
    }),
  },
}
