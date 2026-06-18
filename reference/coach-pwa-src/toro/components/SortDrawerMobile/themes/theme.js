import FilterIcon from '@tapestry-inc/design-tokens/coach/icon/navigation/filter-and-sort.svg'
const plpV3Styles = (theme) => ({
  filterOption: {
    backgroundColor: 'white',
    '&.active': {
      backgroundColor: 'black',
      '& > div': {
        '& svg': {
          color: theme.colors.main.white,
        },
      },
    },
    padding: '10px 14px',
    border: '1px solid var(--color-inactive)',
    borderRadius: 'var(--spacing-10)',
    '& > div': {
      '& svg': {
        color: theme.colors.main.black,
      },
    },
  },
  filterOptionsText: {
    fontSize: 'var(--text-12)',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: 'black',
    '&.active': {
      color: 'white',
    },
  },
  filterWrapper: {
    paddingLeft: '15px',
    overflowX: 'auto',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
  clearAllStyles: {
    ...theme.typography['text-body2-s'],
    color: theme.colors.main.primary,
    borderRadius: 0,
    borderBottomWidth: 'var(--border-width-s)',
    borderBottomColor: theme.colors.main.primary,
  },
  activeFiltersStyles: {
    ...theme.typography['text-body2-s'],
    color: 'var(--color-neutral-light-2)',
    '&:not(:last-child)': {
      marginRight: theme.space.s,
    },
  },
  mainWrapper: {
    display: 'block',
    paddingBottom: 0,
    '&.search-result': {
      borderBottom: 'unset',
    },
  },
  mobileFilterButton: {
    background: theme.colors.main.white,
    padding: '10px 18px 10px 14px',
    mx: 'var(--spacing-3)',
    mt: 0,
    borderRadius: 'var(--spacing-10)',
    gap: 'var(--spacing-2)',
    position: 'relative',

    '&::after': {
      content: '""',
      display: 'block',
      border: 'var(--border-width-s) solid rgba(0, 0, 0, 0.08)',
      w: '100%',
      h: '100%',
      borderRadius: 'var(--spacing-10)',
      position: 'absolute',
      top: 0,
      left: 0,
    },
  },
  activeFilters: {
    padding: 'var(--spacing-3) 0',
  },
  filterButtonText: {
    color: `${theme.colors.main.black} !important`,
    fontSize: 'var(--text-10)',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '16px', // need design token
    letterSpacing: theme.letterSpacings.xs,
    fontFamily: 'var(--font-face1-extended-normal)',
  },
  buttonsWrapper: {
    '&.isSrp': {
      marginTop: 'var(--spacing-3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    '&.default': {
      marginTop: 'var(--spacing-3)',
      height: '36px',
      overflowY: 'hidden',
    },
  },
  boxShadow: 'unset',
})
export default {
  parts: [
    'mobileFilterButton',
    'filterButtonText',
    'filtersDrawerWrapper',
    'filtersDrawer',
    'sortByText',
    'filtersWrapper',
    'viewAllProductsWrapper',
    'mobileRadioFilterText',
    'filterOption',
    'filterOptionsText',
    'boxShadow',
    'filterWrapper',
    'mainWrapper',
    'activeFilters',
    'buttonsWrapper',
  ],
  baseStyle: ({ theme }) => ({
    mainWrapper: {
      display: 'flex',
      alignSelf: 'center',
      justifyContent: 'flex-end',
    },
    mobileFilterButton: {
      position: 'relative',
      mt: 's',
      background: theme.colors.main.white,
      p: theme.space.m,
      '> svg path': {
        strokeWidth: '0.75px',
      },
    },
    filterButtonText: {
      textTransform: 'uppercase',
      color: theme.colors.main.primary,
      fontSize: theme.fontSizes.xxs,
    },
    filtersDrawerWrapper: {
      p: 's',
    },
    filtersDrawer: {
      pb: '72px',
    },
    sortByText: {
      textTransform: 'uppercase',
      letterSpacing: theme.letterSpacings.lg,
      mb: 'm',
    },
    filtersWrapper: {
      mt: 'l',
    },
    viewAllProductsWrapper: {
      p: 'mar',
      background: theme.colors.main.white,
      boxShadow: theme.boxShadow.mobileFilterDrawer,
    },
    FilterIcon,
  }),
  variants: {
    plpV3: ({ theme }) => ({
      ...plpV3Styles(theme),
    }),
    shopByBrowseAll: ({ theme }) => ({
      ...plpV3Styles(theme),

      buttonsWrapper: {
        '&.default': {
          marginTop: '0',
        },
      },

      filterButtonText: {
        ...theme.typography['text-body1-m'],
        fontSize: 'var(--text-10)',
        fontWeight: '400',
        textTransform: 'none',
      },
      mobileFilterButton: {
        background: theme.colors.main.white,
        padding: '10px 15px 10px 15px',
        mx: 'var(--spacing-3)',
        mt: 0,
        borderRadius: 'var(--spacing-10)',
        gap: 'var(--spacing-2)',
        position: 'relative',

        '&::after': {
          content: '""',
          display: 'block',
          border: 'var(--border-width-s) solid rgba(0, 0, 0, 0.08)',
          w: '100%',
          h: '100%',
          borderRadius: 'var(--spacing-10)',
          position: 'absolute',
          top: 0,
          left: 0,
        },
      },
      activeFiltersStyles: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-neutral-light-2)',
        '&:not(:last-child)': {
          marginRight: theme.space.s,
        },
      },
    }),
  },
}
