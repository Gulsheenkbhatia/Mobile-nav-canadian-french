const mobileVariantStyles = ({ theme, exposed = false }) => ({
  searchWrapper: {
    p: '0 var(--spacing-4) var(--spacing-3)',
    position: exposed ? 'relative' : 'static',
    '& .input-wrapper': {
      position: 'relative',
    },
  },
  suggestionsAnimatedContainer: {
    ...(exposed
      ? {
          width: '100%',
          height: '100vh',
          position: 'absolute',
          backgroundColor: 'var(--color-white-base)',
          padding: '0 var(--spacing-4) var(--spacing-3)',
          left: '0px',
        }
      : {}),
  },
  searchIcon: {
    position: 'relative',
    '&.active': {
      display: 'none',
    },
    svg: {
      height: 'inherit',
      width: 'inherit',
    },
  },
  clearIcon: {
    color: 'var(--color-neutral-medium)',
    ml: 'var(--spacing-3)',
    mr: 0,
  },
  searchBackButton: {
    height: '24px',
    position: 'absolute',
    left: '-4px',
    bottom: '62px',
    color: theme.colors.main.white,
  },
  input: {
    fontSize: 'var(--text-16)',
    fontFamily: 'var(--font-face1-normal)',
    color: 'var(--color-primary)',
    pl: 'var(--spacing-1)',
    height: '24px',
    '&.searchIn': {
      '::placeholder': {
        color: 'var(--color-neutral-medium)',
      },
      ':-ms-input-placeholder': {
        color: 'var(--color-neutral-medium)',
      },
      '::-ms-input-placeholder': {
        color: 'var(--color-neutral-medium)',
      },
    },
  },
  inputGroup: {
    borderRadius: 'var(--border-radius-m)',
    border: exposed ? '1px solid var(--color-neutral-light-2)' : '',
    p: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-1)',
    backgroundColor: 'var(--scheme-input-bg-color)',
    w: '100%',
    '&:focus, &[data-focus], &:focus-within': {
      w: '100%',
    },
  },
  inputRightElementsBlock: {
    order: -1,
    boxSizing: 'content-box',
    w: '24px',
    h: '24px',
    pl: '2px',
  },
  suggestionsContainer: {
    boxSizing: 'border-box',
    flexDirection: 'column-reverse',
  },
  searchSuggestionWrapper: {
    mb: '40px',
    pr: '52px',
  },
  searchSuggestionHeader: {
    color: `var(${exposed ? '--color-neutral-medium' : '--scheme-header-color'})`,
    fontSize: 'var(--text-16)',
  },
  SearchSuggestionCategoriesWrapper: {
    flexDirection: 'column',
    mt: 'var(--spacing-6)',
  },
  suggestionsItemsContainer: {
    mt: '58px',
  },
  noResultsCont: {
    mt: 'var(--spacing-6)',
    color: `var(${exposed ? '--color-primary' : '--scheme-text-color'})`,
    fontFamily: 'var(--font-face1-normal)',
    fontSize: 'var(--text-20)',
    fontWeight: 'normal',
  },
  suggestionsItems: {
    flexDirection: 'column',
  },
  SearchSuggestionCategoriesText: {
    mb: 'l',
    fontWeight: 'normal',
    color: `var(${exposed ? '--color-neutral-medium' : '--scheme-header-color'})`,
    fontSize: 'var(--text-16)',
  },
  SearchSuggestionCategoriesName: {
    color: `var(${exposed ? '--color-primary' : '--scheme-text-color'})`,
    fontFamily: 'var(--font-face1-normal)',
    fontSize: 'var(--text-20)',
  },
  SearchSuggestionCategoriesBasePart: {
    color: 'var(--scheme-secondary-text-color)',
  },
  SearchSuggestionCategoriesCount: {
    color: `var(${exposed ? '--color-primary' : '--scheme-text-color'})`,
    fontFamily: 'var(--font-face1-normal)',
    fontSize: 'var(--text-20)',
  },
  searchSuggestionItemFooterProductText: {
    color: `var(${exposed == true ? '---color-black-base' : '--scheme-text-color'})`,
    fontFamily: 'var(--font-face1-extended-bold)',
    fontSize: 'var(--text-14)',
    textAlign: 'center',
  },
  searchSuggestionItemFooterPrice: {
    color: 'var(--scheme-text-color)',
    fontSize: 'var(--text-14)',
  },
  searchSuggestionItemFooterWrapper: {
    mb: 'var(--spacing-2)',
  },
  searchSuggestionItemFooterProductName: {
    flexDirection: 'column',
    gap: '6.5px',
    ml: '10px',
    mt: 'var(--spacing-2)',
  },
  searchSuggestionViewAllProduct: {
    fontSize: 'var(--text-16)',
    color: `var(${exposed ? '---color-black-base' : '--scheme-text-color'})`,
    fontFamily: 'var(--font-face1-normal)',
    textAlign: 'center',
    mt: 'var(--spacing-6)',
  },
})

export default {
  parts: [
    'backdrop',
    'input',
    'inputGroup',
    'inputWrapper',
    'clearIcon',
    'clearIconMobile',
    'closeIconMobile',
    'noResultsCont',
    'searchBackButton',
    'searchIcon',
    'searchInputGroupWrapper',
    'searchSuggestionWrapper',
    'searchSuggestionProductLink',
    'searchSuggestionHeader',
    'searchSuggestionViewAllProduct',
    'searchSuggestionViewAllProductWrapper',
    'searchSuggestionItemWrapper',
    'searchSuggestionItemLinkImage',
    'searchSuggestionItemText',
    'searchSuggestionItemPriceWrapper',
    'searchSuggestionItemFooterWrapper',
    'searchSuggestionItemFooterImage',
    'searchSuggestionItemFooterImageElement',
    'searchSuggestionItemFooterProductName',
    'searchSuggestionItemFooterProductText',
    'searchSuggestionItemFooterPrice',
    'searchSuggestionGrid',
    'SearchSuggestionCategoriesWrapper',
    'SearchSuggestionCategoriesText',
    'SearchSuggestionCategoriesLink',
    'SearchSuggestionCategoriesDetails',
    'SearchSuggestionCategoriesName',
    'SearchSuggestionCategoriesBasePart',
    'SearchSuggestionCategoriesCount',
    'SearchSuggestionCategoriesRecommendedSearches',
    'suggestions',
    'suggestionsCategories',
    'autoCompleteWrapper',
    'autoCompleteRecommendedSearches',
    'autoCompleteLink',
    'autoCompleteName',
    'autoCompleteBasePart',
    'autoCompleteCount',
    'autoCompleteHeader',
    'autoCompleteCollapse',
    'pillsContainer',
    'pillsWrapper',
    'pillsRecommendedSearches',
    'pillsLink',
    'pillsText',
    'pillsName',
    'pillsDetails',
    'pillsBasePart',
    'pillsCount',
    'pillsHeader',
    'suggestionsContainer',
    'suggestionsItemsContainer',
    'suggestionsItems',
    'suggestionRecentlyItemsText',
    'suggestionRecentlyItemsWrapper',
    'suggestionsAnimatedContainer',
    'searchWrapper',
    'noResultsFound',
    'noSearchTerm',
    'collapseContainingError',
    'inputRightElementsBlock',
  ],
  baseStyle: ({ theme }) => ({
    input: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.main.black,
      overflow: 'hidden',
      lineHeight: theme.lineHeights.xl,
      '&.searchIn': {
        '::placeholder': {
          color: 'var(--color-black-base)',
        },
        ':-ms-input-placeholder': {
          color: 'var(--color-neutral-base)',
        },
        '::-ms-input-placeholder': {
          color: 'var(--color-neutral-base)',
        },
      },
    },
    inputRightElementsBlock: {
      boxSizing: 'content-box',
      w: '60px',
      h: '24px',
      pl: '2px',
    },
    clearIcon: {
      h: theme.space.l,
      w: theme.space.l,
      mr: theme.space.s,
    },
    searchIcon: {
      h: theme.space.l,
      w: theme.space.l,
      svg: {
        pointerEvents: 'none',
      },
    },
    searchSuggestionWrapper: {
      mb: '30px',
      pr: '52px',
      '@media (min-width: 1840px)': {
        pr: '30px',
      },
    },
    searchSuggestionHeader: {
      color: `${theme.colors.main.primary}`,
      fontSize: `${theme.fontSizes.xxs}`,
    },
    searchSuggestionProductLink: {
      fontSize: `${theme.fontSizes.xxs}`,
      color: `${theme.colors.main.primary}`,
    },
    searchSuggestionViewAllProduct: {
      fontSize: '10px',
    },
    searchSuggestionItemWrapper: {
      '&:hover .quick-view-container': {
        display: 'inline-flex',
      },
      mb: 'mar',
    },
    searchSuggestionItemLinkImage: {
      objectFit: 'cover',
      background: '#efefef',
      height: '260px',
      width: 'auto',
    },
    searchSuggestionItemText: {
      fontFamily: 'var(--font-face1-extended-bold)',
      textAlign: 'center',
      overflow: 'hidden',
    },
    searchSuggestionItemPriceWrapper: {
      mb: 'mar',
      px: 's',
    },
    searchSuggestionItemFooterWrapper: {
      mb: 'l',
    },
    searchSuggestionItemFooterImage: {
      width: '64px',
    },
    searchSuggestionItemFooterProductName: {
      flexDirection: 'column',
      ml: 'm',
    },
    searchSuggestionItemFooterProductText: {
      fontFamily: 'var(--font-face1-extended-bold)',
      textAlign: 'center',
    },
    searchSuggestionItemFooterPrice: {
      mb: 'mar',
    },
    SearchSuggestionCategoriesWrapper: {
      flexDirection: 'column',
      textTransform: 'capitalize',
    },
    SearchSuggestionCategoriesText: {
      mb: 'l',
      fontWeight: 'normal',
      color: theme.colors.main.primary,
    },
    SearchSuggestionCategoriesLink: {
      '&:focus': theme.focus,
    },
    SearchSuggestionCategoriesDetails: {
      fontSize: theme.fontSizes.sm,
    },
    SearchSuggestionCategoriesName: {
      mb: theme.space.xs,
      fontSize: theme.fontSizes.sm,
    },
    SearchSuggestionCategoriesCount: {
      fontSize: theme.fontSizes.sm,
      ml: 's',
    },
    suggestionRecentlyItemsWrapper: {
      mb: '30px',
    },
    suggestionRecentlyItemsText: {
      color: theme.colors.main.primary,
      fontWeight: 'normal',
    },
  }),
  variants: {
    mobile: ({ theme }) => ({
      clearIcon: {
        right: '8%',
        top: '-2px',
      },
      searchIcon: {
        top: '-4px',
      },
      searchBackButton: {
        height: '24px',
        pr: theme.space.m,
        color: theme.colors.main.black,
      },
      suggestions: {
        minHeight: '100%',
        backgroundColor: theme.colors.main.white,
        padding: `${theme.space.l} 0`,
      },
      suggestionsContainer: {
        boxSizing: 'border-box',
        flexDirection: 'column-reverse',
      },
      suggestionsItemsContainer: {
        mt: theme.space.jumbo,
      },
      suggestionsItems: {
        flexDirection: 'column',
      },
      noResultsCont: {
        textAlign: 'left',
        fontFamily: theme.fontFamily.secondaryNormal,
        fontWeight: 'normal',
        fontSize: theme.fontSizes.sm,
      },
      inputGroup: {
        borderBottom: `1px solid ${theme.colors.main.black}`,
        height: '24px',
        w: '100%',
        '&:focus, &[data-focus], &:focus-within': {
          w: '100%',
        },
      },
    }),
    mobileV2: ({ theme }) => ({
      ...mobileVariantStyles({ theme }),
      suggestionsItemsContainer: { mt: '58px', mb: '98px' },
    }),
    mobileV2Redesign: ({ theme }) => ({
      ...mobileVariantStyles({ theme }),
      inputGroup: {
        borderRadius: 'var(--border-radius-m)',
        border: 'none',
        p: '10px var(--spacing-3) 10px 6px',
        backgroundColor: 'var(--scheme-input-bg-color)',
        w: '100%',
        '&:focus, &[data-focus], &:focus-within': {
          w: '100%',
        },
      },
      input: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        pl: 'var(--spacing-2)',
        pt: 'var(--spacing-1)',
        letterSpacing: 'var(--letter-spacing-xs)',
        height: '38px',
        '&.searchIn': {
          'caret-color': 'transparent',
          '::placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          ':-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          '::-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
        },
      },
      searchIcon: {
        position: 'relative',
        top: '7px',
        pl: '6px',
        '&.active': {
          display: 'none',
        },
        svg: {
          height: '16px',
          width: '16px',
          path: {
            stroke: 'var(--scheme-text-color, #000)',
          },
        },
      },
      suggestionsItemsContainer: { mt: '58px', mb: '98px' },
    }),
    mobileV2RedesignExposed: ({ theme }) => ({
      ...mobileVariantStyles({ theme }),
      searchWrapper: {
        p: 'var(--spacing-1)',
      },
      inputGroup: {
        borderRadius: '0 0 var(--spacing-3) var(--spacing-3)',
        border: '1px solid var(--color-neutral-light-1)',
        p: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-1)',
        backgroundColor: 'var(--color-white-base)',
        w: '100%',
        '&:focus, &[data-focus], &:focus-within': {
          w: '100%',
        },
      },
      input: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        pl: 'var(--spacing-2)',
        pt: 'var(--spacing-1)',
        letterSpacing: 'var(--letter-spacing-xs)',
        height: '38px',
        '&.searchIn': {
          '::placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          ':-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          '::-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
        },
      },
      searchIcon: {
        position: 'relative',
        top: '7px',
        pl: '6px',
        '&.active': {
          display: 'none',
        },
        svg: {
          height: '16px',
          width: '16px',
        },
      },
      suggestionsItemsContainer: { mt: '58px', mb: '98px' },
    }),
    mobileExposed: ({ theme }) => ({
      ...mobileVariantStyles({ theme, exposed: true }),
    }),
    desktop: ({ theme }) => ({
      clearIcon: {
        right: '10%',
      },
      suggestions: {
        position: 'absolute',
        minHeight: '451px',
        top: '-31px',
        left: 0,
        right: 0,
        backgroundColor: theme.colors.main.white,
        zIndex: 1001,
        p: `${theme.space.xxl} ${theme.space.l}`,
        boxShadow: '0 -1px 4px 0 rgb(0 0 0 / 10%)',
      },
      suggestionsContainer: {
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        ml: '10%',
        '@media (min-width: 1840px)': {
          m: '0 260px',
        },
      },
      suggestionsItemsContainer: {
        flexDirection: 'column',
        gridColumnStart: '1',
        gridColumnEnd: '9',
      },
      suggestionsCategories: {
        gridColumnStart: '10',
        gridColumnEnd: '12',
      },
      noResultsCont: {
        textAlign: 'right',
        mr: '15%',
        mt: theme.space.xl,
        fontFamily: theme.fontFamily.secondaryNormal,
        fontWeight: 'normal',
        fontSize: theme.fontSizes.sm,
      },
      inputGroup: {
        fontFamily: theme.fontFamily.secondaryNormal,
        borderBottom: `1px solid ${theme.colors.main.black}`,
        mr: theme.space.s,
        w: '118px',
        '&:focus, &[data-focus], &:focus-within': {
          w: '215px',
        },
      },
      backdrop: {
        position: 'absolute',
        width: '100vw',
        height: '120vh',
        left: 'calc(50% - 50vw)',
        top: '100%',
        zIndex: '1',
        backgroundColor: theme.colors.main.black,
        opacity: '0.8',
      },
    }),
    footer: ({ theme }) => ({
      input: {
        fontSize: theme.fontSizes.lg,
      },
      clearIcon: {
        right: '2%',
      },
      suggestions: {
        backgroundColor: theme.colors.main.white,
        marginTop: theme.space.xxl,
      },
      suggestionsContainer: {
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
      },
      suggestionsItemsContainer: {
        flexDirection: 'column',
        gridColumnStart: '4',
        gridColumnEnd: '12',
      },
      suggestionsCategories: {
        gridColumnStart: '1',
        gridColumnEnd: '3',
        gridRowStart: '1',
      },
      noResultsCont: {
        mr: '15%',
        mt: theme.space.xl,
        fontFamily: theme.fontFamily.secondaryNormal,
        fontWeight: 'normal',
        fontSize: theme.fontSizes.sm,
      },
      inputGroup: {
        fontFamily: theme.fontFamily.secondaryNormal,
        borderBottom: `1px solid ${theme.colors.main.inactive}`,
        height: '24px',
        mr: theme.space.s,
      },
    }),
    footerMobile: ({ theme }) => ({
      input: {
        fontSize: theme.fontSizes.md,
      },
      clearIcon: {
        right: '6%',
      },
      suggestions: {
        backgroundColor: theme.colors.main.white,
        padding: `${theme.space.xl} ${theme.space.jumbo} 0 0`,
      },
      suggestionsContainer: {
        boxSizing: 'border-box',
        flexDirection: 'column-reverse',
      },
      suggestionsItemsContainer: {
        flexDirection: 'column',
        mt: theme.space.xxl,
      },
      suggestionsItems: {
        flexDirection: 'column',
      },
      noResultsCont: {
        textAlign: 'left',
        fontFamily: theme.fontFamily.secondaryNormal,
        fontWeight: 'normal',
        fontSize: theme.fontSizes.sm,
      },
      inputGroup: {
        fontFamily: theme.fontFamily.secondaryNormal,
        borderBottom: `1px solid ${theme.colors.main.inactive}`,
        height: '24px',
        width: '95%',
        mr: theme.space.s,
      },
    }),
    searchV2: ({ theme, isEmptySearchResults = false }) => ({
      searchWrapper: {
        p: '0 var(--spacing-4) var(--spacing-3)',
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'static',
        '& .input-wrapper': {
          position: 'relative',
        },
        background: 'var(--color-neutral-light-1, #F0F0F0)',
        borderRadius: '0',
        height: '-webkit-fill-available',
        '@supports (height: 100dvh)': {
          height: '100dvh',
        },
        '&.search-widget-animation': {
          '@keyframes searchDrawerEntry': {
            '0%': {
              transform: 'translateX(100%)',
            },
            '100%': {
              transform: 'translateX(0%)',
            },
          },
          animation: 'searchDrawerEntry 400ms ease',
        },
      },
      inputWrapper: {
        marginLeft: '-12px',
        marginRight: '-12px',
      },
      searchIcon: {
        position: 'relative',
        h: 'var(--spacing-4)',
        w: 'var(--spacing-4)',
        svg: {
          height: 'var(--spacing-4)',
          width: 'var(--spacing-4)',
        },
        marginLeft: 'var(--spacing-3)',
        marginTop: '21px',
        marginRight: 'var(--spacing-2)',
      },
      clearIcon: {
        h: 'auto',
        w: 'auto',
        color: 'var(--color-neutral-medium)',
        marginLeft: '0px',
        marginRight: '0px',
      },
      closeIconMobile: {
        padding: 'var(--spacing-4)',
        paddingTop: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'var(--spacing-1)',
        borderLeft: '2px solid var(--color-neutral-light-1, #F0F0F0)',
        background: 'var(--color-white-base)',
        svg: {
          margin: 'var(--spacing-1)',
          height: 'var(--spacing-4)',
          width: 'var(--spacing-4)',
        },
      },
      searchBackButton: {
        height: 'var(--spacing-6)',
        position: 'absolute',
        left: '-4px',
        bottom: '62px',
        color: 'var(--color-white-base)',
      },
      searchInputGroupWrapper: {
        overflow: 'hidden',
        opacity: '0',
        '@keyframes inputGroupEntry': {
          '0%': {
            transform: 'translateX(25px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
        },

        animationName: 'inputGroupEntry',
        animationDuration: '400ms',
        animationDelay: '200ms',
        animationFillMode: 'forwards',
        transition: 'border-radius 0.4s',
      },
      collapseContainingError: {
        marginTop: '2px',
        marginLeft: '-12px',
        marginRight: '-12px',
        backgroundColor: 'var(--color-white-base)',
        borderRadius: '0 0 var(--border-radius-l) var(--border-radius-l)',
      },
      input: {
        ...theme.typography['text-title1-m'],
        fontWeight: `400`,
        color: `var(--color-black-base)`,
        borderRadius: '0px',
        overflow: 'auto',
        paddingLeft: '36px',
        paddingTop: 'var(--spacing-1)',
        caretColor: 'var(--color-neutral-medium) !important',
        animationName: 'inputEntry',
        animationDuration: '500ms',
        animationFillMode: 'forwards',
        opacity: 0,
        '@keyframes inputEntry': {
          '0%': {
            opacity: 0,
          },
          '90%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        '&.searchIn': {
          '::placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          ':-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          '::-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
        },
        ':not(:placeholder-shown)': {
          paddingRight: '67px', // clear button width
        },
      },
      inputGroup: {
        position: 'relative',
        background: 'var(--color-white-base)',
        marginTop: 'var(--spacing-1)',
        width: '100%',
        height: '58px',
      },
      clearIconMobile: {
        ...theme.typography['text-cta2-xs'],
        color: 'var(--color-black-base)',
        position: 'absolute',
        left: 'auto',
        right: '0',
        top: '7px',
        height: 'auto',
        fontWeight: '500',
        textTransform: 'capitalize',
        padding: 'var(--spacing-4)',
        background: 'var(--color-white-base)', // hides text underneath
      },
      inputRightElementsBlock: {
        w: '0',
        h: '0',
        pl: '0',
        order: -1,
        boxSizing: 'content-box',
      },
      suggestionsContainer: {
        boxSizing: 'border-box',
        flexDirection: 'column-reverse',
      },
      searchSuggestionWrapper: {
        marginBottom: 'var(--spacing-3)',
        paddingRight: '0px',
      },
      suggestionsItemsContainer: {
        marginTop: 'var(--spacing-4)',
        marginBottom: 'var(--spacing-4)',
        opacity: '0',
        '@keyframes productsEntry': {
          '0%': {
            transform: 'translateX(100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
        },
        animationName: 'productsEntry',
        animationDuration: '600ms',
        animationDelay: '240ms',
        animationFillMode: 'forwards',
      },
      noResultsCont: {
        mt: 'var(--spacing-6)',
        color: `var(--color-black-base)`,
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-20)',
        fontWeight: 'normal',
      },
      suggestionsItems: {
        flexDirection: 'column',
      },
      suggestionsCategories: {
        minWidth: '100%',
      },
      searchSuggestionItemFooterProductText: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-bold)',
        color: `var(--color-black-base)`,
        overflow: 'hidden',
        textAlign: 'center',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        minHeight: '34px',
      },
      searchSuggestionItemFooterPrice: {
        marginBottom: '0',
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-14)',
        '.salePriceWrapper': {
          '*': { display: 'none' }, // Hide discounts
          '.salesPrice': {
            display: 'block',
            ...theme.typography['text-body1-s'],
            fontFamily: 'var(--font-face1-extended-normal)',
            color: `var(--color-black-base) !important`,
            width: '100%',
            textAlign: 'center',
          },
        },
      },
      searchSuggestionGrid: {
        display: 'grid',
        gridTemplateColumns: `repeat(3, 1fr)`,
        gap: `var(--spacing-2)`,
        alignItems: `start`,
        justifyItems: `stretch`,
        gridAutoRows: `minmax(227px, auto)`,
        gridAutoFlow: 'row',
      },
      searchSuggestionItemFooterWrapper: {
        marginBottom: '0',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      },
      searchSuggestionItemFooterProductName: {
        flexDirection: 'column',
        marginTop: 'var(--spacing-3)',
        marginBottom: 'var(--spacing-3)',
        marginLeft: '0',
        gap: 'var(--spacing-2)',
      },
      searchSuggestionItemFooterImage: {
        width: '100%',
        height: '100%',
      },
      searchSuggestionItemFooterImageElement: {
        width: '100%',
        aspectRatio: '4/5',
        objectFit: 'cover',
      },
      searchSuggestionViewAllProductWrapper: {
        justifyContent: 'center',
        alignItems: 'center',

        a: {
          textDecoration: 'auto',
          textTransform: 'none',
        },
      },
      noResultsFound: {
        ...theme.typography['text-title1-m'],
        background: 'var(--color-white-base)',
        padding: 'var(--spacing-4)',
        paddingTop: '20px',
        paddingBottom: '27px',
        borderRadius: '0px 0px var(--border-radius-l) var(--border-radius-l)',
      },
      noSearchTerm: {
        ...theme.typography['text-body1-m'],
        fontWeight: 400,
        background: 'var(--color-white-base)',
        padding: 'var(--spacing-4)',
        paddingTop: '20px',
        paddingBottom: 'var(--spacing-6)',
        borderRadius: '0px 0px var(--border-radius-l) var(--border-radius-l)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 'var(--spacing-3)',
      },
      searchSuggestionViewAllProduct: {
        ...theme.typography['text-cta2-xxs'],
        background: `var(--color-black-base)`,
        color: `var(--color-white-base)`,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 'var(--spacing-2)',
        textDecoration: 'auto !important',
        padding: '10px 14px',
        borderRadius: 'var(--border-radius-full)',

        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      pillsContainer: {
        opacity: 0,
        '@keyframes pillsEntry': {
          '0%': {
            opacity: 0,
            transform: 'translateX(50px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0px)',
          },
        },
        animationName: 'pillsEntry',
        animationDuration: '500ms',
        animationDelay: '220ms',
        animationFillMode: 'forwards',
      },
      pillsWrapper: {
        flexDirection: 'column',
        marginTop: '0px',
        textTransform: 'initial',
      },
      pillsRecommendedSearches: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-2) var(--spacing-1)',
        marginRight: '-11px',
        marginTop: 'var(--spacing-3)',
        maxHeight: '104px',
        overflow: 'hidden',
      },
      pillsLink: {
        borderRadius: 'var(--border-radius-full)',
        padding: 'var(--spacing-4) var(--spacing-6)',
        height: 'var(--spacing-12)',
        border: '1px solid rgba(0, 0, 0, 0.10)',
        background: 'var(--color-white-base)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      pillsText: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-extended-bold)', // design token is normal but figma is bold
        fontWeight: '700',
        marginTop: 'var(--spacing-4)',
        color: `var(--color-black-base)`,
        marginBottom: '0px',
        fontSize: 'var(--text-16)',
        transition: 'font-size 200ms ease',
      },

      pillsDetails: {
        gap: '6px',
        alignItems: 'center',
      },
      pillsBasePart: {
        color: isEmptySearchResults
          ? 'var(--color-black-base)'
          : 'var(--scheme-secondary-text-color)',
      },
      pillsCount: {
        ...theme.typography['text-cta2-xs'],
        color: isEmptySearchResults
          ? 'var(--color-black-base)'
          : 'var(--scheme-secondary-text-color)',
        marginLeft: 'var(--spacing-1)',
        fontWeight: '400',
      },
      pillsHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-extended-bold)', // design tokens have normal font family while figma has bold
        fontWeight: '700',
        fontSize: 'var(--text-16)',
        color: `var(--color-neutral-dark-1, #161616)`,
      },

      autoCompleteHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-extended-bold)', // design tokens have normal font family while figma has bold
        fontWeight: '700',
        fontSize: 'var(--text-12)',
        color: `var(--color-neutral-dark-1, #161616)`,
      },
      autoCompleteCollapse: {
        minWidth: 'calc(100vw - var(--spacing-2))',
        marginLeft: '-12px',
        marginRight: '-12px',
        borderRadius: '0 0 var(--border-radius-xl) var(--border-radius-xl)',
      },
      autoCompleteWrapper: {
        flexDirection: 'column',
        marginTop: '0px',
        marginLeft: '0',
        minWidth: 'calc(100vw - var(--spacing-2))',
        textTransform: 'initial',
      },
      autoCompleteRecommendedSearches: {
        display: 'flex',
        marginTop: '2px',
        overflow: 'hidden',
        height: '218px', // (5 items * 42px) + 8px
        transition: 'max-height 0.6s ease-in-out',
        background: 'white',
        flexDirection: 'column',
        gap: 'var(--spacing-6)',
        paddingTop: '20px',
        paddingLeft: 'var(--spacing-4)',
        paddingRight: 'var(--spacing-4)',
        paddingBottom: 'var(--spacing-3)',
        borderRadius: '0 0 var(--border-radius-xl) var(--border-radius-xl)',
      },
      autoCompleteLink: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        '@keyframes moveDown': {
          '0%': {
            maxHeight: 0,
          },
          '100%': {
            maxHeight: '100%',
          },
        },
        animation: 'moveDown 400ms',
      },
      autoCompleteName: {
        ...theme.typography['text-cta2-xs'],
        fontSize: 'var(--text-14)', // typo class is 12px while figma is 14px
        lineHeight: '125%', // typo class is 100% while figma is 125%
        fontWeight: '400',
        color: `var(--color-black-base)`,
        marginBottom: '0px',
        transition: 'font-size 200ms ease',
      },
      autoCompleteBasePart: {
        color: `var(--color-neutral-1, #6D6D6D)`,
      },
      pillsName: {
        ...theme.typography['text-cta2-xs'],
        fontWeight: '400',
        color: `var(--color-black-base)`,
        marginBottom: '0px',
        pt: '2px',
      },
      SearchSuggestionCategoriesName: {
        ...theme.typography['text-cta2-xs'],
        fontWeight: '400',
        color: `var(--color-black-base)`,
        marginBottom: '0px',
        pt: '2px',
      },
      autoCompleteCount: {
        color: `var(--color-neutral-1, #6D6D6D)`,
        ...theme.typography['text-cta2-xs'],
        fontSize: 'var(--text-14)', // typo class is 12px while figma is 14px
        lineHeight: '125%', // typo class is 100% while figma is 125%
        fontWeight: '400',
        marginLeft: 'var(--spacing-1)',
      },
    }),
  },
}
