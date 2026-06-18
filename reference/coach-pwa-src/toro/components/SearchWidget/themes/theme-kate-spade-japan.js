export default {
  baseStyle: ({ theme }) => ({
    input: {
      ...theme.typography['text-body2-s'],
      '&::placeholder': {
        ...theme.typography['text-body2-s'],
        color: 'var(--color-black-base)',
        opacity: '0.5',
      },
    },
  }),
  variants: {
    footer: ({ theme }) => ({
      input: {
        '&::placeholder': {
          ...theme.typography['text-body2-s'],
        },
        ...theme.typography['text-body2-s'],
        fontWeight: '500',
      },
    }),
    searchV2: ({ theme, isEmptySearchResults = false }) => ({
      clearIconMobile: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        fontWeight: 400,
      },
      noResultsCont: {
        fontFamily: 'var(--font-face1-normal)',
      },
      noResultsFound: {
        ...theme.typography['text-title1-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
      },
      searchSuggestionViewAllProduct: {
        ...theme.typography['text-cta2-xxs'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-10)',
        fontWeight: 400,
      },
      pillsText: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-16)',
        fontWeight: 700,
      },
      pillsCount: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)',
        color: isEmptySearchResults
          ? 'var(--color-black-base)'
          : 'var(--scheme-secondary-text-color)',
      },
      pillsHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-bold)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontWeight: 700,
        fontSize: 'var(--text-16)',
      },

      autoCompleteHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-bold)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontWeight: 700,
        fontSize: 'var(--text-12)',
      },
      autoCompleteName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontSize: 'var(--text-14)', // typo class is 12px while figma is 14px
      },
      pillsName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
      },
      SearchSuggestionCategoriesName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
      },
      autoCompleteCount: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
      },
    }),
    mobileV2Redesign: ({ theme }) => ({
      input: {
        ...theme.typography['text-title1-s'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
        '&.searchIn': {
          'caret-color': 'transparent',
          '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
            ...theme.typography['text-title1-s'],
            fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
            color: '#696969',
          },
        },
      },
      clearIconMobile: {
        fontWeight: 400,
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        color: `var(--color-black-base)`,
      },
      searchIcon: {
        top: '9px',
      },
    }),
    mobileV2RedesignExposed: ({ theme }) => ({
      input: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-normal)',
        '&.searchIn': {
          '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
            ...theme.typography['text-title1-s'],
            color: '#696969',
          },
        },
      },

      searchIcon: {
        top: '9px',
      },
    }),
  },
}
