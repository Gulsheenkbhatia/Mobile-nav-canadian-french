const activeFiltersStyles = {
  height: '36px',
  padding: '10px var(--spacing-3) 10px var(--spacing-4)',
  backgroundColor: 'var(--color-background-filter-pill-applied, #e1e1e1)',
  mb: '1px',

  '& p': {
    pt: 0,
    color: 'var(--color-text-filter-pill-applied, #000000)',
  },
  '& p:last-child': {
    color: 'var(--color-icon-filter-pill-applied, #000000) !important',
    fontSize: 'var(--text-18) !important',
    fontWeight: 100,
    width: '16px',
    height: '16px',
    my: 0,
  },
} as const

export default {
  parts: [
    'horizontalFilterWrapper',
    'horizontalFilterContent',
    'activeFiltersStyles',
    'categoryHeader',
    'filtersAndSortContainer',
    'activeFiltersWrapper',
  ],
  baseStyle: ({ theme }) => ({
    horizontalFilterWrapper: {
      paddingBottom: 'var(--spacing-1)',
      top: '-1px',
      marginTop: '-21px',
      paddingTop: '21px',
      backgroundColor: 'var(--color-neutral-light-1)',
      zIndex: 12,
    },
    bottomLine: {
      zIndex: 10,
      top: 88,
      borderBottom: '1px solid var(--color-neutral-light-2, #e1e1e1)',
    },
    horizontalFilterContent: {
      width: '100%',
      maxWidth: '1344px',
      margin: 'auto',
      paddingX: 'var(--spacing-3)',
    },
    filtersAndSortContainer: {
      justifyContent: 'space-between',
      marginBottom: 'var(--spacing-4)',
      gap: '35px',
      alignItems: 'center',
    },
    categoryHeader: {
      pb: 'unset',
      backgroundColor: 'var(--color-neutral-light-1)',
      borderBottom: '1px solid var(--color-neutral-light-2, #e1e1e1)',
    },
    activeFiltersStyles: {
      ...activeFiltersStyles,
      '&:not(:last-child)': {
        marginRight: theme.space.mar,
      },
    },
    clearAllStyles: {
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-xxs)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      activeFiltersStyles: {
        ...activeFiltersStyles,
        padding: '6px var(--spacing-3) 6px var(--spacing-4)',
        '&:not(:last-child)': {
          marginRight: theme.space.mar,
        },
      },
    }),
    shopBy: {
      horizontalFilterWrapper: {
        marginTop: 0,
        padding: 0,
      },
      horizontalFilterContent: {
        paddingX: 0,
      },
      filtersAndSortContainer: {
        marginBottom: 0,
      },
      activeFiltersWrapper: {
        marginTop: 'var(--spacing-4)',
      },
    },
  },
}
