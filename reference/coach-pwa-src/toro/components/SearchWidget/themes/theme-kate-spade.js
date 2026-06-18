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
      ...theme.typography['text-body2-s'],
      '&::placeholder': {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-black-base)',
        opacity: '0.5',
      },
    },
    searchSuggestionItemText: {
      textAlign: 'unset',
      ...theme.typography['text-body2-m'],
    },

    suggestionRecentlyItemsText: {
      ...theme.typography['text-eyebrow1-m'],
    },

    searchSuggestionHeader: {
      ...theme.typography['text-eyebrow1-m'],
    },

    searchSuggestionProductLink: {
      ...theme.typography['text-eyebrow1-m'],
    },

    SearchSuggestionCategoriesText: {
      ...theme.typography['text-eyebrow1-m'],
    },

    SearchSuggestionCategoriesName: {
      ...theme.typography['text-body2-s'],
    },
    SearchSuggestionCategoriesCount: {
      ...theme.typography['text-body2-s'],
    },

    searchSuggestionItemFooterProductText: {
      textAlign: 'unset',
      ...theme.typography['text-body2-s'],
    },
    searchSuggestionViewAllProduct: {
      ...theme.typography['text-eyebrow1-m'],
    },
    searchSuggestionItemLinkImage: {
      background: 'initial',
      height: 'initial',
    },
    inputGroup: {
      h: '24px',
    },
  }),
  variants: {
    footer: ({ theme }) => ({
      input: {
        '&::placeholder': {
          ...theme.typography['text-body1-s'],
        },
        ...theme.typography['text-body1-s'],
      },
    }),
    footerMobile: ({ theme }) => ({
      input: {
        '&::placeholder': {
          ...theme.typography['text-body1-s'],
        },
        ...theme.typography['text-body1-s'],
      },
    }),
    mobile: () => ({
      searchSuggestionWrapper: {
        mb: 'var(--spacing-4)',
      },
      SearchSuggestionCategoriesName: {
        mb: 'var(--spacing-3)',
      },
      searchSuggestionItemFooterProductText: {
        mb: 'var(--spacing-2)',
      },
      SearchSuggestionCategoriesText: {
        mb: 'var(--spacing-4)',
      },
      searchBackButton: {
        height: 'initial',
        pr: 'var(--spacing-2)',
        minWidth: 'initial',
        mt: 0,
      },
      searchIcon: {
        top: '0',
      },
    }),
    mobileV2Redesign: ({ theme }) => ({
      searchWrapper: {
        p: '0 var(--spacing-1) 0 0',
        m: 'calc(var(--spacing-1) * -1)',
        '& .input-wrapper': {
          position: 'relative',
        },
      },
      inputGroup: {
        borderRadius: 'var(--border-radius-m)',
        border: 'none',
        p: '10px var(--spacing-3) 10px 6px',
        h: 'unset',
        backgroundColor: '#f7f7f7',
        w: '100%',
        '&:focus, &[data-focus], &:focus-within': {
          w: '100%',
        },
      },
      input: {
        ...theme.typography['text-title1-s'],
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        pt: 'var(--spacing-1)',
        letterSpacing: 'var(--letter-spacing-xs)',
        height: '38px',
        '&.searchIn': {
          'caret-color': 'transparent',
          '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
            ...theme.typography['text-title1-s'],
            color: '#696969',
          },
        },
      },
      clearIconMobile: {
        fontWeight: 500,
      },
      searchSuggestionItemFooterProductText: {
        textAlign: 'unset',
        ...theme.typography['text-body2-s'],
      },
    }),
    mobileV2RedesignExposed: ({ theme }) => ({
      input: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        paddingLeft: 'var(--spacing-2)',
        paddingTop: 0,
        '&.searchIn': {
          '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
            ...theme.typography['text-title1-s'],
            color: '#696969',
          },
        },
      },
      inputGroup: {
        h: 'unset',
      },
      searchSuggestionItemFooterProductText: {
        textAlign: 'unset',
        ...theme.typography['text-body2-s'],
      },
    }),
    searchV2: ({ theme }) => ({
      input: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        paddingLeft: '44px',
        paddingTop: 0,
        '&.searchIn': {
          '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
            ...theme.typography['text-title1-s'],
            color: '#696969',
          },
        },
      },
      searchIcon: {
        marginLeft: 'var(--spacing-4)',
      },
      autoCompleteName: {
        ...theme.typography['text-title1-s'],
        fontSize: 'var(--text-14)',
        textTransform: 'none',
      },
      pillsText: {
        ...theme.typography['text-display2-xs'],
        fontWeight: '400',
      },
      pillsHeader: {
        ...theme.typography['text-display2-xs'],
        fontWeight: '400',
      },
      pillsName: {
        ...theme.typography['text-body2-m'],
        color: `var(--color-black-base, #000000)`,
        textTransform: 'none',
      },
      noSearchTerm: {
        ...theme.typography['text-title1-s'],
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
      autoCompleteHeader: {
        ...theme.typography['text-body3-m'],
        fontWeight: '400',
      },
      clearIcon: {
        ...theme.typography['text-cta2-pill-xs'],
        color: `var(--color-black-base, #000000)`,
      },
      searchWrapper: {
        p: '0 var(--spacing-3) var(--spacing-3)',
        '&.search-widget-animation': {
          '@keyframes searchDrawerEntry': {
            '0%': {
              transform: 'translateX(-100%)',
            },
            '100%': {
              transform: 'translateX(0%)',
            },
          },
          animation: 'searchDrawerEntry 400ms ease',
        },
      },
      searchInputGroupWrapper: {
        '@keyframes inputGroupEntry': {
          '0%': {
            transform: 'translateX(-25px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
        },
      },
      suggestionsItemsContainer: {
        '@keyframes productsEntry': {
          '0%': {
            transform: 'translateX(-100px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0px)',
            opacity: '1',
          },
        },
      },

      pillsContainer: {
        '@keyframes pillsEntry': {
          '0%': {
            opacity: 0,
            transform: 'translateX(-50px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0px)',
          },
        },
      },

      collapseContainingError: {
        marginTop: '2px',
        marginLeft: '-8px',
        marginRight: '-8px',
        backgroundColor: 'var(--color-white-base)',
        borderRadius: '0 0 var(--border-radius-l) var(--border-radius-l)',
      },
      inputWrapper: {
        marginX: 'calc(var(--spacing-2) * -1)',
      },
      searchSuggestionViewAllProduct: {
        ...theme.typography['text-body2-s'],
        textDecoration: 'none',
      },
      SearchSuggestionCategoriesName: {
        fontWeight: '500',
      },
      searchSuggestionHeader: {
        ...theme.typography['text-eyebrow1-m'],
        fontWeight: '400',
      },
      searchSuggestionItemFooterProductText: {
        ...theme.typography['text-body1-s'],
      },
      searchSuggestionItemFooterPrice: {
        '.salePriceWrapper': {
          '.salesPrice': {
            ...theme.typography['text-body1-s'],
          },
        },
      },
    }),
    mobileV2: ({ theme }) => ({
      searchSuggestionItemFooterProductText: {
        textAlign: 'unset',
        ...theme.typography['text-body2-s'],
      },
    }),
    mobileExposed: ({ theme }) => ({
      searchSuggestionItemFooterProductText: {
        textAlign: 'unset',
        ...theme.typography['text-body2-s'],
      },
    }),
  },
}
