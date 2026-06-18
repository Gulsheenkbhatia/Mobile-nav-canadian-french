export default {
  parts: [
    'totalProductsCount',
    'activeFiltersStyles',
    'categoryHeader',
    'appliedFilterWrapper',
    'categoryHeaderFilterWrapper',
    'categoryHeaderFilterWrapperExposed',
  ],
  baseStyle: ({ theme }) => ({
    totalProductsCount: {
      fontSize: 'sm',
    },
    categoryHeader: {
      backgroundColor: 'var(--color-white-base)',
    },
    stickyFilterSort: (isStickyFilterEnabled) => {
      return isStickyFilterEnabled
        ? {
            position: 'sticky',
            zIndex: 11,
          }
        : {}
    },
    activeFiltersStyles: {
      '&:not(:last-child)': {
        marginRight: theme.space.s,
      },
    },
    categoryHeaderFilterWrapper: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        justifyContent: 'space-between',
        paddingBottom: theme.space.m,
      },
    },
    categoryHeaderFilterWrapperExposed: {
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      flexDirection: 'column',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        justifyContent: 'space-between',
        paddingBottom: theme.space.m,
        '#sort-drawer-mobile': {
          border: 0,
        },
      },
    },
    noBorderForModelToggle: {
      borderBottom: 0,
    },
  }),
  variants: {
    small: {
      totalProductsCount: {
        fontSize: 'var(--text-12)',
      },
    },
    plpV3: ({ theme }) => ({
      categoryHeader: {
        pb: 'unset',
        backgroundColor: 'var(--color-neutral-light-1)',
        borderBottom: '1px solid var(--color-neutral-light-2, #e1e1e1)',
      },
      totalProductsCount: {
        fontSize: 'md',
        color: 'var(--color-neutral-medium)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&.plp-v3-1': {
            lineHeight: 'var(--line-height-s)',
            letterSpacing: 'var(--letter-spacing-s)',
          },
        },
      },
      appliedFilterWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mx: '0',
        },
      },
      activeFiltersStyles: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          padding: 'var(--spacing-1) var(--spacing-2)',
          height: '25px',

          '&:not(:last-child)': {
            marginRight: theme.space.m,
          },
        },
      },
    }),
    srpV3: ({ theme }) => ({
      totalProductsCount: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-neutral-medium, #575757)',
        mr: 'var(--spacing-3)',
        paddingTop: '3px',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-16)',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-s)',
          color: 'var(--color-neutral-medium, #575757)',
          ml: 'var(--spacing-3)',
          display: 'flex',
          alignItems: 'center',
        },
      },
    }),
  },
}
