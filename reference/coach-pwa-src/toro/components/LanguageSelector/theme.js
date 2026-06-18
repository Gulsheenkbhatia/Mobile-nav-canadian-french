const languageDropdownContent = [
  'languageDropdownLocationTitle',
  'languageDropdownMainContainer',
  'languageDropdownIconContainer',
  'languageCountrySelectorText',
  'languagesWrapper',
  'dropdownLanguageLink',
  'dropdownLanguageText',
  'dropdownViewMoreContainer',
  'dropdownViewMoreText',
  'dropdownNextArrowWrapper',
]

const languageSelector = ['languageSelectorContainer', 'languageSelectionText', 'languageDropdown']

const languageSelectorModal = [
  'modalContent',
  'selectorMessageContainer',
  'selectorMessageText',
  'selectorButtonRedirect',
  'selectorButton',
]

const modalBasedCountrySelector = [
  'modalContentWrapper',
  'updateLocationButton',
  'modalHeader',
  'modalBody',
  'selectInput',
  'selectInputLabel',
  'dropdownContentWrap',
  'dropdownSearchInput',
  'dropdownContentList',
  'dropdownContentListItem',
]

export default {
  parts: [
    ...languageDropdownContent,
    ...languageSelector,
    ...languageSelectorModal,
    ...modalBasedCountrySelector,
  ],
  baseStyle: ({ theme }) => {
    const { colors, fontFamily, fontSizes, lineHeights, letterSpacings } = theme
    const translatePos = { x: 0, y: 32 }
    return {
      modalContent: {
        p: { base: '72px var(--spacing-4)', md: '65px var(--spacing-16) 62px var(--spacing-16)' },
        maxWidth: { base: '83%', md: '600px' },
      },
      selectorMessageContainer: {
        color: colors.black,
        fontFamily: fontFamily.primaryBold,
        textAlign: 'center',
        fontSize: '26px',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
        },
      },
      selectorMessageText: {
        fontSize: fontSizes.md,
        color: '#2e2e2e',
        fontFamily: fontFamily.secondaryNormal,
        mt: { base: 'var(--spacing-6)', md: '31px' },
        textAlign: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display2-s'],
        },
      },
      selectorButtonRedirect: {
        fontSize: fontSizes.sm,
        fontFamily: fontFamily.primaryNormal,
        mt: { base: 'var(--spacing-8)', md: 'var(--spacing-12)' },
        p: 'var(--spacing-4)',
        _focus: { boxShadow: 'none' },
      },
      selectorButton: {
        fontFamily: fontFamily.primaryNormal,
        fontSize: fontSizes.sm,
        mt: 'var(--spacing-4)',
        p: 'var(--spacing-4)',
      },
      languageDropdownLocationTitle: {
        letterSpacing: letterSpacings.xl,
        color: colors.main.primary,
        pt: 'm',
        pb: 's',
        px: 'm',
      },
      languageDropdownMainContainer: {
        pt: 's',
      },
      languageDropdownIconContainer: (flag, selectedFlag) => ({
        py: 's',
        px: 'm',
        _hover: { background: colors.neutral.light },
        _focusWithin: { background: colors.neutral.light },
        background: flag === selectedFlag ? colors.neutral.light : colors.main.white,
      }),
      languageCountrySelectorText: {
        pl: 's',
        lineHeight: lineHeights.xl,
        color: colors.main.primary,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      },
      languagesWrapper: {
        ml: 's',
      },
      dropdownLanguageLink: {
        borderRight: `1px solid ${colors.main.inactive}`,
        '&:last-child': {
          border: 'none',
        },
      },
      dropdownLanguageText: (languageIndex, content, flag, selectedFlag) => ({
        letterSpacing: letterSpacings.xl,
        px: 's',
        textDecoration:
          languageIndex === content?.selectedLanguageIndex && flag === selectedFlag
            ? 'underline'
            : 'none',
      }),
      dropdownViewMoreContainer: {
        borderTop: `1px solid ${colors.neutral.light}`,
        px: 'm',
        py: 'mar',
      },
      dropdownViewMoreText: {
        lineHeight: lineHeights.xl,
      },
      dropdownNextArrowWrapper: {
        ml: 'auto',
      },
      languageSelectorContainer: {
        mr: 's',
      },
      languageSelectionText: {
        lineHeight: lineHeights.xl,
        color: colors.main.black,
        ml: 'xs',
      },
      languageDropdown: {
        transform: `translate3d(${translatePos.x}px, ${translatePos.y}px, 0)`,
        borderRadius: theme.borderRadius.default,
        boxShadow: theme.boxShadow.countrySelectorPopover,
        border: `solid 1px ${theme.colors.main.inactive}`,
        bg: theme.colors.main.white,
      },
    }
  },
  variants: {
    modalBased: ({ theme }) => ({
      modalContentWrapper: {
        padding: { base: '44px 28px 71px', md: '53px var(--spacing-10) 97px' },
        maxWidth: { base: 'calc(100% - 48px)', md: '550px' },
        width: { base: '550px', md: '100%' },
        minHeight: 'auto',
        borderRadius: 0,
      },
      modalHeader: {
        padding: 0,
        marginBottom: { base: '35px', md: '53px' },
        '.country-selector-modal-title': {
          ...theme.typography['text-display4-xxs'],
        },
        '.country-selector-modal-close-btn': {
          alignSelf: 'flex-start',
          marginLeft: 'auto',
          width: 'auto',
          height: 'auto',
          '&:focus': {
            outline: theme.focus.outline,
            borderRadius: 0,
          },
        },
      },
      modalBody: {
        padding: 0,
        ...theme.typography['text-display3-xxs'],
        '.country-selector-modal-sub-title': {
          ...theme.typography['text-display4-xxs'],
          marginBottom: '20px',
        },
        '.country-selector-modal-description': {
          font: 'inherit',
          letterSpacing: 0,
        },
      },
      selectInputLabel: {
        display: 'inline-block',
        color: 'var(--color-grey-40)',
        ...theme.typography['text-cta2-s'],
        marginBottom: 2,
      },
      selectInput: {
        w: '100%',
        h: '28px',
        userSelect: 'none',
        borderBottom: '1px solid var(--border-color-black-base)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        '.selected-country-label': {
          font: 'inherit',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        span: {
          marginLeft: 'auto',
        },
      },
      dropdownContentWrap: {
        width: '100%',
        borderRadius: 0,
        borderColor: 'var(--border-color-black-base)',
      },
      dropdownSearchInput: {
        borderRadius: 0,
        borderColor: '#C6C6C6',
        paddingLeft: 'var(--spacing-3)',
        paddingRight: 'var(--spacing-3)',
        ...theme.typography['text-display4-xxs'],
        '&::placeholder': {
          color: 'var(--color-grey-40)',
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-10)',
          height: '26px', // to adjust the height in mobile
        },
      },
      dropdownContentList: {
        maxHeight: '30vh',
        overflowY: 'auto',
        paddingTop: 'var(--spacing-2)',
        paddingBottom: 'var(--spacing-2)',
      },
      dropdownContentListItem: {
        padding: 'var(--spacing-3) var(--spacing-3)',
        cursor: 'pointer',
        '&:hover, &[data-state="checked"], &[aria-selected="true"]': {
          backgroundColor: 'var(--color-neutral-light)',
        },
        p: {
          ...theme.typography['text-display3-xxs'],
        },
      },
      updateLocationButton: {
        ...theme.typography['text-display4-xxs'],
        textTransform: 'capitalize',
        width: '100%',
        mt: { base: '53px', md: '58px' },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-12)',
          height: '38px',
        },
      },
    }),
  },
}
