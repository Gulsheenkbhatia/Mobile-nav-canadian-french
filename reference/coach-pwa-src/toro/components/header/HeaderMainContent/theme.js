export default {
  parts: [
    'headerMainContentBox',
    'headerMainContentInnerBox',
    'logoContainer',
    'upperRightIcons',
    'exposeSearchWrapper',
    'exposedSearchHeaderContainer',
    'exposedSearchSuggestionsBackground',
    'exposeSearchWrapperContainer',
  ],
  baseStyle: ({ theme }) => ({
    logoContainer: {
      pt: theme.space.xs,
    },
    logoWrapper: () => ({
      justifyContent: 'center',
    }),
  }),
  variants: {
    globalHeaderV1: ({ theme }) => ({
      headerMainContentBox: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          pl: 'var(--spacing-2)',
        },
        p: `0 ${theme.space.mar}`,
        '& svg use[href="#icon-accountV2"]': {
          fill: 'var(--color-primary)',
        },
      },
      headerMainContentInnerBox: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          m: '25px 0',
        },
        m: `${theme.space.xl} 0`,
      }),
      upperRightIcons: {
        flex: '1',
        justifyContent: 'flex-end',
        '& svg use[href="#icon-accountV2"]': {
          transform: 'translateY(-20%) translateX(-30%) scale(1.5)',
        },
        '& svg use[href="#icon-bagV2"]': {
          transform: 'translateX(-14%) translateY(-15%) scale(1.3)',
        },
      },
    }),
    globalHeaderV2Redesign: ({ theme }) => ({
      exposeSearchWrapperContainer: {
        backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
        width: '100%',
        padding: 'var(--spacing-1)',
      },
      exposeSearchWrapper: {
        height: '56px',
        border: '1px solid var(--color-neutral-light-1)',
        borderRadius: '0 0 var(--spacing-3) var(--spacing-3)',
        backgroundColor: 'white',
        width: '100%',
        '&>svg': {
          position: 'absolute',
          left: '19px',
          bottom: '23px',
          pointerEvents: 'none',
        },
        '& .exposed-search-wrapper-placeholder': {
          ...theme.typography['text-title1-m'],
          position: 'absolute',
          bottom: '19px',
          left: '44px',
          color: 'var(--color-neutral-medium)',
          letterSpacing: 'var(--letter-spacing-xs)',
          lineHeight: 'var(--line-height-xl)',
          zIndex: 1,
          pointerEvents: 'none',
        },
      },
      exposedSearchHeaderContainer: {
        position: 'static',
        width: '100%',
        mt: '0',
        backgroundColor: 'var(--color-neutral-light-1)',
        opacity: '0',
      },
    }),
    globalHeaderV2: ({ theme, configuredTabColors }) => ({
      headerMainContentBox: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          p: '0 var(--spacing-4)',
          '&:has(.one-tab-header)': {
            backgroundColor: configuredTabColors?.inActive?.backgroundColor || '#404040',
            '&:has(.transparent-header)': {
              backgroundColor: 'rgba(51, 51, 51, 0.30)',
            },
            '& .upper-right-icons svg, .upper-right-icons path, .upper-right-icons use[href="#icon-bagV2"], .upper-right-icons use[href="#icon-menuSearchV2"]':
              {
                fill: configuredTabColors?.inActive?.textColor || 'var(--color-white-base)',
              },
            '& .bag-icon-container p': {
              color: configuredTabColors?.inActive?.textColor || 'var(--color-white-base)',
            },
          },
        },
        p: `0 ${theme.space.mar}`,
      },
      headerMainContentInnerBox: (isOneCoachTabbedHeaderActive) => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          m: isOneCoachTabbedHeaderActive ? 'var(--spacing-2) 0' : 'var(--spacing-3) 0',
        },
        m: `${theme.space.xl} 0`,
      }),
      upperRightIcons: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          gap: 'var(--spacing-3)',
        },
        flex: '1',
        justifyContent: 'flex-end',
      },
      exposedSearchHeaderContainer: {
        position: 'static',
        width: '100%',
        mt: 'var(--spacing-4)',
      },
      exposedSearchSuggestionsBackground: {
        backgroundColor: 'var(--color-secondary)',
        height: '100vh',
      },
    }),
  },
  defaultProps: {
    variant: 'globalHeaderV1',
  },
}
