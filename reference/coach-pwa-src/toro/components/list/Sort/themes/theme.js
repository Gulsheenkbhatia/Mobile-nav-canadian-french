export default {
  parts: ['sortByText', 'sortButton', 'sortOptionsWrapper', 'sortOptions', 'sortOptionsSRule'],
  baseStyle: ({ theme }) => ({
    sortByText: {
      fontWeight: '300',
      marginRight: 0,
      fontSize: '12px',
      whiteSpace: 'nowrap',
      color: theme.colors.main.black,
      fontFamily: theme.fontFamily.primaryNormal,
      letterSpacing: theme.letterSpacings.lg,
    },
    sortButton: {
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.black,
      fontSize: theme.fontSizes.xs,
      pr: '0',
      pl: 's',
      pt: 'mar',
      '& .chakra-button__icon': { marginLeft: 0 },
    },
    sortOptionsWrapper: {
      p: '0',
      borderRadius: theme.borderRadius.default,
    },
    sortOptions: {
      fontFamily: theme.fontFamily.primaryNormal,
      color: theme.colors.main.black,
      fontSize: theme.fontSizes.xs,
      px: 'm',
      py: 's',
    },
    sortOptionsSRule: {
      backgroundColor: theme.colors.main.inactive,
    },
  }),
  variants: {
    desktopFilterV3: ({ theme }) => ({
      sortByText: {
        ...theme.typography['text-body1-l'],
        fontWeight: 400,
      },
      sortButton: {
        ...theme.typography['text-body1-l'],
        fontFamily: 'var(--font-face1-bold)',
        height: '22px',
        paddingY: '0',
        paddingLeft: '6px',
        '& > span:first-of-type': {
          marginTop: '2px',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& svg': {
            transform: 'none',
            width: '16px',
            marginLeft: 'var(--spacing-2)',
          },
        },
      },
      sortOptionsWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          border: 'none',
          borderRadius: 'var(--spacing-2)',
          overflow: 'hidden',
        },
      },
      sortOptions: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          padding: 'var(--spacing-2)',
          height: '36px',
        },
      },
      sortOptionIconWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          display: 'block',
          width: '16px',
          height: '16px',
          marginRight: '6px',
          '& svg': {
            width: '100%',
            height: '100%',
          },
        },
      },
      sortOptionsSRule: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          padding: 'var(--spacing-2)',
          height: '36px',
          backgroundColor: 'var(--color-neutral-light-2)',
          '&:hover': {
            backgroundColor: 'var(--neutrals-color-grey-100, #F7F7F7)',
          },
        },
      },
    }),
  },
}
