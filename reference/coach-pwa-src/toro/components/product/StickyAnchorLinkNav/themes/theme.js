export default {
  baseStyle: ({ theme }) => ({
    stickyAnchorLinkNavContainer: ({
      hasTopDirectionScroll,
      showBanner,
      bannerHeight,
      isHeaderHeight,
      isStickyHeader,
    }) => {
      const getTopValue = () => {
        if (hasTopDirectionScroll && showBanner) {
          return bannerHeight + isHeaderHeight
        }
        if ((hasTopDirectionScroll && !showBanner) || (!hasTopDirectionScroll && isStickyHeader)) {
          return isHeaderHeight
        }
        return 0
      }
      return {
        overflowX: 'auto',
        zIndex: 10,
        background: theme.colors.main.white,
        fontFamily: theme.fontFamily.primaryNormal,
        position: 'sticky',
        top: getTopValue(),
        height: `48px`,
        fontSize: 12,
        color: 'var(--color-neutral-base)',
        '::-webkit-scrollbar': { display: 'none' },
        '::-webkit-scrollbar-track': { display: 'none' },
        '::-webkit-scrollbar-thumb': { display: 'none' },
        '-ms-overflow-style': 'none' /* IE and Edge */,
        'scrollbar-width': 'none' /* Firefox */,
      }
    },
    stickyAnchorLinkNavDecor: {
      height: `48px`,
      borderBottom: `var(--border-width-s) solid var(--color-neutral-inactive)`,
      width: `100%`,
      position: `absolute`,
      zIndex: 8,
    },
    stickyAnchorLinkNavItems: ({ isActive }) => ({
      color: isActive ? theme.colors.main.primary : 'inherit',
      borderBottomColor: isActive ? theme.colors.main.primary : `var(--color-neutral-inactive)`,
      borderBottomWidth: `var(--border-width-s)`,
      borderBottomStyle: 'solid',
      whiteSpace: 'nowrap',
      p: '15px 10px 14px', // Adjusted height to account the extra line height
      zIndex: 9,
      position: `relative`,
      transitionProperty: `color, border-bottom-color`,
      transitionDuration: `var(--chakra-transition-duration-normal), var(--chakra-transition-duration-normal)`,
    }),
  }),
}
