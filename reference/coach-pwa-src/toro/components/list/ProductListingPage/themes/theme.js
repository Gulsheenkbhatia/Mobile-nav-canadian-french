import getStaircaseFixStyles from 'toro/components/list/ProductListingPage/themes/getStaircaseFixStyles'

const mobilePlpHeading = (theme) => ({
  fontFamily: theme.fontFamily.primaryBold,
  fontSize: theme.fontSizes.md,
  lineHeight: theme.lineHeights.s,
  letterSpacing: theme.letterSpacings.xs,
  display: '-webkit-box',
  lineClamp: 2,
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'normal',
  overflow: 'hidden',
  mt: '6px',
})

const mobilePlpHeadingV3 = {
  fontFamily: 'var(--font-face3-extended-bold)',
  mt: 0,
  textTransform: 'none',
}

const mobileBreadcrumbWrapper = {
  px: 'mar',
}

const mobileBreadcrumbWrapperV3 = {
  display: 'flex',
  pt: 'l',
  pb: 'm',
  mb: 0,
  backgroundColor: 'var(--color-neutral-light-1)',
  '& .total-count': {
    color: 'var(--color-neutral-medium)',
    lineHeight: 'var(--line-height-xl)',
    pt: '3px',
  },
}

const categoryHeaderWrapper = {
  pt: 0,
}

const srpCategoryHeader = (theme) => ({
  p: theme.space.m,
  boxShadow: theme.boxShadow.categoryHeader,
})

const searchWidgetWrapper = (theme) => ({
  '@media (max-width: 769px)': {
    p: `10px ${theme.space.mar} 0`,
  },
})

const mainContainerWrapper = {
  pt: 'var(--spacing-1)',
  pb: 'm',
}

const categoryHeader = {
  px: 'm',
  pt: 's',
  pb: 's',
}

const plpV3Styles = (theme) => ({
  wrapper: {
    background: 'var(--color-neutral-light-1)',
    ...getStaircaseFixStyles(theme),
  },
  mobilePlpHeading: {
    ...mobilePlpHeading(theme),
    ...mobilePlpHeadingV3,
  },
  stickyNav: (stickyHeight, isStickyFilterEnabled) => ({
    position: isStickyFilterEnabled ? 'sticky' : '',
    zIndex: 11,
    top: stickyHeight ? `${stickyHeight}px` : null,
    backgroundColor: 'var(--color-neutral-light-1)',
    width: '100%',
  }),
  categoryHeader: { ...categoryHeader, backgroundColor: 'var(--color-neutral-light-1)' },
  mobileBreadcrumbWrapper: { ...mobileBreadcrumbWrapper, ...mobileBreadcrumbWrapperV3 },
  categoryHeaderWrapper: categoryHeaderWrapper,
  SRPCategoryHeader: srpCategoryHeader(theme),
  searchWidgetWrapper: searchWidgetWrapper(theme),
  mainContainerWrapper: {
    ...mainContainerWrapper,
    backgroundColor: 'var(--color-neutral-light-1)',
  },
  plpHeadingWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: '35px',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      '&.plp-v3-1': {
        display: 'flex',
        marginX: 'auto',
        maxWidth: '1344px', // Same as horizontal filters max-width so it aligns with the filters vertically
      },
    },
  },
  plpHeading: () => ({
    fontSize: 'var(--text-24)',
    fontFamily: theme.fontFamily.primaryBold,
    ml: 'none',
    px: 'var(--spacing-3)',
    fontWeight: 'var(--chakra-fontWeights-bold)',
    width: 'fit-content',
    color: 'var(--color-primary)',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      '&.plp-v3-1': {
        ...theme.typography['text-display4-s'],
      },
    },
  }),
  mobileBottomBreadcrumbWrapper: {
    px: 'mar',
    pb: 'var(--spacing-8)',
    position: 'relative',
    backgroundColor: 'var(--color-neutral-light-1)',
    '& > ::before': {
      content: "''",
      width: '100%',
      display: 'block',
      borderTop: '1px solid var(--color-neutral-light-2)',
      pt: 'var(--spacing-8)',
      px: 'mar',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        display: 'none',
      },
    },
    '& > ::after': {
      content: "''",
      width: '100%',
      zIndex: '-1',
      position: 'absolute',
      height: '60px',
      backgroundColor: 'var(--color-neutral-light-1)',
      left: 0,
      top: '-60px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        display: 'none',
      },
    },
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      pb: '20px',
    },
  },
  mobileBreadcrumbContainer: {
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      marginTop: 0,
    },
  },
  mobileBreadcrumbText: {
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      display: 'flex',
      justifyContent: 'center',
      '.breadcrumb-link': {
        whiteSpace: 'nowrap',
      },
    },
  },
  productListingGrid: {
    marginBottom: 0,
    columnGap: '0px',
    rowGap: '0px',
  },
})

export default {
  parts: [
    'wrapper',
    'mobileBreadcrumbWrapper',
    'mobileBottomBreadcrumbWrapper',
    'mobileBreadcrumbContainer',
    'mobileBreadcrumbText',
    'mobilePlpHeading',
    'mainContainerWrapper',
    'breadCrumbWrapper',
    'plpHeading',
    'catergoryHeader',
    'filtersWrapper',
    'filters',
    'tedbarWrapper',
    'tilesWrapper',
    'searchResultCSS',
    'stickyNav',
    'categoryHeaderWrapper',
    'SRPCategoryHeader',
    'searchWidgetWrapper',
    'categoryHeader',
    'plpHeadingWrapper',
    'productListingGrid',
    'dynamicSubNavStyles',
    'bottomContentSlotWrapper',
    'circularProgressStyles',
    'productResultsWrapper',
  ],
  baseStyle: ({ theme }) => ({
    mainContainerWrapper: {
      py: 'm',
    },
    searchResultCSS: {
      padding: '0 mar',
      '@media (max-width: 769px)': {
        '#product-search-results .tarNode .btn.btn-xsmall.btn-link': {
          letterSpacing: 'normal',
        },
      },
      '@media (min-width: 769px)': {
        padding: 'mar',
        '#product-search-results .tarNode .product-tile__container': {
          paddingLeft: 'var(--spacing-1)',
          paddingRight: 'var(--spacing-1)',
        },
        '#product-search-results .tarNode div .banner-container': {
          height: '100%',
        },
        '#product-search-results .mol-banner-50-50, #product-search-results  .mol-banner': {
          overflow: 'hidden',
        },
        '#product-search-results .mol-banner .row': {
          overflow: 'hidden',
        },
        '#product-search-results .mol-banner-50-50:has(.dropdown-menu)': {
          overflow: 'visible',
        },
        '#product-search-results .mol-banner .row:has(.dropdown-menu)': {
          overflow: 'visible',
        },
        '#product-search-results .promo-tile-up-4 .mol-banner .row': {
          height: 'auto',
        },
        '#product-search-results .mol-banner-50-50 .align-self-center': {
          alignSelf: 'center!important',
          maxHeight: '100%',
          display: 'flex',
        },
        '#product-search-results .mol-banner-50-50 .align-self-center + div': {
          alignSelf: 'center',
        },
      },
      '.mol-banner .banner-container.header-bottom .inline-img-wrapper': {
        margin: '0 auto 32px',
      },
      '.mol-banner .banner-container.header-full-bleed .mol-header-block-container': {
        '@media (min-width: 769px)': {
          padding: '48px 16px',
          width: '100%',
        },
      },
    },
    breadCrumbWrapper: {
      mb: 'l',
      px: 'm',
      width: '100%',
      minWidth: 0,
    },
    plpHeadingWrapper: {
      display: 'block',
    },
    plpHeading: () => ({
      fontSize: 'var(--text-26)',
      fontFamily: theme.fontFamily.primaryBold,
      ml: 'none',
      textTransform: 'uppercase',
      px: 'var(--spacing-3)',
      fontWeight: 'var(--chakra-fontWeights-normal)',
      width: '75%',
    }),
    filtersWrapper: (headerHeight) => ({
      mr: 'xl',
      top: headerHeight ? `${headerHeight + 20}px` : 0,
      alignSelf: 'flex-start',
      position: 'sticky',
      maxHeight: `calc(100vh - ${headerHeight || 0}px)`,
      overflowY: 'auto',
      left: 0,
      flex: '1 0 0',
      minWidth: 0,
    }),
    filters: {
      mt: 'xl',
    },
    tedbarWrapper: {
      p: `8px 0 ${theme.space.l}`,
    },
    tilesWrapper: {
      flex: '0 0',
      minWidth: 0,
      flexBasis: '100%',
      position: 'relative',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        position: 'unset',
        overflowX: 'hidden',
        flexBasis: '75%',
        mt: 'xl',
      },
    },
    mobileBreadcrumbWrapper: {
      px: 'm',
      pt: 's',
      mb: 's',
    },
    mobileBreadcrumbContainer: {
      mt: 's1',
      overflowX: 'auto',
      width: '100%',
    },
    mobileBreadcrumbText: {
      fontSize: '12px',
    },
    mobilePlpHeading: {
      mt: 's',
      fontFamily: theme.fontFamily.primaryBold,
      textTransform: 'uppercase',
      fontSize: '16px',
      minWidth: 0,
      width: '85%',
    },
    categoryHeader: categoryHeader,
    stickyNav: (stickyHeight, isStickyFilterEnabled) => ({
      position: isStickyFilterEnabled ? 'sticky' : '',
      zIndex: 11,
      top: `${stickyHeight}px`,
      width: '100%',
    }),
    categoryHeaderWrapper: {
      pt: theme.space.l,
    },
    SRPCategoryHeader: {
      p: theme.space.m,
      boxShadow: theme.boxShadow.categoryHeader,
    },
    searchWidgetWrapper: {
      '@media (max-width: 769px)': {
        p: `0 ${theme.space.mar}`,
      },
      p: `${theme.space.xl} 67px ${theme.space.l}`,
      w: '100%',
    },
    bottomContentSlotsWrapper: {
      '.plp-certona:not(:last-child) .content-divider': {
        borderBottom: 'none',
      },
    },
    productListingGrid: {
      width: '100%',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      marginBottom: 'var(--spacing-8)',
      maxWidth: '100%',
      columnGap: 's1',
      rowGap: 'xl',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        columnGap: 's3',
        rowGap: 'mar',
      },
    },
    dynamicSubNavStyles: { paddingBottom: 'var(--spacing-1)', minHeight: 'var(--spacing-10)' },
    bottomContentSlotWrapper: {
      width: '100%',
      display: 'block',
    },
    productResultsWrapper: {
      minWidth: 0,
      width: '100%',
      justifyContent: 'start',
      [`@media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg})`]: {
        justifyContent: 'center',
      },
    },
    circularProgressStyles: {
      justifyContent: 'center',
      minHeight: '50px',
      overflow: 'hidden',
    },
    popularSearchBlock: {
      margin: '0 auto',
      margintTop: 'xxl',
      [`@media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg})`]: {
        width: '765px',
      },
    },
    seoContainer: {
      width: '100%',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    promoGridItem: {
      '&:empty': {
        display: 'none',
      },
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      ...plpV3Styles(theme),
    }),
    completePlpV3Desktop: ({ theme }) => ({
      ...plpV3Styles(theme),
      productListingGrid: {
        marginX: 'auto',
        maxWidth: '1344px',
        marginBottom: 0,
        columnGap: '0px',
        rowGap: '0px',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          columnGap: '18px',
        },
      },
      bottomContentSlotWrapper: {
        maxWidth: '100%',
      },
      tilesWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          overflowX: 'unset',
          flexBasis: '100%',
        },
      },
    }),
  },
}
