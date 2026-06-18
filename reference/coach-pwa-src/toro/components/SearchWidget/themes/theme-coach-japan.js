/**
 * Fix for https://jira.tapestry.support/browse/DIGIT-41070
 * iOS Safari can leave search overlay subtrees visually stuck (blank UI but
 * focus/input still work) when base theme replays opacity/transform entrance animations on drawer
 * reopen. This object overrides those parts for JP only.
 *
 * searchInputGroupWrapper (and similar blocks below):
 * - opacity: 1 — visible at rest; avoids a stuck transparent state if animation does not complete.
 * - animationName/Duration/Delay/FillMode — disables the CSS animation so it cannot replay badly.
 * - transition: none — avoids competing transitions with the drawer/modal layer.
 * - transform: translateZ(0) + backfaceVisibility: hidden — promotes a stable compositor layer on
 *   WebKit (reduces blank-frame glitches with transformed ancestors).
 * - @keyframes … — kept with opacity 1 so any stray references do not reintroduce fade-from-zero.
 */
export const searchAnimations = {
  searchInputGroupWrapper: {
    opacity: 1,
    animationName: 'none',
    animationDuration: '0ms',
    animationDelay: '0ms',
    animationFillMode: 'none',
    transition: 'none',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    '@keyframes inputGroupEntry': {
      '0%': { transform: 'translateX(25px)', opacity: 1 },
      '100%': { transform: 'translateX(0px)', opacity: 1 },
    },
  },
  input: {
    opacity: 1,
    animationName: 'none',
    animationDuration: '0ms',
    animationDelay: '0ms',
    animationFillMode: 'none',
    '@keyframes inputEntry': {
      '0%': { opacity: 1 },
      '90%': { opacity: 1 },
      '100%': { opacity: 1 },
    },
  },
  suggestionsItemsContainer: {
    opacity: 1,
    animationName: 'none',
    animationDuration: '0ms',
    animationDelay: '0ms',
    animationFillMode: 'none',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    '@keyframes productsEntry': {
      '0%': { transform: 'translateX(100px)', opacity: 1 },
      '100%': { transform: 'translateX(0px)', opacity: 1 },
    },
  },
  pillsContainer: {
    opacity: 1,
    animationName: 'none',
    animationDuration: '0ms',
    animationDelay: '0ms',
    animationFillMode: 'none',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    '@keyframes pillsEntry': {
      '0%': { opacity: 1, transform: 'translateX(50px)' },
      '100%': { opacity: 1, transform: 'translateX(0px)' },
    },
  },
}

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
      },
    }),
    searchV2: ({ theme, isEmptySearchResults = false }) => ({
      clearIconMobile: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 400,
      },
      noResultsCont: {
        fontFamily: 'var(--font-face1-normal)',
      },
      noResultsFound: {
        ...theme.typography['text-title1-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        fontWeight: 400,
      },
      searchSuggestionViewAllProduct: {
        ...theme.typography['text-cta2-xxs'],
        fontFamily: 'var(--font-face1-normal)',
      },
      pillsText: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-bold)',
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
      },

      autoCompleteHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-bold)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontSize: 'var(--text-12)',
      },
      autoCompleteName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontSize: 'var(--text-14)',
        fontWeight: 400,
      },
      pillsName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
      },
      SearchSuggestionCategoriesName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
      },
      autoCompleteCount: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
      },

      ...searchAnimations,
    }),
    mobileV2Redesign: ({ theme }) => ({
      searchWrapper: {
        p: 0,
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
      searchIcon: {
        top: '9px',
      },
      clearIconMobile: {
        fontWeight: 400,
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        color: `var(--color-black-base)`,
      },
    }),
    mobileV2RedesignExposed: ({ theme }) => ({
      searchWrapper: {
        p: 0,
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
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
        '&.searchIn': {
          '::placeholder': {
            color: 'var(--color-neutral-medium)',
            fontFamily: 'var(--font-face1-normal)',
          },
          ':-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
            fontFamily: 'var(--font-face1-normal)',
          },
          '::-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
            fontFamily: 'var(--font-face1-normal)',
          },
        },
      },
      searchIcon: {
        top: '9px',
      },
    }),
  },
}
