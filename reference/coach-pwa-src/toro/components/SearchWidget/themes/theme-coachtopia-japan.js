import { searchAnimations } from './theme-coach-japan'

const MeiryoMediumFontFamily =
  'Meiryo Medium, Hiragino Kaku Gothic ProN Medium, Hiragino Sans Medium, BIZ UDPGothic Medium, sans-serif;'

const MeiryoBoldFontFamily =
  'Meiryo Bold, Hiragino Kaku Gothic ProN Bold, Hiragino Sans Bold, BIZ UDPGothic Bold, sans-serif' // variable is not defined in the theme file

export default {
  baseStyle: ({ theme }) => ({
    input: {
      fontFamily: theme.fontFamily.secondaryNormal,
    },
  }),
  variants: {
    searchV2: ({ theme }) => ({
      clearIconMobile: {
        fontWeight: 400,
        fontSize: 'var(--text-12)',
        color: `var(--color-black-base)`,
      },
      noSearchTerm: {
        ...theme.typography['text-body1-m'],
        fontWeight: 400,
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      pillsText: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: MeiryoBoldFontFamily,
      },
      pillsCount: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: MeiryoMediumFontFamily,
      },
      pillsHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: MeiryoBoldFontFamily,
      },
      pillsName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: MeiryoMediumFontFamily,
      },
      autoCompleteWrapper: {
        ...theme.typography['text-body1-m'],
      },
      autoCompleteHeader: {
        ...theme.typography['text-display3-xxs'],
        fontFamily: 'var(--font-face1-bold)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontSize: 'var(--text-12)',
      },
      autoCompleteName: {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-extended-normal)', // design tokens have Helvetica font family while we need Hiragino Kaku
        fontSize: 'var(--text-14)',
        fontWeight: 400,
      },
      searchSuggestionItemFooterProductText: {
        ...theme.typography['text-body1-s'],
        fontFamily: MeiryoMediumFontFamily,
      },
      searchSuggestionItemFooterPrice: {
        marginBottom: '0',
        fontFamily: MeiryoMediumFontFamily,
        fontSize: 'var(--text-14)',
        '.salePriceWrapper': {
          '*': { display: 'none' }, // Hide discounts
          '.salesPrice': {
            display: 'block',
            ...theme.typography['text-body1-s'],
            fontFamily: MeiryoMediumFontFamily,
            fontWeight: `400`,
            color: `var(--color-black-base) !important`,
            width: '100%',
            textAlign: 'center',
          },
        },
      },
      ...searchAnimations,
    }),
    mobileV2Redesign: () => ({
      searchWrapper: {
        p: 0,
      },
      inputGroup: {
        borderRadius: 'var(--border-radius-m)',
        border: 'none',
        h: 'unset',
        backgroundColor: '#f7f7f7',
        w: '100%',
        '&:focus, &[data-focus], &:focus-within': {
          w: '100%',
        },
      },
    }),
    mobileV2RedesignExposed: () => ({
      searchWrapper: {
        p: 0,
      },
      inputGroup: {
        borderRadius: 'var(--border-radius-m)',
        border: 'none',
        h: 'unset',
        backgroundColor: '#f7f7f7',
        w: '100%',
        '&:focus, &[data-focus], &:focus-within': {
          w: '100%',
        },
      },
      searchIcon: {
        top: '9px',
      },
    }),
  },
}
