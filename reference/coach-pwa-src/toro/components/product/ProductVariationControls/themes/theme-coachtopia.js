export default {
  parts: ['btnChild'],
  baseStyle: ({ theme }) => ({
    btnChild: {
      mr: 'var(--spacing-2)',
      'button.chakra-button.selected': {
        backgroundColor: theme.colors.main.primary,
      },
    },
    variationLabelText: {
      textTransform: 'none',
      ...theme.typography['text-body1-m'],
    },
    selectBorders: {
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
    },
    sizeButtonText: {
      ...theme.typography['text-body2-s'],
    },
    countryTabs: (isActive) => ({
      color: 'black',
      padding: 0,
      marginRight: { base: 'var(--spacing-2)', lg: 'var(--spacing-3)' },
      '&:last-child': {
        marginRight: { base: 'var(--spacing-1)', lg: 'var(--spacing-2)' },
      },
      '&:focus-visible': {
        boxShadow: 'none',
      },
      borderBottom: `2px solid ${isActive ? 'black' : 'transparent'}`,
      ...(isActive
        ? { ...theme.typography['text-body1-m'] }
        : { ...theme.typography['text-body2-m'] }),
    }),
  }),
  variants: {
    sizeVariation: () => ({
      btnChild: {
        mr: 'var(--spacing-2)',
        mb: 'var(--spacing-2)',
        'button.chakra-button.selected': {
          backgroundColor: 'var(--color-black-base)',
        },
      },
    }),
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      variationLabelText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 'var(--spacing-2)',
        },
      },
      selectBorders: {
        borderTop: '1px',
        borderLeft: '1px',
        borderRight: '1px',
      },
    }),
  },
}
